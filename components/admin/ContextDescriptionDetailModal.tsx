import React from 'react';
import { X, Edit, Building2, Info, Calendar } from 'lucide-react';
import { ContextDescription } from '../../types';
import { MOCK_CONTEXT_DESCRIPTIONS } from '../../constants';

interface ContextDescriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ContextDescription | null;
  onEdit: () => void;
}

export const ContextDescriptionDetailModal: React.FC<ContextDescriptionDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  context, 
  onEdit 
}) => {
  if (!isOpen || !context) return null;

  const allContexts = [...MOCK_CONTEXT_DESCRIPTIONS].sort((a, b) => b.qualityLevel - a.qualityLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="px-2 py-0.5 rounded text-white text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: context.color }}
              >
                Livello {context.qualityLevel}
              </span>
              <span className="text-slate-400 text-xs font-mono">#{context.code}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{context.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Modifica"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descrizione Pubblica</h3>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed border-l-4 border-slate-200 italic">
                  "{context.description}"
                </div>
              </div>

              {context.internalNotes && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Info size={14} />
                    Note Interne (Admin)
                  </h3>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                    {context.internalNotes}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Building2 size={16} />
                  <span>Oggetti collegati: <span className="font-bold text-slate-800">{context.objectsCount}</span></span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={16} />
                  <span>Ultima modifica: <span className="font-mono text-slate-700">{new Date(context.updatedAt).toLocaleDateString()}</span></span>
                </div>
              </div>

            </div>

            {/* Right Column: Comparison */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confronto Livelli</h3>
              <div className="space-y-2">
                {allContexts.map(c => (
                  <div 
                    key={c.id} 
                    className={`p-3 rounded-xl border transition-all ${c.id === context.id ? 'bg-slate-50 border-slate-300 shadow-sm ring-1 ring-slate-200' : 'bg-white border-slate-100 opacity-60'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: c.color }}
                      />
                      <span className={`text-xs font-bold ${c.id === context.id ? 'text-slate-800' : 'text-slate-500'}`}>
                        Lvl {c.qualityLevel}
                      </span>
                    </div>
                    <div className={`text-sm font-medium truncate ${c.id === context.id ? 'text-slate-900' : 'text-slate-400'}`}>
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
