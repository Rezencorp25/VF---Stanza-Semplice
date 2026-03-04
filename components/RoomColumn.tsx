import React from 'react';
import { VirtualRow } from './PlanningSection';
import { Room, Apartment } from '../types';
import { Plus, Building2, BedDouble, ArrowDownWideNarrow } from 'lucide-react';

interface RoomColumnProps {
  virtualRows: VirtualRow[];
  totalHeight: number;
  scrollTop: number;
  onAddRoom: () => void;
}

export const RoomColumn: React.FC<RoomColumnProps> = ({ virtualRows, totalHeight, scrollTop, onAddRoom }) => {
  
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-72 flex-shrink-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      {/* Header Fisso Principale (Matches Month Header: 52px) */}
      <div className="h-[52px] min-h-[52px] flex items-center justify-between px-5 border-b border-slate-200 bg-slate-50/50 backdrop-blur-sm z-30">
        <span className="font-bold text-xs tracking-wider text-slate-400 uppercase">Unità & Stanze</span>
        <button 
          onClick={onAddRoom} 
          className="p-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors text-slate-400"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Sub-Header Fisso (Matches Days Header: 33px) - FIX ALLINEAMENTO */}
      <div className="h-[33px] min-h-[33px] bg-slate-50/50 backdrop-blur-[2px] border-b border-slate-100 flex items-center px-5 z-30">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
           <ArrowDownWideNarrow size={12} />
           <span>Elenco Locali</span>
        </div>
      </div>

      {/* Area Virtualizzata */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {/* Contenitore Phantom per simulare altezza totale (anche se qui non scrolliamo nativamente, serve per riferimento) */}
        <div style={{ height: totalHeight, position: 'relative', transform: `translateY(-${scrollTop}px)` }}>
          
          {virtualRows.map(row => {
            if (row.type === 'header') {
              const apt = row.data as Apartment;
              return (
                <div 
                  key={row.id}
                  className="flex items-center gap-2 px-5 bg-slate-50/80 border-b border-slate-100 absolute w-full"
                  style={{ height: row.height, top: row.top }} 
                >
                  <Building2 size={12} className="text-slate-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    Int. {apt.unitNumber}
                  </span>
                </div>
              );
            } else {
              const room = row.data as Room;
              return (
                <div 
                  key={row.id}
                  className="flex flex-col justify-center px-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group absolute w-full"
                  style={{ height: row.height, top: row.top }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">
                      {room.name}
                    </span>
                    {room.type === 'suite' && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100 font-bold">
                        Suite
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <BedDouble size={10} />
                      {room.type === 'single' ? 'Singola' : room.type === 'double' ? 'Doppia' : 'Tripla'}
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">{room.city}</span>
                  </div>
                </div>
              );
            }
          })}
          
        </div>
      </div>
    </div>
  );
};