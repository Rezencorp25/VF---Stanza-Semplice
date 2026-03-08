import React, { useState } from 'react';
import { ModalPortal } from './ModalPortal';
import { Eye, EyeOff, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

interface ForcePasswordChangeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const ForcePasswordChangeModal: React.FC<ForcePasswordChangeModalProps> = ({ 
  isOpen, 
  onSuccess 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calcolo forza password
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score < 2) return { score, label: 'Debole', color: 'bg-red-500' };
    if (score < 4) return { score, label: 'Media', color: 'bg-yellow-500' };
    return { score, label: 'Forte', color: 'bg-emerald-500' };
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulazione aggiornamento Firebase Auth e Firestore
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 1. admin.auth().updateUser(uid, { password })
      // 2. db.collection('users').doc(uid).update({ mustChangePassword: false })
      
      onSuccess();
    } catch (err) {
      setError('Si è verificato un errore durante l\'aggiornamento della password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header con pattern decorativo */}
        <div className="bg-orange-500 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-500 mb-4 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Benvenuto!</h2>
            <p className="text-orange-100 text-sm font-medium">Imposta la tua nuova password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Per motivi di sicurezza, è necessario scegliere una nuova password personale al primo accesso.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Nuova Password */}
            <div className="space-y-1.5 relative">
              <label className="text-sm font-bold text-slate-700">Nuova Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all pr-10"
                  placeholder="Minimo 8 caratteri"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Indicatore di forza */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2 animate-in fade-in">
                  <div className="flex-1 flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'} transition-colors duration-300`}></div>
                    <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'} transition-colors duration-300`}></div>
                    <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'} transition-colors duration-300`}></div>
                    <div className={`flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-200'} transition-colors duration-300`}></div>
                  </div>
                  <span className={`text-xs font-bold ${strength.score < 2 ? 'text-red-500' : strength.score < 4 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Conferma Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Conferma Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                placeholder="Ripeti la password"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !password || !confirmPassword}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvataggio in corso...
              </>
            ) : (
              'Salva e Accedi'
            )}
          </button>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
};
