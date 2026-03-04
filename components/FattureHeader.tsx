import React from 'react';
import { Plus } from 'lucide-react';

interface FattureHeaderProps {
  kpiTotal: number;
  kpiToCollect: number;
  kpiUnpaid: number;
  onGeneraFatture: () => void;
}

export const FattureHeader: React.FC<FattureHeaderProps> = ({
  kpiTotal,
  kpiToCollect,
  kpiUnpaid,
  onGeneraFatture
}) => {

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  // Calcolo Percentuale Obiettivo (Incassato / Totale)
  const collected = kpiTotal - kpiToCollect;
  const percentage = kpiTotal > 0 ? Math.round((collected / kpiTotal) * 100) : 0;
  
  // Calcolo cerchio SVG
  // Size 48px (w-12). Center 24, 24.
  // Radius 16 (Reduced from 18 to fix overflow/clipping with stroke)
  // Diameter 32. Stroke 4 -> Outer Diameter 36. Fits comfortably in 48px.
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border-b border-slate-200 pb-8 transition-all">
      
      <div className="px-8 pt-8 pb-2 space-y-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fatture</h1>

        {/* KPI CARDS ROW */}
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
          
          <div className="flex flex-wrap gap-4 flex-1 w-full">
            
            {/* Card 1: Totale Mese */}
            <div className="flex-1 min-w-[200px] bg-[#eff6ff] rounded-2xl p-5 border border-blue-100 flex flex-col justify-center min-h-[100px]">
               <span className="text-[11px] font-bold text-[#60a5fa] uppercase tracking-wider mb-1">Totale Mese</span>
               <span className="text-2xl font-bold text-[#1e3a8a]">{formatCurrency(kpiTotal)}</span>
            </div>

            {/* Card 2: Da Incassare */}
            <div className="flex-1 min-w-[200px] bg-[#fff7ed] rounded-2xl p-5 border border-orange-100 flex flex-col justify-center min-h-[100px]">
               <span className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider mb-1 opacity-60">Da Incassare</span>
               <span className="text-2xl font-bold text-[#7c2d12]">{formatCurrency(kpiToCollect)}</span>
            </div>

            {/* Card 3: Insolute */}
            <div className="flex-1 min-w-[200px] bg-[#fef2f2] rounded-2xl p-5 border border-red-100 flex flex-col justify-center min-h-[100px]">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[11px] font-bold text-[#f87171] uppercase tracking-wider">Insolute</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-[#991b1b]">{kpiUnpaid}</span>
                 <span className="text-sm font-medium text-[#ef4444] opacity-80">{formatCurrency(0)}</span> 
               </div>
            </div>

            {/* Card 4: Obiettivo */}
            <div className="flex-1 min-w-[240px] bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-4 min-h-[100px] shadow-sm">
               {/* SVG Circular Chart with Precise Centering */}
               <div className="relative w-12 h-12 flex-shrink-0">
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                    <circle
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="24"
                      cy="24"
                    />
                    {/* Progress Circle */}
                    <circle
                      className="text-[#1e40af]"
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="24"
                      cy="24"
                    />
                  </svg>
                  {/* Percentage Text Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#1e40af] leading-none ml-[1px]">{percentage}%</span>
                  </div>
               </div>
               
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Obiettivo</span>
                 <span className="text-lg font-bold text-slate-800">Incassato</span>
               </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="flex flex-col items-stretch sm:items-end gap-2 w-full xl:w-auto mt-4 xl:mt-0">
            <button 
              onClick={onGeneraFatture}
              className="w-full xl:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-orange-500/20 active:scale-95"
            >
              <Plus size={24} strokeWidth={3} />
              <span>Genera Fatture</span>
            </button>
            <span className="text-xs text-slate-400 font-medium pr-1 text-center sm:text-right">Inizia a generare nuovi documenti fiscali</span>
          </div>

        </div>
      </div>
    </div>
  );
};