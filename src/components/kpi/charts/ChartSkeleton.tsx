import React from 'react';
import { motion } from 'framer-motion';

export const ChartSkeleton: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-[300px] bg-slate-50 rounded-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      <div className="absolute bottom-10 left-10 right-10 top-10 flex items-end gap-4">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="bg-slate-200 rounded-t-md w-full" 
            style={{ height: `${Math.random() * 80 + 20}%` }} 
          />
        ))}
      </div>
    </motion.div>
  );
};
