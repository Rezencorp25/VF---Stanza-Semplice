import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { COLORS } from '../mockDataArea3';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiTrendBarChartProps {
  data: any[];
  dataKey: string;
  trendKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiTrendBarChart: React.FC<KpiTrendBarChartProps> = ({ 
  data, 
  dataKey, 
  trendKey, 
  unit = '',
  isLoading = false,
  hasError = false,
  onRetry,
  onModifyFilters
}) => {
  const isEmpty = !isLoading && !hasError && (!data || data.length === 0);
  const total = data ? data.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0) : 0;
  const delta = 18; // Mock delta

  return (
    <div className="relative">
      {/* Summary Header */}
      <div className="absolute top-0 left-0 z-10 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-orange-600">{total}</span>
        <span className="text-sm font-medium text-orange-500">+{delta}% vs LY</span>
      </div>

      <ChartStateContainer 
        isLoading={isLoading} 
        hasError={hasError} 
        isEmpty={isEmpty}
        onRetry={onRetry}
        onModifyFilters={onModifyFilters}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={data} 
            margin={{ top: 40, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              unit={unit}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number, name: string) => [
                <span className="font-bold">{value}{unit}</span>, 
                <span className="text-slate-500 capitalize">{name === dataKey ? 'Lead' : 'Trend'}</span>
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
            
            <Bar 
              dataKey={dataKey} 
              fill={COLORS.expansion.bar} 
              radius={[4, 4, 0, 0]}
              name="Lead Qualificati"
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey={trendKey} 
              stroke={COLORS.expansion.trend} 
              strokeWidth={2} 
              dot={false}
              name="Trend"
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartStateContainer>
    </div>
  );
};
