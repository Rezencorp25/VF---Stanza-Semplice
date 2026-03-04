
import React, { useState } from 'react';
import { CashflowKPI } from './CashflowKPI';
import { CashflowTabella } from './CashflowTabella';
import { Info, X } from 'lucide-react';

/*
  CALCOLO SALDO REAL-TIME (Firestore):
  // NON denormalizzare il saldo — calcolarlo sempre on-the-fly per consistenza
  const calcolaSaldo = async (inquilinoId) => {
    const [piano, pagamenti] = await Promise.all([
      getDocs(query(collection(db, 'piano_pagamenti'), where('inquilino_ref', '==', inquilinoRef))),
      getDocs(query(collection(db, 'pagamenti'), where('inquilino_ref', '==', inquilinoRef)))
    ]);
    const totPrevisto = piano.docs.flatMap(d => d.data().scadenze)
      .filter(s => s.mese <= meseCorrente).reduce((sum, s) => sum + s.importo, 0);
    const totPagato = pagamenti.docs.reduce((sum, d) => sum + d.data().importo, 0);
    return totPagato - totPrevisto; // negativo = insoluto
  }
*/

export const CashflowSection: React.FC = () => {
  // Stato
  const [meseSelezionato, setMeseSelezionato] = useState<string>('2026-02'); // Default su mock data attuali
  const [filtroAttivo, setFiltroAttivo] = useState<'tutti' | 'insoluti' | 'incassato' | 'da_incassare'>('tutti');
  const [onlyInsoluti, setOnlyInsoluti] = useState<boolean>(false);

  // Handlers
  const handleFiltroChange = (filtro: 'insoluti' | 'incassato' | 'da_incassare' | 'tutti') => {
    setFiltroAttivo(filtro);
    setOnlyInsoluti(filtro === 'insoluti');
  };

  const handleResetFiltro = () => {
    handleFiltroChange('tutti');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header KPI & Grafici */}
      <CashflowKPI 
        meseSelezionato={meseSelezionato}
        onMeseChange={setMeseSelezionato}
        onFiltroChange={handleFiltroChange}
      />

      {/* 2. Banner Filtro Attivo */}
      {filtroAttivo !== 'tutti' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#6c63ff]/[0.08] border-l-4 border-[#6c63ff] rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-[#6c63ff] shrink-0" />
            <span className="text-sm font-medium text-slate-700">
              {filtroAttivo === 'insoluti' && "⚠️ Mostrando solo inquilini con insoluti"}
              {filtroAttivo === 'incassato' && "✅ Mostrando solo inquilini che hanno pagato nel mese"}
              {filtroAttivo === 'da_incassare' && "⏳ Mostrando solo inquilini con pagamenti mancanti"}
            </span>
          </div>
          <button 
            onClick={handleResetFiltro}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6c63ff] hover:text-[#5a52d5] bg-white px-4 py-2 rounded-md border border-[#6c63ff]/20 shadow-sm transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            <X size={14} />
            Mostra tutti
          </button>
        </div>
      )}

      {/* 3. Tabella Dettaglio */}
      <CashflowTabella 
        filtroAttivo={filtroAttivo}
        onlyInsoluti={onlyInsoluti}
        meseSelezionato={meseSelezionato}
      />

    </div>
  );
};
