import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { COLORS } from '../mockDataArea2';
import { ChartStateContainer } from './ChartStateContainer';
import { AlertTriangle } from 'lucide-react';

interface KpiNegativeBarChartProps {
  data: any[];
  dataKey: string;
  countKey: string;
  unit?: string;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onModifyFilters?: () => void;
}

export const KpiNegativeBarChart: React.FC<KpiNegativeBarChartProps> = ({ 
  data, 
  dataKey, 
  countKey, 
  unit = '€',
  isLoading = false,
  hasError = false,
  onRetry,
  onModifyFilters
}) => {
  const isEmpty = !isLoading && !hasError && (!data || data.length === 0);
  const totalIssues = data ? data.reduce((acc, curr) => acc + (curr[countKey] || 0), 0) : 0;
  const isCritical = totalIssues > 5;

  return (
    <div className="relative">
      {/* Summary Chip */}
      <div className="absolute top-0 right-0 z-10">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isCritical ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          {isCritical && <AlertTriangle size={14} />}
          <span className="text-xs font-bold">{totalIssues} Emissioni</span>
          {isCritical && <span className="text-[10px] font-bold uppercase tracking-wider ml-1">Critical Attention</span>}
        </div>
      </div>

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
              formatter={(value: number, name: string, props: any) => [
                <span className="font-bold text-red-600">{value}{unit}</span>, 
                <span className="text-slate-500 capitalize">Valore ({props.payload[countKey]} emissioni)</span>
              ]}
            />
            
            <Bar 
              dataKey={dataKey} 
              radius={[0, 0, 4, 4]}
              animationDuration={1500}
            >
              {data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartStateContainer>
    </div>
  );
};
