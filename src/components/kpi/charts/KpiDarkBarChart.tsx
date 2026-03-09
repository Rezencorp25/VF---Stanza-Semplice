import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LabelList 
} from 'recharts';
import { COLORS } from '../mockDataArea2';
import { ChartStateContainer } from './ChartStateContainer';

interface KpiDarkBarChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiDarkBarChart: React.FC<KpiDarkBarChartProps> = ({ 
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
    <div className="bg-[#1A1A1A] rounded-xl p-4 overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PREZZI DISTRIBUZIONE</h4>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-white">€450</span>
            <span className="text-xs text-slate-400">AVG/ROOM</span>
          </div>
        </div>
        <span className="bg-green-900/30 text-green-400 text-[10px] font-bold px-2 py-1 rounded border border-green-800/50">
          BUDGET OK
        </span>
      </div>

      <ChartStateContainer 
        isLoading={isLoading} 
        hasError={hasError} 
        isEmpty={isEmpty}
        onRetry={onRetry}
        onModifyFilters={onModifyFilters}
        height={220}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey={nameKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 10 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 10 }} 
              unit={unit}
            />
            <Tooltip 
              cursor={{ fill: '#333' }}
              contentStyle={{ backgroundColor: '#262626', borderRadius: '8px', border: '1px solid #404040', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#999' }}
              formatter={(value: number) => [
                <span className="font-bold text-orange-500">{value}{unit}</span>, 
                'Valore'
              ]}
            />
            <Bar 
              dataKey={dataKey} 
              fill={COLORS.orange} 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            >
              <LabelList dataKey={dataKey} position="top" fill="#fff" fontSize={10} formatter={(val: number) => `${val}`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartStateContainer>
    </div>
  );
};
