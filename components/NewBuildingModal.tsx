import React, { useState } from 'react';
import { X, Save, Building2, MapPin, Map, UserCheck, AlertCircle } from 'lucide-react';

interface NewBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buildingData: any) => void;
}

export const NewBuildingModal: React.FC<NewBuildingModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  // Form State
  const [formData, setFormData] = useState({
    city: '',
    neighborhood: '',
    condoName: '',
    taxCode: '',
    context: 'Normale - Residenziale classico',
    contextDescription: '',
    internalNotes: '',
    toponym: 'Via',
    address: '',
    municipality: '',
    zipCode: '',
    province: '',
    country: 'Italia',
    adminNotPresent: false,
    adminName: '',
    adminPhone: '',
    adminMobile: '',
    adminTollFree: '',
    adminEmail: '',
    buildingIban: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.city.trim()) newErrors.city = 'Campo obbligatorio';
    if (!formData.context) newErrors.context = 'Campo obbligatorio';
    if (!formData.toponym) newErrors.toponym = 'Campo obbligatorio';
    if (!formData.address.trim()) newErrors.address = 'Campo obbligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[860px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Nuovo Fabbricato</h2>
            <p className="text-sm text-slate-500 mt-0.5">Inserisci i dati anagrafici e di configurazione dell'immobile</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* PANNELLO 1: Fabbricato */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2 mb-1">
                <Building2 size={18} className="text-orange-500" />
                <h3>Fabbricato</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Città <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.city ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Es. Milano"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Quartiere</label>
                  <input 
                    type="text" 
                    name="neighborhood" 
                    value={formData.neighborhood} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Condominio</label>
                  <input 
                    type="text" 
                    name="condoName" 
                    value={formData.condoName} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Codice Fiscale</label>
                  <input 
                    type="text" 
                    name="taxCode" 
                    value={formData.taxCode} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contesto <span className="text-red-500">*</span></label>
                  <select 
                    name="context" 
                    value={formData.context} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.context ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  >
                    <option value="Normale - Residenziale classico">Normale - Residenziale classico</option>
                    <option value="Premium - Residenziale di pregio">Premium - Residenziale di pregio</option>
                    <option value="Economico - Residenziale popolare">Economico - Residenziale popolare</option>
                    <option value="Commerciale">Commerciale</option>
                    <option value="Misto">Misto</option>
                  </select>
                  {errors.context && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.context}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrizione Contesto</label>
                  <textarea 
                    name="contextDescription" 
                    value={formData.contextDescription} 
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Note Interne</label>
                  <textarea 
                    name="internalNotes" 
                    value={formData.internalNotes} 
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* PANNELLO 2: Indirizzo */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2 mb-1">
                <MapPin size={18} className="text-orange-500" />
                <h3>Indirizzo</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Toponimo <span className="text-red-500">*</span></label>
                  <select 
                    name="toponym" 
                    value={formData.toponym} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.toponym ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  >
                    <option value="Via">Via</option>
                    <option value="Viale">Viale</option>
                    <option value="Piazza">Piazza</option>
                    <option value="Corso">Corso</option>
                    <option value="Largo">Largo</option>
                    <option value="Vicolo">Vicolo</option>
                  </select>
                  {errors.toponym && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.toponym}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Indirizzo <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.address ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Es. Roma, 42"
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Comune</label>
                  <input 
                    type="text" 
                    name="municipality" 
                    value={formData.municipality} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CAP</label>
                  <input 
                    type="text" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange}
                    maxLength={5}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Provincia</label>
                  <input 
                    type="text" 
                    name="province" 
                    value={formData.province} 
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all uppercase"
                    placeholder="MI"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nazione</label>
                  <input 
                    type="text" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* PANNELLO 3: Posizione Geografica */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2 mb-1">
                <Map size={18} className="text-orange-500" />
                <h3>Posizione Geografica</h3>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Le coordinate sono calcolate automaticamente. Verifica la posizione esatta sulla mappa.
                </p>
                
                <button className="w-full py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm active:scale-95">
                  Aggiorna Coordinate
                </button>

                <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center min-h-[120px] relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <MapPin size={32} className="text-orange-500 drop-shadow-md relative z-10" />
                </div>
              </div>
            </div>

          </div>

          {/* PANNELLO 4: Contatti Amministratore */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <UserCheck size={18} className="text-orange-500" />
                <h3>Contatti Amministratore Condominiale</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="adminNotPresent"
                  checked={formData.adminNotPresent}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" 
                />
                <span className="text-xs font-bold text-slate-500 uppercase">Amministratore non presente</span>
              </label>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${formData.adminNotPresent ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
              
              {/* Colonna Sinistra */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amministrato da</label>
                  <input 
                    type="text" 
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    disabled={formData.adminNotPresent}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Nome Amministratore o Studio"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefono Amm.</label>
                    <input 
                      type="text" 
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      disabled={formData.adminNotPresent}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cellulare Amm.</label>
                    <input 
                      type="text" 
                      name="adminMobile"
                      value={formData.adminMobile}
                      onChange={handleChange}
                      disabled={formData.adminNotPresent}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Numero Verde Amm.</label>
                  <input 
                    type="text" 
                    name="adminTollFree"
                    value={formData.adminTollFree}
                    onChange={handleChange}
                    disabled={formData.adminNotPresent}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Colonna Destra */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail Amm.</label>
                  <input 
                    type="email" 
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    disabled={formData.adminNotPresent}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">IBAN Fabbricato</label>
                  <input 
                    type="text" 
                    name="buildingIban"
                    value={formData.buildingIban}
                    onChange={handleChange}
                    disabled={formData.adminNotPresent}
                    maxLength={27}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono"
                    placeholder="IT00X0000000000000000000000"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">IT + 25 caratteri</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors"
          >
            Annulla
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <Save size={18} />
            Salva Fabbricato
          </button>
        </div>

      </div>
    </div>
  );
};
