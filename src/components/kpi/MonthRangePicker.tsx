import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MonthYear } from '../../types/kpi';

interface MonthRangePickerProps {
  from: MonthYear;
  to: MonthYear;
  onChange: (from: MonthYear, to: MonthYear) => void;
}

const months = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
];

export const MonthRangePicker: React.FC<MonthRangePickerProps> = ({
  from,
  to,
  onChange
}) => {
  const [openPicker, setOpenPicker] = useState<'from' | 'to' | null>(null);
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpen = (type: 'from' | 'to') => {
    if (openPicker === type) {
      setOpenPicker(null);
    } else {
      setOpenPicker(type);
      setViewYear(type === 'from' ? from.year : to.year);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const month = monthIndex + 1;
    const newDate = { month, year: viewYear };

    if (openPicker === 'from') {
      // Validate: From cannot be after To
      const fromTime = new Date(newDate.year, newDate.month - 1).getTime();
      const toTime = new Date(to.year, to.month - 1).getTime();
      
      if (fromTime > toTime) {
        // If invalid, push To forward or just block? 
        // Requirement: "non può essere > Al mese". 
        // Let's just update From, and if it's > To, we set To = From
        onChange(newDate, newDate);
      } else {
        onChange(newDate, to);
      }
    } else if (openPicker === 'to') {
      // Validate: To cannot be before From
      const toTime = new Date(newDate.year, newDate.month - 1).getTime();
      const fromTime = new Date(from.year, from.month - 1).getTime();

      if (toTime < fromTime) {
        // If invalid, set From = To
        onChange(newDate, newDate);
      } else {
        onChange(from, newDate);
      }
    }
    setOpenPicker(null);
  };

  const renderPicker = () => (
    <div className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-100 z-50 p-4 w-64 animate-in fade-in zoom-in-95 duration-200 left-0">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setViewYear(prev => prev - 1)}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-bold text-slate-700">{viewYear}</span>
        <button 
          onClick={() => setViewYear(prev => prev + 1)}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((m, index) => {
          const monthNum = index + 1;
          // Check if disabled based on logic? 
          // Requirement says "non può essere > Al mese" but usually we just auto-correct or disable.
          // Let's keep it simple: allow selection and auto-correct in handleMonthSelect.
          
          const isSelected = openPicker === 'from' 
            ? (from.month === monthNum && from.year === viewYear)
            : (to.month === monthNum && to.year === viewYear);

          return (
            <button
              key={m}
              onClick={() => handleMonthSelect(index)}
              className={`text-xs py-2 rounded-lg font-medium transition-colors ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <div className="relative">
        <button
          onClick={() => handleOpen('from')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
            openPicker === 'from'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar size={16} className={openPicker === 'from' ? 'text-orange-500' : 'text-slate-400'} />
          <span className="text-sm font-medium whitespace-nowrap">
            Dal: {months[from.month - 1]} {from.year}
          </span>
        </button>
        {openPicker === 'from' && renderPicker()}
      </div>

      <div className="relative">
        <button
          onClick={() => handleOpen('to')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
            openPicker === 'to'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar size={16} className={openPicker === 'to' ? 'text-orange-500' : 'text-slate-400'} />
          <span className="text-sm font-medium whitespace-nowrap">
            Al: {months[to.month - 1]} {to.year}
          </span>
        </button>
        {openPicker === 'to' && renderPicker()}
      </div>
    </div>
  );
};
