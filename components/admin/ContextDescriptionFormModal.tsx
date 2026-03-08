import React, { useState, useEffect } from 'react';
import { ModalPortal } from '../ModalPortal';
import { X, Save, RefreshCw } from 'lucide-react';
import { ContextDescription } from '../../types';

interface ContextDescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ContextDescription | null;
  onSave: (data: Partial<ContextDescription>) => void;
}

const QUALITY_LEVELS = [
  { value: 4, label: '4 - Alto / Lussuoso' },
  { value: 3, label: '3 - Medio / Borghese' },
  { value: 2, label: '2 - Normale / Residenziale' },
  { value: 1, label: '1 - Popolare / Basso' },
];

const PRESET_COLORS = [
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F97316', // Orange
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#64748B', // Slate
  '#EF4444', // Red
];

export const ContextDescriptionFormModal: React.FC<ContextDescriptionFormModalProps> = ({ 
  isOpen, 
  onClose, 
  context, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Partial<ContextDescription>>({
    name: '',
    code: '',
    qualityLevel: 3,
    color: '#3B82F6',
    description: '',
    internalNotes: '',
    objectsCount: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (context) {
      setFormData(context);
    } else {
      setFormData({
        name: '',
        code: '',
        qualityLevel: 3,
        color: '#3B82F6',
        description: '',
        internalNotes: '',
        objectsCount: 0
      });
    }
    setErrors({});
  }, [context, isOpen]);

  // Auto-generate code from name
  useEffect(() => {
    if (!context && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, code: slug }));
    }
  }, [formData.name, context]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nome contesto obbligatorio';
    if (!formData.code) newErrors.code = 'Codice identificativo obbligatorio';
    if (!formData.description) newErrors.description = 'Descrizione obbligatoria';

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
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {context ? 'Modifica Contesto' : 'Nuovo Contesto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
              Dati Identificativi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome Contesto *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="es. Alto - Lussuoso"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Codice (Slug) *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm ${errors.code ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                    placeholder="es. alto-lussuoso"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const slug = formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData(prev => ({ ...prev, code: slug }));
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Rigenera da nome"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Livello Qualità *</label>
                <select 
                  value={formData.qualityLevel}
                  onChange={(e) => setFormData({...formData, qualityLevel: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {QUALITY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Colore Badge</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({...formData, color: c})}
                        className={`w-6 h-6 rounded-full border border-slate-200 transition-transform hover:scale-110 ${formData.color === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              Contenuti
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Descrizione Default *</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] ${errors.description ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                placeholder="Descrizione dettagliata del contesto..."
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Questa descrizione sarà il default per i nuovi oggetti.</span>
                <span>{formData.description?.length || 0}/500</span>
              </div>
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anteprima Badge & Descrizione</span>
              <div className="flex items-start gap-3">
                <span 
                  className="px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name || 'Nome Contesto'}
                </span>
                <p className="text-sm text-slate-600 italic">
                  {formData.description || 'Nessuna descrizione inserita...'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Note Interne (Admin)</label>
              <textarea 
                value={formData.internalNotes}
                onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                placeholder="Note visibili solo agli amministratori..."
              />
            </div>
          </div>

        </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
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
            Salva Contesto
          </button>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
};
