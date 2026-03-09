import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterBar } from './FilterBar';
import { FilterState } from '../../types/kpi';

interface KpiDetailScreenProps {
  areaId: string;
  onBack: () => void;
  children?: React.ReactNode;
}

export const KpiDetailScreen: React.FC<KpiDetailScreenProps> = ({
  areaId,
  onBack,
  children
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    groupBy: 'cities',
    areas: [],
    cities: [],
    groups: [],
    fromMonth: { month: 1, year: 2025 }, // Default 12 months ago (approx)
    toMonth: { month: 3, year: 2026 }    // Default current month
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count whenever filterState changes
  useEffect(() => {
    let count = 0;
    if (filterState.groupBy !== 'cities') count++;
    if (filterState.areas.length > 0) count++;
    if (filterState.cities.length > 0) count++;
    if (filterState.groups.length > 0) count++;
    // Date range is always active, but we could check if it differs from default
    setActiveFiltersCount(count);
  }, [filterState]);

  const getAreaDetails = () => {
    switch(areaId) {
      case 'occupancy': 
        return { 
          title: 'Area Occupazione-Commerciale', 
          score: 94,
          sections: 4,
          color: 'green'
        };
      case 'financial': 
        return { 
          title: 'Area Economico-Finanziaria', 
          score: 88,
          sections: 6,
          color: 'orange'
        };
      case 'operational': 
        return { 
          title: 'Area Operativa & Crescita', 
          score: 92,
          sections: 4,
          color: 'green'
        };
      default: 
        return { 
          title: 'Dettaglio KPI', 
          score: 0,
          sections: 3,
          color: 'slate'
        };
    }
  };

  const details = getAreaDetails();

  const handleRefresh = () => {
    console.log('Refreshing data with filters:', filterState);
    // Simulate fetch delay
    setTimeout(() => {
      console.log('Data refreshed');
    }, 300);
  };

  const renderPlaceholders = () => {
    return Array.from({ length: details.sections }).map((_, index) => (
      <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">KPI Section {index + 1}</h3>
        <div className="h-[280px] bg-[#E0E0E0] rounded-xl flex items-center justify-center">
          <span className="text-slate-500 font-medium">Grafico in arrivo</span>
        </div>
      </div>
    ));
  };

  return (
    <motion.div 
      layoutId={`area-card-${areaId}`}
      className="fixed inset-0 bg-slate-50 z-50 overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.35 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
            {details.title}
          </h2>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${
          details.score >= 90 ? 'bg-green-50 text-green-600 border-green-100' :
          details.score >= 70 ? 'bg-orange-50 text-orange-600 border-orange-100' :
          'bg-red-50 text-red-600 border-red-100'
        }`}>
          Score: {details.score}%
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 z-20 shadow-sm flex-shrink-0">
        <div className="overflow-x-auto">
          <div className="px-6 py-3 min-w-max">
            <FilterBar 
              filterState={filterState} 
              onFilterChange={setFilterState} 
              onRefresh={handleRefresh} 
            />
          </div>
        </div>
      </div>

      {/* Active Filters Chip */}
      {activeFiltersCount > 0 && (
        <div className="px-8 pt-4 pb-0">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
            <span>Filtri attivi: {activeFiltersCount}</span>
            <button 
              onClick={() => setFilterState({
                groupBy: 'cities',
                areas: [],
                cities: [],
                groups: [],
                fromMonth: { month: 1, year: 2025 },
                toMonth: { month: 3, year: 2026 }
              })}
              className="hover:bg-slate-300 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {/* If children are provided (actual charts), show them, otherwise show placeholders */}
        {children ? (
          React.isValidElement(children) 
            ? React.cloneElement(children as React.ReactElement<any>, { 
                filterState,
                onModifyFilters: () => {
                  const scrollContainer = document.querySelector('.overflow-y-auto');
                  if (scrollContainer) {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }) 
            : children
        ) : renderPlaceholders()}
      </div>
    </motion.div>
  );
};
