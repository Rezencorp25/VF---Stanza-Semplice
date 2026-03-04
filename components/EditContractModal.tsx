import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clipboard, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Copy,
  Percent
} from 'lucide-react';
import { Contract, Owner } from '../types';
import { MOCK_APARTMENTS, MOCK_PROPERTIES, MOCK_OWNERS } from '../constants';
import { DocumentsModal } from './MediaModals';

interface EditContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onSave: (data: any) => void;
}

interface EconomicYear {
  year: number | string; // 1-12 or 'over_12'
  label: string;
  amount: number;
  istat: number;
}

interface ContractOwner {
  id: string; // internal id for list key
  ownerId: string;
  percentage: number;
  iban: string;
  bank: string;
}

export const EditContractModal: React.FC<EditContractModalProps> = ({ isOpen, onClose, contract, onSave }) => {
  if (!isOpen) return null;

  // --- State ---
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1: Dati Contratto
    city: '',
    apartmentId: '',
    contractType: '4+4 Libero mercato',
    securityDepositType: 'Deposito cauzionale',
    securityDepositAmount: '',
    taxCode: '', // Codice A.E.
    registrationNumber: '',
    seriesCode: '',
    paymentDay: '5',

    // Section 2: Date
    registrationDate: '',
    stipulationDate: '',
    startDate: '',
    firstExpirationDate: '',
    secondExpirationDate: '',
    canTerminateAtFirstExpiration: false,

    // Section 3: Piano Economico
    economicPlan: [] as EconomicYear[],

    // Section 4: Proprietari
    owners: [] as ContractOwner[],

    // Section 5: Note
    notes: ''
  });

  // --- Initialization ---
  useEffect(() => {
    if (contract) {
      // Edit Mode
      const apt = MOCK_APARTMENTS.find(a => a.id === contract.apartmentId);
      const bld = apt ? MOCK_PROPERTIES.find(p => p.id === apt.buildingId) : null;

      // Mock economic plan generation if missing
      const mockPlan: EconomicYear[] = Array.from({ length: 13 }).map((_, i) => ({
        year: i < 12 ? i + 1 : 'over_12',
        label: i < 12 ? `${i + 1}° Anno` : 'Oltre il 12°',
        amount: contract.annualAmount,
        istat: i >= 4 ? 75 : 0 // Mock logic
      }));

      // Mock owners generation
      const mockOwners: ContractOwner[] = contract.ownerIds.map((oid, idx) => {
        const owner = MOCK_OWNERS.find(o => o.id === oid);
        return {
          id: `own-${idx}`,
          ownerId: oid,
          percentage: 100 / contract.ownerIds.length,
          iban: owner?.iban || '',
          bank: 'Banca Intesa' // Mock
        };
      });

      setFormData({
        city: bld?.city || '',
        apartmentId: contract.apartmentId,
        contractType: contract.type,
        securityDepositType: 'Deposito cauzionale', // Mock
        securityDepositAmount: (contract.annualAmount / 12 * 3).toString(), // Mock 3 months
        taxCode: contract.taxCode,
        registrationNumber: '123456', // Mock
        seriesCode: '3T', // Mock
        paymentDay: '5',
        registrationDate: '2023-01-15', // Mock
        stipulationDate: '2023-01-10', // Mock
        startDate: contract.startDate,
        firstExpirationDate: contract.firstExpirationDate,
        secondExpirationDate: contract.endDate,
        canTerminateAtFirstExpiration: true,
        economicPlan: mockPlan,
        owners: mockOwners,
        notes: 'Contratto standard.'
      });
    } else {
      // New Mode
      const initialPlan: EconomicYear[] = Array.from({ length: 13 }).map((_, i) => ({
        year: i < 12 ? i + 1 : 'over_12',
        label: i < 12 ? `${i + 1}° Anno` : 'Oltre il 12°',
        amount: 0,
        istat: 0
      }));

      setFormData({
        city: '',
        apartmentId: '',
        contractType: '4+4 Libero mercato',
        securityDepositType: 'Deposito cauzionale',
        securityDepositAmount: '',
        taxCode: '',
        registrationNumber: '',
        seriesCode: '',
        paymentDay: '5',
        registrationDate: '',
        stipulationDate: '',
        startDate: new Date().toISOString().split('T')[0],
        firstExpirationDate: '',
        secondExpirationDate: '',
        canTerminateAtFirstExpiration: false,
        economicPlan: initialPlan,
        owners: [],
        notes: ''
      });
    }
  }, [contract]);

  // --- Date Calculation Logic ---
  useEffect(() => {
    if (!formData.startDate || !formData.contractType) return;

    // Only calculate if not in "edit mode" with existing values, OR if user changed the type/start date
    // For simplicity, we'll recalculate whenever these change. 
    // In a real app, you might want to track if the user manually overrode the dates.
    
    const start = new Date(formData.startDate);
    if (isNaN(start.getTime())) return;

    let firstExp = new Date(start);
    let secondExp = new Date(start);
    let hasSecond = true;

    switch (formData.contractType) {
      case '4+4 Libero mercato':
        firstExp.setFullYear(start.getFullYear() + 4);
        secondExp.setFullYear(start.getFullYear() + 8);
        break;
      case '3+2 Uso transitorio':
      case '3+2 Concordato':
        firstExp.setFullYear(start.getFullYear() + 3);
        secondExp.setFullYear(start.getFullYear() + 5);
        break;
      case 'Transitorio < 18 mesi':
        firstExp.setMonth(start.getMonth() + 18);
        hasSecond = false;
        break;
      case 'Studenti universitari':
        firstExp.setMonth(start.getMonth() + 12);
        secondExp.setMonth(start.getMonth() + 36);
        break;
      case 'Uso foresteria':
        firstExp.setMonth(start.getMonth() + 12);
        hasSecond = false;
        break;
      default:
        return; // Don't auto-calculate for 'Altro' or unknown types
    }

    setFormData(prev => ({
      ...prev,
      firstExpirationDate: firstExp.toISOString().split('T')[0],
      secondExpirationDate: hasSecond ? secondExp.toISOString().split('T')[0] : ''
    }));

  }, [formData.contractType, formData.startDate]);

  // --- Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aptId = e.target.value;
    const apt = MOCK_APARTMENTS.find(a => a.id === aptId);
    const bld = apt ? MOCK_PROPERTIES.find(p => p.id === apt.buildingId) : null;
    
    setFormData(prev => ({
      ...prev,
      apartmentId: aptId,
      city: bld?.city || ''
    }));
  };

  // Economic Plan Handlers
  const handlePlanChange = (index: number, field: 'amount' | 'istat', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
      const newPlan = [...prev.economicPlan];
      newPlan[index] = { ...newPlan[index], [field]: numValue };
      return { ...prev, economicPlan: newPlan };
    });
  };

  const copyFirstYearValue = () => {
    const firstAmount = formData.economicPlan[0].amount;
    setFormData(prev => ({
      ...prev,
      economicPlan: prev.economicPlan.map(item => ({ ...item, amount: firstAmount }))
    }));
  };

  const applyStandardIstat = () => {
    setFormData(prev => ({
      ...prev,
      economicPlan: prev.economicPlan.map((item, index) => ({
        ...item,
        istat: index >= 3 ? 75 : item.istat // From 4th year (index 3)
      }))
    }));
  };

  const planTotals = useMemo(() => {
    const total12 = formData.economicPlan.slice(0, 12).reduce((sum, item) => sum + item.amount, 0);
    const avg = total12 / 12;
    return { total12, avg };
  }, [formData.economicPlan]);

  // Owners Handlers
  const handleAddOwner = () => {
    setFormData(prev => ({
      ...prev,
      owners: [
        ...prev.owners,
        {
          id: `new-${Date.now()}`,
          ownerId: '',
          percentage: 0,
          iban: '',
          bank: ''
        }
      ]
    }));
  };

  const handleRemoveOwner = (id: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.filter(o => o.id !== id)
    }));
  };

  const handleOwnerChange = (id: string, field: keyof ContractOwner, value: any) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map(o => {
        if (o.id !== id) return o;
        
        // Auto-fill IBAN if owner selected
        if (field === 'ownerId') {
          const owner = MOCK_OWNERS.find(mo => mo.id === value);
          return { ...o, ownerId: value, iban: owner?.iban || '' };
        }

        return { ...o, [field]: value };
      })
    }));
  };

  const ownersTotalPercentage = useMemo(() => {
    return formData.owners.reduce((sum, o) => sum + (parseFloat(o.percentage.toString()) || 0), 0);
  }, [formData.owners]);

  const isOwnersValid = Math.abs(ownersTotalPercentage - 100) < 0.1 || formData.owners.length === 0;

  const handleSave = () => {
    if (!formData.apartmentId || !formData.startDate) {
      alert('Compila i campi obbligatori (*)');
      return;
    }
    if (!isOwnersValid && formData.owners.length > 0) {
      alert('La somma delle percentuali di proprietà deve essere 100%');
      return;
    }
    onSave(formData);
    alert('Contratto salvato con successo!');
  };

  const handleSaveAndClose = () => {
    if (!formData.apartmentId || !formData.startDate) {
      alert('Compila i campi obbligatori (*)');
      return;
    }
    if (!isOwnersValid && formData.owners.length > 0) {
      alert('La somma delle percentuali di proprietà deve essere 100%');
      return;
    }
    onSave(formData);
    alert('Contratto salvato con successo!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in fade-in duration-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Modifica Contratto</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{formData.taxCode || 'NUOVO'}</span>
            <span>•</span>
            <span>{MOCK_APARTMENTS.find(a => a.id === formData.apartmentId)?.unitNumber ? `Int. ${MOCK_APARTMENTS.find(a => a.id === formData.apartmentId)?.unitNumber}` : 'Seleziona appartamento'}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={!isOwnersValid && formData.owners.length > 0}
            className={`px-4 py-2 border border-slate-200 font-semibold text-sm rounded-lg flex items-center gap-2 shadow-sm transition-colors ${(!isOwnersValid && formData.owners.length > 0) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-orange-600'}`}
          >
            <Save size={16} />
            <span className="hidden lg:inline">Salva</span>
          </button>
          
          <button 
            onClick={handleSaveAndClose}
            disabled={!isOwnersValid && formData.owners.length > 0}
            className={`px-4 py-2 font-semibold text-sm rounded-lg flex items-center gap-2 shadow-md transition-colors ${(!isOwnersValid && formData.owners.length > 0) ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200'}`}
          >
            <Save size={16} />
            <span className="hidden lg:inline">Salva e chiudi</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={() => setIsDocumentsModalOpen(true)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2" 
            title="Documenti"
          >
            <FileText size={18} />
            <span className="hidden sm:inline text-sm font-medium">Documenti</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={onClose}
            className="px-3 py-2 bg-red-50 text-red-500 border border-transparent hover:border-red-100 hover:bg-red-100 rounded-lg transition-colors"
            title="Chiudi"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* SECTION 1: DATI CONTRATTO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-500">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Dati Contratto</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Città</label>
                <input 
                  type="text" 
                  value={formData.city}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Appartamento <span className="text-red-500">*</span></label>
                <select 
                  name="apartmentId"
                  value={formData.apartmentId}
                  onChange={handleApartmentChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="">Seleziona Appartamento</option>
                  {MOCK_APARTMENTS.map(apt => {
                      const building = MOCK_PROPERTIES.find(p => p.id === apt.buildingId);
                      return (
                        <option key={apt.id} value={apt.id}>
                            {building?.address} - Int. {apt.unitNumber}
                        </option>
                      );
                  })}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipologia Contratto <span className="text-red-500">*</span></label>
                <select 
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="4+4 Libero mercato">4+4 Libero mercato</option>
                  <option value="3+2 Uso transitorio">3+2 Uso transitorio</option>
                  <option value="3+2 Concordato">3+2 Concordato</option>
                  <option value="Transitorio < 18 mesi">Transitorio &lt; 18 mesi</option>
                  <option value="Studenti universitari">Studenti universitari</option>
                  <option value="Uso foresteria">Uso foresteria</option>
                  <option value="Altro">Altro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Garanzia <span className="text-red-500">*</span></label>
                <select 
                  name="securityDepositType"
                  value={formData.securityDepositType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="Deposito cauzionale">Deposito cauzionale</option>
                  <option value="Fideiussione bancaria">Fideiussione bancaria</option>
                  <option value="Fideiussione assicurativa">Fideiussione assicurativa</option>
                  <option value="Nessuna">Nessuna</option>
                </select>
              </div>

              {formData.securityDepositType !== 'Nessuna' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Importo Garanzia</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    <input 
                      type="number" 
                      name="securityDepositAmount"
                      value={formData.securityDepositAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Codice A.E.</label>
                <input 
                  type="text" 
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono"
                  placeholder="Codice Agenzia Entrate"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Numero Registro</label>
                <input 
                  type="text" 
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Codice Serie</label>
                <input 
                  type="text" 
                  name="seriesCode"
                  value={formData.seriesCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="es. 3T"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Giorno Pagamento</label>
                <input 
                  type="number" 
                  name="paymentDay"
                  value={formData.paymentDay}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

            </div>
          </div>

          {/* SECTION 2: DATE DEL CONTRATTO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-orange-500">
                <Calendar size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Date del Contratto</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data Registrazione <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data Stipula</label>
                  <input 
                    type="date" 
                    name="stipulationDate"
                    value={formData.stipulationDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data Inizio <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                    <span>Prima Scadenza <span className="text-red-500">*</span></span>
                    <span className="text-[10px] font-normal text-slate-400 italic lowercase">calcolato automaticamente</span>
                  </label>
                  <input 
                    type="date" 
                    name="firstExpirationDate"
                    value={formData.firstExpirationDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                    <span>Seconda Scadenza</span>
                    <span className="text-[10px] font-normal text-slate-400 italic lowercase">calcolato automaticamente</span>
                  </label>
                  <input 
                    type="date" 
                    name="secondExpirationDate"
                    value={formData.secondExpirationDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        name="canTerminateAtFirstExpiration"
                        checked={formData.canTerminateAtFirstExpiration}
                        onChange={handleChange}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                      />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Possibilità di disdetta alla prima scadenza</span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>Le date di scadenza vengono calcolate automaticamente in base alla tipologia di contratto selezionata, ma possono essere modificate manualmente se necessario.</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PIANO ECONOMICO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-emerald-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Piano Economico</h2>
                  <p className="text-xs text-slate-500">Definisci il valore annuo per ogni anno del contratto</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={copyFirstYearValue}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <Copy size={14} /> Copia valore a tutti gli anni
                </button>
                <button 
                  onClick={applyStandardIstat}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <Percent size={14} /> Applica ISTAT standard (75%)
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[500px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 w-1/3">Anno</th>
                      <th className="px-4 py-3 w-1/3">Valore Annuo</th>
                      <th className="px-4 py-3 w-1/3">% ISTAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.economicPlan.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-700">{item.label}</td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                            <input 
                              type="number" 
                              value={item.amount}
                              onChange={(e) => handlePlanChange(index, 'amount', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <input 
                              type="number" 
                              value={item.istat}
                              onChange={(e) => handlePlanChange(index, 'istat', e.target.value)}
                              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Card */}
              <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Totale previsto 12 anni</p>
                  <p className="text-lg font-bold text-slate-800">€ {planTotals.total12.toLocaleString('it-IT')}</p>
                </div>
                <div className="text-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Media annua</p>
                  <p className="text-lg font-bold text-slate-800">€ {planTotals.avg.toLocaleString('it-IT', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="text-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Valore contratto complessivo</p>
                  <p className="text-lg font-bold text-slate-800">€ {planTotals.total12.toLocaleString('it-IT')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PROPRIETARI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-indigo-500">
                  <Users size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Proprietari</h2>
              </div>
              <button 
                onClick={handleAddOwner}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Aggiungi
              </button>
            </div>
            
            <div className="p-6">
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Proprietario</th>
                      <th className="px-4 py-3 w-24">%</th>
                      <th className="px-4 py-3">IBAN</th>
                      <th className="px-4 py-3">Banca</th>
                      <th className="px-4 py-3 w-16 text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.owners.map((owner) => (
                      <tr key={owner.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2">
                          <select 
                            value={owner.ownerId}
                            onChange={(e) => handleOwnerChange(owner.id, 'ownerId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Seleziona...</option>
                            {MOCK_OWNERS.map(o => (
                              <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <input 
                              type="number" 
                              value={owner.percentage}
                              onChange={(e) => handleOwnerChange(owner.id, 'percentage', parseFloat(e.target.value))}
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={owner.iban}
                            onChange={(e) => handleOwnerChange(owner.id, 'iban', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={owner.bank}
                            onChange={(e) => handleOwnerChange(owner.id, 'bank', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button 
                            onClick={() => handleRemoveOwner(owner.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.owners.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                          Nessun proprietario aggiunto.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {formData.owners.length > 0 && (
                <div className={`mt-4 p-3 rounded-lg flex items-center justify-between ${isOwnersValid ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  <div className="flex items-center gap-2">
                    {isOwnersValid ? <div className="w-2 h-2 rounded-full bg-green-500" /> : <AlertTriangle size={18} />}
                    <span className="text-sm font-bold">Totale: {ownersTotalPercentage}%</span>
                  </div>
                  {!isOwnersValid && (
                    <span className="text-xs font-medium">⚠️ La somma deve essere 100% per salvare</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: NOTE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-500">
                <Clipboard size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Note Contratto</h2>
            </div>
            
            <div className="p-6">
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-y"
                placeholder="Inserisci note aggiuntive qui..."
              />
            </div>
          </div>

        </div>
      </div>

      <DocumentsModal 
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
      />
    </div>
  );
};
