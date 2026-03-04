import React from 'react';
import { Guarantor } from '../types';
import { User, Shield, Phone, Mail, MapPin, CreditCard, Plus } from 'lucide-react';

interface TabGaranteProps {
  guarantor: Guarantor | null | undefined;
  onChange: (field: keyof Guarantor, value: string) => void;
  onAdd: () => void;
}

export const TabGarante: React.FC<TabGaranteProps> = ({ guarantor, onChange, onAdd }) => {
  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400 hover:border-slate-300";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8 min-h-[400px]";

  if (!guarantor) {
    return (
      <div className={`${containerClasses} flex flex-col items-center justify-center text-center space-y-4`}>
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2 shadow-sm">
          <Shield size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Nessun garante associato</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
            Questa prenotazione non ha ancora i dati del garante inseriti.
          </p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-orange-500/20 active:scale-95 mt-4"
        >
          <Plus size={18} />
          Aggiungi Garante
        </button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <Shield size={20} className="text-orange-500" />
          Dati Garante
        </h3>
        <p className="text-slate-500 text-sm">Informazioni anagrafiche e di contatto del garante.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nome */}
        <div>
          <label className={labelClasses}>Nome</label>
          <div className="relative">
            <User size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="Nome"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Cognome */}
        <div>
          <label className={labelClasses}>Cognome</label>
          <div className="relative">
            <User size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Cognome"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Codice Fiscale */}
        <div className="col-span-full">
          <label className={labelClasses}>Codice Fiscale</label>
          <div className="relative">
            <CreditCard size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.fiscalCode}
              onChange={(e) => onChange('fiscalCode', e.target.value.toUpperCase())}
              placeholder="CODICE FISCALE"
              className={`${inputClasses} pl-10 font-mono uppercase tracking-wide`}
              maxLength={16}
            />
          </div>
        </div>

        {/* Telefono */}
        <div>
          <label className={labelClasses}>Telefono</label>
          <div className="relative">
            <Phone size={18} className={iconClasses} />
            <input 
              type="tel" 
              value={guarantor.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+39 ..."
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email</label>
          <div className="relative">
            <Mail size={18} className={iconClasses} />
            <input 
              type="email" 
              value={guarantor.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="email@esempio.com"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Indirizzo */}
        <div className="col-span-full md:col-span-1">
          <label className={labelClasses}>Indirizzo Residenza</label>
          <div className="relative">
            <MapPin size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Via Roma 1"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Città */}
        <div className="col-span-full md:col-span-1">
          <label className={labelClasses}>Città</label>
          <div className="relative">
            <MapPin size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Milano"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Tipo Documento */}
        <div>
          <label className={labelClasses}>Tipo Documento</label>
          <div className="relative">
            <CreditCard size={18} className={iconClasses} />
            <select
              value={guarantor.documentType}
              onChange={(e) => onChange('documentType', e.target.value)}
              className={`${inputClasses} pl-10 appearance-none cursor-pointer`}
            >
              <option value="">Seleziona...</option>
              <option value="Carta d'Identità">Carta d'Identità</option>
              <option value="Passaporto">Passaporto</option>
              <option value="Patente">Patente</option>
            </select>
          </div>
        </div>

        {/* Numero Documento */}
        <div>
          <label className={labelClasses}>Numero Documento</label>
          <div className="relative">
            <CreditCard size={18} className={iconClasses} />
            <input 
              type="text" 
              value={guarantor.documentNumber}
              onChange={(e) => onChange('documentNumber', e.target.value)}
              placeholder="AX1234567"
              className={`${inputClasses} pl-10 uppercase`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
