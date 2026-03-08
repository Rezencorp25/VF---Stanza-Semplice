
import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { Property } from '../types';
import { X, Save, MapPin, Map, Building2, User, Phone, Mail, CheckSquare, ExternalLink } from 'lucide-react';

interface BuildingDrawerProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSave?: (updatedProperty: Property) => void;
}

export const BuildingDrawer: React.FC<BuildingDrawerProps> = ({
  isOpen,
  property,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Property | null>(null);

  useEffect(() => {
    if (property) {
      setFormData({ ...property });
    }
  }, [property]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData && onSave) {
      onSave(formData);
    }
    onClose();
  };

  const getOpenStreetMapUrl = () => {
    const parts = [
      formData.toponym,
      formData.streetName || formData.address,
      formData.municipality || formData.city,
      formData.zipCode,
      formData.province,
      formData.country
    ].filter(Boolean).join(' ');
    
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(parts)}`;
  };

  // Stili UI ispirati all'immagine
  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const inputClass = "w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-300 font-medium";
  const cardClass = "bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-full";
  const headerIconClass = "p-2 bg-orange-50 text-orange-600 rounded-lg mr-3";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-[#F8F9FB] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-5 bg-white border-b border-slate-200 flex justify-between items-center z-10">
          <div>
             <h2 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                VISUALIZZA FABBRICATO
             </h2>
             <p className="text-sm text-slate-500 mt-0.5 font-medium">Dettagli anagrafici e configurazione immobile</p>
          </div>
          <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center gap-2"
          >
              <X size={16} /> Chiudi
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLONNA SINISTRA: FABBRICATO */}
            <div className={cardClass}>
              <div className="flex items-center mb-6">
                <div className={headerIconClass}>
                  <Building2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Fabbricato</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Città*</label>
                  <input 
                    type="text" 
                    value={formData.city || ''} 
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={inputClass}
                    placeholder="Es. Milano"
                  />
                </div>
                
                <div>
                  <label className={labelClass}>Nome quartiere</label>
                  <input 
                    type="text" 
                    value={formData.neighborhood || ''} 
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    className={inputClass}
                    placeholder="Es. Centro Storico"
                  />
                </div>

                <div>
                  <label className={labelClass}>Nome condominio</label>
                  <input 
                    type="text" 
                    value={formData.condoName || ''} 
                    onChange={(e) => handleChange('condoName', e.target.value)}
                    className={inputClass}
                    placeholder="Es. Condominio Roma"
                  />
                </div>

                <div>
                  <label className={labelClass}>Codice Fiscale</label>
                  <input 
                    type="text" 
                    value={formData.taxCode || ''} 
                    onChange={(e) => handleChange('taxCode', e.target.value)}
                    className={inputClass}
                    placeholder="80012345678"
                  />
                </div>

                <div>
                  <label className={labelClass}>Contesto*</label>
                  <div className="relative">
                      <select 
                        value={formData.context || ''}
                        onChange={(e) => handleChange('context', e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Seleziona contesto...</option>
                        <option value="residenziale">Normale - Residenziale classico</option>
                        <option value="centro">Centro Storico</option>
                        <option value="periferia">Periferia</option>
                        <option value="popolare">Popolare</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                      </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Descrizione contesto</label>
                  <textarea 
                    rows={4}
                    value={formData.contextDesc || ''} 
                    onChange={(e) => handleChange('contextDesc', e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Zona residenziale tranquilla ben collegata..."
                  />
                </div>
              </div>
            </div>

            {/* COLONNA DESTRA: INDIRIZZO & POSIZIONE */}
            <div className="flex flex-col gap-6">
                
                {/* Card Indirizzo */}
                <div className={`${cardClass} h-auto`}>
                    <div className="flex items-center mb-6">
                        <div className={headerIconClass}>
                          <MapPin size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Indirizzo</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="flex gap-4">
                            <div className="w-1/3">
                              <label className={labelClass}>Toponimo*</label>
                              <div className="relative">
                                  <select 
                                      value={formData.toponym || 'Via'}
                                      onChange={(e) => handleChange('toponym', e.target.value)}
                                      className={`${inputClass} appearance-none cursor-pointer`}
                                  >
                                      <option value="Via">Via</option>
                                      <option value="Viale">Viale</option>
                                      <option value="Piazza">Piazza</option>
                                      <option value="Corso">Corso</option>
                                  </select>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                                  </div>
                              </div>
                            </div>
                            <div className="w-2/3">
                              <label className={labelClass}>Indirizzo*</label>
                              <input 
                                  type="text" 
                                  value={formData.streetName || formData.address || ''} 
                                  onChange={(e) => handleChange('streetName', e.target.value)}
                                  className={inputClass}
                                  placeholder="Roma 10"
                              />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Comune</label>
                            <input 
                                type="text" 
                                value={formData.municipality || formData.city || ''} 
                                onChange={(e) => handleChange('municipality', e.target.value)}
                                className={inputClass}
                                placeholder="Milano"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                              <label className={labelClass}>CAP</label>
                              <input 
                                  type="text" 
                                  value={formData.zipCode || ''} 
                                  onChange={(e) => handleChange('zipCode', e.target.value)}
                                  className={inputClass}
                                  placeholder="20121"
                              />
                            </div>
                            <div className="w-1/2">
                              <label className={labelClass}>Provincia</label>
                              <input 
                                  type="text" 
                                  value={formData.province || ''} 
                                  onChange={(e) => handleChange('province', e.target.value)}
                                  className={`${inputClass} uppercase`}
                                  maxLength={2}
                                  placeholder="MI"
                              />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Nazione</label>
                            <input 
                                type="text" 
                                value={formData.country || 'Italia'} 
                                onChange={(e) => handleChange('country', e.target.value)}
                                className={inputClass}
                                placeholder="Italia"
                            />
                        </div>
                    </div>
                </div>

                {/* Card Posizione Geografica */}
                <div className={`${cardClass} h-auto relative overflow-hidden group border-blue-100`}>
                    <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none">
                        <Map size={140} />
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mr-3">
                          <Map size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Posizione Geografica</h3>
                    </div>
                    
                    <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">
                        Le coordinate sono calcolate automaticamente. Verifica la posizione esatta.
                    </p>
                    
                    <a 
                        href={getOpenStreetMapUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 relative z-10"
                    >
                        Aggiorna Coordinate
                    </a>
                </div>

            </div>
          </div>

          {/* SEZIONE AMMINISTRATORE (Full Width) */}
          <div className={`mt-6 ${cardClass}`}>
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={headerIconClass}>
                      <User size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Amministratore</h3>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.noAdmin ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-300'}`}>
                          <CheckSquare size={14} strokeWidth={3} />
                      </div>
                      <input 
                          type="checkbox" 
                          className="hidden"
                          checked={formData.noAdmin || false}
                          onChange={(e) => handleChange('noAdmin', e.target.checked)}
                      />
                      <span className="text-xs font-bold text-slate-500 uppercase">Non presente</span>
                  </label>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 ${formData.noAdmin ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
                  <div className="md:col-span-1">
                      <label className={labelClass}>Nome / Studio</label>
                      <input 
                          type="text" 
                          value={formData.adminName || ''} 
                          onChange={(e) => handleChange('adminName', e.target.value)}
                          placeholder="Studio Gestione Immobili"
                          className={inputClass}
                      />
                  </div>
                  <div>
                      <label className={labelClass}>Telefono</label>
                      <input 
                          type="text" 
                          value={formData.adminPhone || ''} 
                          onChange={(e) => handleChange('adminPhone', e.target.value)}
                          className={inputClass}
                      />
                  </div>
                  <div>
                      <label className={labelClass}>Email</label>
                      <input 
                          type="email" 
                          value={formData.adminEmail || ''} 
                          onChange={(e) => handleChange('adminEmail', e.target.value)}
                          className={inputClass}
                      />
                  </div>
              </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-slate-200 flex justify-end gap-4 z-10">
            <button 
                onClick={onClose}
                className="px-6 py-3 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
            >
                Annulla
            </button>
            <button 
                onClick={handleSave}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
                <Save size={18} />
                Salva Modifiche
            </button>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
};
