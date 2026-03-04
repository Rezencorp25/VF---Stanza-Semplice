import React from 'react';
import { format } from 'date-fns';
import { ContractDetails } from '../types';
import { FileText, Calendar, Building, Hash, Plus, FileCheck } from 'lucide-react';

interface TabContrattoProps {
  contract: ContractDetails | null | undefined;
  onChange: (field: keyof ContractDetails, value: unknown) => void;
  onInitialize: () => void;
}

export const TabContratto: React.FC<TabContrattoProps> = ({ contract, onChange, onInitialize }) => {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (e) {
      return '';
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400 hover:border-slate-300";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8 min-h-[400px]";

  if (!contract) {
    return (
      <div className={`${containerClasses} flex flex-col items-center justify-center text-center space-y-4`}>
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2 shadow-sm">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Contratto non registrato</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
            Non sono presenti dati di registrazione per questo contratto.
          </p>
        </div>
        <button 
          onClick={onInitialize}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-orange-500/20 active:scale-95 mt-4"
        >
          <Plus size={18} />
          Inserisci Dati Contratto
        </button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <FileCheck size={20} className="text-orange-500" />
          Dati Registrazione Contratto
        </h3>
        <p className="text-slate-500 text-sm">Estremi di registrazione presso l'Agenzia delle Entrate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Codice Ufficio / Agenzia */}
        <div>
          <label className={labelClasses}>Codice Ufficio (AdE)</label>
          <div className="relative">
            <Building size={18} className={iconClasses} />
            <input 
              type="text" 
              value={contract.agencyCode}
              onChange={(e) => onChange('agencyCode', e.target.value)}
              placeholder="Es. T63"
              className={`${inputClasses} pl-10 uppercase`}
            />
          </div>
        </div>

        {/* Serie */}
        <div>
          <label className={labelClasses}>Serie</label>
          <div className="relative">
            <Hash size={18} className={iconClasses} />
            <input 
              type="text" 
              value={contract.series}
              onChange={(e) => onChange('series', e.target.value)}
              placeholder="Es. 3T"
              className={`${inputClasses} pl-10 uppercase`}
            />
          </div>
        </div>

        {/* Numero Registrazione */}
        <div className="col-span-full">
          <label className={labelClasses}>Numero Registrazione</label>
          <div className="relative">
            <Hash size={18} className={iconClasses} />
            <input 
              type="text" 
              value={contract.registrationNumber}
              onChange={(e) => onChange('registrationNumber', e.target.value)}
              placeholder="Es. 12345"
              className={`${inputClasses} pl-10 font-medium`}
            />
          </div>
        </div>

        {/* Data Stipula */}
        <div>
          <label className={labelClasses}>Data Stipula</label>
          <div className="relative">
            <Calendar size={18} className={iconClasses} />
            <input 
              type="date" 
              value={formatDateForInput(contract.stipulationDate)}
              onChange={(e) => onChange('stipulationDate', e.target.value ? new Date(e.target.value) : null)}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Data Registrazione */}
        <div>
          <label className={labelClasses}>Data Registrazione</label>
          <div className="relative">
            <Calendar size={18} className={iconClasses} />
            <input 
              type="date" 
              value={formatDateForInput(contract.registrationDate)}
              onChange={(e) => onChange('registrationDate', e.target.value ? new Date(e.target.value) : null)}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
