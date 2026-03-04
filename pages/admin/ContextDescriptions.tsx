import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Building2,
  Calendar
} from 'lucide-react';
import { ContextDescription } from '../../types';
import { MOCK_CONTEXT_DESCRIPTIONS } from '../../constants';
import { ContextDescriptionFormModal } from '../../components/admin/ContextDescriptionFormModal';
import { ContextDescriptionDetailModal } from '../../components/admin/ContextDescriptionDetailModal';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const ContextDescriptions: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<ContextDescription | null>(null);
  const [viewingContext, setViewingContext] = useState<ContextDescription | null>(null);

  // Derived Data
  const filteredContexts = useMemo(() => {
    return MOCK_CONTEXT_DESCRIPTIONS.filter(context => {
      const searchLower = searchQuery.toLowerCase();
      return (
        context.name.toLowerCase().includes(searchLower) ||
        context.code.toLowerCase().includes(searchLower) ||
        context.description.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => b.qualityLevel - a.qualityLevel); // Sort by quality level descending
  }, [searchQuery]);

  // Handlers
  const handleEdit = (context: ContextDescription) => {
    setEditingContext(context);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleView = (context: ContextDescription) => {
    setViewingContext(context);
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo contesto?')) {
      console.log('Deleting context:', id);
    }
    setActiveMenu(null);
  };

  const handleSave = (data: Partial<ContextDescription>) => {
    console.log('Saving context:', data);
    setIsFormOpen(false);
    setEditingContext(null);
  };

  return (
    <AdminLayout 
      title="Descrizioni Contesti" 
      subtitle="Gestione livelli qualitativi e descrizioni quartieri" 
      breadcrumbs={[{ label: 'Contesti' }]}
      actions={
        <>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Esporta CSV</span>
          </button>

          <button 
            onClick={() => {
              setEditingContext(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nuovo Contesto</span>
          </button>
        </>
      }
    >
      <div className="space-y-8">
      
      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cerca per nome, codice, descrizione..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Contesto</th>
                <th className="px-6 py-4 w-1/3">Descrizione Default</th>
                <th className="px-6 py-4 text-center">Oggetti</th>
                <th className="px-6 py-4">Ultima Modifica</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContexts.map((context) => (
                <tr key={context.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                        style={{ backgroundColor: context.color }}
                      >
                        {context.qualityLevel}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{context.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{context.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600 line-clamp-2 text-xs leading-relaxed max-w-md" title={context.description}>
                      {context.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors group/btn font-bold text-xs">
                      <Building2 size={14} className="text-slate-400 group-hover/btn:text-blue-500" />
                      {context.objectsCount}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={14} />
                      {new Date(context.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === context.id ? null : context.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === context.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === context.id && (
                      <div className="absolute right-0 top-full mt-[-10px] mr-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleView(context)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Eye size={14} /> Dettagli
                        </button>
                        <button 
                          onClick={() => handleEdit(context)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} /> Modifica
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button 
                          onClick={() => handleDelete(context.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} /> Elimina
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Visualizzati <span className="font-bold text-slate-700">{filteredContexts.length}</span> contesti
          </span>
        </div>
      </div>

      {/* Modals */}
      <ContextDescriptionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        context={editingContext}
        onSave={handleSave}
      />

      <ContextDescriptionDetailModal
        isOpen={!!viewingContext}
        onClose={() => setViewingContext(null)}
        context={viewingContext}
        onEdit={() => {
          if (viewingContext) {
            setViewingContext(null);
            handleEdit(viewingContext);
          }
        }}
      />
    </div>
    </AdminLayout>
  );
};
