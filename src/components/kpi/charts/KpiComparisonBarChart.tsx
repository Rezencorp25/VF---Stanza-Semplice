import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList 
} from 'recharts';
import { COLORS } from '../mockDataArea3';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiComparisonBarChartProps {
  data: any[];
  dataKeys: string[];
  nameKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiComparisonBarChart: React.FC<KpiComparisonBarChartProps> = ({ 
  data, 
  dataKeys, 
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
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={nameKey} 
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
              <span className="text-slate-500 capitalize">{name}</span>
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
          
          <Bar 
            dataKey={dataKeys[0]} 
            fill={COLORS.rent.passive} 
            radius={[4, 4, 0, 0]}
            name="Affitto Passivo"
            animationDuration={1500}
          />
          <Bar 
            dataKey={dataKeys[1]} 
            fill={COLORS.rent.revenue} 
            radius={[4, 4, 0, 0]}
            name="Ricavo Generato"
            animationDuration={1500}
          >
            <LabelList 
              dataKey="delta" 
              position="top" 
              content={(props: any) => {
                const { x, y, width, index } = props;
                const delta = data[index][dataKeys[1]] - data[index][dataKeys[0]];
                return (
                  <text 
                    x={x + width / 2} 
                    y={y - 10} 
                    fill={delta >= 0 ? COLORS.rent.revenue : COLORS.rent.passive} 
                    textAnchor="middle" 
                    fontSize={10} 
                    fontWeight="bold"
                  >
                    {delta > 0 ? '+' : ''}{delta}{unit}
                  </text>
                );
              }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartStateContainer>
  );
};
