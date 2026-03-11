import React from 'react';
import { AlertTriangle, Wrench, Home, CreditCard, ExternalLink, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';
import { AlertData } from '../hooks/useRoleData';

interface AlertOperativiProps {
  alerts: AlertData[];
  onNavigate: (view: ViewState) => void;
}

export const AlertOperativi: React.FC<AlertOperativiProps> = ({ alerts, onNavigate }) => {
  
  // TODO: soglie dinamiche post-migrazione gestionale
  // Affitti: rosso >= 6, giallo 2-5, verde 0-1
  // Ticket: rosso >= 10, giallo 4-9, verde 0-3
  // Occupazione: rosso <= -4%, giallo -1/-3%, verde >= 0%
  const getAlertStatus = (category: string, value: number) => {
    if (category === 'pagamenti') {
      if (value >= 6) return 'red';
      if (value >= 2) return 'yellow';
      return 'green';
    }
    if (category === 'manutenzione') {
      if (value >= 10) return 'red';
      if (value >= 4) return 'yellow';
      return 'green';
    }
    if (category === 'occupazione') {
      if (value <= -4) return 'red';
      if (value <= -1) return 'yellow';
      return 'green';
    }
    return 'green';
  };

  const getStatusStyles = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red':
        return 'bg-red-50 border-red-100 text-red-800 hover:border-red-200';
      case 'yellow':
        return 'bg-amber-50 border-amber-100 text-amber-800 hover:border-amber-200';
      case 'green':
        return 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:border-emerald-200';
    }
  };

  const getIconStyles = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red':
        return 'text-red-500 bg-red-100/50';
      case 'yellow':
        return 'text-amber-500 bg-amber-100/50';
      case 'green':
        return 'text-emerald-500 bg-emerald-100/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pagamenti': return <CreditCard size={18} />;
      case 'manutenzione': return <Wrench size={18} />;
      case 'occupazione': return <Home size={18} />;
      default: return <AlertTriangle size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg">
            <AlertTriangle size={18} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Alert Operativi</h2>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const status = getAlertStatus(alert.category, alert.value);
          const styles = getStatusStyles(status);
          const iconStyles = getIconStyles(status);
          
          return (
            <div 
              key={alert.id} 
              onClick={() => onNavigate(alert.link as ViewState)}
              className={`p-4 rounded-xl border ${styles} flex flex-col transition-all cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${iconStyles}`}>
                    {getCategoryIcon(alert.category)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {alert.city}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="opacity-50" />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-sm mb-0.5">{alert.title}</h3>
                <p className="text-xs opacity-80">{alert.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
