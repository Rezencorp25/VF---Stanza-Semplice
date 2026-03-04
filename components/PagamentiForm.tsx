
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, User, CheckCircle2, Calendar, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_INQUILINI } from '../financialTypes';

interface PagamentiFormProps {
  onPagamentoSalvato: (pagamento: any) => void;
  onClose: () => void;
}

export const PagamentiForm: React.FC<PagamentiFormProps> = ({ onPagamentoSalvato, onClose }) => {
  // --- STATO ---
  const [searchText, setSearchText] = useState('');
  const [risultatiRicerca, setRisultatiRicerca] = useState<typeof MOCK_INQUILINI>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inquilinoSelezionato, setInquilinoSelezionato] = useState<typeof MOCK_INQUILINI[0] | null>(null);
  
  const [formData, setFormData] = useState({
    importo: '',
    data_incasso: new Date().toISOString().split('T')[0],
    note: ''
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 1) {
      const filtered = MOCK_INQUILINI.filter(i => 
        `${i.nome} ${i.cognome}`.toLowerCase().includes(text.toLowerCase()) ||
        i.appartamento_nome.toLowerCase().includes(text.toLowerCase())
      );
      setRisultatiRicerca(filtered);
      setShowDropdown(true);
    } else {
      setRisultatiRicerca([]);
      setShowDropdown(false);
    }
  };

  const handleSelectInquilino = (inquilino: typeof MOCK_INQUILINI[0]) => {
    setInquilinoSelezionato(inquilino);
    setSearchText(`${inquilino.nome} ${inquilino.cognome}`);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!inquilinoSelezionato || !formData.importo) return;

    const newPayment = {
      id: `pay_new_${Date.now()}`,
      tipo: 'Pagamento',
      data_pagamento: formData.data_incasso,
      importo_ricevuto: parseFloat(formData.importo),
      effettuato_da: {
        inquilino_id: inquilinoSelezionato.id,
        nome_completo: `${inquilinoSelezionato.nome} ${inquilinoSelezionato.cognome}`,
        id_display: inquilinoSelezionato.id
      },
      pagante: null,
      note: formData.note,
      importato_automaticamente: false,
      stripe_payment_id: null,
      n_pagamenti_uguali_stessa_data: 1,
      citta: inquilinoSelezionato.citta,
      mese_competenza: format(new Date(), 'yyyy-MM')
    };

    onPagamentoSalvato(newPayment);
  };

  // UI Components
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 ring-4 ring-orange-50/50">
      
      {/* Header Form */}
      <div className="px-6 py-4 border-b border-orange-100/50 flex justify-between items-center bg-orange-50/30">
        <div>
          <h3 className="text-base font-bold text-slate-800">Nuovo Pagamento</h3>
          <p className="text-xs text-slate-500">Registra rapidamente un nuovo incasso manuale.</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4">
          
          {/* SEARCH BAR ROW */}
          <div className="flex gap-3 relative" ref={searchRef}>
             <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cerca inquilino o appartamento..."
                  className={`
                    w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all
                    ${inquilinoSelezionato 
                      ? 'border-green-500/50 ring-2 ring-green-500/10 text-green-700 font-bold bg-green-50/10' 
                      : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-slate-700'}
                  `}
                  autoComplete="off"
                />
                {inquilinoSelezionato && (
                  <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
                )}
             </div>

             {!inquilinoSelezionato && (
               <button className="px-6 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-200 hover:bg-[#ea580c] transition-all">
                 Cerca
               </button>
             )}

             {/* DROPDOWN RESULTS */}
             {showDropdown && risultatiRicerca.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-y-auto custom-scrollbar">
                  {risultatiRicerca.map(inquilino => (
                    <div 
                      key={inquilino.id}
                      onClick={() => handleSelectInquilino(inquilino)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                        {inquilino.nome.charAt(0)}{inquilino.cognome.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{inquilino.nome} {inquilino.cognome}</p>
                        <p className="text-[11px] text-slate-500 truncate">{inquilino.appartamento_nome}</p>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>

          {/* DETAILS ROW (Visible only after selection) */}
          {inquilinoSelezionato && (
            <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-top-2 pt-2">
               
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Importo"
                    value={formData.importo}
                    onChange={(e) => setFormData({...formData, importo: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
               </div>

               <div className="flex-1 relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date"
                    value={formData.data_incasso}
                    onChange={(e) => setFormData({...formData, data_incasso: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-slate-600"
                  />
               </div>

               <div className="flex-[2]">
                  <input 
                    type="text"
                    placeholder="Note aggiuntive (opzionale)..."
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
               </div>

               <button 
                 onClick={handleSubmit}
                 disabled={!formData.importo}
                 className="px-8 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-200 hover:bg-[#ea580c] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
               >
                 Registra Incasso
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
