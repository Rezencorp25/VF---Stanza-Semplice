import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  X, 
  MoreVertical, 
  Download, 
  Edit, 
  Trash2, 
  MapPin, 
  User, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  Send,
  RotateCcw
} from 'lucide-react';
import { STATI_FATTURA } from '../financialTypes';

interface Fattura {
  id: string;
  numero_fattura: string | null;
  inquilino_nome: string;
  inquilino_id: string; // Added based on mock data structure
  appartamento_nome: string;
  citta: string;
  importo_lordo: number;
  mese_competenza: string;
  stato: string;
  data_emissione: string | null;
  note: string;
}

interface DrawerDettaglioFatturaProps {
  fattura: Fattura | null;
  onClose: () => void;
  onModifica: (id: string) => void;
  onCambioStato: (id: string, nuovoStato: string) => void;
}

export const DrawerDettaglioFattura: React.FC<DrawerDettaglioFatturaProps> = ({
  fattura,
  onClose,
  onModifica,
  onCambioStato
}) => {
  const [note, setNote] = useState('');
  const [isNoteChanged, setIsNoteChanged] = useState(false);

  // Sync internal state when fattura changes
  useEffect(() => {
    if (fattura) {
      setNote(fattura.note || '');
      setIsNoteChanged(false);
    }
  }, [fattura]);

  if (!fattura) return null;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setIsNoteChanged(e.target.value !== (fattura.note || ''));
  };

  const handleSaveNote = () => {
    // Logic to save note would go here
    console.log('Saving note:', note);
    setIsNoteChanged(false);
    // In a real app, call an onUpdate prop here
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/D';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: it });
    } catch {
      return dateStr;
    }
  };

  const statusConfig = STATI_FATTURA[fattura.stato as keyof typeof STATI_FATTURA] || 
    { label: fattura.stato, color: 'text-slate-600', bgColor: 'bg-slate-100' };

  // Timeline Logic
  const timelineSteps = [
    { id: 'bozza', label: 'Bozza' },
    { id: 'emessa', label: 'Emessa' },
    { id: 'inviata_sdi', label: 'Inviata SDI' },
    { id: 'pagata', label: 'Pagata' }
  ];

  // Handle "Scartata" case which deviates from standard flow
  const isScartata = fattura.stato === 'scartata';
  const currentStepIndex = isScartata 
    ? 2 // Show up to "Inviata SDI" visually, then mark scartata specially
    : timelineSteps.findIndex(s => s.id === fattura.stato);

  return (
    <ModalPortal>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 z-[9999] h-full w-full max-w-[480px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0 bg-white z-10">
          <div className="flex justify-between items-start mb-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-1 text-slate-500 hover:text-orange-600 text-sm font-medium transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Indietro
            </button>
            <div className="relative group">
              <button className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
              {/* Dropdown Menu (Mockup) */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-focus-within:block group-hover:block z-20">
                <div className="py-1">
                  <button onClick={() => onModifica(fattura.id)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Edit size={14} /> Modifica
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Download size={14} /> Scarica XML
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 size={14} /> Elimina
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {fattura.numero_fattura || 'Bozza'}
              </h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide border ${statusConfig.color} ${statusConfig.bgColor} bg-opacity-20 border-opacity-20`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
          
          {/* Section 1: Importo Highlight */}
          <div className="bg-[#F0EFF9] border-l-4 border-orange-500 rounded-r-lg p-4 shadow-sm">
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {formatCurrency(fattura.importo_lordo)}
            </p>
            <p className="text-xs text-slate-500 font-medium mb-1">
              IVA 0% (locazione esente): €0,00
            </p>
            <p className="text-sm font-semibold text-slate-700">
              Totale documento: {formatCurrency(fattura.importo_lordo)}
            </p>
          </div>

          {/* Section 2: Info Documento */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">N° Fattura</p>
              <p className="text-sm font-medium text-slate-800 font-mono">{fattura.numero_fattura || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data Emissione</p>
              <div className="flex items-center gap-1.5 text-slate-800">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm font-medium">{formatDate(fattura.data_emissione)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mese Competenza</p>
              <p className="text-sm font-medium text-slate-800 capitalize">
                {format(new Date(fattura.mese_competenza), 'MMMM yyyy', { locale: it })}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scadenza</p>
              <p className="text-sm font-medium text-slate-800">
                {fattura.data_emissione ? formatDate(new Date(new Date(fattura.data_emissione).setDate(new Date(fattura.data_emissione).getDate() + 30)).toISOString()) : '-'}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Inquilino */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Intestatario</p>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg border border-orange-200">
                {fattura.inquilino_nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{fattura.inquilino_nome}</p>
                <p className="text-xs text-slate-500 font-medium">ID: {fattura.inquilino_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <MapPin size={16} className="text-orange-500 shrink-0" />
              <span>
                <span className="font-semibold">{fattura.appartamento_nome}</span> — {fattura.citta}
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Timeline */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stato Avanzamento</p>
            <div className="relative pl-2 ml-2 space-y-6 border-l-2 border-slate-100">
              {timelineSteps.map((step, index) => {
                const isCompleted = !isScartata && (fattura.stato === step.id || index < currentStepIndex);
                const isCurrent = fattura.stato === step.id;
                
                // Handle Scartata visualization specially
                if (isScartata && step.id === 'pagata') return null; // Don't show Paid if rejected
                
                return (
                  <div key={step.id} className="relative pl-6">
                    {/* Dot */}
                    <div 
                      className={`
                        absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all
                        ${isCurrent ? 'bg-orange-500 border-orange-200 ring-4 ring-orange-100' : ''}
                        ${isCompleted ? 'bg-green-500 border-green-500' : ''}
                        ${!isCurrent && !isCompleted ? 'bg-white border-slate-300' : ''}
                        ${isScartata && step.id === 'inviata_sdi' ? 'bg-red-500 border-red-500' : ''}
                      `}
                    >
                      {isCurrent && <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75"></span>}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isCurrent ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.label}
                        {isScartata && step.id === 'inviata_sdi' && <span className="text-red-600 ml-2">(Scartata)</span>}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-slate-400">
                          {fattura.data_emissione && index === 1 ? formatDate(fattura.data_emissione) : 'Completato'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Special Scartata Node if active */}
              {isScartata && (
                 <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-red-500 border-red-200 ring-4 ring-red-100"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-red-700">Scartata da SDI</span>
                      <span className="text-[10px] text-slate-400">Verifica l'errore nelle note</span>
                    </div>
                 </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 5: Note Interne */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note Interne</p>
              {isNoteChanged && (
                <button 
                  onClick={handleSaveNote}
                  className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors shadow-sm"
                >
                  Salva Nota
                </button>
              )}
            </div>
            <textarea 
              value={note}
              onChange={handleNoteChange}
              placeholder="Scrivi una nota interna..."
              className="w-full min-h-[100px] p-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0 z-10">
          {fattura.stato === 'bozza' && (
            <button 
              onClick={() => onCambioStato(fattura.id, 'emessa')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Emetti Fattura
            </button>
          )}

          {fattura.stato === 'emessa' && (
            <button 
              className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-orange-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Download size={18} />
              Scarica XML Aruba
            </button>
          )}

          {fattura.stato === 'inviata_sdi' && (
            <button 
              onClick={() => onCambioStato(fattura.id, 'pagata')}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Segna come Pagata
            </button>
          )}
          
          {fattura.stato === 'scartata' && (
             <button 
              onClick={() => onCambioStato(fattura.id, 'bozza')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Rimetti in Bozza
            </button>
          )}

          {fattura.stato === 'pagata' && (
             <div className="w-full py-3 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
               <CheckCircle2 size={18} />
               Pagata il {formatDate(new Date().toISOString())}
             </div>
          )}
        </div>

      </div>
    </ModalPortal>
  );
};