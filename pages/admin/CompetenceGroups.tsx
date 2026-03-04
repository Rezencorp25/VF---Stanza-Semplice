import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  MapPin,
  Building2,
  Users,
  UserCheck
} from 'lucide-react';
import { CompetenceGroup } from '../../types';
import { MOCK_CITIES, MOCK_COLLABORATORS } from '../../constants';
import { CompetenceGroupFormModal } from '../../components/admin/CompetenceGroupFormModal';
import { CompetenceGroupDetailModal } from '../../components/admin/CompetenceGroupDetailModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useCompetenceGroups } from '../../hooks/useCompetenceGroups';
import { useToast } from '../../components/Toast';

export const CompetenceGroups: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CompetenceGroup | null>(null);
  const [viewingGroup, setViewingGroup] = useState<CompetenceGroup | null>(null);

  const { competenceGroups, loading, error, addCompetenceGroup, updateCompetenceGroup, deleteCompetenceGroup, toggleCompetenceGroupStatus } = useCompetenceGroups();
  const { showToast } = useToast();

  // Derived Data
  const filteredGroups = useMemo(() => {
    return competenceGroups.filter(group => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        group.name.toLowerCase().includes(searchLower) ||
        group.code.toLowerCase().includes(searchLower) ||
        group.agency.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Filters
      if (filterAgency !== 'all' && group.agency !== filterAgency) return false;
      if (filterCity !== 'all' && group.cityId !== filterCity) return false;
      if (filterStatus !== 'all' && group.status !== filterStatus) return false;

      return true;
    });
  }, [competenceGroups, searchQuery, filterAgency, filterCity, filterStatus]);

  // Handlers
  const handleEdit = (group: CompetenceGroup) => {
    setEditingGroup(group);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleView = (group: CompetenceGroup) => {
    setViewingGroup(group);
    setActiveMenu(null);
  };

  const handleDelete = async (group: CompetenceGroup) => {
    if (group.collaboratorIds.length > 0) {
      alert(`Impossibile eliminare ${group.name}: ci sono ${group.collaboratorIds.length} collaboratori assegnati.`);
      setActiveMenu(null);
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare ${group.name}? Questa azione non può essere annullata.`)) {
      try {
        await deleteCompetenceGroup(group.id);
        showToast('Gruppo eliminato con successo', 'success');
      } catch (error) {
        console.error('Error deleting group:', error);
        showToast('Errore durante l\'eliminazione del gruppo', 'error');
      }
    }
    setActiveMenu(null);
  };

  const handleToggleStatus = async (group: CompetenceGroup) => {
    try {
      await toggleCompetenceGroupStatus(group.id, group.status);
      showToast(`Stato gruppo aggiornato: ${group.status === 'active' ? 'Disattivato' : 'Attivato'}`, 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Errore durante l\'aggiornamento dello stato', 'error');
    }
    setActiveMenu(null);
  };

  const handleSave = async (data: Partial<CompetenceGroup>) => {
    try {
      if (editingGroup) {
        await updateCompetenceGroup(editingGroup.id, data);
        showToast('Gruppo aggiornato con successo', 'success');
      } else {
        await addCompetenceGroup(data as Omit<CompetenceGroup, 'id'>);
        showToast('Gruppo creato con successo', 'success');
      }
      setIsFormOpen(false);
      setEditingGroup(null);
    } catch (error) {
      console.error('Error saving group:', error);
      showToast('Errore durante il salvataggio del gruppo', 'error');
    }
  };

  // Render Helpers
  const getCityName = (cityId: string) => {
    const city = MOCK_CITIES.find(c => c.id === cityId);
    return city ? city.name : 'Unknown City';
  };

  const getManagerName = (managerId?: string) => {
    if (!managerId) return <span className="text-slate-400 italic">Nessuno</span>;
    const manager = MOCK_COLLABORATORS.find(c => c.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Attivo</span>
      : <span className="flex items-center gap-1 text-xs font-bold text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Inattivo</span>;
  };

  return (
    <AdminLayout 
      title="Gruppi di Competenza" 
      subtitle="Gestione unità operative e assegnazioni" 
      breadcrumbs={[{ label: 'Gruppi' }]}
      actions={
        <>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta CSV</span>
          </button>

          <button 
            onClick={() => {
              setEditingGroup(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuovo Gruppo</span>
          </button>
        </>
      }
    >
      <div className="space-y-8">
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cerca per nome, codice, agenzia..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <select 
            value={filterAgency}
            onChange={(e) => setFilterAgency(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="all">Tutte le Agenzie</option>
            <option value="Stanza Semplice SRL">Stanza Semplice SRL</option>
            <option value="Dueda Rooms SRL">Dueda Rooms SRL</option>
          </select>

          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutte le Città</option>
            {MOCK_CITIES.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutti gli Stati</option>
            <option value="active">Attivi</option>
            <option value="inactive">Inattivi</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Gruppo</th>
                <th className="px-6 py-4">Agenzia & Città</th>
                <th className="px-6 py-4">Responsabile</th>
                <th className="px-6 py-4">Assegnazioni</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs font-bold border border-slate-200 whitespace-nowrap">
                        {group.code}
                      </div>
                      <div className="font-bold text-slate-800">{group.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium text-slate-700">{group.agency}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        {getCityName(group.cityId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-slate-400" />
                      <span className="text-slate-700 font-medium">{getManagerName(group.managerId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors group/btn" title="Collaboratori">
                        <Users size={14} className="text-slate-400 group-hover/btn:text-blue-500" />
                        <span className="font-bold text-xs">{group.collaboratorIds.length}</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors group/btn" title="Oggetti">
                        <Building2 size={14} className="text-slate-400 group-hover/btn:text-purple-500" />
                        <span className="font-bold text-xs">{group.objectIds.length}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(group.status)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === group.id ? null : group.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === group.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === group.id && (
                      <div className="absolute right-0 top-full mt-[-10px] mr-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleView(group)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Eye size={14} /> Dettagli
                        </button>
                        <button 
                          onClick={() => handleEdit(group)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} /> Modifica
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(group)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <RefreshCw size={14} /> {group.status === 'active' ? 'Disattiva' : 'Attiva'}
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button 
                          onClick={() => handleDelete(group)}
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
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Visualizzati <span className="font-bold text-slate-700">{filteredGroups.length}</span> gruppi
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Precedente</button>
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white">Successivo</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CompetenceGroupFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        group={editingGroup}
        onSave={handleSave}
      />

      <CompetenceGroupDetailModal
        isOpen={!!viewingGroup}
        onClose={() => setViewingGroup(null)}
        group={viewingGroup}
        onEdit={() => {
          if (viewingGroup) {
            setViewingGroup(null);
            handleEdit(viewingGroup);
          }
        }}
      />
    </div>
    </AdminLayout>
  );
};
