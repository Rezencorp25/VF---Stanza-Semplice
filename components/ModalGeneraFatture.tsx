import React, { useState } from 'react';
import { ModalPortal } from './ModalPortal';
import { format, parse } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Info
} from 'lucide-react';

interface ModalGeneraFattureProps {
  isOpen: boolean;
  onClose: () => void;
  onConferma: (options: { isDraft: boolean }) => void;
  meseSelezionatoStr: string; // Changed from Date to string 'yyyy-MM'
}

export const ModalGeneraFatture: React.FC<ModalGeneraFattureProps> = ({
  isOpen,
  onClose,
  onConferma,
  meseSelezionatoStr
}) => {
  const [isDraft, setIsDraft] = useState(true);
  
  if (!isOpen) return null;

  // Safe parsing from string 'yyyy-MM'
  let monthLabel = '';
  try {
    const parsedDate = parse(meseSelezionatoStr, 'yyyy-MM', new Date());
    monthLabel = format(parsedDate, 'MMMM yyyy', { locale: it });
  } catch (e) {
    monthLabel = meseSelezionatoStr;
  }

  /*
    LOGICA PRODUZIONE — Firestore batch:
    1. Query prenotazioni: stato='confermata' OR 'attiva' AND data_fine >= inizio_mese AND data_inizio <= fine_mese
    2. Per ogni prenotazione: controlla esistenza fattura con stesso prenotazione_id e mese_competenza
    3. Se non esiste: prepara documento da creare in collection 'fatture' con stato='bozza'
    4. Usa Firestore batch write per atomicità (max 500 doc per batch)
  */

  // Mock list per anteprima
  const previewItems = [
    { id: 1, name: 'Mario Rossi', initials: 'MR', apt: 'Via Roma 10, Int. 1', amount: 450 },
    { id: 2, name: 'Luca Verdi', initials: 'LV', apt: 'Corso Italia 45, Int. B', amount: 600 },
    { id: 3, name: 'Sofia Neri', initials: 'SN', apt: 'Via Napoli 12, Int. 3', amount: 500 },
    { id: 4, name: 'Giulia Bianchi', initials: 'GB', apt: 'Piazza Verdi 3, Int. A', amount: 550 },
    { id: 5, name: 'Marco Gialli', initials: 'MG', apt: 'Viale Kennedy 88, Int. 4', amount: 480 },
  ];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Box */}
      <div className="relative bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Genera Fatture</h2>
              <p className="text-sm font-medium text-slate-500 capitalize">{monthLabel}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          {/* Preview Card */}
          <div className="bg-[#F8F7FF] rounded-xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} /> Anteprima generazione
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                <span><span className="font-bold text-slate-800">22</span> prenotazioni attive trovate</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-[18px] flex justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /></div>
                <span><span className="font-bold text-slate-800">3</span> fatture già esistenti (skip automatico)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-orange-700 bg-orange-50 p-2 rounded-lg border border-orange-100">
                <Zap size={18} className="text-orange-500" fill="currentColor" />
                <span><span className="font-bold">19</span> nuove fatture da generare</span>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="mt-4 pt-4 border-t border-slate-200 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {previewItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 hover:bg-white/50 rounded-lg px-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{item.apt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-slate-800">€{item.amount},00</p>
                    <p className="text-[10px] text-slate-400 capitalize">{monthLabel}</p>
                  </div>
                </div>
              ))}
              <div className="text-center py-2 text-xs text-slate-400 italic">
                ...altre 14 fatture
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mt-6 space-y-4">
            
            {/* Toggle Bozza */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Crea come Bozza</span>
                <span className="text-xs text-slate-500">Permette di revisionare prima dell'invio</span>
              </div>
              <button 
                onClick={() => setIsDraft(!isDraft)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isDraft ? 'bg-orange-500' : 'bg-slate-200'}`}
              >
                <span 
                  className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition duration-200 ease-in-out mt-0.5 ml-0.5 ${isDraft ? 'translate-x-6' : 'translate-x-0'}`} 
                />
              </button>
            </div>

            {/* Toggle Email (Disabled) */}
            <div className="flex items-center justify-between opacity-60">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Notifica email inquilino</span>
                  <div className="group relative">
                    <Info size={14} className="text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                      Funzionalità disponibile in produzione
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">Invia PDF cortesia automaticamente</span>
              </div>
              <button 
                disabled
                className="relative w-12 h-6 rounded-full bg-slate-100 cursor-not-allowed"
              >
                <span className="inline-block w-5 h-5 bg-white rounded-full shadow mt-0.5 ml-0.5 border border-slate-200" />
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 z-10">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors border border-transparent"
          >
            Annulla
          </button>
          <button 
            onClick={() => onConferma({ isDraft })}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            Genera 19 Fatture
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
};