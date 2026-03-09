import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { COLORS } from '../mockDataArea1';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiBarChartProps {
  data: any[];
  dataKeys: string[];
  unit?: string;
  layout?: 'horizontal' | 'vertical';
  threshold?: number;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiBarChart: React.FC<KpiBarChartProps> = ({ 
  data, 
  dataKeys, 
  unit = '',
  layout = 'horizontal',
  threshold,
  isLoading = false,
  hasError = false,
  onRetry,
  onModifyFilters
}) => {
  const colors = [COLORS.blue, COLORS.green, COLORS.orange, COLORS.purple];
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
          layout={layout}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          {layout === 'horizontal' ? (
            <>
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
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                unit={unit}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                width={80}
              />
            </>
          )}

          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => [
              <span className="font-bold">{value}{unit}</span>, 
              <span className="text-slate-500 capitalize">{name}</span>
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
          
          {dataKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={colors[index % colors.length]} 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
