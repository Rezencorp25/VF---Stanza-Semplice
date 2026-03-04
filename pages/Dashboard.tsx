import React from 'react';
import { UserRole, ViewState } from '../types';
import { MOCK_KPI_DATA } from '../constants';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Users, Wrench, Home, Calendar } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

interface DashboardProps {
  currentRole: UserRole;
  onNavigate: (view: ViewState) => void;
}

const dataRevenue = [
  { name: 'Gen', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'Mag', value: 6000 },
  { name: 'Giu', value: 5500 },
  { name: 'Lug', value: 7000 },
];

const dataOccupancy = [
  { name: 'Milano', occupied: 95, vacant: 5 },
  { name: 'Torino', occupied: 88, vacant: 12 },
  { name: 'Roma', occupied: 92, vacant: 8 },
  { name: 'Bologna', occupied: 100, vacant: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ currentRole, onNavigate }) => {
  
  const getKpiIcon = (name: string) => {
    if (name.includes('Revenue')) return <DollarSign size={20} />;
    if (name.includes('Occupancy')) return <Home size={20} />;
    if (name.includes('Maintenance')) return <Wrench size={20} />;
    if (name.includes('Tenants')) return <Users size={20} />;
    return <TrendingUp size={20} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Benvenuto nel pannello di controllo.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                {getKpiIcon(kpi.name)}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === 'up' ? 'bg-green-50 text-green-600' : kpi.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                {kpi.change}
                {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{kpi.name}</h3>
              <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Andamento Ricavi</h3>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={dataRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `€${value}`} />
                {/* <Tooltip /> */}
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Occupazione</h3>
          <div className="flex-1 w-full min-h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={dataOccupancy} layout="vertical" barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                {/* <Tooltip cursor={{fill: '#f8fafc'}} /> */}
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Bar dataKey="occupied" name="Occupati" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} />
                <Bar dataKey="vacant" name="Liberi" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
  );
};