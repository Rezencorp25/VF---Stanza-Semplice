import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Filter } from 'lucide-react';

interface ChartStateContainerProps {
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
  children: React.ReactNode;
  height?: number | string;
}

export const ChartStateContainer: React.FC<ChartStateContainerProps> = ({
  isLoading,
  hasError,
  isEmpty,
  onRetry,
  onModifyFilters,
  children,
  height = 300
}) => {
  // Loading State (Shimmer)
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-slate-50 rounded-xl relative overflow-hidden"
        style={{ height }}
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
  }

  // Error State
  if (hasError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full bg-red-50 rounded-xl flex flex-col items-center justify-center gap-4 border border-red-100"
        style={{ height }}
      >
        <div className="bg-red-100 p-3 rounded-full">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <div className="text-center">
          <h3 className="text-red-900 font-medium">Errore nel caricamento</h3>
          <p className="text-red-700 text-sm mt-1">Non è stato possibile recuperare i dati.</p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            Riprova
          </button>
        )}
      </motion.div>
    );
  }

  // Empty State
  if (isEmpty) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-4 border border-slate-100"
        style={{ height }}
      >
        <div className="bg-slate-100 p-3 rounded-full">
          <Filter className="text-slate-400" size={24} />
        </div>
        <div className="text-center">
          <h3 className="text-slate-700 font-medium">Nessun dato disponibile</h3>
          <p className="text-slate-500 text-sm mt-1">Prova a modificare i filtri selezionati.</p>
        </div>
        {onModifyFilters && (
          <button 
            onClick={onModifyFilters}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm animate-pulse-subtle"
          >
            Modifica filtri
          </button>
        )}
      </motion.div>
    );
  }

  // Content
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full"
      style={{ height }}
    >
      {children}
    </motion.div>
  );
};
