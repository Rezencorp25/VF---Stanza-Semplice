import React, { useMemo } from 'react';
import { PaymentDeadline } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarClock, RefreshCw, Plus, CheckCircle2, Clock, Wallet, Banknote, AlertCircle } from 'lucide-react';

interface TabPianoPagamentiProps {
  paymentPlan: PaymentDeadline[];
  onRecalculate: () => void;
  onAddManual: () => void;
  onTogglePaid: (id: string) => void;
}

export const TabPianoPagamenti: React.FC<TabPianoPagamentiProps> = ({
  paymentPlan,
  onRecalculate,
  onAddManual,
  onTogglePaid
}) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const totals = useMemo(() => {
    const totalExpected = paymentPlan.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = paymentPlan
      .filter(item => item.isPaid)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      totalExpected,
      totalPaid,
      remaining: totalExpected - totalPaid
    };
  }, [paymentPlan]);

  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 min-h-[400px]";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
           <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
            <CalendarClock size={20} className="text-orange-500" />
            Piano Pagamenti
          </h3>
          <p className="text-slate-500 text-sm">Scadenzario delle rate e stato pagamenti.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={onRecalculate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Ricalcola Auto</span>
            <span className="sm:hidden">Ricalcola</span>
          </button>
          <button 
            onClick={onAddManual}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Plus size={14} />
            <span>Nuova Scadenza</span>
          </button>
        </div>
      </div>

      {/* Tabella Scadenze */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider w-16 text-center">#</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Data Scadenza</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Importo</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Stato</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paymentPlan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    Nessuna scadenza pianificata.
                  </td>
                </tr>
              ) : (
                paymentPlan.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {format(item.dueDate, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border
                        ${item.isPaid 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-amber-100 text-amber-700 border-amber-200'}
                      `}>
                        {item.isPaid ? 'Pagato' : 'In attesa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={item.isPaid}
                            onChange={() => onTogglePaid(item.id)}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Riepilogo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
        
        {/* Totale Atteso */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 rounded-full bg-white border border-slate-100 text-slate-600 shadow-sm">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Totale Atteso</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(totals.totalExpected)}</p>
          </div>
        </div>

        {/* Totale Pagato */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
          <div className="p-3 rounded-full bg-white border border-green-100 text-green-600 shadow-sm">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-wider">Totale Pagato</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totals.totalPaid)}</p>
          </div>
        </div>

        {/* Saldo Residuo */}
        <div className={`p-4 rounded-xl border flex items-center gap-4
          ${totals.remaining > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'}
        `}>
          <div className={`p-3 rounded-full bg-white border shadow-sm
             ${totals.remaining > 0 ? 'border-amber-100 text-amber-600' : 'border-slate-100 text-slate-400'}
          `}>
            {totals.remaining > 0 ? <AlertCircle size={20} /> : <Banknote size={20} />}
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${totals.remaining > 0 ? 'text-amber-600/70' : 'text-slate-400'}`}>Saldo Residuo</p>
            <p className={`text-lg font-bold ${totals.remaining > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
              {formatCurrency(totals.remaining)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
