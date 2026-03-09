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
import { KpiCard } from '../KpiCard';
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

  // Calculate summary values
  const latestOccupancy = data?.occupancy[data.occupancy.length - 1];
  const occupancyValue = latestOccupancy 
    ? (activeKeys.reduce((acc, key) => acc + (latestOccupancy[key] as number || 0), 0) / activeKeys.length).toFixed(1)
    : 0;

  const latestActiveRooms = data?.activeRooms[data.activeRooms.length - 1];
  const activeRoomsValue = latestActiveRooms
    ? activeKeys.reduce((acc, key) => acc + (latestActiveRooms[key] as number || 0), 0)
    : 0;

  const latestAvailableSqM = data?.availableSqM[data.availableSqM.length - 1];
  const availableSqMValue = latestAvailableSqM
    ? activeKeys.reduce((acc, key) => acc + (latestAvailableSqM[key] as number || 0), 0).toLocaleString()
    : 0;

  const reRentDaysValue = data?.reRentDays
    ? (data.reRentDays.reduce((acc, curr) => acc + curr.days, 0) / data.reRentDays.length).toFixed(1)
    : 0;

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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* 1. Occupancy nel tempo */}
            <KpiCard 
              title="Occupancy nel tempo" 
              value={occupancyValue}
              unit="%"
              icon={<TrendingUp size={20} />}
              color="#3b82f6"
              description="Misura la percentuale di stanze affittate rispetto al totale delle stanze disponibili. Calcolato come: (Stanze Affittate / Stanze Totali) * 100."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiLineChart 
                    data={data.occupancy} 
                    dataKeys={activeKeys} 
                    targetValue={90}
                    unit="%"
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 2. Stanze Attive */}
            <KpiCard 
              title="Stanze Attive" 
              value={activeRoomsValue}
              icon={<BarChart3 size={20} />}
              color="#22c55e"
              description="Il numero totale di stanze attualmente disponibili e gestite nel portafoglio, pronte per essere affittate o già occupate."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiBarChart 
                    data={data.activeRooms} 
                    dataKeys={activeKeys} 
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 3. MQ Disponibili */}
            <KpiCard 
              title="MQ Disponibili" 
              value={availableSqMValue}
              unit="mq"
              icon={<Maximize size={20} />}
              color="#f97316"
              description="La superficie totale in metri quadrati di tutte le stanze e le aree comuni gestite nel portafoglio immobiliare."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiBarChart 
                    data={data.availableSqM} 
                    dataKeys={activeKeys} 
                    unit="mq"
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 4. Giorni medi di riaffitto */}
            <KpiCard 
              title="Giorni medi di riaffitto" 
              value={reRentDaysValue}
              unit="gg"
              icon={<Clock size={20} />}
              color="#a855f7"
              description="Il tempo medio (in giorni) che intercorre tra l'uscita di un inquilino e l'ingresso del successivo. Un valore più basso indica maggiore efficienza."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiHorizontalBarChart 
                    data={data.reRentDays} 
                    dataKey="days" 
                    nameKey="room"
                    threshold={7}
                    unit="gg"
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
