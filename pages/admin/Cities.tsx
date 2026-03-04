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
  Users
} from 'lucide-react';
import { City, GeographicArea } from '../../types';
import { CityFormModal } from '../../components/admin/CityFormModal';
import { CityDetailModal } from '../../components/admin/CityDetailModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useCities } from '../../hooks/useCities';
import { useToast } from '../../components/Toast';

export const Cities: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [viewingCity, setViewingCity] = useState<City | null>(null);

  const { cities, loading, error, addCity, updateCity, deleteCity, toggleCityStatus } = useCities();
  const { showToast } = useToast();

  // Derived Data
  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        city.name.toLowerCase().includes(searchLower) ||
        city.code.toLowerCase().includes(searchLower) ||
        city.province.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Filters
      if (filterArea !== 'all' && city.area !== filterArea) return false;
      if (filterRegion !== 'all' && city.region !== filterRegion) return false;
      if (filterStatus !== 'all' && city.status !== filterStatus) return false;

      return true;
    });
  }, [cities, searchQuery, filterArea, filterRegion, filterStatus]);

  // Handlers
  const handleEdit = (city: City) => {
    setEditingCity(city);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleView = (city: City) => {
    setViewingCity(city);
    setActiveMenu(null);
  };

  const handleDelete = async (city: City) => {
    if (city.objectsCount > 0) {
      alert(`Impossibile eliminare ${city.name}: ci sono ${city.objectsCount} fabbricati associati.`);
      setActiveMenu(null);
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare ${city.name}? Questa azione non può essere annullata.`)) {
      try {
        await deleteCity(city.id);
        showToast('Città eliminata con successo', 'success');
      } catch (error) {
        console.error('Error deleting city:', error);
        showToast('Errore durante l\'eliminazione della città', 'error');
      }
    }
    setActiveMenu(null);
  };

  const handleToggleStatus = async (city: City) => {
    try {
      await toggleCityStatus(city.id, city.status);
      showToast(`Stato città aggiornato: ${city.status === 'active' ? 'Disattivata' : 'Attivata'}`, 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Errore durante l\'aggiornamento dello stato', 'error');
    }
    setActiveMenu(null);
  };

  const handleSave = async (data: Partial<City>) => {
    try {
      if (editingCity) {
        await updateCity(editingCity.id, data);
        showToast('Città aggiornata con successo', 'success');
      } else {
        await addCity(data as Omit<City, 'id'>);
        showToast('Città creata con successo', 'success');
      }
      setIsFormOpen(false);
      setEditingCity(null);
    } catch (error) {
      console.error('Error saving city:', error);
      showToast('Errore durante il salvataggio della città', 'error');
    }
  };

  // Render Helpers
  const getAreaBadge = (area: GeographicArea) => {
    switch (area) {
      case 'Nord-ovest':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">Nord-Ovest</span>;
      case 'Nord-est':
        return <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">Nord-Est</span>;
      case 'Centro':
        return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">Centro</span>;
      case 'Sud':
        return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">Sud</span>;
      case 'Isole':
        return <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold border border-cyan-200">Isole</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Attiva</span>
      : <span className="flex items-center gap-1 text-xs font-bold text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Inattiva</span>;
  };

  return (
    <AdminLayout 
      title="Città" 
      subtitle="Gestione aree operative e valori di mercato" 
      breadcrumbs={[{ label: 'Città' }]}
      actions={
        <>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta CSV</span>
          </button>

          <button 
            onClick={() => {
              setEditingCity(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuova Città</span>
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
            placeholder="Cerca per nome, sigla..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <select 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutte le Aree</option>
            <option value="Nord-ovest">Nord-Ovest</option>
            <option value="Nord-est">Nord-Est</option>
            <option value="Centro">Centro</option>
            <option value="Sud">Sud</option>
            <option value="Isole">Isole</option>
          </select>

          <select 
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutte le Regioni</option>
            <option value="Lombardia">Lombardia</option>
            <option value="Emilia-Romagna">Emilia-Romagna</option>
            <option value="Veneto">Veneto</option>
            <option value="Lazio">Lazio</option>
            <option value="Toscana">Toscana</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Tutti gli Stati</option>
            <option value="active">Attive</option>
            <option value="inactive">Inattive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Città</th>
                <th className="px-6 py-4">Area & Regione</th>
                <th className="px-6 py-4">Valore Mercato</th>
                <th className="px-6 py-4">Oggetti</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs font-bold border border-slate-200">
                        {city.code}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{city.name}</div>
                        <div className="text-xs text-slate-500">{city.province}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      {getAreaBadge(city.area)}
                      <span className="text-xs text-slate-500">{city.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-slate-700">
                      € {city.marketValuePerSqm.toLocaleString()} <span className="text-xs text-slate-400">/mq</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors group/btn">
                      <Building2 size={16} className="text-slate-400 group-hover/btn:text-blue-500" />
                      <span className="font-bold">{city.objectsCount}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(city.status)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === city.id ? null : city.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === city.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === city.id && (
                      <div className="absolute right-0 top-full mt-[-10px] mr-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleView(city)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Eye size={14} /> Dettagli
                        </button>
                        <button 
                          onClick={() => handleEdit(city)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} /> Modifica
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(city)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <RefreshCw size={14} /> {city.status === 'active' ? 'Disattiva' : 'Attiva'}
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button 
                          onClick={() => handleDelete(city)}
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
            Visualizzate <span className="font-bold text-slate-700">{filteredCities.length}</span> città
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Precedente</button>
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-white">Successivo</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CityFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        city={editingCity}
        onSave={handleSave}
      />

      <CityDetailModal
        isOpen={!!viewingCity}
        onClose={() => setViewingCity(null)}
        city={viewingCity}
        onEdit={() => {
          if (viewingCity) {
            setViewingCity(null);
            handleEdit(viewingCity);
          }
        }}
      />
    </div>
    </AdminLayout>
  );
};
