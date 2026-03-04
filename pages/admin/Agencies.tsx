import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Building2,
  Users,
  Network,
  LayoutGrid,
  List,
  MapPin,
  Phone,
  Mail,
  Globe,
  RefreshCw
} from 'lucide-react';
import { Agency } from '../../types';
import { MOCK_COLLABORATORS } from '../../constants';
import { AgencyFormModal } from '../../components/admin/AgencyFormModal';
import { AgencyDetailModal } from '../../components/admin/AgencyDetailModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAgencies } from '../../hooks/useAgencies';
import { useToast } from '../../components/Toast';

export const Agencies: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [viewingAgency, setViewingAgency] = useState<Agency | null>(null);

  const { agencies, loading, error, addAgency, updateAgency, deleteAgency, toggleAgencyStatus } = useAgencies();
  const { showToast } = useToast();

  // Derived Data
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const searchLower = searchQuery.toLowerCase();
      return (
        agency.name.toLowerCase().includes(searchLower) ||
        agency.code.toLowerCase().includes(searchLower) ||
        agency.city.toLowerCase().includes(searchLower) ||
        agency.vatNumber?.includes(searchLower)
      );
    });
  }, [agencies, searchQuery]);

  // Handlers
  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleView = (agency: Agency) => {
    setViewingAgency(agency);
    setActiveMenu(null);
  };

  const handleDelete = async (agency: Agency) => {
    const assignedCollaborators = agency.collaboratorIds || [];
    
    if (assignedCollaborators.length > 0) {
      const collaboratorNames = assignedCollaborators.map(id => {
        const collaborator = MOCK_COLLABORATORS.find(c => c.id === id);
        return collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : id;
      }).join(', ');

      alert(`Impossibile eliminare la filiale ${agency.name}.\n\nCi sono ${assignedCollaborators.length} collaboratori assegnati:\n${collaboratorNames}`);
      setActiveMenu(null);
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare la filiale ${agency.name}? Questa azione non può essere annullata.`)) {
      try {
        await deleteAgency(agency.id);
        showToast('Filiale eliminata con successo', 'success');
      } catch (error) {
        console.error('Error deleting agency:', error);
        showToast('Errore durante l\'eliminazione della filiale', 'error');
      }
    }
    setActiveMenu(null);
  };

  const handleToggleStatus = async (agency: Agency) => {
    try {
      await toggleAgencyStatus(agency.id, agency.status);
      showToast(`Stato filiale aggiornato: ${agency.status === 'active' ? 'Disattivata' : 'Attivata'}`, 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Errore durante l\'aggiornamento dello stato', 'error');
    }
    setActiveMenu(null);
  };

  const handleSave = async (data: Partial<Agency>) => {
    try {
      if (editingAgency) {
        await updateAgency(editingAgency.id, data);
        showToast('Filiale aggiornata con successo', 'success');
      } else {
        await addAgency(data as Omit<Agency, 'id'>);
        showToast('Filiale creata con successo', 'success');
      }
      setIsFormOpen(false);
      setEditingAgency(null);
    } catch (error) {
      console.error('Error saving agency:', error);
      showToast('Errore durante il salvataggio della filiale', 'error');
    }
  };

  return (
    <AdminLayout 
      title="Filiali" 
      subtitle="Gestione entità giuridiche e sedi operative" 
      breadcrumbs={[{ label: 'Filiali' }]}
      actions={
        <>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Vista Cards"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Vista Tabella"
            >
              <List size={18} />
            </button>
          </div>

          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta CSV</span>
          </button>

          <button 
            onClick={() => {
              setEditingAgency(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuova Filiale</span>
          </button>
        </>
      }
    >
      <div className="space-y-8">
      
      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cerca per nome, codice, città, P.IVA..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgencies.map(agency => (
            <div key={agency.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              
              {/* Card Header */}
              <div className="h-24 bg-slate-50 relative border-b border-slate-100">
                <div 
                  className="absolute top-0 left-0 w-full h-1" 
                  style={{ backgroundColor: agency.brandColor }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(agency)}
                    className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-blue-600 rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleView(agency)}
                    className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-blue-600 rounded-lg transition-colors shadow-sm"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6 -mt-10 relative">
                <div className="w-20 h-20 rounded-xl bg-white shadow-lg p-2 flex items-center justify-center border border-slate-100 mb-4">
                  {agency.logoUrl ? (
                    <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div 
                      className="w-full h-full rounded-lg flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: agency.brandColor || '#cbd5e1' }}
                    >
                      {agency.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{agency.code}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                      {agency.legalForm}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{agency.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} />
                    {agency.city} ({agency.province})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                      <Network size={12} /> Gruppi
                    </div>
                    <div className="text-lg font-bold text-slate-700">{agency.competenceGroupsCount}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                      <Users size={12} /> Staff
                    </div>
                    <div className="text-lg font-bold text-slate-700">{agency.collaboratorsCount}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <a href={`tel:${agency.phone}`} className="hover:text-blue-600 transition-colors">{agency.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <a href={`mailto:${agency.email}`} className="hover:text-blue-600 transition-colors truncate">{agency.email}</a>
                  </div>
                  {agency.website && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Globe size={14} className="text-slate-400" />
                      <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate">
                        {agency.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Filiale</th>
                  <th className="px-6 py-4">Sede</th>
                  <th className="px-6 py-4">Contatti</th>
                  <th className="px-6 py-4">Dati Fiscali</th>
                  <th className="px-6 py-4 text-center">Stats</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center p-1">
                          {agency.logoUrl ? (
                            <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-contain rounded" />
                          ) : (
                            <div 
                              className="w-full h-full rounded flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: agency.brandColor || '#cbd5e1' }}
                            >
                              {agency.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{agency.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-mono">{agency.code}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                              {agency.legalForm}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{agency.city} ({agency.province})</span>
                        <span className="text-xs text-slate-500">{agency.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <a href={`tel:${agency.phone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600">
                          <Phone size={12} /> {agency.phone}
                        </a>
                        <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600">
                          <Mail size={12} /> {agency.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-slate-500">
                          <span className="font-bold">P.IVA:</span> {agency.vatNumber || '-'}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="font-bold">REA:</span> {agency.reaNumber || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col items-center px-2 py-1 bg-slate-50 rounded-lg border border-slate-100" title="Gruppi Competenza">
                          <Network size={14} className="text-slate-400 mb-0.5" />
                          <span className="text-xs font-bold text-slate-700">{agency.competenceGroupsCount}</span>
                        </div>
                        <div className="flex flex-col items-center px-2 py-1 bg-slate-50 rounded-lg border border-slate-100" title="Collaboratori">
                          <Users size={14} className="text-slate-400 mb-0.5" />
                          <span className="text-xs font-bold text-slate-700">{agency.collaboratorsCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === agency.id ? null : agency.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${activeMenu === agency.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {activeMenu === agency.id && (
                        <div className="absolute right-0 top-full mt-[-10px] mr-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => handleView(agency)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Eye size={14} /> Dettagli
                          </button>
                          <button 
                            onClick={() => handleEdit(agency)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit size={14} /> Modifica
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Download size={14} /> Report Immagini
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(agency)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <RefreshCw size={14} /> {agency.status === 'active' ? 'Disattiva' : 'Attiva'}
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button 
                            onClick={() => handleDelete(agency)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} /> Elimina
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Visualizzate <span className="font-bold text-slate-700">{filteredAgencies.length}</span> filiali
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      <AgencyFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        agency={editingAgency}
        onSave={handleSave}
      />

      <AgencyDetailModal
        isOpen={!!viewingAgency}
        onClose={() => setViewingAgency(null)}
        agency={viewingAgency}
        onEdit={() => {
          if (viewingAgency) {
            setViewingAgency(null);
            handleEdit(viewingAgency);
          }
        }}
      />
    </div>
    </AdminLayout>
  );
};
