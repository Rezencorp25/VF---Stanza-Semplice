
import React, { useMemo, useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  PieChart
} from 'lucide-react';
import { MOCK_PIANO_PAGAMENTI, MOCK_PAGAMENTI, MOCK_INQUILINI } from '../financialTypes';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

interface CashflowKPIProps {
  meseSelezionato: string; // Format 'yyyy-MM'
  onMeseChange: (nuovoMese: string) => void;
  onFiltroChange: (filtro: 'insoluti' | 'incassato' | 'da_incassare' | 'tutti') => void;
}

export const CashflowKPI: React.FC<CashflowKPIProps> = ({
  meseSelezionato,
  onMeseChange,
  onFiltroChange
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // --- CALCOLO KPI ---
  const stats = useMemo(() => {
    // 1. Totale Previsto (dal Piano Pagamenti per il mese selezionato)
    const pagamentiPrevisti = MOCK_PIANO_PAGAMENTI.filter(p => p.mese_competenza === meseSelezionato);
    const totalePrevisto = pagamentiPrevisti.reduce((acc, p) => acc + p.importo_previsto, 0);
    const contrattiAttivi = pagamentiPrevisti.length;

    // 2. Totale Incassato (dai Pagamenti Effettivi per il mese selezionato)
    const pagamentiEffettivi = MOCK_PAGAMENTI.filter(p => p.mese_competenza === meseSelezionato);
    const totaleIncassato = pagamentiEffettivi.reduce((acc, p) => acc + p.importo_ricevuto, 0);
    const numeroIncassi = pagamentiEffettivi.length;

    // 3. Totale Insoluti (Saldo negativo inquilini - Storico globale, non solo mese)
    // Nota: "Insoluti" è un concetto di stato attuale del debito
    const inquiliniInsoluti = MOCK_INQUILINI.filter(i => i.saldo_attuale < 0);
    const totaleInsoluti = inquiliniInsoluti.reduce((acc, i) => acc + Math.abs(i.saldo_attuale), 0);
    const countInsoluti = inquiliniInsoluti.length;

    // 4. Da Incassare (Gap mensile)
    // Se incassato > previsto (es. anticipi), da incassare è 0
    const daIncassare = Math.max(0, totalePrevisto - totaleIncassato);

    // 5. Percentuali
    const percentualeIncassata = totalePrevisto > 0 ? Math.min(100, Math.round((totaleIncassato / totalePrevisto) * 100)) : 0;

    return {
      totalePrevisto,
      contrattiAttivi,
      totaleIncassato,
      numeroIncassi,
      totaleInsoluti,
      countInsoluti,
      daIncassare,
      percentualeIncassata
    };
  }, [meseSelezionato]);

  // --- HELPER FORMATTING ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  
  const handlePrevMonth = () => {
    const d = parseISO(meseSelezionato + '-01');
    onMeseChange(format(subMonths(d, 1), 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const d = parseISO(meseSelezionato + '-01');
    onMeseChange(format(addMonths(d, 1), 'yyyy-MM'));
  };

  const currentMonthLabel = format(parseISO(meseSelezionato + '-01'), 'MMMM yyyy', { locale: it });

  // --- SVG CHART LOGIC ---
  // Dati per il grafico Donut
  const chartData = [
    { label: 'Incassato', value: stats.totaleIncassato, color: '#10b981' }, // Emerald-500
    { label: 'Da Incassare', value: stats.daIncassare, color: '#f59e0b' }, // Amber-500
    { label: 'Insoluti Storici', value: stats.totaleInsoluti, color: '#ef4444' } // Red-500
  ];

  const totalChartValue = chartData.reduce((acc, d) => acc + d.value, 0);
  
  // Calcolo percorsi SVG (Arc)
  let cumulativePercent = 0;
  
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const chartPaths = chartData.map((slice, index) => {
    if (totalChartValue === 0) return null;
    const slicePercent = slice.value / totalChartValue;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slicePercent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
    
    // Path command
    // M 0 0 -> Center (not needed for donut, we move to start)
    // L startX startY
    // A radius radius 0 largeArcFlag 1 endX endY
    // Z (close)
    
    // Adjust for SVG coordinate system (Center 0,0, Radius 1)
    // We'll scale in the SVG element viewBox
    
    return {
      d: `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      color: slice.color,
      label: slice.label,
      value: slice.value,
      percent: slicePercent
    };
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER: TIME SELECTOR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Cashflow</h2>
          <p className="text-slate-500 text-sm">Monitoraggio flussi di cassa e stato pagamenti.</p>
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <div className="flex bg-slate-100 rounded-lg p-1 mr-2">
             <button 
               onClick={() => setViewMode('month')}
               className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Mese
             </button>
             <button 
               onClick={() => setViewMode('year')}
               className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'year' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Anno
             </button>
          </div>
          
          <div className="flex items-center border-l border-slate-200 pl-2">
             <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600"><ChevronDown size={16} className="rotate-90" /></button>
             <span className="text-sm font-bold text-slate-700 px-2 capitalize min-w-[120px] text-center">{currentMonthLabel}</span>
             <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600"><ChevronDown size={16} className="-rotate-90" /></button>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: CARDS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* CARD 1: PREVISTO */}
          <div 
            onClick={() => onFiltroChange('da_incassare')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4 border-l-orange-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previsto</span>
               <div className="p-2 bg-orange-50 text-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                 <Calendar size={20} />
               </div>
            </div>
            <div className="mt-2">
               <span className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalePrevisto)}</span>
               <p className="text-xs text-slate-400 mt-1 font-medium">Basato su {stats.contrattiAttivi} contratti attivi</p>
            </div>
          </div>

          {/* CARD 2: INCASSATO */}
          <div 
            onClick={() => onFiltroChange('incassato')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incassato</span>
               <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                 <CheckCircle2 size={20} />
               </div>
            </div>
            <div className="mt-2">
               <span className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.totaleIncassato)}</span>
               
               {/* Progress Bar */}
               <div className="h-1.5 w-full bg-emerald-50 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.percentualeIncassata}%` }}
                  />
               </div>
               <p className="text-xs text-emerald-600/70 mt-1.5 font-bold flex justify-between">
                 <span>{stats.percentualeIncassata}% del previsto</span>
                 <span>{stats.numeroIncassi} incassi</span>
               </p>
            </div>
          </div>

          {/* CARD 3: INSOLUTI (Priority) */}
          <div 
            onClick={() => onFiltroChange('insoluti')}
            className={`
              rounded-2xl p-6 shadow-sm border border-l-4 border-l-red-500 hover:shadow-md transition-all cursor-pointer group relative
              ${stats.totaleInsoluti > 0 ? 'bg-red-50/30 border-red-100' : 'bg-white border-slate-100'}
            `}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
               <ArrowUpRight size={18} />
            </div>

            <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Insoluti Totali</span>
               <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${stats.totaleInsoluti > 0 ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                 <AlertCircle size={20} />
               </div>
            </div>
            <div className="mt-2">
               <span className={`text-3xl font-bold ${stats.totaleInsoluti > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                 {formatCurrency(stats.totaleInsoluti)}
               </span>
               <p className="text-xs text-slate-500 mt-1 font-medium">
                 {stats.totaleInsoluti > 0 
                   ? `⚠️ ${stats.countInsoluti} inquilini con saldo negativo`
                   : 'Tutti i conti sono in ordine'
                 }
               </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CHART */}
        <div className="w-full lg:w-[320px] flex-shrink-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
           
           <h3 className="absolute top-4 left-5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <PieChart size={14} /> Distribuzione
           </h3>

           <div className="relative w-40 h-40 mt-4 group">
              {/* SVG Chart */}
              <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full transform -rotate-90">
                 {chartPaths.map((slice, i) => (
                   slice && (
                     <path 
                       key={i}
                       d={slice.d}
                       fill="none"
                       stroke={slice.color}
                       strokeWidth="0.35"
                       className="transition-all duration-300 hover:stroke-[0.4] hover:opacity-90 cursor-pointer"
                       onClick={() => onFiltroChange(slice.label === 'Insoluti Storici' ? 'insoluti' : slice.label === 'Incassato' ? 'incassato' : 'da_incassare')}
                     >
                       <title>{slice.label}: {formatCurrency(slice.value)}</title>
                     </path>
                   )
                 ))}
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-slate-800">{stats.percentualeIncassata}%</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Incassato</span>
              </div>
           </div>

           {/* Legend */}
           <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                </div>
              ))}
           </div>

        </div>

      </div>
    </div>
  );
};
