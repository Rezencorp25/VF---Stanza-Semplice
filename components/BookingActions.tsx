import React from 'react';
import { BookingStatus, UserRole } from '../types';
import { Save, CheckCircle2, Trash2, ArrowRight, Banknote, ShieldCheck } from 'lucide-react';

interface BookingActionsProps {
  status: BookingStatus;
  userRole: UserRole;
  onSave: () => void;
  onSaveAndClose: () => void;
  onClose: () => void;
  onDelete: () => void;
  onRequestPayment: () => void;
  onConfirmBooking: () => void;
  onFinalConfirm: () => void;
}

export const BookingActions: React.FC<BookingActionsProps> = ({
  status,
  userRole,
  onSave,
  onSaveAndClose,
  onClose,
  onDelete,
  onRequestPayment,
  onConfirmBooking,
  onFinalConfirm
}) => {

  const handleDelete = () => {
    if (window.confirm("Sei sicuro di voler eliminare questa prenotazione? L'operazione è irreversibile.")) {
      onDelete();
    }
  };

  // Logica permessi: Admin e City Manager hanno privilegi elevati
  const hasElevatedPrivileges = userRole === UserRole.ADMIN || userRole === UserRole.CITY_MANAGER;

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 w-full">

      {/* Left Side: Delete Action */}
      <div className="w-full sm:w-auto">
        {hasElevatedPrivileges && (
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors w-full sm:w-auto"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Elimina</span>
          </button>
        )}
      </div>

      {/* Right Side: Primary Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">

        {/* Close (Always Visible) */}
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
        >
          Chiudi
        </button>

        {/* Save (Always Visible) */}
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Save size={16} />
          Salva
        </button>

        {/* --- Status Transitions --- */}

        {/* 1. Ricevuta (Rosa) -> Richiedi Pagamento -> Trattativa (Giallo) */}
        {status === 'ricevuta' && (
          <button
            onClick={onRequestPayment}
            className="px-4 py-2 text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            title="Passa allo stato Trattativa"
          >
            <Banknote size={16} />
            Richiedi Pagamento
            <ArrowRight size={16} />
          </button>
        )}

        {/* 2. Trattativa (Giallo) -> Conferma Prenotazione -> Confermata (Arancione) */}
        {status === 'trattativa' && (
          <button
            onClick={onConfirmBooking}
            className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            title="Passa allo stato Confermata"
          >
            <CheckCircle2 size={16} />
            Conferma Prenotazione
            <ArrowRight size={16} />
          </button>
        )}

        {/* 3. Confermata (Arancione) -> Conferma Finale -> Attiva (Verde) - Restricted */}
        {status === 'confermata' && hasElevatedPrivileges && (
          <button
            onClick={onFinalConfirm}
            className="px-4 py-2 text-sm font-bold text-green-700 bg-green-100 hover:bg-green-200 border border-green-200 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            title="Attiva la prenotazione"
          >
            <ShieldCheck size={16} />
            Conferma Finale
            <ArrowRight size={16} />
          </button>
        )}

        {/* Save & Close (Always Visible - Primary Action) */}
        <button
          onClick={onSaveAndClose}
          className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          Salva e Chiudi
        </button>
      </div>
    </div>
  );
};
