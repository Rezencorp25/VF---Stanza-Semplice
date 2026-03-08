
import React, { useState, useMemo } from 'react';
import { ModalPortal } from './ModalPortal';
import { 
  Plus, 
  Download, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  Euro,
  FileSpreadsheet,
  Wallet,
  Home,
  Filter,
  CalendarDays
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, isValid } from 'date-fns';
import { MOCK_COSTI, CATEGORIE_COSTO, CITTA_DISPONIBILI, APPARTAMENTI_PER_FILTRO, Costo } from '../financialTypes';

export const CostiSection: React.FC = () => {
  // --- STATE ---
  const [costi, setCosti] = useState<Costo[]>(MOCK_COSTI);
  
  // Filtri
  const [filters, setFilters] = useState({
    citta: '',
    appartamento: '',
    tipo: '',
    dal: '', // data inizio filtro (YYYY-MM-DD)
    al: '', // data fine filtro (YYYY-MM-DD)
    valore: '',
    note: ''
  });

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Costo | null>(null);
  
  // Form State
  const initialFormState: Partial<Costo> = {
    fornitore: '',
    descrizione: '',
    importo_imponibile: 0,
    iva_percentuale: 22,
    importo_iva: 0,
    importo_totale: 0,
    data_fattura: new Date().toISOString().split('T')[0],
    mese_competenza: format(new Date(), 'yyyy-MM'),
    data_competenza_inizio: '',
    data_competenza_fine: '',
    categoria: '',
    citta: '',
    appartamento: '',
    numero_fattura_fornitore: '',
    note: '',
    esportato_profis: false
  };
  const [formData, setFormData] = useState<Partial<Costo>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Toast
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ 
    visible: false, message: '', type: 'success' 
  });

  // --- HELPERS ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };
  
  // Helper per calcolare Dal/Al dal mese di competenza (Visualizzazione in tabella se non c'è data fattura)
  const getDatesFromMonth = (monthStr: string) => {
    try {
      const date = parseISO(monthStr + '-01');
      if (!isValid(date)) return { dal: '-', al: '-' };
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      return {
        dal: format(start, 'dd/MM/yyyy'),
        al: format(end, 'dd/MM/yyyy')
      };
    } catch {
      return { dal: '-', al: '-' };
    }
  };

  const getCategoryLabel = (catValue: string) => {
    return CATEGORIE_COSTO.find(c => c.value === catValue)?.label || catValue;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // --- LISTE FILTRATE ---
  const appartamentiFiltrati = useMemo(() => {
    if (filters.citta) {
      return APPARTAMENTI_PER_FILTRO.filter(a => a.citta === filters.citta);
    }
    return APPARTAMENTI_PER_FILTRO;
  }, [filters.citta]);

  const modalAppartamentiFiltrati = useMemo(() => {
    if (formData.citta) {
      return APPARTAMENTI_PER_FILTRO.filter(a => a.citta === formData.citta);
    }
    return [];
  }, [formData.citta]);

  // Se cambio città e l'appartamento selezionato non è compatibile, resetto appartamento
  React.useEffect(() => {
    if (filters.citta && filters.appartamento) {
      const isValid = APPARTAMENTI_PER_FILTRO.some(a => a.citta === filters.citta && a.nome === filters.appartamento);
      if (!isValid) {
        setFilters(prev => ({ ...prev, appartamento: '' }));
      }
    }
  }, [filters.citta]);

  // --- FILTER LOGIC ---
  const filteredCosts = useMemo(() => {
    return costi.filter(c => {
      // 1. Città
      if (filters.citta && c.citta !== filters.citta) return false;
      
      // 2. Appartamento
      if (filters.appartamento && (c.appartamento || '') !== filters.appartamento) return false;
      
      // 3. Tipo
      if (filters.tipo && c.categoria !== filters.tipo) return false;
      
      // 4. Date (Confronto Data Fattura o Competenza)
      const dataRif = c.data_competenza_inizio || c.data_fattura || (c.mese_competenza + '-01');
      if (filters.dal && dataRif < filters.dal) return false;
      if (filters.al && dataRif > filters.al) return false;
      
      // 5. Valore
      if (filters.valore && !c.importo_totale.toString().includes(filters.valore)) return false;
      
      // 6. Note
      if (filters.note) {
        const searchStr = `${c.note || ''} ${c.descrizione} ${c.fornitore} ${c.numero_fattura_fornitore || ''}`.toLowerCase();
        if (!searchStr.includes(filters.note.toLowerCase())) return false;
      }

      return true;
    });
  }, [costi, filters]);

  // --- KPI LOGIC ---
  const kpiData = useMemo(() => {
    const totalAmount = filteredCosts.reduce((acc, c) => acc + c.importo_totale, 0);
    const pendingExportFiltered = filteredCosts.filter(c => !c.esportato_profis).reduce((acc, c) => acc + c.importo_totale, 0);
    const uniqueApts = new Set(filteredCosts.map(c => c.appartamento).filter(Boolean)).size;
    const avgPerApt = uniqueApts > 0 ? totalAmount / uniqueApts : 0;

    return { totalAmount, pendingExportFiltered, avgPerApt };
  }, [filteredCosts]);

  // --- HANDLERS ---

  const handleOpenModal = (cost?: Costo) => {
    if (cost) {
      setEditingCost(cost);
      setFormData(cost);
    } else {
      setEditingCost(null);
      setFormData(initialFormState);
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCost(null);
  };

  const handleFormChange = (field: keyof Costo, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset apartment if city changes
      if (field === 'citta') {
        updated.appartamento = '';
      }

      // Recalculate totals if economic fields change
      if (field === 'importo_imponibile' || field === 'iva_percentuale') {
        const imp = field === 'importo_imponibile' ? Number(value) : Number(prev.importo_imponibile || 0);
        const ivaPct = field === 'iva_percentuale' ? Number(value) : Number(prev.iva_percentuale || 0);
        const ivaVal = imp * (ivaPct / 100);
        updated.importo_iva = ivaVal;
        updated.importo_totale = imp + ivaVal;
      }
      
      // Sync mese_competenza with data_competenza_inizio automatically
      if (field === 'data_competenza_inizio' && value) {
         try {
           updated.mese_competenza = format(parseISO(value), 'yyyy-MM');
         } catch {}
      }

      return updated;
    });
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.importo_imponibile) errors.importo_imponibile = true;
    if (!formData.data_fattura) errors.data_fattura = true;
    if (!formData.data_competenza_inizio) errors.data_competenza_inizio = true;
    if (!formData.data_competenza_fine) errors.data_competenza_fine = true;
    if (!formData.categoria) errors.categoria = true;
    if (!formData.citta) errors.citta = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Compila i campi obbligatori', 'error');
      return;
    }

    const costToSave = { 
      ...formData, 
      id: editingCost ? editingCost.id : `cost_${Date.now()}`,
      fornitore: formData.fornitore || '', 
      descrizione: formData.descrizione || '', 
      importo_imponibile: Number(formData.importo_imponibile),
      importo_iva: Number(formData.importo_iva),
      importo_totale: Number(formData.importo_totale)
    } as Costo;

    if (editingCost) {
      setCosti(prev => prev.map(c => c.id === costToSave.id ? costToSave : c));
      showToast('Costo aggiornato');
    } else {
      setCosti(prev => [costToSave, ...prev]);
      showToast('Costo aggiunto');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo costo?')) {
      setCosti(prev => prev.filter(c => c.id !== id));
      showToast('Costo eliminato');
    }
  };

  const handleExportProfis = () => {
    const itemsToExport = filteredCosts.filter(c => !c.esportato_profis);
    
    if (itemsToExport.length === 0) {
      showToast('Nessun costo da esportare con i filtri attuali', 'error');
      return;
    }

    const headers = "data_fattura;fornitore;descrizione;categoria;imponibile;iva_pct;totale;mese_comp;citta;appartamento;num_fatt_fornitore\n";
    const rows = itemsToExport.map(c => 
      `${c.data_fattura};${c.fornitore};${c.descrizione};${c.categoria};${c.importo_imponibile.toFixed(2)};${c.iva_percentuale};${c.importo_totale.toFixed(2)};${c.mese_competenza};${c.citta};${c.appartamento || ''};${c.numero_fattura_fornitore || ''}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_profis_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setCosti(prev => prev.map(c => 
        itemsToExport.some(exp => exp.id === c.id) 
          ? { ...c, esportato_profis: true, data_export_profis: new Date().toISOString() } 
          : c
      ));
      showToast(`✅ ${itemsToExport.length} costi esportati. File CSV scaricato.`);
    }, 1000);
  };

  // --- STYLES FOR MODAL ---
  const modalLabelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2";
  const modalInputClass = "w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400";
  const modalSelectClass = "w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer";

  // MODAL CONTENT
  const modalContent = (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={handleCloseModal} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl">
                    <Plus size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {editingCost ? 'Modifica Costo' : 'Aggiungi Nuovo Costo'}
                </h2>
            </div>
            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLONNA SINISTRA */}
            <div className="space-y-6">
              
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={modalLabelClass}>Tipologia *</label>
                  <select 
                    value={formData.categoria} 
                    onChange={e => handleFormChange('categoria', e.target.value)}
                    className={`${modalSelectClass} ${formErrors.categoria ? 'border-red-500' : ''}`}
                  >
                    <option value="">Seleziona...</option>
                    {CATEGORIE_COSTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={modalLabelClass}>N° Fattura Fornitore</label>
                  <input 
                    type="text" 
                    value={formData.numero_fattura_fornitore} 
                    onChange={e => handleFormChange('numero_fattura_fornitore', e.target.value)}
                    className={modalInputClass}
                    placeholder="Esempio: 2024/01"
                  />
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={modalLabelClass}>Città *</label>
                  <select 
                    value={formData.citta} 
                    onChange={e => handleFormChange('citta', e.target.value)}
                    className={`${modalSelectClass} ${formErrors.citta ? 'border-red-500' : ''}`}
                  >
                    <option value="">Seleziona...</option>
                    {CITTA_DISPONIBILI.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={modalLabelClass}>Appartamento</label>
                  <select 
                    value={formData.appartamento} 
                    onChange={e => handleFormChange('appartamento', e.target.value)}
                    className={`${modalSelectClass} disabled:bg-slate-50 disabled:text-slate-400`}
                    disabled={!formData.citta || modalAppartamentiFiltrati.length === 0}
                  >
                    <option value="">{formData.citta ? 'Opzionale / Seleziona...' : 'Seleziona Città prima'}</option>
                    {modalAppartamentiFiltrati.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3: Notes */}
              <div className="flex-1 flex flex-col">
                <label className={modalLabelClass}>Note</label>
                <textarea 
                  value={formData.note}
                  onChange={e => handleFormChange('note', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[180px]"
                  placeholder="Inserisci qui eventuali note interne o dettagli aggiuntivi..."
                />
              </div>
            </div>

            {/* COLONNA DESTRA */}
            <div className="space-y-6">
              
              {/* Card Dettagli Economici */}
              <div className="bg-[#F8F9FC] border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1 bg-white border border-slate-200 rounded shadow-sm">
                        <Euro size={14} className="text-slate-600"/>
                    </div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dettagli Economici</span>
                </div>
                
                <div className="mb-5">
                    <label className={modalLabelClass}>Imponibile *</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={formData.importo_imponibile} 
                        onChange={e => handleFormChange('importo_imponibile', e.target.value)}
                        className={`w-full h-14 text-right font-bold text-2xl bg-white border ${formErrors.importo_imponibile ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm`}
                        placeholder="0"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className={modalLabelClass}>IVA %</label>
                        <select 
                            value={formData.iva_percentuale} 
                            onChange={e => handleFormChange('iva_percentuale', e.target.value)}
                            className={modalSelectClass}
                        >
                            <option value="0">0%</option>
                            <option value="4">4%</option>
                            <option value="10">10%</option>
                            <option value="22">22%</option>
                        </select>
                    </div>
                    <div>
                        <label className={modalLabelClass}>Importo IVA</label>
                        <input 
                            type="text" 
                            value={formData.importo_iva?.toFixed(2)} 
                            readOnly
                            className="w-full h-11 bg-slate-100 border border-slate-200 rounded-lg px-4 text-slate-500 text-right font-mono font-medium outline-none cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Totale</span>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(Number(formData.importo_totale))}</span>
                </div>
              </div>

              {/* Data Fattura */}
              <div>
                 <label className="block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Data Fattura *</label>
                 <input 
                    type="date" 
                    value={formData.data_fattura} 
                    onChange={e => handleFormChange('data_fattura', e.target.value)}
                    className={`w-full h-11 bg-white border ${formErrors.data_fattura ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm`}
                 />
              </div>

              {/* Card Periodo Competenza */}
              <div className="bg-[#F8F9FC] border border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="p-1 bg-white border border-slate-200 rounded shadow-sm">
                        <CalendarDays size={14} className="text-slate-600"/>
                    </div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Periodo di Competenza</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={modalLabelClass}>Data Inizio *</label>
                      <input 
                        type="date" 
                        value={formData.data_competenza_inizio} 
                        onChange={e => handleFormChange('data_competenza_inizio', e.target.value)}
                        className={`${modalInputClass} ${formErrors.data_competenza_inizio ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div>
                      <label className={modalLabelClass}>Data Fine *</label>
                      <input 
                        type="date" 
                        value={formData.data_competenza_fine} 
                        onChange={e => handleFormChange('data_competenza_fine', e.target.value)}
                        className={`${modalInputClass} ${formErrors.data_competenza_fine ? 'border-red-500' : ''}`}
                      />
                    </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-end gap-4 mt-auto">
          <button 
            onClick={handleCloseModal}
            className="font-bold text-slate-600 text-sm hover:bg-slate-50 px-6 py-2.5 rounded-xl transition-colors"
          >
            Annulla
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save size={18} />
            Salva Costo
          </button>
        </div>

      </div>
    </div>
    </ModalPortal>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Elenco Costi</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <Wallet size={16} />
            <span className="text-sm font-medium">Gestione spese e contabilità</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportProfis}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Esporta</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Nuovo
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... existing kpi cards ... */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-h-[100px]">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Totale Costi (Filtrati)</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{formatCurrency(kpiData.totalAmount)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100"><Euro size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-h-[100px]">
          <div>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Da Esportare</p>
            <p className="text-3xl font-bold text-orange-600 tracking-tight">{formatCurrency(kpiData.pendingExportFiltered)}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl text-orange-500 border border-orange-100"><Download size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-h-[100px]">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Costo Medio / Apt</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{formatCurrency(kpiData.avgPerApt)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100"><Home size={24} /></div>
        </div>
      </div>

      {/* UNIFIED TABLE CARD WITH FILTERS IN HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        
        {/* Card Header Title */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-white">
           <Filter size={20} className="text-slate-800" />
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filtri di Ricerca</h3>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[1400px]">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                {/* CITTÀ */}
                <th className="px-4 py-4 w-[160px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Città</label>
                   <select 
                     value={filters.citta}
                     onChange={(e) => setFilters({...filters, citta: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer appearance-none shadow-sm transition-all"
                   >
                     <option value="">Tutte le città</option>
                     {CITTA_DISPONIBILI.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </th>

                {/* APPARTAMENTO */}
                <th className="px-4 py-4 w-[240px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Appartamento</label>
                   <select 
                     value={filters.appartamento}
                     onChange={(e) => setFilters({...filters, appartamento: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer appearance-none disabled:bg-slate-50 disabled:text-slate-400 shadow-sm transition-all"
                     disabled={appartamentiFiltrati.length === 0}
                   >
                     <option value="">Seleziona</option>
                     {appartamentiFiltrati.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                   </select>
                </th>

                {/* TIPO */}
                <th className="px-4 py-4 w-[180px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Tipo</label>
                   <select 
                     value={filters.tipo}
                     onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer appearance-none shadow-sm transition-all"
                   >
                     <option value="">Tutti</option>
                     {CATEGORIE_COSTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                   </select>
                </th>

                {/* DAL */}
                <th className="px-4 py-4 w-[140px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Dal</label>
                   <input 
                     type="date" 
                     value={filters.dal}
                     onChange={(e) => setFilters({...filters, dal: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm transition-all"
                   />
                </th>

                {/* AL */}
                <th className="px-4 py-4 w-[140px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Al</label>
                   <input 
                     type="date" 
                     value={filters.al}
                     onChange={(e) => setFilters({...filters, al: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm transition-all"
                   />
                </th>

                {/* VALORE */}
                <th className="px-4 py-4 w-[140px] align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Valore</label>
                   <input 
                     type="text" 
                     value={filters.valore}
                     onChange={(e) => setFilters({...filters, valore: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm transition-all"
                     placeholder="€ 0.00"
                   />
                </th>

                {/* NOTE */}
                <th className="px-4 py-4 align-top bg-slate-50/30">
                   <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Note</label>
                   <input 
                     type="text" 
                     value={filters.note}
                     onChange={(e) => setFilters({...filters, note: e.target.value})}
                     className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm transition-all"
                     placeholder="Cerca note..."
                   />
                </th>

                {/* AZIONI (Placeholder for alignment) */}
                <th className="px-4 py-4 w-[80px] align-top bg-slate-50/30">
                   {/* Empty header for actions column, just keeping space */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCosts.map(cost => {
                const dates = getDatesFromMonth(cost.mese_competenza); // Fallback visualization
                // Use explicit start/end dates if available, otherwise fallback to month calc
                const dataInizioVis = cost.data_competenza_inizio ? formatDate(cost.data_competenza_inizio) : dates.dal;
                const dataFineVis = cost.data_competenza_fine ? formatDate(cost.data_competenza_fine) : dates.al;
                
                const tipoLabel = getCategoryLabel(cost.categoria);
                const cittaShort = cost.citta.substring(0, 3).toUpperCase();

                return (
                  <tr key={cost.id} className="hover:bg-slate-50 transition-colors text-xs text-slate-700 group">
                    <td className="px-4 py-3 font-bold text-slate-600">{cittaShort}</td>
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]" title={cost.appartamento}>
                      {cost.appartamento || '-'}
                    </td>
                    <td className="px-4 py-3 truncate max-w-[180px]" title={tipoLabel}>
                      {tipoLabel}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{dataInizioVis}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{dataFineVis}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {cost.importo_totale.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-[250px]" title={`${cost.descrizione} ${cost.note || ''}`}>
                      <span className="uppercase font-semibold">{cost.fornitore}</span> - {cost.descrizione} {cost.numero_fattura_fornitore ? `Ft. ${cost.numero_fattura_fornitore}` : ''} {cost.note}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(cost)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Modifica"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cost.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Elimina"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCosts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                    Nessun costo trovato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Totals */}
        {filteredCosts.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end gap-8 text-sm font-bold text-slate-700">
             <div>Righe: {filteredCosts.length}</div>
             <div>Totale: {formatCurrency(kpiData.totalAmount)}</div>
          </div>
        )}
      </div>

      {/* MODAL AGGIUNGI/MODIFICA (PORTALED to Body) */}
      {modalOpen && modalContent}

      {/* TOAST Notification */}
      {toast.visible && createPortal(
        <div className="fixed bottom-8 right-8 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <div className={`p-1 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
             {toast.type === 'error' ? <X size={14} /> : <CheckCircle2 size={14} />}
           </div>
           <span className="text-sm font-semibold">{toast.message}</span>
        </div>,
        document.body
      )}

    </div>
  );
};
