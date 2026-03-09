import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { COLORS } from '../mockDataArea1';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiLineChartProps {
  data: any[];
  dataKeys: string[];
  targetValue?: number;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiLineChart: React.FC<KpiLineChartProps> = ({ 
  data, 
  dataKeys, 
  targetValue,
  unit = '%',
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
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            domain={[0, 100]}
            unit={unit}
          />
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
          
          {targetValue && (
            <ReferenceLine 
              y={targetValue} 
              stroke={COLORS.target} 
              strokeDasharray="3 3" 
              label={{ 
                value: `Target ${targetValue}${unit}`, 
                position: 'right', 
                fill: COLORS.target, 
                fontSize: 10 
              }} 
            />
          )}

          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={colors[index % colors.length]} 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
