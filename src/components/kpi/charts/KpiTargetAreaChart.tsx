import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { COLORS } from '../mockDataArea3';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiTargetAreaChartProps {
  data: any[];
  dataKey: string;
  targetKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiTargetAreaChart: React.FC<KpiTargetAreaChartProps> = ({ 
  data, 
  dataKey, 
  targetKey, 
  unit = '%',
  isLoading = false,
  hasError = false,
  onRetry,
  onModifyFilters
}) => {
  const isEmpty = !isLoading && !hasError && (!data || data.length === 0);
  const targetValue = data && data.length > 0 ? data[0][targetKey] : 40;

  // Split gradient logic
  const gradientOffset = () => {
    if (!data || data.length === 0) return 0;
    const dataMax = Math.max(...data.map((i) => i[dataKey]));
    const dataMin = Math.min(...data.map((i) => i[dataKey]));
  
    if (dataMax <= targetValue) return 0;
    if (dataMin >= targetValue) return 1;
  
    return (targetValue - dataMin) / (dataMax - dataMin);
  };
  
  const off = gradientOffset();

  return (
    <ChartStateContainer 
      isLoading={isLoading} 
      hasError={hasError} 
      isEmpty={isEmpty}
      onRetry={onRetry}
      onModifyFilters={onModifyFilters}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor={COLORS.grossMargin.above} stopOpacity={1} />
              <stop offset={off} stopColor={COLORS.grossMargin.below} stopOpacity={1} />
            </linearGradient>
          </defs>
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
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => [
              <span className={`font-bold ${value >= targetValue ? 'text-green-600' : 'text-red-600'}`}>
                {value}{unit}
              </span>, 
              <span className="text-slate-500 capitalize">{name === dataKey ? 'Margine' : name}</span>
            ]}
          />
          
          <ReferenceLine 
            y={targetValue} 
            stroke={COLORS.grossMargin.target} 
            strokeDasharray="3 3" 
            label={{ value: `Target ${targetValue}${unit}`, position: 'right', fill: COLORS.grossMargin.target, fontSize: 10 }} 
          />
          
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={COLORS.grossMargin.line} 
            strokeWidth={3} 
            fill="url(#splitColor)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
