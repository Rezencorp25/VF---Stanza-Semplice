import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { RoomColumn } from './RoomColumn';
import { CalendarGrid } from './CalendarGrid';
import { FilterBar } from './FilterBar';
import { CreateEventModal } from './CreateEventModal';
import { BookingDrawer } from './BookingDrawer';
import { MoveBookingModal } from './MoveBookingModal';
import { 
  CalendarFilters, 
  Booking, 
  CalendarEvent,
  Room,
  Apartment
} from '../types';
import { 
  mockRooms, 
  mockBookings, 
  mockCalendarEvents, 
  mockCompetenceGroups, 
  mockCityManager,
  mockApartments
} from '../mockData';
import { differenceInDays, addDays, format, areIntervalsOverlapping, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { CheckCircle2, X } from 'lucide-react';

const HEADER_HEIGHT = 33;
const ROW_HEIGHT = 56;
const OVERSCAN = 5; 

export interface VirtualRow {
  type: 'header' | 'room';
  id: string;
  data: Apartment | Room;
  height: number;
  top: number;
  index: number;
}

export const PlanningSection: React.FC = () => {
  // --- STATE ---
  const [filters, setFilters] = useState<CalendarFilters>({
    period: { month: new Date().getMonth(), year: new Date().getFullYear() },
    eventTypes: ['prenotazione', 'pulizia', 'manutenzione', 'fattura'],
    bookingStatusFilter: 'active',
    roomType: 'all',
    viewMode: 'days',
    cities: [],
    competenceGroupIds: []
  });

  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [extraEvents, setExtraEvents] = useState<CalendarEvent[]>(
    mockCalendarEvents.filter(e => e.type !== 'prenotazione')
  );

  // --- DERIVED STATE (Source of Truth) ---
  const events = useMemo(() => {
    const bookingEvents: CalendarEvent[] = bookings.map(b => ({
      id: b.id,
      roomId: b.roomId,
      type: 'prenotazione',
      startDate: b.checkIn,
      endDate: b.checkOut,
      label: b.tenantName,
      status: b.status,
      bookingId: b.id
    }));
    return [...bookingEvents, ...extraEvents];
  }, [bookings, extraEvents]);

  // --- FILTER LOGIC ---
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (!filters.eventTypes.includes(e.type)) return false;
      if (e.type === 'prenotazione' && e.bookingId) {
         const booking = bookings.find(b => b.id === e.bookingId);
         if (!booking) return false;
         if (filters.bookingStatusFilter === 'active' && booking.isDeleted) return false;
         if (filters.bookingStatusFilter === 'deleted' && !booking.isDeleted) return false;
      }
      return true;
    });
  }, [filters, events, bookings]);

  const { flatRows, totalContentHeight } = useMemo(() => {
    const activeRooms = mockRooms.filter(r => {
      if (filters.roomType === 'stanza' && r.type === 'suite') return true; 
      if (filters.roomType === 'stanza' && r.type !== 'single' && r.type !== 'double') return false; 
      if (filters.cities.length > 0 && r.city && !filters.cities.includes(r.city)) return false;
      if (filters.competenceGroupIds.length > 0 && r.competenceGroupId && !filters.competenceGroupIds.includes(r.competenceGroupId)) return false;
      return true;
    });

    const groups: Record<string, Room[]> = {};
    activeRooms.forEach(room => {
      if (!groups[room.apartmentId]) groups[room.apartmentId] = [];
      groups[room.apartmentId].push(room);
    });

    const rows: VirtualRow[] = [];
    let currentTop = 0;
    let index = 0;

    Object.keys(groups).forEach(aptId => {
      const apt = mockApartments.find(a => a.id === aptId) || { id: aptId, unitNumber: '?', buildingId: '?' } as Apartment;
      rows.push({
        type: 'header',
        id: `apt-${aptId}`,
        data: apt,
        height: HEADER_HEIGHT,
        top: currentTop,
        index: index++
      });
      currentTop += HEADER_HEIGHT;

      groups[aptId].forEach(room => {
        rows.push({
          type: 'room',
          id: room.id,
          data: room,
          height: ROW_HEIGHT,
          top: currentTop,
          index: index++
        });
        currentTop += ROW_HEIGHT;
      });
    });

    return { flatRows: rows, totalContentHeight: currentTop };
  }, [filters]);

  // --- VIRTUALIZATION ---
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    if (scrollContainerRef.current) {
      setContainerHeight(scrollContainerRef.current.clientHeight);
    }
    const handleResize = () => {
      if (scrollContainerRef.current) setContainerHeight(scrollContainerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleRows = useMemo(() => {
    const startIndex = Math.max(0, flatRows.findIndex(r => r.top + r.height > scrollTop) - OVERSCAN);
    let endIndex = flatRows.findIndex(r => r.top > scrollTop + containerHeight);
    
    if (endIndex === -1) endIndex = flatRows.length;
    endIndex = Math.min(flatRows.length, endIndex + OVERSCAN);

    return flatRows.slice(startIndex, endIndex);
  }, [flatRows, scrollTop, containerHeight]);

  // --- MODALS & HELPERS ---
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ visible: false, message: '', type: 'success' });
  const [createModal, setCreateModal] = useState<{ isOpen: boolean; roomId: string; date: Date }>({ isOpen: false, roomId: '', date: new Date() });
  const [moveModal, setMoveModal] = useState<{ isOpen: boolean; eventId: string; roomId: string; date: Date }>({ isOpen: false, eventId: '', roomId: '', date: new Date() });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('general');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const isRoomOccupied = useCallback((roomId: string, startDate: Date, endDate: Date, excludeEventId?: string) => {
    return events.some(ev => {
      if (ev.id === excludeEventId) return false;
      if (ev.roomId !== roomId) return false;
      return areIntervalsOverlapping({ start: startDate, end: endDate }, { start: ev.startDate, end: ev.endDate });
    });
  }, [events]);

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    showToast('Prenotazione salvata correttamente');
  };

  // --- DROP LOGIC IMPLEMENTATION ---
  const handleEventDrop = (eventId: string, newRoomId: string, newDate: Date) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const duration = differenceInDays(event.endDate, event.startDate);
    const newEndDate = addDays(newDate, duration);

    // 1. Validazione Overlap
    if (isRoomOccupied(newRoomId, newDate, newEndDate, eventId)) {
      showToast('Impossibile spostare: La stanza è occupata in queste date.', 'error');
      return;
    }

    // A. Eventi Extra (Pulizie/Manutenzioni) -> Spostamento Immediato
    if (event.type !== 'prenotazione') {
      setExtraEvents(prev => prev.map(e => e.id === eventId ? { ...e, roomId: newRoomId, startDate: newDate, endDate: newEndDate } : e));
      showToast('Evento spostato');
      return;
    }

    // B. Logica Prenotazioni in base allo Status
    if (event.status === 'ricevuta') {
        // ROSA -> Salvataggio automatico senza wizard
        setBookings(prev => prev.map(b => b.id === event.bookingId ? { ...b, roomId: newRoomId, checkIn: newDate, checkOut: newEndDate } : b));
        showToast('Prenotazione spostata e salvata automaticamente');
        return;
    }

    if (['trattativa', 'confermata', 'confermata_fattura_mancante'].includes(event.status || '')) {
        // GIALLO / ARANCIONE -> Wizard di Conferma
        setMoveModal({ isOpen: true, eventId, roomId: newRoomId, date: newDate });
        return;
    }

    if (event.status === 'attiva') {
        // VERDE -> Bloccato
        showToast('Non puoi spostare una prenotazione Attiva. Usa la funzione "Rinnovo".', 'error');
        return;
    }
  };

  const handleConfirmMove = (data: { price: number; notes: string }) => {
    const { eventId, roomId, date } = moveModal;
    const event = events.find(e => e.id === eventId);
    if (!event || !event.bookingId) return;

    const duration = differenceInDays(event.endDate, event.startDate);
    const newEndDate = addDays(date, duration);

    // Re-check overlap before final commit
    if (isRoomOccupied(roomId, date, newEndDate, eventId)) {
      showToast('Conflitto rilevato: La stanza è stata occupata nel frattempo.', 'error');
      return;
    }

    setBookings(prev => prev.map(b => b.id === event.bookingId ? { 
      ...b, roomId: roomId, checkIn: date, checkOut: newEndDate, notes: b.notes + `\n[Spostamento] ${data.notes}` 
    } : b));

    setMoveModal({ isOpen: false, eventId: '', roomId: '', date: new Date() });
    showToast('Spostamento confermato con successo');
  };

  const selectedBooking = useMemo(() => bookings.find(b => b.id === selectedBookingId) || null, [selectedBookingId, bookings]);
  const moveModalBooking = useMemo(() => {
    if (!moveModal.eventId) return null;
    const event = events.find(e => e.id === moveModal.eventId);
    return bookings.find(b => b.id === event?.bookingId) || null;
  }, [moveModal.eventId, bookings, events]);
  const newRoomName = useMemo(() => mockRooms.find(r => r.id === moveModal.roomId)?.name || 'Stanza ...', [moveModal.roomId]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-500 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white relative">
      <FilterBar 
        filters={filters} availableCities={mockRooms.map(r=>r.city).filter((v,i,a)=>a.indexOf(v)===i) as string[]} competenceGroups={mockCompetenceGroups}
        onChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))} onRefresh={() => {}} onAddRoom={() => {}}
      />
      <CalendarHeader 
        year={filters.period.year} monthName={format(new Date(filters.period.year, filters.period.month), 'MMMM', { locale: it })}
        viewMode={viewMode} onViewChange={setViewMode}
        onPrev={() => {}} onNext={() => {}} onToday={() => {}} 
      />

      <div className="flex flex-1 overflow-hidden relative">
        <RoomColumn 
          virtualRows={visibleRows}
          totalHeight={totalContentHeight}
          scrollTop={scrollTop}
          onAddRoom={() => console.log('Add')}
        />
        
        <CalendarGrid 
          virtualRows={visibleRows}
          totalHeight={totalContentHeight}
          events={filteredEvents}
          year={filters.period.year}
          month={filters.period.month}
          onCellClick={(rid, date) => setCreateModal({ isOpen: true, roomId: rid, date })}
          onEventClick={(eid) => {
             const ev = events.find(e => e.id === eid);
             if (ev?.bookingId) { setSelectedBookingId(ev.bookingId); setActiveDrawerTab('general'); }
          }}
          onEventDrop={handleEventDrop}
          scrollRef={scrollContainerRef}
          onScroll={handleScroll}
        />
      </div>

      {toast.visible && (
        <div className="absolute bottom-8 right-8 z-[60] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <div className={`p-1 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
             {toast.type === 'error' ? <X size={14} /> : <CheckCircle2 size={14} />}
           </div>
           <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <CreateEventModal isOpen={createModal.isOpen} roomId={createModal.roomId} date={createModal.date} onClose={() => setCreateModal({ ...createModal, isOpen: false })} onSelectType={() => setCreateModal({ ...createModal, isOpen: false })} />
      <MoveBookingModal isOpen={moveModal.isOpen} booking={moveModalBooking} newRoomName={newRoomName} newDate={moveModal.date} onClose={() => setMoveModal({ isOpen: false, eventId: '', roomId: '', date: new Date() })} onConfirm={handleConfirmMove} />
      <BookingDrawer isOpen={!!selectedBookingId} booking={selectedBooking} onClose={() => setSelectedBookingId(null)} activeTab={activeDrawerTab} onTabChange={setActiveDrawerTab} userRole={mockCityManager.role} onSave={handleUpdateBooking} onSaveAndClose={(b) => { handleUpdateBooking(b); setSelectedBookingId(null); }} />
    </div>
  );
};