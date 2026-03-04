import React from 'react';
import { CalendarFilters, EventType, CompetenceGroup } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Plus, 
  MapPin, 
  Users,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';

interface FilterBarProps {
  filters: CalendarFilters;
  availableCities: string[];
  competenceGroups: CompetenceGroup[];
  onChange: (newFilters: Partial<CalendarFilters>) => void;
  onRefresh: () => void;
  onAddRoom: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  availableCities,
  competenceGroups,
  onChange,
  onRefresh,
  onAddRoom
}) => {

  // --- Handlers ---

  const handlePrevPeriod = () => {
    let { month, year } = filters.period;
    if (month === 0) {
      month = 11;
      year -= 1;
    } else {
      month -= 1;
    }
    onChange({ period: { month, year } });
  };

  const handleNextPeriod = () => {
    let { month, year } = filters.period;
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    onChange({ period: { month, year } });
  };

  const toggleEventType = (type: EventType) => {
    const current = filters.eventTypes;
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onChange({ eventTypes: next });
  };

  // Formattazione Data
  const periodLabel = new Date(filters.period.year, filters.period.month, 1)
    .toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

  // Mappa label tipologie per UI
  const eventTypeLabels: Record<EventType, string> = {
    prenotazione: 'Prenotazioni',
    pulizia: 'Pulizie',
    manutenzione: 'Manutenzioni',
    fattura: 'Fatture'
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800 text-white shadow-md border-b border-slate-700 w-full z-30 relative">
      
      {/* 1. PERIODO */}
      <div className="flex items-center bg-slate-700 rounded-lg p-1">
        <button onClick={handlePrevPeriod} className="p-1 hover:bg-slate-600 rounded transition-colors text-slate-300 hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center">
          <Calendar size={14} className="text-orange-400" />
          <span className="font-bold capitalize text-sm">
            {periodLabel}
          </span>
        </div>
        <button onClick={handleNextPeriod} className="p-1 hover:bg-slate-600 rounded transition-colors text-slate-300 hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="h-6 w-px bg-slate-700 hidden md:block" />

      {/* 2. TIPOLOGIE EVENTO (Pills Toggle) */}
      <div className="flex items-center gap-2">
        {(['prenotazione', 'pulizia', 'manutenzione', 'fattura'] as EventType[]).map(type => {
          const isActive = filters.eventTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleEventType(type)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                }
              `}
            >
              {eventTypeLabels[type]}
            </button>
          );
        })}
      </div>

      <div className="h-6 w-px bg-slate-700 hidden md:block" />

      {/* 3. FILTRI SELECT (Stato, Locale, Città, Gruppi) */}
      <div className="flex flex-wrap gap-3">
        
        {/* Stato Prenotazione */}
        <div className="relative">
          <select 
            value={filters.bookingStatusFilter}
            onChange={(e) => onChange({ bookingStatusFilter: e.target.value as any })}
            className="appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg pl-3 pr-8 py-2 outline-none focus:border-orange-500 hover:bg-slate-600 transition-colors cursor-pointer"
          >
            <option value="active">Solo Attive</option>
            <option value="deleted">Eliminate</option>
            <option value="all">Tutte</option>
          </select>
          <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* CITTÀ */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <MapPin size={14} />
          </div>
          <select 
            value={filters.cities[0] || ''} 
            onChange={(e) => onChange({ cities: e.target.value ? [e.target.value] : [] })}
            className="appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg pl-9 pr-8 py-2 outline-none focus:border-orange-500 hover:bg-slate-600 transition-colors cursor-pointer min-w-[130px]"
          >
            <option value="">Tutte le Città</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* GRUPPI */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Users size={14} />
          </div>
          <select 
            value={filters.competenceGroupIds[0] || ''} 
            onChange={(e) => onChange({ competenceGroupIds: e.target.value ? [e.target.value] : [] })}
            className="appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg pl-9 pr-8 py-2 outline-none focus:border-orange-500 hover:bg-slate-600 transition-colors cursor-pointer min-w-[140px]"
          >
            <option value="">Tutti i Gruppi</option>
            {competenceGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

      </div>

      <div className="flex-1" />

      {/* 4. VISTA (Toggle Giorni/Mesi) */}
      <div className="flex bg-slate-700 rounded-lg p-1">
        {(['days', 'months', 'years'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange({ viewMode: mode })}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all
              ${filters.viewMode === mode ? 'bg-slate-600 text-orange-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {mode === 'days' ? 'Giorni' : mode === 'months' ? 'Mesi' : 'Anni'}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-slate-700 mx-2 hidden lg:block" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-orange-400 hover:bg-slate-700 rounded-lg transition-colors"
          title="Aggiorna Dati"
        >
          <RotateCw size={18} />
        </button>
        <button 
          onClick={onAddRoom}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden xl:inline">Nuova Stanza</span>
        </button>
      </div>

    </div>
  );
};