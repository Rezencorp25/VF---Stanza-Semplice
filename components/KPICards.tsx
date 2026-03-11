import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Home, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';
import { KpiData } from '../hooks/useRoleData';

interface KPICardsProps {
  kpis: KpiData[];
  onNavigate: (view: ViewState, params?: any) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onNavigate }) => {
  const getKpiIcon = (name: string) => {
    if (name.includes('Ricavi')) return <DollarSign size={20} className="text-emerald-500" />;
    if (name.includes('Occupancy')) return <Home size={20} className="text-blue-500" />;
    if (name.includes('Stanze')) return <Users size={20} className="text-purple-500" />;
    return <Home size={20} className="text-slate-500" />;
  };

  const getIconBg = (name: string) => {
    if (name.includes('Ricavi')) return 'bg-emerald-50';
    if (name.includes('Occupancy')) return 'bg-blue-50';
    if (name.includes('Stanze')) return 'bg-purple-50';
    return 'bg-slate-50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          onClick={() => onNavigate(kpi.link as ViewState, kpi.linkParams)}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${getIconBg(kpi.name)}`}>
                {getKpiIcon(kpi.name)}
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.name}</h3>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              kpi.trend === 'up' ? 'bg-green-50 text-green-600' : 
              kpi.trend === 'down' ? 'bg-red-50 text-red-600' : 
              'bg-slate-50 text-slate-600'
            }`}>
              {kpi.change}
              {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : 
               kpi.trend === 'down' ? <ArrowDownRight size={14} /> : null}
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpi.value}</span>
            <div className="text-slate-300 group-hover:text-orange-500 transition-colors pb-1">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
