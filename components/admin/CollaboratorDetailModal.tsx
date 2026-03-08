import React from 'react';
import { ModalPortal } from '../ModalPortal';
import { X, Edit, Mail, Phone, MapPin, Shield, Calendar, Clock, Activity, Lock, User, Building2, Network, Eye, EyeOff } from 'lucide-react';
import { Collaborator } from '../../types';
import { MOCK_COMPETENCE_GROUPS } from '../../constants';
import { useAgencies } from '../../hooks/useAgencies';

interface CollaboratorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
  onEdit: () => void;
}

export const CollaboratorDetailModal: React.FC<CollaboratorDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  collaborator, 
  onEdit 
}) => {
  const { agencies } = useAgencies();
  const [showTempPassword, setShowTempPassword] = React.useState(false);

  if (!isOpen || !collaborator) return null;

  const branch = agencies.find(a => a.id === collaborator.branchId);
  const groups = MOCK_COMPETENCE_GROUPS.filter(g => collaborator.assignedGroupIds?.includes(g.id));

  const mockActivityLog = [
    { id: '1', action: 'Login', target: 'Sistema', timestamp: '2023-10-25T09:15:00Z' },
    { id: '2', action: 'Modifica', target: 'Contratto C-123', timestamp: '2023-10-24T14:30:00Z' },
    { id: '3', action: 'Creazione', target: 'Inquilino Marco Rossi', timestamp: '2023-10-23T11:20:00Z' },
    { id: '4', action: 'Login', target: 'Sistema', timestamp: '2023-10-23T09:00:00Z' },
    { id: '5', action: 'Visualizzazione', target: 'Report Mensile', timestamp: '2023-10-22T16:45:00Z' },
  ];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header with Profile Cover */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute -bottom-12 left-8 flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold overflow-hidden">
                {collaborator.avatar ? (
                  <img src={collaborator.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} />
                )}
              </div>
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                {collaborator.firstName} {collaborator.lastName}
              </h2>
              <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                <span className="bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                  {collaborator.role}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {collaborator.assignedCities.includes('all') ? 'Tutte le città' : collaborator.assignedCities.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-8 pb-8 space-y-8">
          
          {/* Actions */}
          <div className="flex justify-end">
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
            >
              <Edit size={16} /> Modifica Profilo
            </button>
          </div>

          {collaborator.mustChangePassword && collaborator.passwordTemporanea && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  <Lock size={16} />
                  Password Temporanea Attiva
                </h3>
                <p className="text-xs text-amber-700 mt-1">
                  L'utente dovrà cambiare password al prossimo accesso.
                </p>
              </div>
              <div className="relative">
                <input 
                  type={showTempPassword ? "text" : "password"}
                  value={collaborator.passwordTemporanea}
                  readOnly
                  className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-amber-900 font-mono text-sm outline-none pr-10 w-40"
                />
                <button 
                  type="button"
                  onClick={() => setShowTempPassword(!showTempPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showTempPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Info */}
            <div className="md:col-span-1 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contatti</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div className="text-sm font-medium break-all">{collaborator.email}</div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <div className="text-sm font-medium">{collaborator.phone}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organizzazione</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Filiale</div>
                      <div className="text-sm font-bold text-slate-700">{branch?.name || 'Nessuna filiale'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <Network size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Gruppi di Competenza</div>
                      <div className="text-sm font-bold text-slate-700">
                        {groups.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {groups.map(g => (
                              <li key={g.id} className="truncate max-w-[150px]" title={g.name}>{g.name}</li>
                            ))}
                          </ul>
                        ) : (
                          'Nessun gruppo'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dettagli Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Shield size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Ruolo</div>
                      <div className="text-sm font-bold text-slate-700">{collaborator.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Creato il</div>
                      <div className="text-sm font-bold text-slate-700">{new Date(collaborator.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Ultimo Accesso</div>
                      <div className="text-sm font-bold text-slate-700">
                        {collaborator.lastLogin ? new Date(collaborator.lastLogin).toLocaleString() : 'Mai'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {collaborator.notes && (
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800 italic">
                  "{collaborator.notes}"
                </div>
              )}

            </div>

            {/* Right Column: Activity */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} />
                Attività Recente
              </h3>

              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                {mockActivityLog.map((log, index) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-sm"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-bold text-slate-700">{log.action}</span>
                      <span className="text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      su <span className="font-medium text-slate-700">{log.target}</span>
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                Visualizza tutto lo storico
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
