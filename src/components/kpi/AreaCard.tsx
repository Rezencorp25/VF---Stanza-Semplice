import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      layoutId={layoutId}
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
            {areaNumber}
          </div>
          <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {title}
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
          score >= 90 ? 'bg-green-50 text-green-600 border-green-100' :
          score >= 70 ? 'bg-orange-50 text-orange-600 border-orange-100' :
          'bg-red-50 text-red-600 border-red-100'
        }`}>
          Score: {score}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      {children}
      
      <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center text-sm font-bold text-orange-500 gap-1">
          Dettagli <ArrowRight size={16} />
        </span>
      </div>
    </motion.div>
  );
};
