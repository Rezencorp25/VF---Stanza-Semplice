import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AreaCardProps {
  areaNumber: number;
  title: string;
  score: number;
  metrics: {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }[];
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export const AreaCard: React.FC<AreaCardProps> = ({
  areaNumber,
  title,
  score,
  metrics,
  onClick,
  children,
  className = '',
  layoutId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layoutId={layoutId}
      layout
      className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 group ${className}`}
      animate={{
        boxShadow: isExpanded 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header (Clickable to expand) */}
      <div 
        className="flex justify-between items-center mb-6 cursor-pointer select-none"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) {
            onClick(); // Trigger the onClick when expanding to show details
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              onClick();
            }
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
            {areaNumber}
          </div>
          <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
            score >= 90 ? 'bg-green-50 text-green-600 border-green-100' :
            score >= 70 ? 'bg-orange-50 text-orange-600 border-orange-100' :
            'bg-red-50 text-red-600 border-red-100'
          }`}>
            Score: {score}%
          </span>
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      {/* Metrics (Always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-50 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
              {metric.label}
            </p>
            <div className="flex justify-between items-end">
              <span className={`text-xl font-bold ${metric.color || 'text-slate-900'}`}>
                {metric.value}
              </span>
              {metric.subValue && (
                <span className="text-xs font-bold text-slate-400">
                  {metric.subValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Content (Charts) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.35, ease: [0.4, 0.0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <motion.div 
              variants={{
                open: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.25, ease: [0.4, 0.0, 0.2, 1] } },
                collapsed: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] } }
              }}
              className="pt-4"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
