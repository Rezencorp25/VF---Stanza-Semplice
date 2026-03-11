import React, { useState } from 'react';
import { UserRole, ViewState } from '../types';
import { MOCK_KPI_DATA } from '../constants';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Users, Wrench, Home, Calendar, ChevronRight, Newspaper, X } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { useRoleData } from '../hooks/useRoleData';
import { KPICards } from '../components/KPICards';
import { AlertOperativi } from '../components/AlertOperativi';
import { RevenueChart } from '../components/RevenueChart';
import { MarketNewsModal } from '../components/MarketNewsModal';

interface DashboardProps {
  currentRole: UserRole;
  onNavigate: (view: ViewState, params?: any) => void;
}

const dataOccupancy = [
  { name: 'Milano', occupied: 95, vacant: 5 },
  { name: 'Torino', occupied: 88, vacant: 12 },
  { name: 'Roma', occupied: 92, vacant: 8 },
  { name: 'Bologna', occupied: 100, vacant: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ currentRole, onNavigate }) => {
  const roleData = useRoleData(currentRole);
  const [isMarketNewsOpen, setIsMarketNewsOpen] = useState(false);
  
  const getSubtitle = () => {
    const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    switch(currentRole) {
      case UserRole.ADMIN:
        return 'Benvenuto nel pannello di controllo, ecco la panoramica odierna.';
      case UserRole.CITY_MANAGER:
        return `Panoramica delle tue città: ${roleData.cities.join(', ')}`;
      case UserRole.PROPERTY_MANAGER:
        return `I tuoi immobili al ${today}`;
      default:
        return 'Benvenuto nel pannello di controllo, ecco la panoramica odierna.';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <button 
              onClick={() => onNavigate('DASHBOARD')}
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-bold text-slate-800 cursor-default">Dashboard</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{getSubtitle()}</p>
        </div>
        
        {/* Date Picker and Market News */}
        <div className="flex gap-2 self-start sm:self-auto mt-2 sm:mt-0">
          <button 
            onClick={() => setIsMarketNewsOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Newspaper size={16} />
            Market News
          </button>
          <span className="px-4 py-2 bg-white text-slate-600 rounded-xl text-sm font-medium border border-slate-200 shadow-sm flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards kpis={roleData.kpis} onNavigate={onNavigate} />

      {/* Alert Operativi */}
      <AlertOperativi alerts={roleData.alerts} onNavigate={onNavigate} />

      {/* Main Charts Area */}
      <div className="mb-6">
        {/* Revenue Chart */}
        <RevenueChart data={roleData.revenueData} />
      </div>

      {/* Bottom Grid: Recent Activities */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Activities / Alerts */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-800">Attività Recenti</h3>
             <button 
               onClick={() => onNavigate('MANAGEMENT_DEADLINES')}
               className="text-xs text-orange-600 font-bold hover:underline"
             >
               Vedi tutto
             </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Contratto in scadenza - Via Roma 10 (Appt 3)', date: 'Oggi', type: 'alert' },
              { title: 'Manutenzione completata - Corso Italia 45', date: 'Ieri', type: 'success' },
              { title: 'Nuovo inquilino registrato - Mario Rossi', date: '2 ore fa', type: 'info' },
              { title: 'Pagamento ricevuto - Fabbricato Bologna', date: '4 ore fa', type: 'success' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.type === 'alert' ? 'bg-amber-100 text-amber-600' : item.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {item.type === 'alert' && <AlertCircle size={16} />}
                    {item.type === 'success' && <CheckCircle2 size={16} />}
                    {item.type === 'info' && <TrendingUp size={16} />}
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{item.title}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market News Modal */}
      <MarketNewsModal 
        isOpen={isMarketNewsOpen} 
        onClose={() => setIsMarketNewsOpen(false)} 
      />
    </div>
  );
};