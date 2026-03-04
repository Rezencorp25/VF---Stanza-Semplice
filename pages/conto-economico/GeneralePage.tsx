import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { ChevronDown, ChevronUp, Download, FileText, Loader2, TrendingUp, Building2, Key, DoorOpen, Percent, DollarSign } from 'lucide-react';
import { PnlTable } from '../../components/PnlTable';
import { mockPnlGenerale, mockPnlKpiGenerale } from '../../data/pnlMock';
import { MonthlyNotes, Note } from '../../components/pnl/MonthlyNotes';
import { CityMultiSelect } from '../../components/pnl/CityMultiSelect';

const CITIES = [
  'ADMIN-CENTRALE', 'Bologna', 'Brescia', 'Milano', 
  'Modena', 'Reggio Emilia', 'Trento', 'Verona'
];

const MOCK_TREND_DATA = [
  { name: 'Gen', grossMargin: 89.1, ebitda: 87.2 },
  { name: 'Feb', grossMargin: 89.5, ebitda: 87.5 },
  { name: 'Mar', grossMargin: 90.2, ebitda: 88.1 },
  { name: 'Apr', grossMargin: 89.8, ebitda: 87.9 },
  { name: 'Mag', grossMargin: 90.5, ebitda: 88.4 },
  { name: 'Giu', grossMargin: 91.0, ebitda: 88.9 },
  { name: 'Lug', grossMargin: 90.8, ebitda: 88.7 },
  { name: 'Ago', grossMargin: 89.9, ebitda: 87.8 },
  { name: 'Set', grossMargin: 90.4, ebitda: 88.3 },
  { name: 'Ott', grossMargin: 90.7, ebitda: 88.6 },
  { name: 'Nov', grossMargin: 90.1, ebitda: 88.0 },
  { name: 'Dic', grossMargin: 89.94, ebitda: 88.48 },
];

const INITIAL_NOTES: Note[] = [
  { id: '1', text: 'Ottimo risultato nel Q4, i costi operativi sono diminuiti.', timestamp: new Date(2026, 11, 28, 14, 30) },
  { id: '2', text: 'Da verificare le spese di manutenzione su Milano per il mese di marzo.', timestamp: new Date(2026, 2, 15, 9, 15) }
];

export interface GeneralePageProps {
  onNavigate?: (view: any) => void;
}

export const GeneralePage: React.FC<GeneralePageProps> = ({ onNavigate }) => {
  // Filters State
  const [selectedCities, setSelectedCities] = useState<string[]>(CITIES);
  const [dateFrom, setDateFrom] = useState('2026-01');
  const [dateTo, setDateTo] = useState('2026-12');
  const [viewMode, setViewMode] = useState<'mensile' | 'annuale'>('annuale');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [showTrend, setShowTrend] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    // TODO: Integrazione futura con API reale
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const formatTooltip = (value: number | string | Array<number | string>) => `${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 1. HEADER PAGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Conto Economico — Generale</h1>
          <p className="text-slate-500 text-sm mt-1">P&L aggregato per tutte le strutture selezionate</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all shadow-sm">
            <FileText size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA FILTRI ORIZZONTALE */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 lg:px-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <CityMultiSelect 
            cities={CITIES}
            selectedCities={selectedCities}
            onChange={setSelectedCities}
          />

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dal</label>
            <input 
              type="month" 
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Al</label>
            <input 
              type="month" 
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider opacity-0">Vista</label>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setViewMode('mensile')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'mensile' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mensile
              </button>
              <button 
                onClick={() => setViewMode('annuale')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'annuale' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Annuale
              </button>
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 h-[42px]"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Aggiornamento...</>
            ) : (
              'Aggiorna'
            )}
          </button>
        </div>

        {/* NAVIGAZIONE RAPIDA IN PAGINA */}
        <div className="flex justify-end gap-4 mt-4 pt-3 border-t border-slate-100">
          <button onClick={() => onNavigate?.('PNL_MEETINGS')} className="text-[#6b7280] font-medium text-[12px] hover:text-orange-500 transition-colors flex items-center gap-1">
            Vai a Riunioni <span className="text-lg leading-none">→</span>
          </button>
          <button onClick={() => onNavigate?.('PNL_CITIES')} className="text-[#6b7280] font-medium text-[12px] hover:text-orange-500 transition-colors flex items-center gap-1">
            Vai a Per Città <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </div>

      {/* 3. STRISCIA KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-800">
            <Building2 size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stanze Attive</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">{mockPnlKpiGenerale.stanze_attive}</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-600">
            <Key size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Affittate</p>
          <p className="text-3xl font-black text-emerald-600 tracking-tight">{mockPnlKpiGenerale.stanze_affittate}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-orange-500">
            <DoorOpen size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Libere</p>
          <p className="text-3xl font-black text-orange-500 tracking-tight">{mockPnlKpiGenerale.stanze_libere}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-600">
            <Percent size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Occupazione</p>
          <p className="text-3xl font-black text-blue-600 tracking-tight">{mockPnlKpiGenerale.tasso_occupazione.toLocaleString('it-IT')}%</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group col-span-2 md:col-span-4 lg:col-span-2">
          <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-600">
            <DollarSign size={80} />
          </div>
          <div className="flex justify-between items-start h-full">
            <div className="flex flex-col justify-between h-full">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Margin</p>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">89,94%</p>
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1">
                  <TrendingUp size={10} className="mr-1" /> +0,8% vs prev
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full text-right">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">EBITDA</p>
              <div>
                <div className="flex items-baseline gap-2 justify-end">
                  <p className="text-2xl font-black text-slate-800 tracking-tight">3.171k €</p>
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1">
                  <TrendingUp size={10} className="mr-1" /> +2,1% vs prev
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PANNELLO TREND MENSILE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowTrend(!showTrend)}
          className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            {showTrend ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            Mostra Trend Mensile
          </span>
        </button>
        
        {showTrend && (
          <div className="p-5 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={MOCK_TREND_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val}%`} domain={['dataMin - 1', 'dataMax + 1']} />
                  <RechartsTooltip 
                    formatter={formatTooltip}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#059669" strokeWidth={2} dot={{r: 4, fill: '#059669'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#f97316" strokeWidth={2} dot={{r: 4, fill: '#f97316'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 5. TABELLA P&L */}
      <PnlTable 
        rows={mockPnlGenerale} 
        unitCount={mockPnlKpiGenerale.stanze_attive} 
        unitLabel="€ / Stanza" 
        loading={loading} 
      />

      {/* 6. NOTE DEL PERIODO */}
      <MonthlyNotes initialNotes={INITIAL_NOTES} />

    </div>
  );
};
