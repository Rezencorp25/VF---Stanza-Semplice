import React from 'react';
import { 
  Users, 
  Map, 
  Network, 
  Landmark, 
  Activity, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  AlertOctagon,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { MOCK_COLLABORATORS, MOCK_CITIES, MOCK_COMPETENCE_GROUPS, MOCK_AGENCIES } from '../../constants';
import { AdminLayout } from '../../components/admin/AdminLayout';

interface AdminDashboardProps {
  onNavigate: (view: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // Stats
  const activeCollaborators = MOCK_COLLABORATORS.filter(c => c.status === 'active').length;
  const activeCities = MOCK_CITIES.filter(c => c.status === 'active').length;
  const activeGroups = MOCK_COMPETENCE_GROUPS.filter(g => g.status === 'active').length;
  const totalAgencies = MOCK_AGENCIES.length;

  // Mock Logs
  const recentLogs = [
    { id: 1, action: 'Creato nuovo collaboratore', target: 'Mario Rossi', user: 'Admin', time: '10 min fa', status: 'success' },
    { id: 2, action: 'Modificato gruppo competenza', target: 'Bologna (BO) 1', user: 'Admin', time: '45 min fa', status: 'success' },
    { id: 3, action: 'Errore sync immagini', target: 'System', user: 'System', time: '2 ore fa', status: 'error' },
    { id: 4, action: 'Aggiornato listino prezzi', target: 'Milano', user: 'Manager', time: '3 ore fa', status: 'success' },
    { id: 5, action: 'Disattivata città', target: 'Torino', user: 'Admin', time: '1 giorno fa', status: 'warning' },
  ];

  return (
    <AdminLayout 
      title="Dashboard Amministrazione" 
      subtitle="Panoramica delle attività e stato del sistema"
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div 
          onClick={() => onNavigate('ADMIN_EMPLOYEES')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collaboratori</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{activeCollaborators}</div>
          <div className="text-sm text-slate-500 font-medium">Utenti attivi a sistema</div>
        </div>

        <div 
          onClick={() => onNavigate('ADMIN_CITIES')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Map size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Città</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{activeCities}</div>
          <div className="text-sm text-slate-500 font-medium">Sedi operative attive</div>
        </div>

        <div 
          onClick={() => onNavigate('ADMIN_COMPETENCE_GROUPS')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Network size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gruppi</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{activeGroups}</div>
          <div className="text-sm text-slate-500 font-medium">Unità operative assegnate</div>
        </div>

        <div 
          onClick={() => onNavigate('ADMIN_AGENCIES')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
              <Landmark size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filiali</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalAgencies}</div>
          <div className="text-sm text-slate-500 font-medium">Entità giuridiche</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Strumenti Admin</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              Accesso rapido alle utility di sistema per manutenzione e controllo.
            </p>
            <button 
              onClick={() => onNavigate('ADMIN_TOOLS')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative z-10"
            >
              <Wrench size={16} />
              Vai agli Strumenti
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-slate-400" />
              Stato Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Database</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Storage</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> 45% Usato
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">API Gateway</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> 99.9% Uptime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Ultime Attività
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Vedi tutto <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Azione</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Utente</th>
                  <th className="px-6 py-3 text-right">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
                        {log.status === 'error' && <AlertOctagon size={14} className="text-red-500" />}
                        {log.status === 'warning' && <AlertOctagon size={14} className="text-amber-500" />}
                        <span className="font-medium text-slate-700">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                      {log.target}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-500">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-slate-400 text-xs">
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
};
