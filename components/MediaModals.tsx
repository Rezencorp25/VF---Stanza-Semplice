import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  AlertTriangle,
  FileText,
  Folder,
  Download
} from 'lucide-react';

interface PublicImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Data
const MOCK_IMAGES = [
  { id: '1', filename: 'soggiorno.jpg', type: 'image/jpeg', description: 'Vista soggiorno', isCover: true, size: '2.4 MB' },
  { id: '2', filename: 'camera_1.jpg', type: 'image/jpeg', description: 'Camera da letto principale', isCover: false, size: '1.8 MB' },
  { id: '3', filename: 'cucina.png', type: 'image/png', description: 'Angolo cottura', isCover: false, size: '3.1 MB' },
];

const MOCK_DOCUMENTS = [
  { id: '1', name: 'Contratti 2024', type: 'folder', size: '-' },
  { id: '2', name: 'Planimetria.pdf', type: 'file', size: '1.2 MB', extension: 'PDF' },
  { id: '3', name: 'Visura_Catastale.pdf', type: 'file', size: '850 KB', extension: 'PDF' },
  { id: '4', name: 'Certificazione_Energetica.pdf', type: 'file', size: '2.4 MB', extension: 'PDF' },
];

export const PublicImagesModal: React.FC<PublicImagesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon size={24} className="text-orange-500" />
              Immagini Pubbliche
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Gestisci le immagini visibili sul sito web</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center gap-3 text-amber-800 text-sm font-medium">
          <AlertTriangle size={18} className="text-amber-600" />
          ⚠️ Queste immagini sono visibili anche fuori dalla piattaforma Verumflow
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 bg-slate-50">
          {MOCK_IMAGES.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Filename</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Descrizione</th>
                  <th className="px-6 py-3 text-center">Copertina</th>
                  <th className="px-6 py-3 text-center">Anteprima</th>
                  <th className="px-6 py-3">Dimensioni</th>
                  <th className="px-6 py-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {MOCK_IMAGES.map((img, index) => (
                  <tr key={img.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-3 font-medium text-slate-700">{img.filename}</td>
                    <td className="px-6 py-3 text-slate-500 uppercase text-xs">{img.type.split('/')[1]}</td>
                    <td className="px-6 py-3 text-slate-600 italic">{img.description}</td>
                    <td className="px-6 py-3 text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto border ${img.isCover ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300'}`}></div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button className="text-slate-400 hover:text-orange-500 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{img.size}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Nessuna immagine caricata</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center z-10">
          <button className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 border border-slate-200">
            <FolderPlus size={18} />
            Nuova Cartella
          </button>
          
          <div className="flex gap-3">
             <button className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 border border-slate-200">
              <ImageIcon size={18} />
              Galleria
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center gap-2">
              <Plus size={18} />
              Nuova Immagine
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText size={24} className="text-blue-500" />
              Documenti
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Gestisci i documenti dell'appartamento</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 bg-slate-50">
          {MOCK_DOCUMENTS.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Filename / Cartella</th>
                  <th className="px-6 py-3 text-center">Anteprima</th>
                  <th className="px-6 py-3">Dimensioni</th>
                  <th className="px-6 py-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {MOCK_DOCUMENTS.map((doc, index) => (
                  <tr key={doc.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {doc.type === 'folder' ? (
                          <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Folder size={18} />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg relative">
                            <FileText size={18} />
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded shadow-sm">{doc.extension}</span>
                          </div>
                        )}
                        <span className={`text-slate-700 ${doc.type === 'folder' ? 'font-bold' : 'font-medium'}`}>
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {doc.type === 'file' && (
                        <button className="text-slate-400 hover:text-blue-500 transition-colors">
                          <Eye size={18} />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{doc.size}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.type === 'file' && (
                           <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                             <Download size={16} />
                           </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="m-6 p-8 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center justify-center text-amber-800/60">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-amber-800">Nessun file presente</p>
              <p className="text-sm mt-1">Carica documenti o crea cartelle per organizzare i file.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center z-10">
          <button className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 border border-slate-200">
            <FolderPlus size={18} />
            Nuova Cartella
          </button>
          
          <button className="px-4 py-2 bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            Nuovo File
          </button>
        </div>

      </div>
    </div>
  );
};
