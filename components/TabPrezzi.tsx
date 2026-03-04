import React, { useMemo } from 'react';
import { BillingMode, MonthlyPriceRow } from '../types';
import { ReceiptEuro, RefreshCw, Trash2, Calendar, Settings, DollarSign, Calculator } from 'lucide-react';

interface TabPrezziProps {
  billingMode: BillingMode;
  utilityPrice: number;
  monthlyPrices: MonthlyPriceRow[];
  onBillingModeChange: (mode: BillingMode) => void;
  onMonthlyPriceChange: (index: number, field: keyof MonthlyPriceRow, value: number) => void;
  onDeletePrices: () => void;
  onRecreate: () => void;
}

export const TabPrezzi: React.FC<TabPrezziProps> = ({
  billingMode,
  utilityPrice,
  monthlyPrices,
  onBillingModeChange,
  onMonthlyPriceChange,
  onDeletePrices,
  onRecreate
}) => {
  
  // Helper per i nomi dei mesi
  const getMonthName = (monthIndex: number) => {
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return months[monthIndex] || '';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Calcoli Totali
  const totals = useMemo(() => {
    return monthlyPrices.reduce((acc, row) => ({
      roomPrice: acc.roomPrice + row.roomPrice,
      utilityShare: acc.utilityShare + row.utilityShare,
      clubCost: acc.clubCost + row.clubCost,
      total: acc.total + (row.roomPrice + row.utilityShare + row.clubCost)
    }), { roomPrice: 0, utilityShare: 0, clubCost: 0, total: 0 });
  }, [monthlyPrices]);

  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400 hover:border-slate-300";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
  const tableInputClasses = "w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 text-right text-sm outline-none transition-colors px-1 py-1 text-slate-700 focus:text-slate-900 font-medium font-mono";
  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 min-h-[400px]";

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <ReceiptEuro size={20} className="text-orange-500" />
          Prezzi & Fatturazione
        </h3>
        <p className="text-slate-500 text-sm">Configurazione canoni e costi mensili.</p>
      </div>

      {/* Controlli Superiori */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        
        {/* Modalità Fatturazione */}
        <div className="md:col-span-4">
          <label className={labelClasses}>Modalità Fatturazione</label>
          <div className="relative">
            <Settings size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={billingMode}
              onChange={(e) => onBillingModeChange(e.target.value as BillingMode)}
              className={`${inputClasses} pl-10 appearance-none cursor-pointer bg-white`}
            >
              <option value="mensile">Mensile</option>
              <option value="bimestrale">Bimestrale</option>
              <option value="trimestrale">Trimestrale</option>
              <option value="semestrale">Semestrale</option>
              <option value="annuale">Annuale</option>
            </select>
          </div>
        </div>

        {/* Prezzo Utenze Mensile */}
        <div className="md:col-span-3">
          <label className={labelClasses}>Utenze (Default)</label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="number"
              value={utilityPrice}
              onChange={(e) => {
                // Logic to update default utility price
              }}
              className={`${inputClasses} pl-10 text-right bg-white`}
              placeholder="50.00"
            />
          </div>
        </div>

        {/* Bottoni Azione */}
        <div className="md:col-span-5 flex items-end gap-3 justify-end">
           <button 
             onClick={onDeletePrices}
             className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all hover:bg-red-100 active:scale-95"
           >
             <Trash2 size={16} />
             Elimina
           </button>
           <button 
             onClick={onRecreate}
             className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
           >
             <RefreshCw size={16} />
             Ricrea Prezzi
           </button>
        </div>
      </div>

      {/* Tabella Prezzi */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Periodo</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/5">Canone</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/5">Utenze</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/5">Club</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-1/5 bg-slate-100">Totale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyPrices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    Nessun piano prezzi generato. Clicca su "Ricrea Prezzi" per iniziare.
                  </td>
                </tr>
              ) : (
                monthlyPrices.map((row, index) => {
                  const rowTotal = row.roomPrice + row.utilityShare + row.clubCost;
                  return (
                    <tr key={`${row.year}-${row.month}`} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2 text-slate-700">
                           <Calendar size={14} className="text-orange-500" />
                           <span className="font-semibold">{getMonthName(row.month)}</span>
                           <span className="text-slate-400 text-xs">{row.year}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={row.roomPrice}
                          onChange={(e) => onMonthlyPriceChange(index, 'roomPrice', parseFloat(e.target.value) || 0)}
                          className={tableInputClasses}
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={row.utilityShare}
                          onChange={(e) => onMonthlyPriceChange(index, 'utilityShare', parseFloat(e.target.value) || 0)}
                          className={tableInputClasses}
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={row.clubCost}
                          onChange={(e) => onMonthlyPriceChange(index, 'clubCost', parseFloat(e.target.value) || 0)}
                          className={tableInputClasses}
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-slate-900 bg-slate-50 group-hover:bg-slate-100">
                        {formatCurrency(rowTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            
            {/* Footer Totali */}
            {monthlyPrices.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800 shadow-sm">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Calculator size={16} className="text-orange-500" />
                    TOTALE
                  </td>
                  <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(totals.roomPrice)}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(totals.utilityShare)}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(totals.clubCost)}</td>
                  <td className="px-4 py-3 text-right text-lg text-slate-900 bg-slate-100 border-l border-slate-200">{formatCurrency(totals.total)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
