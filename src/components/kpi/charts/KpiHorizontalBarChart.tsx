import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import { COLORS } from '../mockDataArea1';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiHorizontalBarChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  threshold: number;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiHorizontalBarChart: React.FC<KpiHorizontalBarChartProps> = ({ 
  data, 
  dataKey, 
  nameKey, 
  threshold,
  unit = '',
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
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey={nameKey} 
            type="category" 
            width={80} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [
              <span className={`font-bold ${value > threshold ? 'text-red-600' : 'text-green-600'}`}>
                {value} {unit}
              </span>, 
              'Giorni'
            ]}
          />
          <ReferenceLine x={threshold} stroke={COLORS.red} strokeDasharray="3 3" label={{ value: `Soglia ${threshold}gg`, position: 'top', fill: COLORS.red, fontSize: 10 }} />
          <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500}>
            {data && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry[dataKey] > threshold ? COLORS.red : COLORS.green} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
