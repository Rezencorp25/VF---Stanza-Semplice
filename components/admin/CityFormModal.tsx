import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Upload } from 'lucide-react';
import { City, GeographicArea } from '../../types';

interface CityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
  onSave: (data: Partial<City>) => void;
}

const REGIONS = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 
  'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 
  'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 
  'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
];

const AREAS: GeographicArea[] = ['Nord-ovest', 'Nord-est', 'Centro', 'Sud', 'Isole'];

export const CityFormModal: React.FC<CityFormModalProps> = ({ 
  isOpen, 
  onClose, 
  city, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Partial<City>>({
    code: '',
    name: '',
    province: '',
    region: 'Lombardia',
    area: 'Nord-ovest',
    marketValuePerSqm: 0,
    publicName: '',
    description: '',
    status: 'active',
    coordinates: { lat: 0, lng: 0 },
    imageUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (city) {
      setFormData(city);
    } else {
      setFormData({
        code: '',
        name: '',
        province: '',
        region: 'Lombardia',
        area: 'Nord-ovest',
        marketValuePerSqm: 0,
        publicName: '',
        description: '',
        status: 'active',
        coordinates: { lat: 0, lng: 0 },
        imageUrl: ''
      });
    }
    setErrors({});
  }, [city, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code) newErrors.code = 'Sigla obbligatoria';
    else if (formData.code.length > 3) newErrors.code = 'Max 3 caratteri';
    
    if (!formData.name) newErrors.name = 'Nome obbligatorio';
    if (!formData.province) newErrors.province = 'Provincia obbligatoria';
    else if (formData.province.length !== 2) newErrors.province = 'Esattamente 2 caratteri';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {city ? 'Modifica Città' : 'Nuova Città'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
              Dati Generali
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Sigla *</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.code ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="MIL"
                  maxLength={3}
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome Città *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="Milano"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Provincia *</label>
                <input 
                  type="text" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.province ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="MI"
                  maxLength={2}
                />
                {errors.province && <p className="text-xs text-red-500">{errors.province}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Regione *</label>
                <select 
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Area *</label>
                <select 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value as GeographicArea})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Market & Portal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              Mercato e Portale
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Valore medio al mq (€)</label>
                <input 
                  type="number" 
                  value={formData.marketValuePerSqm}
                  onChange={(e) => setFormData({...formData, marketValuePerSqm: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="3000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome sul sito</label>
                <input 
                  type="text" 
                  value={formData.publicName}
                  onChange={(e) => setFormData({...formData, publicName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Milano"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Descrizione breve</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                maxLength={300}
                placeholder="Descrizione per il portale pubblico..."
              />
              <div className="text-xs text-right text-slate-400">
                {formData.description?.length || 0}/300
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Immagine (URL)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://..."
                />
                <button type="button" className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                  <Upload size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Location & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
              Posizione e Stato
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Latitudine</label>
                <input 
                  type="number" 
                  step="any"
                  value={formData.coordinates?.lat}
                  onChange={(e) => setFormData({
                    ...formData, 
                    coordinates: { ...formData.coordinates!, lat: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Longitudine</label>
                <input 
                  type="number" 
                  step="any"
                  value={formData.coordinates?.lng}
                  onChange={(e) => setFormData({
                    ...formData, 
                    coordinates: { ...formData.coordinates!, lng: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Stato Città</label>
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
            Salva Città
          </button>
        </div>

      </div>
    </div>
  );
};
