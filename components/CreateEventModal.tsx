import React from 'react';
import { ModalPortal } from './ModalPortal';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { EventType } from '../types';
import { CalendarPlus, SprayCan, Wrench, X, Calendar } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  roomId: string;
  date: Date;
  onClose: () => void;
  onSelectType: (type: EventType, roomId: string, date: Date) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  roomId,
  date,
  onClose,
  onSelectType
}) => {
  if (!isOpen) return null;

  const formattedDate = format(date, 'dd MMMM yyyy', { locale: it });

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Nuovo Evento</h3>
            <p className="text-xs text-slate-500 mt-0.5 capitalize flex items-center gap-1">
              <Calendar size={12} /> {formattedDate}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Seleziona Tipo</p>
          
          <button 
            onClick={() => onSelectType('prenotazione', roomId, date)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <CalendarPlus size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-700 group-hover:text-orange-700">Prenotazione</span>
            </div>
          </button>

          <button 
            onClick={() => onSelectType('pulizia', roomId, date)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
             <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <SprayCan size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-700 group-hover:text-blue-700">Pulizia</span>
            </div>
          </button>

           <button 
            onClick={() => onSelectType('manutenzione', roomId, date)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group"
          >
             <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Wrench size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-700 group-hover:text-amber-700">Manutenzione</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Stanza: <span className="font-mono font-bold text-slate-600">{roomId}</span></p>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};