import React, { useRef } from 'react';
import { DocumentItem, DocumentType } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { FileText, Upload, Eye, Trash2, Printer, CheckCircle, File, AlertCircle } from 'lucide-react';

interface TabDocumentiProps {
  documents: DocumentItem[];
  onUpload: (type: DocumentType, file: File) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (type: DocumentType) => void;
}

const DOC_TYPES: { type: DocumentType; label: string; required?: boolean }[] = [
  { type: 'id_inquilino', label: 'Documento Identità Inquilino', required: true },
  { type: 'cf_inquilino', label: 'Codice Fiscale Inquilino', required: true },
  { type: 'iscrizione_uni', label: 'Iscrizione Universitaria / Lavoro' },
  { type: 'id_garante', label: 'Documento Identità Garante' },
  { type: 'garanzia_garante', label: 'Lettera Garanzia Firmata' },
  { type: 'contabile', label: 'Contabile Bonifico / Pagamento' },
  { type: 'contratto_subaffitto', label: 'Contratto Subaffitto', required: true },
  { type: 'privacy', label: 'Modulo Privacy', required: true },
  { type: 'regolamento', label: 'Regolamento Firmato' },
];

export const TabDocumenti: React.FC<TabDocumentiProps> = ({
  documents,
  onUpload,
  onPreview,
  onDelete,
  onGeneratePDF
}) => {
  
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(type, e.target.files[0]);
    }
  };

  const triggerFileInput = (type: DocumentType) => {
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]?.click();
    }
  };

  const containerClasses = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 min-h-[400px]";

  return (
    <div className={containerClasses}>
      <div>
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-1">
          <FileText size={20} className="text-orange-500" />
          Documenti Prenotazione
        </h3>
        <p className="text-slate-500 text-sm">Gestione della documentazione contrattuale e personale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOC_TYPES.map((docDef) => {
          const existingDoc = documents.find(d => d.type === docDef.type && d.fileName);
          const isUploaded = !!existingDoc;
          
          return (
            <div 
              key={docDef.type} 
              className={`
                relative p-4 rounded-xl border transition-all duration-200 group
                ${isUploaded 
                  ? 'bg-green-50/50 border-green-200' 
                  : 'bg-slate-50 border-slate-200 border-dashed hover:border-orange-300 hover:bg-orange-50/10'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2.5 rounded-lg flex items-center justify-center border shadow-sm
                    ${isUploaded ? 'bg-white text-green-600 border-green-100' : 'bg-white text-slate-400 border-slate-100'}
                  `}>
                    {isUploaded ? <CheckCircle size={20} /> : <File size={20} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isUploaded ? 'text-slate-800' : 'text-slate-600'}`}>
                      {docDef.label}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isUploaded ? 'text-green-700' : 'text-slate-400'}`}>
                      {isUploaded && existingDoc?.uploadedAt 
                        ? `Caricato il ${format(existingDoc.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: it })}`
                        : docDef.required ? 'Richiesto obbligatoriamente' : 'Opzionale'}
                    </p>
                  </div>
                </div>
                
                {!isUploaded && docDef.required && (
                   <span className="text-amber-500 bg-white rounded-full p-0.5" title="Documento mancante"><AlertCircle size={18} /></span>
                )}
              </div>

              {isUploaded && existingDoc ? (
                /* FILE CARICATO */
                <div className="space-y-3">
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                    <FileText size={14} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-600 truncate font-mono font-medium">{existingDoc.fileName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => onPreview(existingDoc.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Eye size={14} /> Anteprima
                    </button>
                    <button 
                      onClick={() => onDelete(existingDoc.id)}
                      className="px-3 py-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* FILE NON CARICATO */
                <div className="flex items-center gap-2 mt-3">
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={(el) => { fileInputRefs.current[docDef.type] = el; }}
                    onChange={(e) => handleFileChange(e, docDef.type)}
                  />
                  
                  <button 
                    onClick={() => triggerFileInput(docDef.type)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-orange-500 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition-all active:scale-95 group-hover:border-orange-500 border border-slate-200 shadow-sm"
                  >
                    <Upload size={14} />
                    Carica File
                  </button>

                  {(docDef.type === 'contratto_subaffitto' || docDef.type === 'privacy') && (
                    <button 
                      onClick={() => onGeneratePDF(docDef.type)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-lg text-xs font-bold transition-colors shadow-sm"
                      title="Genera PDF automatico"
                    >
                      <Printer size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
