import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TimeRange, RevenueDataPoint } from '../hooks/useRoleData';

interface RevenueChartProps {
  data: Record<TimeRange, RevenueDataPoint[]>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('ytd');

  const filters: { id: TimeRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: '7days', label: 'Last 7 days' },
    { id: '30days', label: 'Last 30 days' },
    { id: '90days', label: 'Last 90 days' },
    { id: 'ytd', label: 'YTD' },
    { id: '12months', label: 'Last 12 months' }
  ];

  const currentData = data[timeRange];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
    return `€${value}`;
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-slate-800">Andamento Ricavi</h3>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setTimeRange(filter.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                timeRange === filter.id 
                  ? 'bg-orange-100 text-orange-600 border border-orange-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}} 
              tickFormatter={formatYAxis} 
              width={60}
            />
            <Tooltip 
              formatter={(value: number) => [`€${value.toLocaleString('it-IT')}`, 'Ricavi']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#f97316" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
