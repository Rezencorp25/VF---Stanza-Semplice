import React from 'react';
import { ModalPortal } from '../ModalPortal';
import { X, Edit, Users, Building2, MapPin, UserCheck, Calendar } from 'lucide-react';
import { CompetenceGroup } from '../../types';
import { MOCK_CITIES, MOCK_COLLABORATORS } from '../../constants';

interface CompetenceGroupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: CompetenceGroup | null;
  onEdit: () => void;
}

export const CompetenceGroupDetailModal: React.FC<CompetenceGroupDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  group, 
  onEdit 
}) => {
  if (!isOpen || !group) return null;

  const city = MOCK_CITIES.find(c => c.id === group.cityId);
  const manager = MOCK_COLLABORATORS.find(c => c.id === group.managerId);
  const collaborators = MOCK_COLLABORATORS.filter(c => group.collaboratorIds.includes(c.id));

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                {group.code}
              </span>
              {group.color && (
                <div 
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" 
                  style={{ backgroundColor: group.color }} 
                  title="Colore Gruppo"
                />
              )}
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${group.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {group.status === 'active' ? 'ATTIVO' : 'INATTIVO'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{group.name}</h2>
            <div className="text-sm text-slate-500 mt-1">{group.agency}</div>
            {group.description && (
              <div className="text-sm text-slate-600 mt-2 italic border-l-2 border-slate-200 pl-3">
                {group.description}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Modifica"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Collaboratori</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{group.collaboratorIds.length}</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Oggetti Assegnati</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{group.objectIds.length}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Città</span>
              </div>
              <div className="text-lg font-bold text-slate-800 truncate">{city?.name || 'N/A'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Info & Manager */}
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck size={14} />
                  Responsabile Gruppo
                </h3>
                {manager ? (
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{manager.firstName} {manager.lastName}</div>
                      <div className="text-xs text-slate-500">{manager.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-400 text-sm text-center">
                    Nessun responsabile assegnato
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note Operative</h3>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100">
                  {group.notes || "Nessuna nota operativa inserita."}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} />
                  Date
                </h3>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Creato il: <span className="font-mono text-slate-700">{new Date(group.createdAt).toLocaleDateString()}</span></div>
                  <div>Ultima modifica: <span className="font-mono text-slate-700">{new Date(group.updatedAt).toLocaleDateString()}</span></div>
                </div>
              </div>

            </div>

            {/* Right Column: Collaborators & Objects */}
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Users size={14} />
                  Collaboratori Assegnati
                </h3>
                {collaborators.length > 0 ? (
                  <div className="space-y-2">
                    {collaborators.map(col => (
                      <div key={col.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {col.firstName.charAt(0)}{col.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{col.firstName} {col.lastName}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{col.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">Nessun collaboratore assegnato.</div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} />
                  Oggetti Assegnati
                </h3>
                {group.objectIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.objectIds.map(id => (
                      <span key={id} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded border border-slate-200">
                        ID: {id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">Nessun oggetto assegnato.</div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
