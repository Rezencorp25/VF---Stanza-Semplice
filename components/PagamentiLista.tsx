
import React, { useState, useMemo } from 'react';
import { 
  Download, 
  MapPin, 
  Wallet,
  LayoutList,
  BarChart3,
  Zap,
  CalendarDays,
  ChevronDown,
  Plus,
  X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { MOCK_PAGAMENTI, TOTALE_PAGAMENTI_DB, CITTA_DISPONIBILI, METODI_PAGAMENTO } from '../financialTypes';
import { PagamentiForm } from './PagamentiForm';

interface PagamentiListaProps {
  pagamentiAggiuntivi?: any[];
  isFormOpen: boolean;
  onToggleForm: () => void;
  onPagamentoSalvato: (p: any) => void;
}

export const PagamentiLista: React.FC<PagamentiListaProps> = ({ 
  pagamentiAggiuntivi = [],
  isFormOpen,
  onToggleForm,
  onPagamentoSalvato
}) => {
  
  // --- STATO FILTRI ---
  const [filtri, setFiltri] = useState({
    data_da: '',
    data_a: '',
    citta: '',
    metodo: '',
    solo_stripe: false
  });

  // --- DATA PROCESSING ---
  const tuttiIPagamenti = useMemo(() => {
    return [...pagamentiAggiuntivi, ...MOCK_PAGAMENTI].sort((a, b) => 
      new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime()
    );
  }, [pagamentiAggiuntivi]);

  const pagamentiFiltrati = useMemo(() => {
    return tuttiIPagamenti.filter(p => {
      if (filtri.data_da && p.data_pagamento < filtri.data_da) return false;
      if (filtri.data_a && p.data_pagamento > filtri.data_a) return false;
      if (filtri.citta && p.citta !== filtri.citta) return false;
      if (filtri.metodo) {
        // Logica semplificata per mock: cerca nelle note o nel flag stripe
        const isStripe = p.importato_automaticamente || (p.note || '').toLowerCase().includes('stripe');
        if (filtri.metodo === 'stripe' && !isStripe) return false;
        if (filtri.metodo !== 'stripe' && !(p.note || '').toLowerCase().includes(filtri.metodo) && !isStripe) return false;
      }
      if (filtri.solo_stripe && !p.importato_automaticamente) return false;
      return true;
    });
  }, [tuttiIPagamenti, filtri]);

  // Raggruppamento per Data
  const groupedPayments = useMemo(() => {
    const groups: Record<string, typeof pagamentiFiltrati> = {};
    pagamentiFiltrati.forEach(p => {
      const dateKey = p.data_pagamento;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(p);
    });
    return groups;
  }, [pagamentiFiltrati]);

  const sortedDates = useMemo(() => Object.keys(groupedPayments).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [groupedPayments]);

  // KPI
  const kpi = useMemo(() => {
    const totale = pagamentiFiltrati.reduce((acc, p) => acc + p.importo_ricevuto, 0);
    const count = pagamentiFiltrati.length;
    return {
      totale,
      count,
      media: count > 0 ? totale / count : 0
    };
  }, [pagamentiFiltrati]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);
  
  // Format Date for Header (e.g. "06 FEBBRAIO 2026")
  const formatDateHeader = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: it }).toUpperCase();
    } catch { return dateStr; }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. HEADER (Fixed Top Block) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pagamenti ricevuti</h2>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-md">
            {TOTALE_PAGAMENTI_DB.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} />
            Esporta
          </button>
          <button 
            onClick={onToggleForm}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95
              ${isFormOpen ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-orange-500/20'}
            `}
          >
            {isFormOpen ? <X size={18} /> : <Plus size={18} strokeWidth={3} />}
            {isFormOpen ? 'Chiudi' : 'Inserisci nuovo pagamento'}
          </button>
        </div>
      </div>

      {/* 2. KPI STRIP (Fixed Row) */}
      <div className="flex flex-col md:flex-row gap-4 flex-shrink-0">
         {/* Card 1: Incassato (Blue Highlight) */}
         <div className="flex-1 bg-[#EFF6FF] border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm min-h-[90px]">
            <div>
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Incassato (Filtrato)</p>
               <p className="text-2xl font-bold text-blue-700">{formatCurrency(kpi.totale)}</p>
            </div>
         </div>

         {/* Card 2: Count */}
         <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm min-h-[90px]">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">N° Pagamenti</p>
               <p className="text-2xl font-bold text-slate-800">{kpi.count}</p>
            </div>
         </div>

         {/* Card 3: Average */}
         <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm min-h-[90px]">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Media</p>
               <p className="text-2xl font-bold text-slate-800">{formatCurrency(kpi.media)}</p>
            </div>
         </div>
      </div>

      {/* 3. FILTERS BAR (Fixed Row) */}
      <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-200/60 flex flex-col xl:flex-row items-center gap-3 flex-shrink-0">
         
         {/* Dates */}
         <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-1 w-full sm:w-auto shadow-sm">
            <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Data Da</div>
            <input 
              type="date" 
              value={filtri.data_da}
              onChange={(e) => setFiltri({...filtri, data_da: e.target.value})}
              className="bg-transparent text-sm text-slate-700 outline-none w-32 px-1 py-1.5 cursor-pointer font-medium hover:bg-slate-50 rounded"
              placeholder="gg/mm/aaaa"
            />
         </div>
         
         <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-1 w-full sm:w-auto shadow-sm">
            <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Data A</div>
            <input 
              type="date" 
              value={filtri.data_a}
              onChange={(e) => setFiltri({...filtri, data_a: e.target.value})}
              className="bg-transparent text-sm text-slate-700 outline-none w-32 px-1 py-1.5 cursor-pointer font-medium hover:bg-slate-50 rounded"
              placeholder="gg/mm/aaaa"
            />
         </div>

         {/* Città Select */}
         <div className="relative w-full sm:w-auto min-w-[160px] group">
            <label className="absolute left-3 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pointer-events-none">Città</label>
            <select 
              value={filtri.citta}
              onChange={(e) => setFiltri({...filtri, citta: e.target.value})}
              className="w-full pl-3 pr-8 pt-6 pb-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all hover:border-slate-300 appearance-none cursor-pointer font-medium shadow-sm h-[50px]"
            >
              <option value="">Tutte le città</option>
              {CITTA_DISPONIBILI.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none mt-1" />
         </div>

         {/* Metodo Select */}
         <div className="relative w-full sm:w-auto min-w-[160px] group">
            <label className="absolute left-3 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pointer-events-none">Metodo</label>
            <select 
              value={filtri.metodo}
              onChange={(e) => setFiltri({...filtri, metodo: e.target.value})}
              className="w-full pl-3 pr-8 pt-6 pb-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all hover:border-slate-300 appearance-none cursor-pointer font-medium shadow-sm h-[50px]"
            >
              <option value="">Tutti i metodi</option>
              {METODI_PAGAMENTO.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none mt-1" />
         </div>

         <div className="w-px h-6 bg-slate-300 mx-2 hidden xl:block" />

         {/* Stripe Toggle */}
         <button
           onClick={() => setFiltri({...filtri, solo_stripe: !filtri.solo_stripe})}
           className={`
             flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-sm ml-auto sm:ml-0
             ${filtri.solo_stripe 
               ? 'bg-white text-slate-800 border-slate-300 ring-2 ring-slate-100' 
               : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
           `}
         >
           <Zap size={14} className={filtri.solo_stripe ? "fill-orange-500 text-orange-500" : ""} />
           Solo Stripe
         </button>
      </div>

      {/* 4. EXPANDABLE FORM (Optional) */}
      {isFormOpen && (
        <div className="flex-shrink-0">
          <PagamentiForm onPagamentoSalvato={onPagamentoSalvato} onClose={onToggleForm} />
        </div>
      )}

      {/* 5. SCROLLABLE LIST (Grouped by Date) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 space-y-8 min-h-0">
        
        {sortedDates.map(dateKey => (
          <div key={dateKey} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Date Header with Icon */}
            <div className="flex items-center gap-3 mb-3 pl-1">
               <div className="p-1.5 bg-slate-100 rounded-md text-slate-400">
                 <CalendarDays size={14} />
               </div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 {formatDateHeader(dateKey)}
               </h4>
            </div>

            {/* Cards for this date */}
            <div className="space-y-3">
              {groupedPayments[dateKey].map(p => (
                <div 
                  key={p.id} 
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:border-orange-200 group"
                >
                  {/* Left: User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-colors">
                      {p.effettuato_da?.nome_completo.split(' ').map((n:string) => n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{p.effettuato_da?.nome_completo}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{p.effettuato_da?.id_display}</span>
                        {p.pagante && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{p.pagante}</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.note || (p.importato_automaticamente ? 'Pagamento Automatico' : 'Pagamento quota mensile')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Meta */}
                  <div className="text-right">
                    <div className="inline-flex items-center justify-end px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 mb-1">
                       <span className="text-sm font-bold">{formatCurrency(p.importo_ricevuto)}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-medium">
                       <span>{format(parseISO(p.data_pagamento), 'HH:mm')}</span>
                       <span>•</span>
                       <span className="uppercase tracking-wide">{p.tipo}</span>
                       {p.importato_automaticamente && <Zap size={10} className="text-blue-500 fill-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 italic opacity-60">
             <LayoutList size={48} className="mb-4 text-slate-300" />
             <p>Nessun pagamento trovato con i filtri correnti.</p>
          </div>
        )}

      </div>

    </div>
  );
};
