import React, { useState, useEffect } from 'react';
import { X, Save, Upload, RefreshCw } from 'lucide-react';
import { Agency } from '../../types';
import { MOCK_COLLABORATORS } from '../../constants';

interface AgencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
  onSave: (data: Partial<Agency>) => void;
}

const LEGAL_FORMS = ['SRL', 'SRLS', 'SPA', 'SNC', 'SAS', 'Ditta Individuale', 'Altro'];

export const AgencyFormModal: React.FC<AgencyFormModalProps> = ({ 
  isOpen, 
  onClose, 
  agency, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Partial<Agency>>({
    name: '',
    code: '',
    legalForm: 'SRL',
    taxCode: '',
    vatNumber: '',
    reaNumber: '',
    shareCapital: 0,
    paidUpCapital: 0,
    address: '',
    zipCode: '',
    city: '',
    province: '',
    region: '',
    phone: '',
    email: '',
    pec: '',
    website: '',
    brandColor: '#F97316',
    logoUrl: '',
    managerId: '',
    collaboratorIds: [],
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (agency) {
      setFormData(agency);
    } else {
      setFormData({
        name: '',
        code: '',
        legalForm: 'SRL',
        taxCode: '',
        vatNumber: '',
        reaNumber: '',
        shareCapital: 0,
        paidUpCapital: 0,
        address: '',
        zipCode: '',
        city: '',
        province: '',
        region: '',
        phone: '',
        email: '',
        pec: '',
        website: '',
        brandColor: '#F97316',
        logoUrl: '',
        managerId: '',
        collaboratorIds: [],
        status: 'active'
      });
    }
    setErrors({});
  }, [agency, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Ragione Sociale obbligatoria';
    if (!formData.code) newErrors.code = 'Codice Agenzia obbligatorio';
    if (!formData.taxCode) newErrors.taxCode = 'Codice Fiscale obbligatorio';
    if (!formData.address) newErrors.address = 'Indirizzo obbligatorio';
    if (!formData.zipCode) newErrors.zipCode = 'CAP obbligatorio';
    if (!formData.city) newErrors.city = 'Comune obbligatorio';
    if (!formData.province) newErrors.province = 'Provincia obbligatoria';
    if (!formData.phone) newErrors.phone = 'Telefono obbligatorio';
    if (!formData.email) newErrors.email = 'Email obbligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCollaboratorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData({ ...formData, collaboratorIds: selectedOptions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {agency ? 'Modifica Filiale' : 'Nuova Filiale'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Corporate Data */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
              Dati Societari
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Ragione Sociale *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="es. Stanza Semplice SRL"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Forma Giuridica</label>
                <select 
                  value={formData.legalForm}
                  onChange={(e) => setFormData({...formData, legalForm: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {LEGAL_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Codice Agenzia *</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.code ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="es. STANZASEMPLICE"
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Codice Fiscale *</label>
                <input 
                  type="text" 
                  value={formData.taxCode}
                  onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.taxCode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.taxCode && <p className="text-xs text-red-500">{errors.taxCode}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Partita IVA</label>
                <input 
                  type="text" 
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({...formData, vatNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Registro Imprese (REA)</label>
                <input 
                  type="text" 
                  value={formData.reaNumber}
                  onChange={(e) => setFormData({...formData, reaNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Capitale Sociale (€)</label>
                <input 
                  type="number" 
                  value={formData.shareCapital}
                  onChange={(e) => setFormData({...formData, shareCapital: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Capitale Versato (€)</label>
                <input 
                  type="number" 
                  value={formData.paidUpCapital}
                  onChange={(e) => setFormData({...formData, paidUpCapital: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              Sede Legale
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Indirizzo *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">CAP *</label>
                <input 
                  type="text" 
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.zipCode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Comune *</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.city ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Provincia *</label>
                <input 
                  type="text" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.province ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  maxLength={2}
                />
                {errors.province && <p className="text-xs text-red-500">{errors.province}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Regione</label>
                <input 
                  type="text" 
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Contacts & Branding */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
              Contatti e Branding
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Telefono *</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">PEC</label>
                <input 
                  type="email" 
                  value={formData.pec}
                  onChange={(e) => setFormData({...formData, pec: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Sito Web</label>
                <input 
                  type="url" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Colore Brand</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={formData.brandColor}
                    onChange={(e) => setFormData({...formData, brandColor: e.target.value})}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
                  />
                  <span className="text-sm text-slate-500 font-mono">{formData.brandColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Logo (URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://..."
                  />
                  <button type="button" className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Management & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">4</span>
              Gestione e Stato
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Responsabile Filiale</label>
                <select 
                  value={formData.managerId || ''}
                  onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Nessun responsabile</option>
                  {MOCK_COLLABORATORS.filter(c => c.status === 'active').map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Stato Filiale</label>
                <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'active'})}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Attiva
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'inactive'})}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${formData.status === 'inactive' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Inattiva
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Collaboratori Assegnati</label>
              <select 
                multiple
                value={formData.collaboratorIds || []}
                onChange={handleCollaboratorChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
              >
                {MOCK_COLLABORATORS.filter(c => c.status === 'active').map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.role})</option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Tieni premuto Ctrl (o Cmd su Mac) per selezionare più collaboratori.</p>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
          >
            Annulla
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Salva Filiale
          </button>
        </div>

      </div>
    </div>
  );
};
