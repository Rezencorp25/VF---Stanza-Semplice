import React, { useMemo, useState, useRef } from 'react';
import { CalendarEvent, BookingStatus, EventType } from '../types';
import { VirtualRow } from './PlanningSection';
import { eachDayOfInterval, startOfYear, endOfYear, differenceInCalendarDays, startOfDay, getDaysInMonth, format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';

interface CalendarGridProps {
  virtualRows: VirtualRow[];
  totalHeight: number;
  events: CalendarEvent[];
  year: number;
  month: number;
  onCellClick: (roomId: string, date: Date) => void;
  onEventClick: (eventId: string) => void;
  onEventDrop?: (eventId: string, newRoomId: string, newDate: Date) => void;
  scrollRef: React.Ref<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const CELL_WIDTH = 48; 
const MONTH_HEADER_HEIGHT = 52; 

const getEventStyles = (type: EventType, status?: BookingStatus) => {
  if (type === 'prenotazione') {
    switch (status) {
      case 'ricevuta': return 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200';
      case 'trattativa': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
      case 'confermata': return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200';
      case 'confermata_fattura_mancante': return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
      case 'attiva': return 'bg-emerald-100 text-emerald-700 border-emerald-200 opacity-90'; 
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
  if (type === 'pulizia') return 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200';
  if (type === 'manutenzione') return 'bg-gray-800 text-white border-gray-700';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  virtualRows,
  totalHeight,
  events,
  year,
  onCellClick,
  onEventClick,
  onEventDrop,
  scrollRef,
  onScroll
}) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{ roomId: string; date: Date } | null>(null);
  
  // Ref for the main container to toggle classes without re-renders
  const containerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => eachDayOfInterval({ start: startOfYear(new Date(year, 0, 1)), end: endOfYear(new Date(year, 0, 1)) }), [year]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return { name: format(date, 'MMMM', { locale: it }), width: getDaysInMonth(date) * CELL_WIDTH };
  }), [year]);
  const yearStart = useMemo(() => startOfYear(new Date(year, 0, 1)), [year]);
  const today = new Date();

  // Optimized Event Mapping
  const eventsByRoom = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      if (!map[event.roomId]) map[event.roomId] = [];
      map[event.roomId].push(event);
    });
    return map;
  }, [events]);

  // --- D&D Handlers ---
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image if needed, or let browser default handle it.
    // IMPORTANT: Delay the class toggle to allow the browser to generate the drag image from the element 
    // BEFORE we make it transparent/pointer-events-none.
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('is-dragging');
      }
    }, 10);
  };

  const handleDragOver = (e: React.DragEvent, roomId: string, date: Date) => {
    e.preventDefault(); // MANDATORY for onDrop to fire
    e.dataTransfer.dropEffect = 'move';
    
    // Update visual feedback (blue cell background)
    // Optimization: Only update state if values actually changed
    if (!dragOverInfo || dragOverInfo.roomId !== roomId || !isSameDay(dragOverInfo.date, date)) {
       setDragOverInfo({ roomId, date });
    }
  };

  const handleDrop = (e: React.DragEvent, roomId: string, date: Date) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling
    
    const eventId = e.dataTransfer.getData('text/plain');
    
    // Cleanup DOM classes immediately
    if (containerRef.current) {
      containerRef.current.classList.remove('is-dragging');
    }
    setDragOverInfo(null);

    if (eventId && onEventDrop) {
      onEventDrop(eventId, roomId, date);
    }
  };

  const handleDragEnd = () => {
    // Safety cleanup in case drop didn't fire (e.g. dropped outside)
    if (containerRef.current) {
      containerRef.current.classList.remove('is-dragging');
    }
    setDragOverInfo(null);
  };

  return (
    <>
      <style>{`
        /* 
         * Critical Style for D&D:
         * When .is-dragging is active on the container, ALL calendar events 
         * lose pointer events. This allows the mouse to pass through the event
         * and hit the 'onDrop' target of the cell underneath.
         */
        .is-dragging .calendar-event {
          pointer-events: none !important;
          opacity: 0.6;
        }
        /* Ensure cells are always clickable targets */
        .calendar-cell {
          z-index: 1; 
        }
      `}</style>
      
      <div 
        ref={(node) => {
          // Merge refs: Local containerRef + parent scrollRef
          containerRef.current = node;
          if (typeof scrollRef === 'function') scrollRef(node);
          else if (scrollRef) (scrollRef as any).current = node;
        }}
        onScroll={onScroll}
        className="flex-1 overflow-auto bg-white relative h-full custom-scrollbar isolate select-none planning-container"
      >
        <div className="min-w-max relative">
          
          {/* Sticky Headers Wrapper */}
          <div className="sticky top-0 z-50 bg-white shadow-sm">
             {/* Months */}
             <div className="flex border-b border-slate-200" style={{ height: MONTH_HEADER_HEIGHT }}>
                {months.map((m, i) => (
                  <div key={i} style={{ width: m.width }} className="flex items-center px-4 border-r border-slate-100 text-sm font-bold capitalize text-slate-700 h-full bg-white">
                    {m.name}
                  </div>
                ))}
             </div>
             {/* Days (Sub-header) */}
             <div className="flex bg-slate-50/50 backdrop-blur-[2px] border-b border-slate-100 h-[33px]">
                {days.map((d, i) => (
                   <div key={`th-${i}`} style={{ width: CELL_WIDTH }} className={`border-r border-slate-100 h-full flex-shrink-0 flex items-center justify-center text-[10px] font-medium ${isSameDay(d, today) ? 'text-orange-600 bg-orange-50 font-bold' : 'text-slate-400'}`}>
                     {d.getDate()}
                   </div>
                ))}
             </div>
          </div>

          {/* Virtualized Body */}
          <div style={{ height: totalHeight, position: 'relative' }}>
            {virtualRows.map(row => {
              if (row.type === 'header') {
                 return (
                   <div 
                     key={row.id}
                     className="absolute w-full border-b border-slate-50 bg-slate-50/30"
                     style={{ height: row.height, top: row.top }}
                   />
                 );
              } else {
                 const room = row.data as any; // Room type
                 return (
                   <div 
                     key={row.id} 
                     className="absolute w-full border-b border-slate-50 flex hover:bg-slate-50 transition-colors"
                     style={{ height: row.height, top: row.top }}
                   >
                      {/* Cells */}
                      {days.map(day => (
                         <div
                           key={day.toISOString()}
                           className={`calendar-cell border-r border-slate-100 h-full flex-shrink-0 cursor-pointer transition-colors ${dragOverInfo?.roomId === room.id && isSameDay(dragOverInfo.date, day) ? 'bg-orange-100 ring-2 ring-inset ring-orange-400' : ''}`}
                           style={{ width: CELL_WIDTH }}
                           onClick={() => onCellClick(room.id, day)}
                           onDragOver={(e) => handleDragOver(e, room.id, day)}
                           onDrop={(e) => handleDrop(e, room.id, day)}
                         />
                      ))}
                      
                      {/* Events */}
                      {eventsByRoom[room.id]?.map(event => {
                         const startDate = startOfDay(new Date(event.startDate));
                         const endDate = startOfDay(new Date(event.endDate));
                         if (endDate < yearStart || startDate > endOfYear(yearStart)) return null;

                         let offsetDays = differenceInCalendarDays(startDate, yearStart);
                         if (offsetDays < 0) offsetDays = 0;
                         
                         let durationDays = differenceInCalendarDays(endDate, startDate);
                         if (durationDays < 1) durationDays = 1;

                         return (
                           <div
                             key={event.id}
                             draggable={true}
                             onDragStart={(e) => handleDragStart(e, event.id)}
                             onDragEnd={handleDragEnd}
                             onMouseEnter={() => setHoveredEventId(event.id)}
                             onMouseLeave={() => setHoveredEventId(null)}
                             onClick={(e) => { e.stopPropagation(); onEventClick(event.id); }}
                             className={`calendar-event absolute top-2 bottom-2 mx-1 rounded-full border shadow-sm flex items-center px-3 z-20 whitespace-nowrap transition-all duration-200 cursor-move
                               ${getEventStyles(event.type, event.status)}
                             `}
                             style={{ left: `${offsetDays * CELL_WIDTH}px`, width: `${durationDays * CELL_WIDTH - 8}px` }}
                           >
                             <span className="text-[11px] font-bold truncate block w-full pointer-events-none">{event.label}</span>
                             {/* Tooltip */}
                             {hoveredEventId === event.id && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs p-2 rounded z-50 pointer-events-none shadow-lg whitespace-nowrap">
                                  {event.label} ({event.status?.replace('_', ' ')})
                                </div>
                             )}
                           </div>
                         );
                      })}
                   </div>
                 );
              }
            })}
          </div>

        </div>
      </div>
    </>
  );
};