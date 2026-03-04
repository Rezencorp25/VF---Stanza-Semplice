import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Plus, 
  RefreshCw, 
  MoreHorizontal, 
  Eye, 
  Copy, 
  Mail, 
  Trash2, 
  AlertCircle,
  Calendar,
  Edit,
  ArrowRight
} from 'lucide-react';
import { MOCK_CONTRACTS, MOCK_APARTMENTS, MOCK_PROPERTIES, MOCK_OWNERS } from '../constants';
import { Contract, ViewState } from '../types';
import { EditContractModal } from '../components/EditContractModal';

interface ContractsProps {
  onNavigate?: (view: ViewState, params?: any) => void;
}

export const Contracts: React.FC<ContractsProps> = ({ onNavigate }) => {
  // Filters State
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterApartmentId, setFilterApartmentId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('');
  
  // UI State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null | undefined>(undefined); // undefined = closed, null = new, object = edit

  // Helper to get related data
  const getApartment = (id: string) => MOCK_APARTMENTS.find(a => a.id === id);
  const getBuilding = (id: string) => MOCK_PROPERTIES.find(p => p.id === id);
  const getOwners = (ids: string[]) => ids.map(id => MOCK_OWNERS.find(o => o.id === id)).filter(Boolean);

  // Filter Logic
  const filteredContracts = useMemo(() => {
    return MOCK_CONTRACTS.filter(contract => {
      const apt = getApartment(contract.apartmentId);
      const bld = getBuilding(contract.buildingId);

      // City Filter
      if (filterCity && bld?.city !== filterCity) return false;

      // Apartment Filter
      if (filterApartmentId && contract.apartmentId !== filterApartmentId) return false;

      // Status Filter
      if (filterStatus !== 'all' && contract.status !== filterStatus) return false;

      // Year Filter
      if (filterYear && !contract.startDate.startsWith(filterYear)) return false;

      return true;
    });
  }, [filterCity, filterApartmentId, filterStatus, filterYear]);

  // Expiration Badge Logic
  const getExpirationBadge = (dateStr: string) => {
    const today = new Date();
    const expDate = new Date(dateStr);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffDays < 0) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">⚫ Scaduto</span>;
    } else if (diffDays < 90) { // < 3 months
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-xs font-bold border border-red-200">🔴 Urgente</span>;
    } else if (diffDays < 365) { // 3-12 months
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">⚠️ In scadenza</span>;
    } else { // > 12 months
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold border border-green-200">🟢 Tra {diffYears} anni</span>;
    }
  };

  // Status Badge Logic
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">Attivo</span>;
      case 'expiring': return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">In scadenza</span>;
      case 'expired': return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">Scaduto</span>;
      case 'terminated': return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">Disdettato</span>;
      default: return null;
    }
  };

  // Row Styling Logic
  const getRowStyle = (status: string) => {
    if (status === 'expiring') return 'bg-yellow-50/50 hover:bg-yellow-50';
    if (status === 'expired') return 'bg-red-50/50 hover:bg-red-50';
    return 'hover:bg-slate-50';
  };

  // Menu Toggle
  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSaveContract = (data: any) => {
    console.log('Saving contract:', data);
    // Here you would update the state or call an API
    setEditingContract(undefined);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contratti Affitto Immobili</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <FileText size={16} />
            <span className="text-sm font-medium">Gestione dei contratti di locazione</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta</span>
          </button>

          <button 
            onClick={() => setEditingContract(null)}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuovo</span>
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        
        {/* City Filter */}
        <div className="w-full lg:w-auto min-w-[180px]">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Città</label>
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="">Tutte le Città</option>
            {Array.from(new Set(MOCK_PROPERTIES.map(p => p.city))).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Apartment Filter */}
        <div className="w-full lg:w-auto min-w-[220px]">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Appartamento</label>
          <select 
            value={filterApartmentId}
            onChange={(e) => setFilterApartmentId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="">Tutti gli Appartamenti</option>
            {MOCK_APARTMENTS
              .filter(a => !filterCity || getBuilding(a.buildingId)?.city === filterCity)
              .map(apt => {
                const bld = getBuilding(apt.buildingId);
                return (
                  <option key={apt.id} value={apt.id}>
                    {bld?.address} - Int. {apt.unitNumber}
                  </option>
                );
            })}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-auto min-w-[160px]">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Stato</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="all">Tutti</option>
            <option value="active">Attivi</option>
            <option value="expiring">In scadenza</option>
            <option value="expired">Scaduti</option>
            <option value="terminated">Disdettati</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="w-full lg:w-auto min-w-[120px]">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Anno Inizio</label>
          <input 
            type="number" 
            placeholder="YYYY"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="w-full lg:w-auto flex items-end gap-2 ml-auto mt-4 lg:mt-0">
          <button 
            onClick={() => {
              // Refresh logic (just re-render for mock)
              console.log('Refreshing...');
            }}
            className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors flex items-center gap-2 h-[38px]"
          >
            <RefreshCw size={16} />
            <span className="hidden xl:inline">Aggiorna</span>
          </button>
        </div>
      </div>

      {/* CONTRACTS TABLE */}
      {MOCK_CONTRACTS.length === 0 ? (
        /* EMPTY STATE (No contracts at all) */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 bg-orange-50 rounded-full shadow-sm mb-4">
            <FileText size={32} className="text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Nessun contratto presente</h3>
          <p className="text-slate-500 max-w-md mb-6">
            Non hai ancora inserito nessun contratto di affitto. 
            Aggiungi il primo contratto per iniziare a gestire le tue locazioni.
          </p>
          <button 
            onClick={() => setEditingContract(null)}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuovo Contratto</span>
          </button>
        </div>
      ) : filteredContracts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Appartamento</th>
                  <th className="px-6 py-4 whitespace-nowrap">Tipologia</th>
                  <th className="px-6 py-4 whitespace-nowrap">Codice A.E.</th>
                  <th className="px-6 py-4 whitespace-nowrap">Proprietari</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date Contratto</th>
                  <th className="px-6 py-4 whitespace-nowrap">Prima Scadenza</th>
                  <th className="px-6 py-4 whitespace-nowrap">Importo Annuo</th>
                  <th className="px-6 py-4 whitespace-nowrap">Stato</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContracts.map(contract => {
                  const apt = getApartment(contract.apartmentId);
                  const bld = getBuilding(contract.buildingId);
                  const owners = getOwners(contract.ownerIds);
                  
                  return (
                    <tr key={contract.id} className={`transition-colors group ${getRowStyle(contract.status)}`}>
                      <td className="px-6 py-4">
                        <div>
                          <button 
                            onClick={() => onNavigate && onNavigate('OBJECTS_APARTMENTS', { targetId: contract.apartmentId, action: 'edit_apartment' })}
                            className="font-bold text-slate-800 whitespace-nowrap hover:text-orange-600 hover:underline text-left flex items-center gap-1"
                          >
                            {bld?.address}, Int. {apt?.unitNumber} <ArrowRight size={10} />
                          </button>
                          <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{bld?.city}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 whitespace-nowrap">
                          {contract.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">{contract.taxCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 whitespace-nowrap">
                            {owners[0] ? `${owners[0].firstName} ${owners[0].lastName}` : '-'}
                          </span>
                          {owners.length > 1 && (
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                              + {owners.length - 1} altri
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs font-medium text-slate-600 whitespace-nowrap">
                          <span>Dal {new Date(contract.startDate).toLocaleDateString('it-IT')}</span>
                          <span>Al {new Date(contract.endDate).toLocaleDateString('it-IT')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-700 whitespace-nowrap">
                            {new Date(contract.firstExpirationDate).toLocaleDateString('it-IT')}
                          </span>
                          {getExpirationBadge(contract.firstExpirationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 whitespace-nowrap">
                          € {contract.annualAmount.toLocaleString('it-IT')} <span className="text-xs font-normal text-slate-400">/anno</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => toggleMenu(e, contract.id)}
                          className={`p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors ${activeMenu === contract.id ? 'bg-orange-50 text-orange-600' : ''}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeMenu === contract.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => {
                                setEditingContract(contract);
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <Eye size={14} /> Visualizza
                            </button>
                            <button 
                              onClick={() => {
                                setEditingContract(contract);
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <Edit size={14} /> Modifica
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                              <Copy size={14} /> Duplica
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                              <Mail size={14} /> Invia email
                            </button>
                            <div className="h-px bg-slate-100 my-1" />
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                              <Trash2 size={14} /> Elimina
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMPTY STATE (Filtered results) */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 bg-slate-50 rounded-full shadow-sm mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Nessun risultato trovato</h3>
          <p className="text-slate-500 max-w-md mb-6">
            Non ci sono contratti che corrispondono ai filtri selezionati.
            Prova a modificare i criteri di ricerca.
          </p>
          <button 
            onClick={() => {
              setFilterCity('');
              setFilterApartmentId('');
              setFilterStatus('all');
              setFilterYear('');
            }}
            className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Resetta filtri</span>
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      <EditContractModal 
        isOpen={editingContract !== undefined}
        onClose={() => setEditingContract(undefined)}
        contract={editingContract || null}
        onSave={handleSaveContract}
      />
    </div>
  );
};
