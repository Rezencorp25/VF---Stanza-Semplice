import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  Wallet,
  Home,
  ScatterChart as LucideScatterChart,
  Rocket
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { KpiSection } from '../KpiSection';
import { FilterState } from '../../../types/kpi';
import { getArea3Data, Area3Data } from '../mockDataArea3';
import { KpiTargetAreaChart } from '../charts/KpiTargetAreaChart';
import { KpiStackedBarChart } from '../charts/KpiStackedBarChart';
import { KpiComparisonBarChart } from '../charts/KpiComparisonBarChart';
import { KpiScatterPlot } from '../charts/KpiScatterPlot';
import { KpiTrendBarChart } from '../charts/KpiTrendBarChart';
import { ChartSkeleton } from '../charts/ChartSkeleton';

interface OperationalDetailViewProps {
  filterState?: FilterState;
  onModifyFilters?: () => void;
}

export const OperationalDetailView: React.FC<OperationalDetailViewProps> = ({ filterState, onModifyFilters }) => {
  const [data, setData] = useState<Area3Data | null>(null);
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
        
        const newData = filterState ? getArea3Data(filterState) : null;
        setData(newData);
        setIsLoading(false);
      } catch (err) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [filterState]);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      const newData = filterState ? getArea3Data(filterState) : null;
      setData(newData);
      setIsLoading(false);
    }, 600);
  };

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
            {[...Array(5)].map((_, i) => (
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
            {/* 1. Gross Margin % */}
            <KpiSection 
              title="Gross Margin %" 
              description="Margine operativo lordo vs Target (40%)."
              icon={<TrendingUp size={20} />}
            >
              <KpiTargetAreaChart 
                data={data?.grossMargin || []} 
                dataKey="value" 
                targetKey="target"
                unit="%"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 2. Costi Operativi */}
            <KpiSection 
              title="Costi Operativi" 
              description="Breakdown costi fissi vs variabili."
              icon={<Wallet size={20} />}
            >
              <KpiStackedBarChart 
                data={data?.operationalCosts || []} 
                dataKeys={['fixed', 'variable']} 
                unit="€"
                colors={[COLORS.costs.fixed, COLORS.costs.variable]}
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 3. Affitti Passivi vs Ricavo Stanza */}
            <KpiSection 
              title="Affitti Passivi vs Ricavo Stanza" 
              description="Confronto diretto per singola unità."
              icon={<Home size={20} />}
            >
              <KpiComparisonBarChart 
                data={data?.rentComparison || []} 
                dataKeys={['passive', 'revenue']} 
                nameKey="room"
                unit="€"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 4. Distribuzione Margine per Stanza */}
            <KpiSection 
              title="Distribuzione Margine per Stanza" 
              description="Analisi dispersione marginalità."
              icon={<LucideScatterChart size={20} />}
            >
              <KpiScatterPlot 
                data={data?.marginDistribution || []} 
                xKey="room" 
                yKey="margin"
                unit="€"
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>

            {/* 5. Expansion Performance */}
            <KpiSection 
              title="Expansion Performance" 
              description="Crescita lead qualificati e trend."
              icon={<Rocket size={20} />}
            >
              <KpiTrendBarChart 
                data={data?.expansionPerformance || []} 
                dataKey="leads" 
                trendKey="trend"
                unit=""
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
                onModifyFilters={onModifyFilters}
              />
            </KpiSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
