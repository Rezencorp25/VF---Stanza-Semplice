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
  Shield,
  MapPin,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Lock
} from 'lucide-react';
import { Collaborator, CollaboratorRole } from '../../types';
import { CollaboratorFormModal } from '../../components/admin/CollaboratorFormModal';
import { CollaboratorDetailModal } from '../../components/admin/CollaboratorDetailModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useCollaborators } from '../../hooks/useCollaborators';
import { useToast } from '../../components/Toast';

export const Collaborators: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [viewingCollaborator, setViewingCollaborator] = useState<Collaborator | null>(null);

  const { collaborators, loading, error, addCollaborator, updateCollaborator, deleteCollaborator, toggleCollaboratorStatus } = useCollaborators();
  const { showToast } = useToast();

  // Derived Data
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(col => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        col.firstName.toLowerCase().includes(searchLower) ||
        col.lastName.toLowerCase().includes(searchLower) ||
        col.email.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Filters
      if (filterRole !== 'all' && col.role !== filterRole) return false;
      if (filterStatus !== 'all' && col.status !== filterStatus) return false;
      if (filterCity !== 'all' && !col.assignedCities.includes('all') && !col.assignedCities.includes(filterCity)) return false;

      return true;
    });
  }, [collaborators, searchQuery, filterRole, filterStatus, filterCity]);

  // Handlers
  const handleEdit = (col: Collaborator) => {
    setEditingCollaborator(col);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleView = (col: Collaborator) => {
    setViewingCollaborator(col);
    setActiveMenu(null);
  };

  const handleDelete = async (col: Collaborator) => {
    if (confirm(`Eliminare questo collaboratore (${col.firstName} ${col.lastName}) rimuoverà anche il suo account di accesso.\n\nSei sicuro?`)) {
      try {
        await deleteCollaborator(col.id);
        showToast('Collaboratore eliminato con successo', 'success');
      } catch (error) {
        console.error('Error deleting collaborator:', error);
        showToast('Errore durante l\'eliminazione del collaboratore', 'error');
      }
    }
    setActiveMenu(null);
  };

  const handleToggleStatus = async (col: Collaborator) => {
    try {
      await toggleCollaboratorStatus(col.id, col.status);
      showToast(`Stato collaboratore aggiornato: ${col.status === 'active' ? 'Disattivato' : 'Attivato'}`, 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Errore durante l\'aggiornamento dello stato', 'error');
    }
    setActiveMenu(null);
  };

  const handleSave = async (data: Partial<Collaborator>) => {
    try {
      if (editingCollaborator) {
        await updateCollaborator(editingCollaborator.id, data);
        showToast('Collaboratore aggiornato con successo', 'success');
      } else {
        await addCollaborator(data as Omit<Collaborator, 'id'>);
        showToast('Collaboratore creato con successo', 'success');
      }
      setIsFormOpen(false);
      setEditingCollaborator(null);
    } catch (error) {
      console.error('Error saving collaborator:', error);
      showToast('Errore durante il salvataggio del collaboratore', 'error');
    }
  };

  // Render Helpers
  const getRoleBadge = (role: CollaboratorRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">Admin</span>;
      case 'CITY_MANAGER':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">Manager</span>;
      case 'OPERATOR':
        return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">Operatore</span>;
      case 'VIEWER':
        return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">Viewer</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Attivo</span>
      : <span className="flex items-center gap-1 text-xs font-bold text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Inattivo</span>;
  };

  return (
    <AdminLayout 
      title="Collaboratori" 
      subtitle="Gestione utenti e permessi" 
      breadcrumbs={[{ label: 'Collaboratori' }]}
      actions={
        <>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta CSV</span>
          </button>

          <button 
            onClick={() => {
              setEditingCollaborator(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuovo Collaboratore</span>
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
            placeholder="Cerca per nome, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutti i Ruoli</option>
            <option value="ADMIN">Admin</option>
            <option value="CITY_MANAGER">Manager</option>
            <option value="OPERATOR">Operatore</option>
            <option value="VIEWER">Viewer</option>
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

          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutte le Città</option>
            <option value="Milano">Milano</option>
            <option value="Roma">Roma</option>
            <option value="Bologna">Bologna</option>
            <option value="Torino">Torino</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Collaboratore</th>
                <th className="px-6 py-4">Contatti</th>
                <th className="px-6 py-4">Ruolo & Città</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4">Ultimo Accesso</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollaborators.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                        {col.avatar ? (
                          <img src={col.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{col.firstName.charAt(0)}{col.lastName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{col.firstName} {col.lastName}</div>
                        <div className="text-xs text-slate-500">Creato il {new Date(col.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        <span>{col.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        <span>{col.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      {getRoleBadge(col.role)}
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        <span>{col.assignedCities.includes('all') ? 'Tutte le città' : col.assignedCities.join(', ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(col.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600">
                      {col.lastLogin ? new Date(col.lastLogin).toLocaleString() : 'Mai'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === col.id ? null : col.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === col.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === col.id && (
                      <div className="absolute right-0 top-full mt-[-10px] mr-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleView(col)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Eye size={14} /> Dettagli
                        </button>
                        <button 
                          onClick={() => handleEdit(col)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} /> Modifica
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(col)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <RefreshCw size={14} /> {col.status === 'active' ? 'Disattiva' : 'Attiva'}
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button 
                          onClick={() => handleDelete(col)}
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
            Visualizzati <span className="font-bold text-slate-700">{filteredCollaborators.length}</span> collaboratori
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Precedente</button>
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white">Successivo</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CollaboratorFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        collaborator={editingCollaborator}
        onSave={handleSave}
      />

      <CollaboratorDetailModal
        isOpen={!!viewingCollaborator}
        onClose={() => setViewingCollaborator(null)}
        collaborator={viewingCollaborator}
        onEdit={() => {
          if (viewingCollaborator) {
            setViewingCollaborator(null);
            handleEdit(viewingCollaborator);
          }
        }}
      />
    </div>
    </AdminLayout>
  );
};
