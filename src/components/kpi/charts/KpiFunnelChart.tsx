import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  LabelList 
} from 'recharts';
import { COLORS } from '../mockDataArea2';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiFunnelChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiFunnelChart: React.FC<KpiFunnelChartProps> = ({ 
  data, 
  dataKey, 
  nameKey, 
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
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 0 }}
          barCategoryGap="10%"
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey={nameKey} 
            type="category" 
            width={100} 
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string, props: any) => [
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">{value.toLocaleString()}{unit}</span>
                <span className="text-xs text-slate-500">{props.payload.percentage}% del totale</span>
              </div>, 
              ''
            ]}
          />
          <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} animationDuration={1500}>
            {data && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || COLORS.funnel[index % COLORS.funnel.length]} />
            ))}
            <LabelList 
              dataKey="percentage" 
              position="right" 
              formatter={(val: number) => `${val}%`} 
              style={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
