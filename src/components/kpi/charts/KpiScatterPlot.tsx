import React from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import { COLORS } from '../mockDataArea3';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiScatterPlotProps {
  data: any[];
  xKey: string;
  yKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiScatterPlot: React.FC<KpiScatterPlotProps> = ({ 
  data, 
  xKey, 
  yKey, 
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
        <ScatterChart 
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={xKey} 
            type="category" 
            name="Stanza" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            type="number" 
            dataKey={yKey} 
            name="Margine" 
            unit={unit} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [
              <span className={`font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value}{unit}
              </span>, 
              'Margine'
            ]}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Scatter name="Margine per Stanza" data={data} fill="#8884d8">
            {data && data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry[yKey] >= 0 ? COLORS.scatter.positive : COLORS.scatter.negative} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
