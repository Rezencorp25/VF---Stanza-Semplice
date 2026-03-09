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
    if (name.includes('Ricavi')) return <DollarSign size={24} className="text-emerald-500" />;
    if (name.includes('Occupancy')) return <Home size={24} className="text-blue-500" />;
    if (name.includes('Stanze')) return <Users size={24} className="text-purple-500" />;
    return <Home size={24} className="text-slate-500" />;
  };

  const getIconBg = (name: string) => {
    if (name.includes('Ricavi')) return 'bg-emerald-50';
    if (name.includes('Occupancy')) return 'bg-blue-50';
    if (name.includes('Stanze')) return 'bg-purple-50';
    return 'bg-slate-50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${getIconBg(kpi.name)}`}>
              {getKpiIcon(kpi.name)}
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              kpi.trend === 'up' ? 'bg-green-50 text-green-600' : 
              kpi.trend === 'down' ? 'bg-red-50 text-red-600' : 
              'bg-slate-50 text-slate-600'
            }`}>
              {kpi.change}
              {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : 
               kpi.trend === 'down' ? <ArrowDownRight size={14} /> : null}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{kpi.name}</h3>
            <span className="text-4xl font-extrabold text-slate-800">{kpi.value}</span>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={() => onNavigate(kpi.link as ViewState, kpi.linkParams)}
              className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wide"
            >
              <ExternalLink size={14} />
              Vedi Dettagli
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
