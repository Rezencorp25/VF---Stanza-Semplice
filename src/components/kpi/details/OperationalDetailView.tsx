import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  Wallet,
  Home,
  ScatterChart as LucideScatterChart,
  Rocket
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { KpiCard } from '../KpiCard';
import { FilterState } from '../../../types/kpi';
import { getArea3Data, Area3Data } from '../mockDataArea3';
import { KpiTargetAreaChart } from '../charts/KpiTargetAreaChart';
import { KpiStackedBarChart } from '../charts/KpiStackedBarChart';
import { KpiComparisonBarChart } from '../charts/KpiComparisonBarChart';
import { KpiScatterPlot } from '../charts/KpiScatterPlot';
import { KpiTrendBarChart } from '../charts/KpiTrendBarChart';
import { ChartSkeleton } from '../charts/ChartSkeleton';

const COLORS = {
  costs: {
    fixed: '#ef4444',
    variable: '#f97316'
  }
};

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

  // Calculate summary values
  const latestMargin = data?.grossMargin[data.grossMargin.length - 1];
  const marginValue = latestMargin ? latestMargin.value.toLocaleString() : 0;

  const latestCosts = data?.operationalCosts[data.operationalCosts.length - 1];
  const costsValue = latestCosts ? (latestCosts.fixed + latestCosts.variable).toLocaleString() : 0;

  const latestRent = data?.rentComparison[data.rentComparison.length - 1];
  const rentValue = latestRent ? (latestRent.revenue - latestRent.passive).toLocaleString() : 0;

  const marginDistValue = data?.marginDistribution.length 
    ? (data.marginDistribution.reduce((acc, curr) => acc + curr.margin, 0) / data.marginDistribution.length).toFixed(0)
    : 0;

  const latestExpansion = data?.expansionPerformance[data.expansionPerformance.length - 1];
  const expansionValue = latestExpansion ? latestExpansion.leads.toLocaleString() : 0;

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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* 1. Gross Margin % */}
            <KpiCard 
              title="Gross Margin %" 
              value={marginValue}
              unit="%"
              icon={<TrendingUp size={20} />}
              color="#10b981"
              description="Il margine operativo lordo percentuale, calcolato come (Ricavi Totali - Costi Operativi) / Ricavi Totali * 100. Confrontato con il target aziendale del 40%."
              details={
                <div className="flex-1 flex flex-col">
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
                </div>
              }
            />

            {/* 2. Costi Operativi */}
            <KpiCard 
              title="Costi Operativi" 
              value={costsValue}
              unit="€"
              icon={<Wallet size={20} />}
              color="#ef4444"
              description="La somma di tutti i costi necessari per la gestione degli immobili, suddivisi tra costi fissi (es. affitti passivi, assicurazioni) e variabili (es. utenze, manutenzioni)."
              details={
                <div className="flex-1 flex flex-col">
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
                </div>
              }
            />

            {/* 3. Affitti Passivi vs Ricavo Stanza */}
            <KpiCard 
              title="Affitti Passivi vs Ricavo Stanza" 
              value={rentValue}
              unit="€"
              icon={<Home size={20} />}
              color="#3b82f6"
              description="Confronto diretto tra il costo dell'affitto passivo pagato al proprietario e il ricavo generato dall'affitto della singola stanza agli inquilini."
              details={
                <div className="flex-1 flex flex-col">
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
                </div>
              }
            />

            {/* 4. Distribuzione Margine per Stanza */}
            <KpiCard 
              title="Distribuzione Margine per Stanza" 
              value={marginDistValue}
              unit="€"
              icon={<LucideScatterChart size={20} />}
              color="#8b5cf6"
              description="Analisi a dispersione (scatter plot) che mostra la marginalità assoluta generata da ogni singola stanza, utile per identificare le unità più o meno profittevoli."
              details={
                <div className="flex-1 flex flex-col">
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
                </div>
              }
            />

            {/* 5. Expansion Performance */}
            <KpiCard 
              title="Expansion Performance" 
              value={expansionValue}
              unit=" leads"
              icon={<Rocket size={20} />}
              color="#f97316"
              description="Misura l'efficacia delle attività di acquisizione di nuovi immobili, tracciando il numero di lead qualificati generati nel tempo e il relativo trend di crescita."
              details={
                <div className="flex-1 flex flex-col">
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
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
