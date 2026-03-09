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
import { KpiSection } from '../KpiSection';
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* 1. Ricavi Strutturali */}
            <KpiSection 
              title="Ricavi Strutturali" 
              description="Totale ricavi mensili suddivisi per raggruppamento."
              icon={<BarChart3 size={20} />}
            >
              <KpiStackedBarChart 
                data={data?.structuralRevenue || []} 
                dataKeys={activeKeys} 
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>

            {/* 2. Distribuzione Prezzi */}
            <KpiSection 
              title="Distribuzione Prezzi" 
              description="Analisi delle fasce di prezzo e budget."
              icon={<DollarSign size={20} />}
            >
              <KpiDarkBarChart 
                data={data?.priceDistribution || []} 
                dataKey="value" 
                nameKey="range"
                unit=""
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>

            {/* 3. Altri Ricavi Mensili */}
            <KpiSection 
              title="Altri Ricavi Mensili" 
              description="Breakdown per categoria (Servizi, Penali, Extra)."
              icon={<Wallet size={20} />}
            >
              <KpiGroupedBarChart 
                data={data?.otherRevenue || []} 
                dataKeys={['Servizi', 'Penali', 'Extra', 'Altro']} 
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>

            {/* 4. Ricavo Medio Stanza */}
            <KpiSection 
              title="Ricavo Medio Stanza" 
              description="Trend del ricavo medio con range min/max."
              icon={<TrendingUp size={20} />}
            >
              <KpiRangeLineChart 
                data={data?.avgRoomRevenue || []} 
                dataKey="avg" 
                minKey="min"
                maxKey="max"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>

            {/* 5. Note Credito */}
            <KpiSection 
              title="Note Credito" 
              description="Monitoraggio emissioni note di credito."
              icon={<CreditCard size={20} />}
            >
              <KpiNegativeBarChart 
                data={data?.creditNotes || []} 
                dataKey="value" 
                countKey="count"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>

            {/* 6. Tipologie Ricavo (Funnel) */}
            <KpiSection 
              title="Tipologie Ricavo nel Periodo" 
              description="Analisi a cascata dal fatturato all'utile."
              icon={<Layers size={20} />}
            >
              <KpiFunnelChart 
                data={data?.revenueFunnel || []} 
                dataKey="value" 
                nameKey="step"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
              />
            </KpiSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
