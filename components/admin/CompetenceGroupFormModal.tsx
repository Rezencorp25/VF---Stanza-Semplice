import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CompetenceGroup } from '../../types';
import { MOCK_COLLABORATORS } from '../../constants';
import { useCities } from '../../hooks/useCities';

interface CompetenceGroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: CompetenceGroup | null;
  onSave: (data: Partial<CompetenceGroup>) => void;
}

const AGENCIES = ['Stanza Semplice SRL', 'Dueda Rooms SRL'];

export const CompetenceGroupFormModal: React.FC<CompetenceGroupFormModalProps> = ({ 
  isOpen, 
  onClose, 
  group, 
  onSave 
}) => {
  const { cities } = useCities();
  const [formData, setFormData] = useState<Partial<CompetenceGroup>>({
    code: '',
    name: '',
    agency: 'Stanza Semplice SRL',
    cityId: '',
    managerId: '',
    status: 'active',
    notes: '',
    description: '',
    color: '#3B82F6', // Default blue
    collaboratorIds: [],
    objectIds: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (group) {
      setFormData(group);
    } else {
      setFormData({
        code: '',
        name: '',
        agency: 'Stanza Semplice SRL',
        cityId: '',
        managerId: '',
        status: 'active',
        notes: '',
        description: '',
        color: '#3B82F6',
        collaboratorIds: [],
        objectIds: []
      });
    }
    setErrors({});
  }, [group, isOpen]);

  // Auto-generate code and name when city changes
  useEffect(() => {
    if (!group && formData.cityId) {
      const city = cities.find(c => c.id === formData.cityId);
      if (city) {
        // Simple logic to suggest a name/code
        const existingGroupsForCity = 0; // In a real app we'd count existing groups
        const nextNum = existingGroupsForCity + 1;
        const suggestedCode = `${city.name} (${city.code}) ${nextNum}`;
        
        if (!formData.code) setFormData(prev => ({ ...prev, code: suggestedCode }));
        if (!formData.name) setFormData(prev => ({ ...prev, name: `${city.name} Centro` }));
      }
    }
  }, [formData.cityId, group, cities]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.agency) newErrors.agency = 'Agenzia obbligatoria';
    if (!formData.cityId) newErrors.cityId = 'Città obbligatoria';
    if (!formData.name) newErrors.name = 'Nome gruppo obbligatorio';
    if (!formData.code) newErrors.code = 'Codice gruppo obbligatorio';

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {group ? 'Modifica Gruppo' : 'Nuovo Gruppo di Competenza'}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Agenzia / Filiale *</label>
                <select 
                  value={formData.agency}
                  onChange={(e) => setFormData({...formData, agency: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.agency ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                >
                  <option value="">Seleziona agenzia...</option>
                  {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.agency && <p className="text-xs text-red-500">{errors.agency}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Città *</label>
                <select 
                  value={formData.cityId}
                  onChange={(e) => setFormData({...formData, cityId: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.cityId ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                >
                  <option value="">Seleziona città...</option>
                  {cities.filter(c => c.status === 'active').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
                {errors.cityId && <p className="text-xs text-red-500">{errors.cityId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Codice Gruppo *</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${errors.code ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="es. Bologna (BO) 1"
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome Gruppo *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="es. Bologna Centro"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Descrizione</label>
              <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                placeholder="Descrizione del gruppo di competenza..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Colore Identificativo</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={formData.color || '#3B82F6'}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
                />
                <span className="text-sm text-slate-500 font-mono">{formData.color || '#3B82F6'}</span>
              </div>
            </div>
          </div>

          {/* Management & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              Gestione e Stato
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Responsabile Gruppo</label>
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
                <label className="text-sm font-medium text-slate-700">Stato Gruppo</label>
                <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'active'})}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Attivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'inactive'})}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${formData.status === 'inactive' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Inattivo
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Note Operative</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                placeholder="Note interne sul gruppo..."
              />
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
            Salva Gruppo
          </button>
        </div>

      </div>
    </div>
  );
};
