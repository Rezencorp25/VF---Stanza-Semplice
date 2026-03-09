import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  details?: React.ReactNode;
  color?: string;
  description?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  details,
  color = '#F97316',
  description
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // Close info popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    };

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-visible flex flex-col h-full">
      {/* Header */}
      <div className="p-6 flex items-start justify-between border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 shrink-0"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
              {description && (
                <div className="relative" ref={infoRef}>
                  <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    aria-label="Info KPI"
                  >
                    <Info size={16} />
                  </button>
                  
                  <AnimatePresence>
                    {showInfo && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-10"
                      >
                        {description}
                        {/* Little triangle pointer */}
                        <div className="absolute -top-1 left-1.5 w-2 h-2 bg-slate-800 transform rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black" style={{ color }}>{value}</span>
              {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Details (Always Expanded) */}
      <div className="p-6 flex-1 flex flex-col">
        {details}
      </div>
    </div>
  );
};
