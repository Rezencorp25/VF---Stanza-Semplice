import React from 'react';
import { Activity, Filter, TrendingUp } from 'lucide-react';
import { ExecutiveOverviewCard } from './ExecutiveOverviewCard';
import { AreaCard } from './AreaCard';
import { MiniChart } from './MiniChart';
import { 
  GLOBAL_TREND_DATA, 
  WEEKLY_FORECAST_DATA, 
  PRICE_DISTRIBUTION_DATA, 
  MARGIN_DISTRIBUTION_DATA, 
  EXPANSION_DATA 
} from './mockData';

interface PerformanceStorytellingProps {
  onAreaClick: (areaId: string) => void;
}

export const PerformanceStorytelling: React.FC<PerformanceStorytellingProps> = ({
  onAreaClick
}) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Storytelling</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <Activity size={16} />
            <span className="text-sm font-medium">Analisi strategica del portafoglio</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-sm font-bold text-slate-700">Dati aggiornati al: 08/03/2026</span>
          </div>
          <div className="bg-slate-100 p-2 rounded-xl">
            <Filter size={20} className="text-slate-500" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <ExecutiveOverviewCard 
          growthIndex={12.4} 
          monthlyRevenue={42850} 
          globalTrend={{ value: 55, change: 2.1, data: GLOBAL_TREND_DATA }} 
        />
        
        <div className="space-y-6">
          {/* Area 1: Occupancy */}
          <AreaCard
            layoutId="area-card-occupancy"
            areaNumber={1}
            title="Area Occupazione-Commerciale"
            score={94}
            onClick={() => onAreaClick('occupancy')}
            metrics={[
              { label: 'Occupancy', value: '94.2%', subValue: '+1.2% vs target', color: 'text-slate-900' },
              { label: 'Stanze Attive', value: 142 },
              { label: 'MQ Disponibili', value: '3.450', subValue: 'm²' },
              { label: 'Giorni Riaffitto', value: 12.4, subValue: 'gg', color: 'text-orange-500' }
            ]}
          >
            <div className="h-32 bg-slate-50 rounded-xl mb-6 relative overflow-hidden mt-6">
              <div className="absolute top-3 left-3 z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Weekly Forecast</p>
              </div>
              <div className="absolute bottom-3 right-3 z-10">
                <p className="text-xs font-medium text-slate-400 italic">"Stability expected next month"</p>
              </div>
              <MiniChart 
                type="area" 
                data={GLOBAL_TREND_DATA} 
                dataKey="value" 
                color="#22c55e" 
                height={128} 
              />
              <div className="absolute bottom-3 left-3 w-24 h-12 flex items-end gap-1">
                {WEEKLY_FORECAST_DATA.map((d, i) => (
                  <div 
                    key={i} 
                    className="bg-green-500 w-full rounded-t-sm opacity-80" 
                    style={{ height: `${(d.value - 80) * 5}%` }} 
                  />
                ))}
              </div>
            </div>
          </AreaCard>

          {/* Area 2: Financial */}
          <AreaCard
            layoutId="area-card-financial"
            areaNumber={2}
            title="Area Economico-Finanziaria"
            score={88}
            onClick={() => onAreaClick('financial')}
            metrics={[
              { label: 'Ricavi Strutturali', value: '€38.200', subValue: '+12% vs LY' },
              { label: 'Altri Ricavi', value: '€4.650' },
              { label: 'Note Credito', value: '-€1.240', color: 'text-red-600' },
              { label: 'Avg Room Price', value: '€450' }
            ]}
          >
            <div className="mt-6 bg-slate-900 p-4 rounded-2xl text-white relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prezzi Distribuzione</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold">€450</span>
                    <span className="text-xs text-slate-400">AVG/ROOM</span>
                  </div>
                </div>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-700">
                  BUDGET OK
                </span>
              </div>
              
              <div className="h-16 w-full flex items-end gap-1 relative z-10">
                {PRICE_DISTRIBUTION_DATA.map((d, i) => (
                  <div 
                    key={i} 
                    className="bg-orange-500 hover:bg-orange-400 transition-colors rounded-t-sm flex-1"
                    style={{ height: `${d.value}%`, opacity: 0.8 + (i * 0.05) }}
                  />
                ))}
              </div>
            </div>
          </AreaCard>

          {/* Area 3: Operational */}
          <AreaCard
            layoutId="area-card-operational"
            areaNumber={3}
            title="Area Operativa & Crescita"
            score={92}
            onClick={() => onAreaClick('operational')}
            metrics={[
              { label: 'Gross Margin', value: '€22.250', subValue: '(52%)' },
              { label: 'Costi Operativi', value: '€12.400' },
              { label: 'Affitti Passivi', value: '€8.200' },
              { label: 'Avg Room Cost', value: '€156', color: 'text-orange-500' }
            ]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-900 p-4 rounded-xl">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Distribuzione Margin</span>
                 </div>
                 <div className="flex h-8 w-full gap-1">
                    {MARGIN_DISTRIBUTION_DATA.map((d, i) => (
                       <div 
                         key={i} 
                         style={{ width: `${d.value}%`, backgroundColor: d.color }} 
                         className="h-full first:rounded-l-md last:rounded-r-md opacity-80 hover:opacity-100 transition-opacity"
                       />
                    ))}
                 </div>
              </div>

              <div className="bg-orange-500 rounded-xl p-4 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <TrendingUp size={60} />
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-orange-100 uppercase tracking-wider mb-1">Expansion</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">287</span>
                    <span className="text-sm font-bold text-orange-200">+18%</span>
                  </div>
                </div>

                <div className="flex items-end gap-1 h-8 mt-2">
                   {EXPANSION_DATA.map((d, i) => (
                      <div 
                        key={i} 
                        className="bg-white/30 hover:bg-white/50 transition-colors rounded-t-sm flex-1"
                        style={{ height: `${d.value}%` }}
                      />
                   ))}
                </div>
              </div>
            </div>
          </AreaCard>
        </div>
      </div>
    </div>
  );
};
