import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Wallet, 
  PieChart as LucidePieChart, 
  TrendingUp,
  CreditCard,
  DollarSign,
  Layers
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { KpiCard } from '../KpiCard';
import { FilterState } from '../../../types/kpi';
import { getArea2Data, Area2Data } from '../mockDataArea2';
import { KpiStackedBarChart } from '../charts/KpiStackedBarChart';
import { KpiDarkBarChart } from '../charts/KpiDarkBarChart';
import { KpiGroupedBarChart } from '../charts/KpiGroupedBarChart';
import { KpiRangeLineChart } from '../charts/KpiRangeLineChart';
import { KpiNegativeBarChart } from '../charts/KpiNegativeBarChart';
import { KpiFunnelChart } from '../charts/KpiFunnelChart';
import { ChartSkeleton } from '../charts/ChartSkeleton';

interface FinancialDetailViewProps {
  filterState?: FilterState;
  onModifyFilters?: () => void;
}

export const FinancialDetailView: React.FC<FinancialDetailViewProps> = ({ filterState, onModifyFilters }) => {
  const [data, setData] = useState<Area2Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate data fetching/filtering when filterState changes
    setIsLoading(true);
    setHasError(false);
    
    const timer = setTimeout(() => {
      try {
        // Simulate random error for demonstration (1% chance)
        if (Math.random() < 0.01) throw new Error("Fetch failed");
        
        const newData = filterState ? getArea2Data(filterState) : null;
        setData(newData);
        setIsLoading(false);
      } catch (err) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 600); // Slightly longer delay for realism

    return () => clearTimeout(timer);
  }, [filterState]);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      const newData = filterState ? getArea2Data(filterState) : null;
      setData(newData);
      setIsLoading(false);
    }, 600);
  };

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

  const activeKeys = getActiveKeys().slice(0, 4);

  // Calculate summary values
  const latestStructural = data?.structuralRevenue[data.structuralRevenue.length - 1];
  const structuralValue = latestStructural
    ? activeKeys.reduce((acc, key) => acc + (latestStructural[key] as number || 0), 0).toLocaleString()
    : 0;

  const avgRoomPrice = "450"; // Mocked for simplicity as in AreaCard

  const latestOther = data?.otherRevenue[data.otherRevenue.length - 1];
  const otherValue = latestOther
    ? ((latestOther['Servizi'] as number || 0) + (latestOther['Penali'] as number || 0) + (latestOther['Extra'] as number || 0) + (latestOther['Altro'] as number || 0)).toLocaleString()
    : 0;

  const latestAvgRoom = data?.avgRoomRevenue[data.avgRoomRevenue.length - 1];
  const avgRoomValue = latestAvgRoom ? latestAvgRoom.avg.toLocaleString() : 0;

  const latestCredit = data?.creditNotes[data.creditNotes.length - 1];
  const creditValue = latestCredit ? latestCredit.value.toLocaleString() : 0;

  const funnelStart = data?.revenueFunnel[0];
  const funnelValue = funnelStart ? funnelStart.value.toLocaleString() : 0;

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {isLoading && !data && !hasError ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {[...Array(6)].map((_, i) => (
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
            {/* 1. Ricavi Strutturali */}
            <KpiCard 
              title="Ricavi Strutturali" 
              value={structuralValue}
              unit="€"
              icon={<BarChart3 size={20} />}
              color="#3b82f6"
              description="Il totale dei ricavi generati direttamente dall'affitto delle stanze, escludendo servizi extra o penali."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiStackedBarChart 
                    data={data?.structuralRevenue || []} 
                    dataKeys={activeKeys} 
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 2. Distribuzione Prezzi */}
            <KpiCard 
              title="Distribuzione Prezzi" 
              value={avgRoomPrice}
              unit="€"
              icon={<DollarSign size={20} />}
              color="#f97316"
              description="Analisi della distribuzione delle stanze per fasce di prezzo, utile per comprendere il posizionamento sul mercato."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiDarkBarChart 
                    data={data?.priceDistribution || []} 
                    dataKey="value" 
                    nameKey="range"
                    unit=""
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 3. Altri Ricavi Mensili */}
            <KpiCard 
              title="Altri Ricavi Mensili" 
              value={otherValue}
              unit="€"
              icon={<Wallet size={20} />}
              color="#8b5cf6"
              description="Ricavi accessori generati da servizi aggiuntivi, penali applicate o altre voci non legate direttamente al canone di affitto."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiGroupedBarChart 
                    data={data?.otherRevenue || []} 
                    dataKeys={['Servizi', 'Penali', 'Extra', 'Altro']} 
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 4. Ricavo Medio Stanza */}
            <KpiCard 
              title="Ricavo Medio Stanza" 
              value={avgRoomValue}
              unit="€"
              icon={<TrendingUp size={20} />}
              color="#10b981"
              description="Il ricavo medio generato da una singola stanza affittata, calcolato come Ricavi Strutturali / Stanze Occupate."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiRangeLineChart 
                    data={data?.avgRoomRevenue || []} 
                    dataKey="avg" 
                    minKey="min"
                    maxKey="max"
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 5. Note Credito */}
            <KpiCard 
              title="Note Credito" 
              value={creditValue}
              unit="€"
              icon={<CreditCard size={20} />}
              color="#ef4444"
              description="Valore totale e numero delle note di credito emesse, che riducono il fatturato effettivo."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiNegativeBarChart 
                    data={data?.creditNotes || []} 
                    dataKey="value" 
                    countKey="count"
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
                    onModifyFilters={onModifyFilters}
                  />
                </div>
              }
            />

            {/* 6. Tipologie Ricavo (Funnel) */}
            <KpiCard 
              title="Tipologie Ricavo nel Periodo" 
              value={funnelValue}
              unit="€"
              icon={<Layers size={20} />}
              color="#0ea5e9"
              description="Rappresentazione a cascata (funnel) che mostra come il fatturato lordo si riduce fino all'utile netto."
              details={
                <div className="flex-1 flex flex-col">
                  <KpiFunnelChart 
                    data={data?.revenueFunnel || []} 
                    dataKey="value" 
                    nameKey="step"
                    isLoading={isLoading}
                    hasError={hasError}
                    onRetry={handleRetry}
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
