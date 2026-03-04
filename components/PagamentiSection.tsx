
import React, { useState } from 'react';
import { PagamentiLista } from './PagamentiLista';
import { CheckCircle2, X } from 'lucide-react';

export const PagamentiSection: React.FC = () => {
  const [pagamentiLocali, setPagamentiLocali] = useState<any[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleNuovoPagamento = (newPayment: any) => {
    setPagamentiLocali(prev => [newPayment, ...prev]);
    setToast({
      visible: true,
      message: `Pagamento di €${newPayment.importo_ricevuto} aggiunto con successo!`
    });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    setIsFormOpen(false); // Chiude il form dopo il salvataggio
  };

  return (
    <div className="animate-in fade-in duration-500 w-full h-[calc(100vh-100px)] flex flex-col">
      
      {/* Contenitore unico che gestisce il layout interno */}
      <PagamentiLista 
        pagamentiAggiuntivi={pagamentiLocali} 
        isFormOpen={isFormOpen}
        onToggleForm={() => setIsFormOpen(!isFormOpen)}
        onPagamentoSalvato={handleNuovoPagamento}
      />

      {/* GLOBAL TOAST */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 duration-300 max-w-[calc(100vw-2rem)]">
          <div className="bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] flex items-center gap-3 border border-emerald-500/50 backdrop-blur-sm">
            <div className="p-1 bg-white/20 rounded-full shrink-0">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">Operazione completata</p>
              <p className="text-xs text-emerald-100 truncate">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast({ ...toast, visible: false })}
              className="ml-2 text-emerald-200 hover:text-white transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
