import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon?: React.ReactNode;
  isMulti?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  icon,
  isMulti = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (!isMulti) {
      onChange([option]);
      setIsOpen(false);
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const selectAll = () => {
    onChange([...options]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const activeCount = selected.length;
  const isAllSelected = activeCount === options.length;
  
  // Label logic: Show count if some are selected but not all
  const displayLabel = isAllSelected 
    ? label 
    : activeCount > 0 
      ? `${label} (${activeCount})` 
      : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
          activeCount > 0 && !isAllSelected
            ? 'bg-orange-50 border-orange-200 text-orange-700' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        {icon}
        <span className="text-sm font-medium whitespace-nowrap">
          {displayLabel}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Mobile Backdrop & Bottom Sheet */}
          <div className="fixed inset-0 bg-black/20 z-50 md:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{label}</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>
            
            {isMulti && (
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                  {activeCount} selezionati
                </span>
                <div className="flex gap-1">
                  {activeCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Deseleziona tutto"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {!isAllSelected && (
                    <button
                      onClick={selectAll}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Seleziona tutto"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-colors mb-1 ${
                      isSelected 
                        ? 'bg-orange-50 text-orange-700 font-bold' 
                        : 'text-slate-600 bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <Check size={16} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 safe-area-bottom">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
              >
                Applica Filtri
              </button>
            </div>
          </div>

          {/* Desktop Popover */}
          <div className="hidden md:block absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {isMulti && (
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                  {activeCount} selezionati
                </span>
                <div className="flex gap-1">
                  {activeCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Deseleziona tutto"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {!isAllSelected && (
                    <button
                      onClick={selectAll}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Seleziona tutto"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="max-h-60 overflow-y-auto p-1">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected 
                        ? 'bg-orange-50 text-orange-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <Check size={14} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
            
            <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded hover:bg-orange-100 transition-colors"
              >
                Fatto
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
