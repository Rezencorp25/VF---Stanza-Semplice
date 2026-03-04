import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle, AlertTriangle, Loader2, Eye, EyeOff, Clock } from 'lucide-react';
import { Collaborator, CollaboratorRole } from '../../types';
import { MOCK_COMPETENCE_GROUPS } from '../../constants';
import { useAgencies } from '../../hooks/useAgencies';

interface CollaboratorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
  onSave: (data: Partial<Collaborator>) => void;
}

export const CollaboratorFormModal: React.FC<CollaboratorFormModalProps> = ({ 
  isOpen, 
  onClose, 
  collaborator, 
  onSave 
}) => {
  const { agencies } = useAgencies();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    branchId: '',
    competenceGroups: [] as string[],
    role: 'CITY_MANAGER' as CollaboratorRole | 'ADMINISTRATION' | 'PROPERTY_MANAGER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);

  useEffect(() => {
    if (collaborator) {
      setFormData({
        firstName: collaborator.firstName || '',
        lastName: collaborator.lastName || '',
        email: collaborator.email || '',
        branchId: collaborator.branchId || '',
        competenceGroups: collaborator.assignedGroupIds || [],
        role: collaborator.role || 'CITY_MANAGER',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        branchId: '',
        competenceGroups: [],
        role: 'CITY_MANAGER',
      });
    }
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowTempPassword(false);
  }, [collaborator, isOpen]);

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome obbligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'Cognome obbligatorio';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.branchId) newErrors.branchId = 'Filiale obbligatoria';
    if (formData.competenceGroups.length === 0) newErrors.competenceGroups = 'Seleziona almeno un gruppo';
    if (!formData.role) newErrors.role = 'Ruolo obbligatorio';

    setErrors(newErrors);
  }, [formData]);

  if (!isOpen) return null;

  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => {
      const current = prev.competenceGroups;
      const updated = current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId];
      return { ...prev, competenceGroups: updated };
    });
    setTouched(prev => ({ ...prev, competenceGroups: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call delay if needed, or just proceed
      // In a real app, you might validate email uniqueness here if adding
      
      onSave({
        ...formData,
        role: formData.role as CollaboratorRole,
        assignedGroupIds: formData.competenceGroups,
        // Map branchId to branch name if needed, or just store ID. 
        // The type has branchId now.
        branchId: formData.branchId,
        status: collaborator ? collaborator.status : 'active',
      });
      
      // If creating new, show success message
      if (!collaborator) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        onClose();
      }

    } catch (error: any) {
      setSubmitError(error.message || 'Si è verificato un errore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter groups based on selected branch
  // Note: MOCK_COMPETENCE_GROUPS uses 'agency' name string, but we are using IDs now.
  // We need to match branchId to agency name or ID.
  // Assuming MOCK_COMPETENCE_GROUPS has agency name matching MOCK_AGENCIES name.
  // But we are using useAgencies which returns agencies with IDs.
  // We should probably filter by agency ID if competence groups had it.
  // MOCK_COMPETENCE_GROUPS has 'agency' field which is a string name.
  // Let's find the agency name from the selected branchId.
  const selectedAgency = agencies.find(a => a.id === formData.branchId);
  const availableGroups = selectedAgency 
    ? MOCK_COMPETENCE_GROUPS.filter(g => g.agency === selectedAgency.name)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">
              {collaborator ? 'Modifica Collaboratore' : 'Nuovo Collaboratore'}
            </h2>
            {collaborator?.mustChangePassword && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                <Clock size={12} />
                In attesa di primo accesso
              </span>
            )}
          </div>
          {!isSubmitting && !submitSuccess && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          )}
        </div>

        {submitSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Collaboratore Creato!</h3>
            <p className="text-slate-600 max-w-sm">
              L'account per <strong>{formData.firstName} {formData.lastName}</strong> è stato creato con successo.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4 w-full max-w-md">
              <p className="text-sm text-slate-600">
                Email di conferma inviata a:<br/>
                <strong className="text-slate-800">{formData.email}</strong>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{submitError}</p>
              </div>
            )}

            {collaborator?.mustChangePassword && collaborator.passwordTemporanea && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
                <h3 className="text-sm font-bold text-amber-800 mb-2">Credenziali Temporanee</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 block">Password Temporanea</label>
                    <div className="relative">
                      <input 
                        type={showTempPassword ? "text" : "password"}
                        value={collaborator.passwordTemporanea}
                        readOnly
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-amber-900 font-mono text-sm outline-none pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowTempPassword(!showTempPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                      >
                        {showTempPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-amber-700 mt-5">
                      Il collaboratore dovrà cambiare questa password al primo accesso.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Nome *</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  onBlur={() => handleBlur('firstName')}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${touched.firstName && errors.firstName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="Inserisci il nome"
                />
                {touched.firstName && errors.firstName && <p className="text-xs text-red-500 font-medium">{errors.firstName}</p>}
              </div>

              {/* Cognome */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Cognome *</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  onBlur={() => handleBlur('lastName')}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${touched.lastName && errors.lastName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                  placeholder="Inserisci il cognome"
                />
                {touched.lastName && errors.lastName && <p className="text-xs text-red-500 font-medium">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onBlur={() => handleBlur('email')}
                  disabled={isSubmitting || !!collaborator}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${touched.email && errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'} ${!!collaborator ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                  placeholder="email@stanzasemplice.com"
                />
                {touched.email && errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                {!!collaborator && <p className="text-xs text-slate-400 italic">Per cambiare l'email contatta il supporto.</p>}
              </div>

              {/* Ruolo */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Ruolo *</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  onBlur={() => handleBlur('role')}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${touched.role && errors.role ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                >
                  <option value="ADMINISTRATION">Amministrazione</option>
                  <option value="PROPERTY_MANAGER">Property Manager</option>
                  <option value="CITY_MANAGER">City Manager</option>
                  <option value="OPERATOR">Operatore</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                {touched.role && errors.role && <p className="text-xs text-red-500 font-medium">{errors.role}</p>}
              </div>

              {/* Filiale */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Filiale *</label>
                <select 
                  value={formData.branchId}
                  onChange={(e) => {
                    setFormData({...formData, branchId: e.target.value, competenceGroups: []});
                  }}
                  onBlur={() => handleBlur('branchId')}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${touched.branchId && errors.branchId ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                >
                  <option value="">Seleziona una filiale...</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                  ))}
                </select>
                {touched.branchId && errors.branchId && <p className="text-xs text-red-500 font-medium">{errors.branchId}</p>}
              </div>

              {/* Gruppi di Competenza */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Gruppi di Competenza *</label>
                <div className={`border rounded-xl p-3 max-h-48 overflow-y-auto bg-slate-50 ${touched.competenceGroups && errors.competenceGroups ? 'border-red-300' : 'border-slate-200'}`}>
                  {!formData.branchId ? (
                    <p className="text-sm text-slate-500 italic text-center py-4">Seleziona prima una filiale</p>
                  ) : availableGroups.length === 0 ? (
                    <p className="text-sm text-slate-500 italic text-center py-4">Nessun gruppo disponibile per questa filiale</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableGroups.map(group => (
                        <label key={group.id} className="flex items-start gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                          <input 
                            type="checkbox"
                            checked={formData.competenceGroups.includes(group.id)}
                            onChange={() => handleGroupToggle(group.id)}
                            disabled={isSubmitting}
                            className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{group.name}</span>
                            <span className="text-xs text-slate-500">{group.code}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {touched.competenceGroups && errors.competenceGroups && <p className="text-xs text-red-500 font-medium">{errors.competenceGroups}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-8">
              <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button 
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creazione in corso...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {collaborator ? 'Salva Modifiche' : 'Crea Collaboratore'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

