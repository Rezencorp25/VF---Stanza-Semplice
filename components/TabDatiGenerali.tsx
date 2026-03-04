import React from 'react';
import { format } from 'date-fns';
import { Booking } from '../types';
import { Calendar, User, Briefcase, Globe, Euro, FileText, MapPin } from 'lucide-react';

interface TabDatiGeneraliProps {
  booking: Booking;
  onChange: (field: keyof Booking, value: unknown) => void;
}

export const TabDatiGenerali: React.FC<TabDatiGeneraliProps> = ({ booking, onChange }) => {
  // Helper per formattare date per input type="date"
  const formatDateForInput = (date: Date) => {
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (e) {
      return '';
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400 hover:border-slate-300";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8";

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <FileText size={20} className="text-orange-500" />
          Informazioni Generali
        </h3>
        <p className="text-slate-500 text-sm">Dati principali della prenotazione e dell'inquilino.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appartamento e Stanza (Read-only) */}
        <div className="col-span-full">
          <label className={labelClasses}>Appartamento / Stanza</label>
          <div className="relative group">
            <MapPin size={18} className={iconClasses} />
            <input 
              type="text" 
              value={booking.roomId} 
              readOnly 
              className={`${inputClasses} pl-10 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className={labelClasses}>Check-in</label>
          <div className="relative">
            <Calendar size={18} className={iconClasses} />
            <input 
              type="date" 
              value={formatDateForInput(booking.checkIn)}
              onChange={(e) => onChange('checkIn', new Date(e.target.value))}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className={labelClasses}>Check-out</label>
          <div className="relative">
            <Calendar size={18} className={iconClasses} />
            <input 
              type="date" 
              value={formatDateForInput(booking.checkOut)}
              onChange={(e) => onChange('checkOut', new Date(e.target.value))}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Inquilino */}
        <div>
          <label className={labelClasses}>Nome Inquilino</label>
          <div className="relative">
            <User size={18} className={iconClasses} />
            <input 
              type="text" 
              value={booking.tenantName}
              onChange={(e) => onChange('tenantName', e.target.value)}
              placeholder="Nome e Cognome"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Provenienza Contatto */}
        <div>
          <label className={labelClasses}>Canale Provenienza</label>
          <div className="relative">
            <Globe size={18} className={iconClasses} />
            <select
              value={booking.source}
              onChange={(e) => onChange('source', e.target.value)}
              className={`${inputClasses} pl-10 appearance-none cursor-pointer`}
            >
              <option value="">Seleziona...</option>
              <option value="Idealista">Idealista</option>
              <option value="Immobiliare.it">Immobiliare.it</option>
              <option value="HousingAnywhere">HousingAnywhere</option>
              <option value="Spotahome">Spotahome</option>
              <option value="Diretto">Diretto</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
        </div>

        {/* Tipologia Professione */}
        <div>
          <label className={labelClasses}>Professione</label>
          <div className="relative">
            <Briefcase size={18} className={iconClasses} />
            <select
              value={booking.profession || ''}
              onChange={(e) => onChange('profession', e.target.value)}
              className={`${inputClasses} pl-10 appearance-none cursor-pointer`}
            >
              <option value="">Seleziona...</option>
              <option value="Studente">Studente</option>
              <option value="Lavoratore">Lavoratore</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
        </div>

        {/* Deposito Cauzionale */}
        <div>
          <label className={labelClasses}>Deposito Cauzionale</label>
          <div className="relative">
            <Euro size={18} className={iconClasses} />
            <input 
              type="number" 
              value={booking.deposit}
              onChange={(e) => onChange('deposit', Number(e.target.value))}
              placeholder="0.00"
              className={`${inputClasses} pl-10 font-medium`}
            />
          </div>
        </div>

        {/* Note Storiche */}
        <div className="col-span-full">
          <label className={labelClasses}>Note interne</label>
          <textarea 
            value={booking.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Aggiungi note importanti sulla prenotazione..."
          />
        </div>

      </div>
    </div>
  );
};
