import React from 'react';
import { Copy, Link, CheckCircle2, Clock, FileInput, CreditCard, ArrowRight, ExternalLink } from 'lucide-react';

interface TabFormPagamentoProps {
  formLink: string | null;
  isFormCompleted: boolean;
  isPaymentCompleted: boolean;
  onGenerateLink: () => void;
  onCopyLink: () => void;
}

export const TabFormPagamento: React.FC<TabFormPagamentoProps> = ({
  formLink,
  isFormCompleted,
  isPaymentCompleted,
  onGenerateLink,
  onCopyLink
}) => {
  
  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 min-h-[400px]";
  const cardClasses = "bg-slate-50 rounded-xl border border-slate-200 p-5";

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <CreditCard size={20} className="text-orange-500" />
          Form & Pagamento
        </h3>
        <p className="text-slate-500 text-sm">Gestione flusso di onboarding digitale e pagamenti Stripe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Colonna Sinistra: Link e Stato Form */}
        <div className="space-y-6">
          
          {/* Link Compilazione */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                 <Link size={20} />
               </div>
               <div>
                 <h4 className="text-slate-800 font-bold text-sm">Link di Onboarding</h4>
                 <p className="text-xs text-slate-500">Da inviare all'inquilino per inserimento dati</p>
               </div>
            </div>

            {formLink ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-slate-600 text-xs truncate flex-1 font-mono select-all font-medium">
                    {formLink}
                  </span>
                  <button 
                    onClick={onCopyLink}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    title="Copia Link"
                  >
                    <Copy size={14} />
                  </button>
                  <a 
                    href={formLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Apri Link"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="flex items-center gap-2 mt-2">
                   <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                     ${isFormCompleted 
                       ? 'bg-green-100 text-green-700 border-green-200' 
                       : 'bg-amber-100 text-amber-700 border-amber-200'}
                   `}>
                     {isFormCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                     {isFormCompleted ? 'Compilazione Completata' : 'In attesa compilazione'}
                   </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <button 
                  onClick={onGenerateLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Link size={16} />
                  Genera Link
                </button>
              </div>
            )}
          </div>

          {/* Stato Pagamento Stripe */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-sm">
                 <CreditCard size={20} />
               </div>
               <div>
                 <h4 className="text-slate-800 font-bold text-sm">Stato Pagamento (Stripe)</h4>
                 <p className="text-xs text-slate-500">Verifica automatica del pagamento iniziale</p>
               </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <span className="text-slate-500 text-sm font-medium">Stato attuale:</span>
               <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border
                 ${isPaymentCompleted 
                   ? 'bg-green-100 text-green-700 border-green-200' 
                   : 'bg-slate-100 text-slate-500 border-slate-200'}
               `}>
                 {isPaymentCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                 {isPaymentCompleted ? 'Pagamento Ricevuto' : 'In attesa pagamento'}
               </span>
            </div>
            
            {!isPaymentCompleted && formLink && (
              <p className="text-[10px] text-slate-500 mt-3 italic text-center">
                Il link di pagamento è incluso nel form inviato all'inquilino.
              </p>
            )}
          </div>

        </div>

        {/* Colonna Destra: Info Flusso */}
        <div className={cardClasses}>
          <h4 className="text-slate-800 font-bold text-sm mb-6">Flusso di Onboarding</h4>
          
          <div className="relative space-y-8 pl-2">
            {/* Linea verticale connettiva */}
            <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-slate-200"></div>

            {/* Step 1 */}
            <div className="relative flex items-start gap-4">
               <div className={`
                 relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors shadow-sm
                 ${formLink ? 'bg-white border-green-500 text-green-500' : 'bg-white border-slate-200 text-slate-300'}
               `}>
                 <Link size={18} />
               </div>
               <div>
                 <h5 className={`font-bold text-sm ${formLink ? 'text-green-700' : 'text-slate-400'}`}>Generazione Link</h5>
                 <p className="text-xs text-slate-500 mt-0.5">Genera e invia il link univoco all'inquilino via email o WhatsApp.</p>
               </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-4">
               <div className={`
                 relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors shadow-sm
                 ${isFormCompleted ? 'bg-white border-green-500 text-green-500' : 'bg-white border-slate-200 text-slate-300'}
               `}>
                 <FileInput size={18} />
               </div>
               <div>
                 <h5 className={`font-bold text-sm ${isFormCompleted ? 'text-green-700' : 'text-slate-400'}`}>Compilazione Dati</h5>
                 <p className="text-xs text-slate-500 mt-0.5">L'inquilino inserisce i suoi dati, carica i documenti e i dati del garante.</p>
               </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-4">
               <div className={`
                 relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors shadow-sm
                 ${isPaymentCompleted ? 'bg-white border-green-500 text-green-500' : 'bg-white border-slate-200 text-slate-300'}
               `}>
                 <CreditCard size={18} />
               </div>
               <div>
                 <h5 className={`font-bold text-sm ${isPaymentCompleted ? 'text-green-700' : 'text-slate-400'}`}>Pagamento</h5>
                 <p className="text-xs text-slate-500 mt-0.5">Al termine del form, l'inquilino paga deposito e prima mensilità via Stripe.</p>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200">
             <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                <ArrowRight size={16} className="text-orange-500" />
                <p className="text-xs text-orange-800">
                  Completati questi passaggi, la prenotazione passerà automaticamente allo stato <span className="font-bold">Attiva</span>.
                </p>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
