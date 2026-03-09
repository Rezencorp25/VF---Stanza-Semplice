import React from 'react';
import { AlertTriangle, Wrench, Home, CreditCard, ExternalLink } from 'lucide-react';
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
        return 'bg-red-50 border-red-200 text-red-800';
      case 'yellow':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'green':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    }
  };

  const getIconStyles = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red':
        return 'text-red-500 bg-red-100';
      case 'yellow':
        return 'text-amber-500 bg-amber-100';
      case 'green':
        return 'text-emerald-500 bg-emerald-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pagamenti': return <CreditCard size={20} />;
      case 'manutenzione': return <Wrench size={20} />;
      case 'occupazione': return <Home size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border-l-4 border-l-orange-500 border-y border-r border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
          <AlertTriangle size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Alert Operativi</h2>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const status = getAlertStatus(alert.category, alert.value);
          const styles = getStatusStyles(status);
          const iconStyles = getIconStyles(status);
          
          return (
            <div key={alert.id} className={`p-5 rounded-xl border ${styles} flex flex-col h-full transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 bg-white/60 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {alert.city}
                </span>
                <div className={`p-2 rounded-lg ${iconStyles}`}>
                  {getCategoryIcon(alert.category)}
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                <h3 className="font-bold text-base mb-1">{alert.title}</h3>
                <p className="text-sm opacity-80">{alert.description}</p>
              </div>
              
              <div className="pt-4 border-t border-black/5 mt-auto">
                <button 
                  onClick={() => onNavigate(alert.link as ViewState)}
                  className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wide"
                >
                  <ExternalLink size={14} />
                  Vedi Dettagli
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
