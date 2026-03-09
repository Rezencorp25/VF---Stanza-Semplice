import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { COLORS } from '../mockDataArea2';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiRangeLineChartProps {
  data: any[];
  dataKey: string;
  minKey: string;
  maxKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiRangeLineChart: React.FC<KpiRangeLineChartProps> = ({ 
  data, 
  dataKey, 
  minKey, 
  maxKey, 
  unit = '€',
  isLoading = false,
  hasError = false,
  onRetry,
  onModifyFilters
}) => {
  const isEmpty = !isLoading && !hasError && (!data || data.length === 0);

  return (
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
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
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
            formatter={(value: number, name: string) => {
              if (name === 'Range') return [null, null];
              return [
                <span className="font-bold">{value}{unit}</span>, 
                <span className="text-slate-500 capitalize">{name === dataKey ? 'Media' : name}</span>
              ];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey={maxKey} 
            stroke="none" 
            fill={COLORS.structural[0]} 
            fillOpacity={0.1} 
            name="Range Max"
          />
          <Area 
            type="monotone" 
            dataKey={minKey} 
            stroke="none" 
            fill="#fff" 
            fillOpacity={1} 
            name="Range Min" // Trick to create a band: Max area minus Min area (white)
          />
          
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={COLORS.structural[0]} 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Media"
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
