import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { Booking } from '../types';
import { X, User, Calendar, CreditCard, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

interface MoveBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  newRoomName: string;
  newDate: Date;
  onClose: () => void;
  onConfirm: (updatedData: { price: number; notes: string }) => void;
}

export const MoveBookingModal: React.FC<MoveBookingModalProps> = ({
  isOpen,
  booking,
  newRoomName,
  newDate,
  onClose,
  onConfirm
}) => {
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState<number>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (booking) {
      // Initialize with existing booking data or recalculate based on new room logic
      // For mock purposes, keep existing price or set a default
      setPrice(booking.monthlyPrices?.[0]?.roomPrice || 600); 
      setNotes(booking.notes || '');
      setStep(1);
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const duration = differenceInDays(booking.checkOut, booking.checkIn);
  const calculatedEndDate = addDays(newDate, duration);

  const handleConfirm = () => {
    onConfirm({ price, notes });
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Conferma Spostamento</h2>
            <p className="text-slate-500 text-sm mt-1">
              È richiesta la conferma per modificare questa prenotazione.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 px-4 relative">
             <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10" />
             <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-orange-600' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= 1 ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}>1</div>
                <span className="text-xs font-bold uppercase">Anagrafica</span>
             </div>
             <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-orange-600' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= 2 ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}>2</div>
                <span className="text-xs font-bold uppercase">Date & Stanza</span>
             </div>
             <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-orange-600' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= 3 ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}>3</div>
                <span className="text-xs font-bold uppercase">Economico</span>
             </div>
          </div>

          <div className="space-y-6">
            
            {/* Step 1: Anagrafica (Read Only) */}
            <div className={`transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-40 hidden'}`}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-orange-500" /> Verifica Cliente
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                    {booking.tenantName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{booking.tenantName}</p>
                    <p className="text-sm text-slate-500">Cliente esistente - ID: <span className="font-mono">{booking.id}</span></p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Verificato
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 italic">
                L'anagrafica cliente verrà mantenuta. Non verranno creati duplicati nel database.
              </p>
            </div>

            {/* Step 2: Date e Stanza */}
            <div className={`transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'hidden'}`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-orange-500" /> Nuova Collocazione
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nuova Stanza</p>
                   <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Building2 size={18} className="text-slate-400" />
                      {newRoomName}
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Durata</p>
                   <div className="flex items-center gap-2 text-slate-800 font-bold">
                      {duration} giorni
                   </div>
                </div>
                <div className="col-span-2 bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                   <div>
                      <p className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mb-0.5">Nuovo Periodo</p>
                      <p className="font-bold text-orange-800">
                        {format(newDate, 'dd MMM yyyy', { locale: it })} — {format(calculatedEndDate, 'dd MMM yyyy', { locale: it })}
                      </p>
                   </div>
                   <Calendar size={24} className="text-orange-300" />
                </div>
              </div>
            </div>

            {/* Step 3: Economico */}
            <div className={`transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'hidden'}`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-500" /> Aggiornamento Contratto
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nuovo Canone Mensile</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Il prezzo verrà aggiornato per i mesi futuri nel piano pagamenti.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Note Modifica</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                    rows={3}
                    placeholder="Motivo dello spostamento..."
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-2">
             <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-slate-200'}`} />
             <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
             <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-orange-500' : 'bg-slate-200'}`} />
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
              >
                Indietro
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
              >
                Avanti <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                className="px-8 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-200 animate-in pulse"
              >
                <CheckCircle2 size={18} />
                Conferma Spostamento
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
};