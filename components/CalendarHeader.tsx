import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';

interface CalendarHeaderProps {
  year: number;
  monthName: string; // Aggiunto per mostrare il mese corrente
  viewMode: 'days' | 'weeks' | 'months';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: 'days' | 'weeks' | 'months') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  year, 
  monthName,
  viewMode,
  onPrev, 
  onNext,
  onToday,
  onViewChange
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-30 relative">
      
      {/* Left: Date Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
          <button 
            onClick={onPrev}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={onToday}
            className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
          >
            Oggi
          </button>
          <button 
            onClick={onNext}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-500 hover:text-slate-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="capitalize">{monthName}</span> 
          <span className="text-slate-400 font-medium">{year}</span>
        </h2>
      </div>

      {/* Right: View Toggles & Actions */}
      <div className="flex items-center gap-3">
        
        {/* View Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => onViewChange('days')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'days' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mese
          </button>
          <button 
             onClick={() => onViewChange('weeks')}
             className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'weeks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            2 Settimane
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-all active:scale-95">
          <Calendar size={16} />
          <span>Filtra Date</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </div>
    </div>
  );
};