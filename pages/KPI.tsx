import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PerformanceStorytelling } from '../src/components/kpi/PerformanceStorytelling';
import { KpiDetailScreen } from '../src/components/kpi/KpiDetailScreen';
import { OccupancyDetailView } from '../src/components/kpi/details/OccupancyDetailView';
import { FinancialDetailView } from '../src/components/kpi/details/FinancialDetailView';
import { OperationalDetailView } from '../src/components/kpi/details/OperationalDetailView';

const KPI: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const renderDetailContent = () => {
    switch(selectedArea) {
      case 'occupancy':
        return <OccupancyDetailView />;
      case 'financial':
        return <FinancialDetailView />;
      case 'operational':
        return <OperationalDetailView />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <AnimatePresence mode="wait">
        {selectedArea ? (
          <KpiDetailScreen 
            key="detail"
            areaId={selectedArea} 
            onBack={() => setSelectedArea(null)}
          >
            {renderDetailContent()}
          </KpiDetailScreen>
        ) : (
          <motion.div 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <PerformanceStorytelling onAreaClick={setSelectedArea} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KPI;
