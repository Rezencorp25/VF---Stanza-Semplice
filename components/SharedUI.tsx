import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

// --- EMPTY STATE ---
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 animate-in fade-in zoom-in-95 duration-300">
    <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-slate-400">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 max-w-md mb-6 text-sm">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all"
      >
        {action.label}
      </button>
    )}
  </div>
);

// --- SKELETON LOADER ---
export const SkeletonLoader: React.FC<{ type: 'card' | 'table' | 'list', count?: number }> = ({ type, count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[400px] overflow-hidden">
            <div className="h-48 bg-slate-200 w-full" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="h-16 bg-slate-200 rounded-xl" />
                <div className="h-16 bg-slate-200 rounded-xl" />
                <div className="h-16 bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 border-b border-slate-200" />
        <div className="divide-y divide-slate-100">
          {items.map((_, i) => (
            <div key={i} className="h-16 bg-white px-6 flex items-center gap-4">
              <div className="h-8 w-8 bg-slate-200 rounded-full shrink-0" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/6 ml-auto" />
              <div className="h-4 bg-slate-200 rounded w-1/6" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-20 bg-white rounded-xl border border-slate-200" />
      ))}
    </div>
  );
};

// --- DELETE CONFIRMATION MODAL ---
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemName,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 mb-6">
            Sei sicuro di voler eliminare <span className="font-bold text-slate-800">"{itemName}"</span>? 
            Questa azione non può essere annullata.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-100 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              {isDeleting ? 'Eliminazione...' : 'Elimina'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
