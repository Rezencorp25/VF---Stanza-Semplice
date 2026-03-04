
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Filter, 
  MapPin, 
  Search,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { MOCK_INQUILINI, MOCK_PIANO_PAGAMENTI, MOCK_PAGAMENTI, CITTA_DISPONIBILI } from '../financialTypes';

interface CashflowTabellaProps {
  filtroAttivo: 'tutti' | 'insoluti' | 'incassato' | 'da_incassare';
  onlyInsoluti: boolean;
  meseSelezionato: string; // YYYY-MM
}

export const CashflowTabella: React.FC<CashflowTabellaProps> = ({
  filtroAttivo,
  onlyInsoluti,
  meseSelezionato
}) => {
  // --- STATE ---
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [filtroCitta, setFiltroCitta] = useState<string>('');
  const [showOnlyInsoluti, setShowOnlyInsoluti] = useState(onlyInsoluti);
  const [searchText, setSearchText] = useState('');

  // Sync prop change to local state
  useEffect(() => {
    setShowOnlyInsoluti(onlyInsoluti || filtroAttivo === 'insoluti');
  }, [onlyInsoluti, filtroAttivo]);

  // --- DATA PROCESSING ---
  const tableData = useMemo(() => {
    return MOCK_INQUILINI.map((inquilino, index) => {
      // 1. Dati Mese Corrente
      const pianiMese = MOCK_PIANO_PAGAMENTI.filter(p => 
        p.inquilino_id === inquilino.id && p.mese_competenza === meseSelezionato
      );
      const pagamentiMese = MOCK_PAGAMENTI.filter(p => 
        p.effettuato_da.inquilino_id === inquilino.id && p.mese_competenza === meseSelezionato
      );

      const previstoMese = pianiMese.reduce((acc, p) => acc + p.importo_previsto, 0);
      const incassatoMese = pagamentiMese.reduce((acc, p) => acc + p.importo_ricevuto, 0);
      
      // Stato Mese
      let statoMese = 'in_attesa';
      if (incassatoMese >= previstoMese && previstoMese > 0) statoMese = 'saldato';
      else if (incassatoMese > 0) statoMese = 'parziale';
      else if (previstoMese === 0) statoMese = 'nessun_addebito';

      // 2. Avatar Color Logic
      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
      const avatarColor = colors[index % colors.length];

      return {
        ...inquilino,
        previstoMese,
        incassatoMese,
        statoMese,
        avatarColor
      };
    });
  }, [meseSelezionato]);

  // --- FILTERING ---
  const filteredRows = useMemo(() => {
    return tableData.filter(row => {
      // Filtro Città
      if (filtroCitta && row.citta !== filtroCitta) return false;
      
      // Filtro Insoluti (Saldo negativo storico O non pagato mese corrente)
      if (showOnlyInsoluti) {
        const hasBadStanding = row.saldo_attuale < 0; // Storico
        // const hasUnpaidMonth = row.previstoMese > 0 && row.incassatoMese < row.previstoMese; // Mese corrente
        if (!hasBadStanding) return false;
      }

      // Filtro Search
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          row.nome.toLowerCase().includes(searchLower) ||
          row.cognome.toLowerCase().includes(searchLower) ||
          row.appartamento_nome.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [tableData, filtroCitta, showOnlyInsoluti, searchText]);

  // --- TOTALI FOOTER ---
  const summary = useMemo(() => {
    return filteredRows.reduce((acc, row) => ({
      previsto: acc.previsto + row.previstoMese,
      incassato: acc.incassato + row.incassatoMese,
      saldoStorico: acc.saldoStorico + row.saldo_attuale
    }), { previsto: 0, incassato: 0, saldoStorico: 0 });
  }, [filteredRows]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const inRegola = filteredRows.filter(r => r.saldo_attuale >= 0).length;
    const insoluti = total - inRegola;
    return { total, inRegola, insoluti };
  }, [filteredRows]);

  // --- FORMATTERS ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  // --- DRILL-DOWN HISTORY GENERATOR ---
  const getHistoryData = (inquilinoId: string) => {
    const history = [];
    const current = parseISO(meseSelezionato + '-01');
    
    // Last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(current, i);
      const monthStr = format(date, 'yyyy-MM');
      
      const piani = MOCK_PIANO_PAGAMENTI.filter(p => p.inquilino_id === inquilinoId && p.mese_competenza === monthStr);
      const pagamenti = MOCK_PAGAMENTI.filter(p => p.effettuato_da.inquilino_id === inquilinoId && p.mese_competenza === monthStr);
      
      const previsto = piani.reduce((acc, p) => acc + p.importo_previsto, 0);
      const pagato = pagamenti.reduce((acc, p) => acc + p.importo_ricevuto, 0);
      const delta = pagato - previsto;
      
      let status = 'none';
      if (previsto > 0) {
        if (pagato >= previsto) status = 'ok';
        else if (pagato > 0) status = 'partial';
        else status = 'ko';
      }

      history.push({ month: date, previsto, pagato, delta, status });
    }
    return history;
  };

  const handleToggleExpand = (id: string) => {
    setExpandedRowId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. TABLE FILTERS HEADER */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Citta Filter */}
          <div className="relative group">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" />
            <select
              value={filtroCitta}
              onChange={(e) => setFiltroCitta(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="">Tutte le città</option>
              {CITTA_DISPONIBILI.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Filter */}
          <div className="relative group flex-1 md:flex-none md:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" />
             <input 
               type="text" 
               placeholder="Cerca inquilino o appartamento..." 
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
             />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
           {/* Counters */}
           <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-700">{stats.total} inquilini</span>
              <span className="w-px h-3 bg-slate-300" />
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> {stats.inRegola}</span>
              <span className="w-px h-3 bg-slate-300" />
              <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> {stats.insoluti}</span>
           </div>

           {/* Toggle Insoluti */}
           <button
             onClick={() => setShowOnlyInsoluti(!showOnlyInsoluti)}
             className={`
               flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all border
               ${showOnlyInsoluti 
                 ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
                 : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
             `}
           >
             <AlertTriangle size={16} className={showOnlyInsoluti ? 'fill-red-600' : ''} />
             <span className="hidden sm:inline">Solo Insoluti</span>
           </button>
        </div>
      </div>

      {/* 2. TABLE BODY */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
              <th className="px-6 py-4">Inquilino</th>
              <th className="px-6 py-4">Appartamento</th>
              <th className="px-6 py-4">Città</th>
              <th className="px-6 py-4 text-right">Previsto</th>
              <th className="px-6 py-4 text-right">Incassato</th>
              <th className="px-6 py-4 text-center">Saldo Cumulato</th>
              <th className="px-6 py-4 text-center">Stato</th>
              <th className="px-4 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map(row => {
              const isExpanded = expandedRowId === row.id;
              const hasInsoluto = row.saldo_attuale < 0;

              return (
                <React.Fragment key={row.id}>
                  {/* MAIN ROW */}
                  <tr 
                    onClick={() => handleToggleExpand(row.id)}
                    className={`
                      cursor-pointer transition-colors group
                      ${isExpanded ? 'bg-orange-50/30' : 'hover:bg-slate-50'}
                      ${hasInsoluto ? 'bg-red-50/20' : ''}
                    `}
                  >
                    {/* Inquilino */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${row.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                          {row.nome.charAt(0)}{row.cognome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{row.nome} {row.cognome}</p>
                          <p className="text-xs text-slate-400 font-mono">ID: {row.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Appartamento */}
                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-medium truncate max-w-[180px] block" title={row.appartamento_nome}>
                        {row.appartamento_nome}
                      </span>
                    </td>

                    {/* Città */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                        {row.citta}
                      </span>
                    </td>

                    {/* Previsto */}
                    <td className="px-6 py-4 text-right font-medium text-slate-600">
                      {formatCurrency(row.previstoMese)}
                    </td>

                    {/* Incassato */}
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      {formatCurrency(row.incassatoMese)}
                    </td>

                    {/* Saldo Cumulato */}
                    <td className="px-6 py-4 text-center">
                      {hasInsoluto ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-red-700 border border-red-200">
                          <AlertTriangle size={14} className="fill-red-700 text-red-100" />
                          <span className="font-bold text-xs">{formatCurrency(row.saldo_attuale)}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={14} />
                          <span className="font-bold text-xs">In regola</span>
                        </div>
                      )}
                    </td>

                    {/* Stato Mese (Badge) */}
                    <td className="px-6 py-4 text-center">
                      {row.statoMese === 'saldato' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wide">Saldato</span>
                      )}
                      {row.statoMese === 'parziale' && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 uppercase tracking-wide">Parziale</span>
                      )}
                      {row.statoMese === 'in_attesa' && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">In Attesa</span>
                      )}
                      {row.statoMese === 'nessun_addebito' && (
                        <span className="text-slate-300 text-lg">&mdash;</span>
                      )}
                    </td>

                    {/* Expand Arrow */}
                    <td className="px-4 py-4 text-right">
                      <ChevronRight 
                        size={20} 
                        className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-orange-500' : 'group-hover:text-slate-500'}`} 
                      />
                    </td>
                  </tr>

                  {/* EXPANDED DRILL-DOWN PANEL */}
                  <tr className={`transition-all duration-300 ${isExpanded ? '' : 'hidden'}`}>
                    <td colSpan={8} className="p-0 border-0">
                      <div className="bg-[#F8F7FF] border-y border-slate-200 shadow-inner px-8 py-6">
                        
                        <div className="flex flex-col md:flex-row gap-8">
                          
                          {/* Left: Summary & Action */}
                          <div className="md:w-1/4 space-y-6">
                             <div>
                               <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                 <div className={`w-2 h-6 rounded-full ${row.avatarColor}`} />
                                 Riepilogo {row.nome}
                               </h4>
                               <p className="text-xs text-slate-500 mt-1 pl-4">Situazione contabile aggiornata</p>
                             </div>

                             <div className={`p-4 rounded-xl border ${hasInsoluto ? 'bg-white border-red-200 shadow-sm' : 'bg-white border-emerald-100 shadow-sm'}`}>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Totale</p>
                                <p className={`text-2xl font-bold ${hasInsoluto ? 'text-red-600' : 'text-emerald-600'}`}>
                                  {formatCurrency(row.saldo_attuale)}
                                </p>
                             </div>

                             {hasInsoluto && (
                               <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl text-xs font-bold transition-all shadow-sm group/btn">
                                 <Mail size={16} />
                                 Invia Sollecito
                                 <span className="absolute bottom-full mb-2 hidden group-hover/btn:block bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-10">
                                   Funzione disponibile in produzione
                                 </span>
                               </button>
                             )}
                          </div>

                          {/* Right: History Table */}
                          <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                             <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                               <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ultimi 6 Mesi</h5>
                               <button className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-1">
                                 Vedi tutto <ArrowRight size={12} />
                               </button>
                             </div>
                             
                             <table className="w-full text-xs text-left">
                               <thead>
                                 <tr className="text-slate-400 border-b border-slate-100">
                                   <th className="px-5 py-3 font-medium">Mese</th>
                                   <th className="px-5 py-3 font-medium text-right">Previsto</th>
                                   <th className="px-5 py-3 font-medium text-right">Pagato</th>
                                   <th className="px-5 py-3 font-medium text-center">Delta</th>
                                   <th className="px-5 py-3 font-medium text-center">Stato</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50">
                                 {getHistoryData(row.id).map((h, i) => (
                                   <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                     <td className="px-5 py-3 font-medium text-slate-700 capitalize">
                                       {format(h.month, 'MMM yyyy', { locale: it })}
                                     </td>
                                     <td className="px-5 py-3 text-right text-slate-600">{formatCurrency(h.previsto)}</td>
                                     <td className="px-5 py-3 text-right font-bold text-slate-800">{formatCurrency(h.pagato)}</td>
                                     <td className="px-5 py-3 text-center">
                                       {h.delta === 0 ? (
                                         <span className="text-slate-300"><Minus size={14} className="mx-auto"/></span>
                                       ) : (
                                         <span className={`font-bold ${h.delta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                           {h.delta > 0 ? '+' : ''}{formatCurrency(h.delta)}
                                         </span>
                                       )}
                                     </td>
                                     <td className="px-5 py-3 text-center">
                                       {h.status === 'ok' && <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Saldato" />}
                                       {h.status === 'partial' && <span className="inline-block w-2 h-2 rounded-full bg-amber-500" title="Parziale" />}
                                       {h.status === 'ko' && <span className="inline-block w-2 h-2 rounded-full bg-red-500" title="Non Pagato" />}
                                       {h.status === 'none' && <span className="inline-block w-2 h-2 rounded-full bg-slate-300" title="Nessun Addebito" />}
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                          </div>

                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}

            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-slate-400 bg-slate-50/30 italic">
                  Nessun inquilino trovato con i filtri correnti.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. STICKY SUMMARY FOOTER */}
      <div className="bg-slate-50 border-t-2 border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Visualizzati {filteredRows.length} record</span>
         </div>

         <div className="flex items-center gap-6 md:gap-10 text-sm">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Totale Previsto</span>
               <span className="font-bold text-slate-700">{formatCurrency(summary.previsto)}</span>
            </div>
            
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Totale Incassato</span>
               <span className="font-bold text-emerald-600">{formatCurrency(summary.incassato)}</span>
            </div>

            <div className="flex flex-col items-end pl-6 border-l border-slate-200">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Netto (Tot)</span>
               <span className={`font-extrabold text-lg flex items-center gap-1 ${summary.saldoStorico >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                 {summary.saldoStorico >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                 {formatCurrency(summary.saldoStorico)}
               </span>
            </div>
         </div>
      </div>

    </div>
  );
};
