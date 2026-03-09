import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Map, 
  PieChart as LucidePieChart, 
  TrendingUp,
  Clock,
  Maximize
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { KpiSection } from '../KpiSection';
import { FilterState } from '../../../types/kpi';
import { getArea1Data, Area1Data } from '../mockDataArea1';
import { KpiLineChart } from '../charts/KpiLineChart';
import { KpiBarChart } from '../charts/KpiBarChart';
import { KpiHorizontalBarChart } from '../charts/KpiHorizontalBarChart';
import { ChartSkeleton } from '../charts/ChartSkeleton';

interface OccupancyDetailViewProps {
  filterState?: FilterState;
  onModifyFilters?: () => void;
}

export const OccupancyDetailView: React.FC<OccupancyDetailViewProps> = ({ filterState, onModifyFilters }) => {
  const [data, setData] = useState<Area1Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!filterState) return;
    
    // Simulate data fetching/filtering when filterState changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      const newData = getArea1Data(filterState);
      setData(newData);
      setIsLoading(false);
    }, 450); // 150ms fade out + 300ms shimmer

    return () => clearTimeout(timer);
  }, [filterState]);

  // Determine active keys for charts
  const getActiveKeys = () => {
    if (!filterState) return ['Milano', 'Roma', 'Torino', 'Bologna'];
    
    if (filterState.groupBy === 'cities') {
      return filterState.cities.length > 0 ? filterState.cities : ['Milano', 'Roma', 'Torino', 'Bologna'];
    } else if (filterState.groupBy === 'areas') {
      return filterState.areas.length > 0 ? filterState.areas : ['Nord', 'Centro', 'Sud'];
    } else {
      return filterState.groups.length > 0 ? filterState.groups : ['GC1', 'GC2', 'GC3'];
    }
  };

  const activeKeys = getActiveKeys().slice(0, 4); // Limit to 4 for visualization

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {isLoading || !data ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[400px]">
                <ChartSkeleton />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* 1. Occupancy nel tempo */}
            <KpiSection 
              title="Occupancy nel tempo" 
              description="Andamento percentuale dell'occupazione negli ultimi 12 mesi."
              icon={<TrendingUp size={20} />}
            >
              <KpiLineChart 
                data={data.occupancy} 
                dataKeys={activeKeys} 
                targetValue={90}
                unit="%"
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 2. Stanze Attive */}
            <KpiSection 
              title="Stanze Attive" 
              description="Numero di stanze attive per raggruppamento."
              icon={<BarChart3 size={20} />}
            >
              <KpiBarChart 
                data={data.activeRooms} 
                dataKeys={activeKeys} 
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 3. MQ Disponibili */}
            <KpiSection 
              title="MQ Disponibili" 
              description="Metri quadri totali disponibili per raggruppamento."
              icon={<Maximize size={20} />}
            >
              <KpiBarChart 
                data={data.availableSqM} 
                dataKeys={activeKeys} 
                unit="mq"
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 4. Giorni medi di riaffitto */}
            <KpiSection 
              title="Giorni medi di riaffitto" 
              description="Tempo medio per riaffittare una stanza (Soglia: 7gg)."
              icon={<Clock size={20} />}
            >
              <KpiHorizontalBarChart 
                data={data.reRentDays} 
                dataKey="days" 
                nameKey="room"
                threshold={7}
                unit="gg"
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
