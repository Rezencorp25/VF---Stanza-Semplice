import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MiniChart } from './MiniChart';

interface ExecutiveOverviewCardProps {
  growthIndex: number;
  monthlyRevenue: number;
  globalTrend: {
    value: number;
    change: number;
    data: any[];
  };
}

export const ExecutiveOverviewCard: React.FC<ExecutiveOverviewCardProps> = ({
  growthIndex,
  monthlyRevenue,
  globalTrend
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        <div className="space-y-6 max-w-xl">
          <div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Executive Overview
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Overall Performance
            </h1>
            <p className="text-slate-500 mt-2 text-lg leading-relaxed">
              Aggregated metrics across all macro-areas reflecting the health of the entire portfolio.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Growth Index</p>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-black ${growthIndex >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                  {growthIndex > 0 ? '+' : ''}{growthIndex}%
                </span>
                {growthIndex >= 0 ? (
                  <TrendingUp className="text-green-500" size={24} />
                ) : (
                  <TrendingDown className="text-red-500" size={24} />
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</p>
              <span className="text-3xl font-black text-slate-900">
                €{monthlyRevenue.toLocaleString('it-IT')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full lg:max-w-md bg-slate-50 rounded-2xl p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Trend</p>
              <p className={`text-sm font-semibold ${globalTrend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {globalTrend.change >= 0 ? 'Positivo' : 'Negativo'} ({globalTrend.change > 0 ? '+' : ''}{globalTrend.change}% WoW)
              </p>
            </div>
            <div className="bg-orange-500 text-white text-2xl font-black px-3 py-1 rounded-lg shadow-lg shadow-orange-500/20">
              A+
            </div>
          </div>
          <div className="h-32 w-full">
            <MiniChart 
              type="area" 
              data={globalTrend.data} 
              dataKey="value" 
              color="#f97316" 
              height={128} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
