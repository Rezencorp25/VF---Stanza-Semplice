import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ChevronDown, ChevronUp, Download, FileText, Loader2, TrendingUp, TrendingDown, Users, Building2, Key, DoorOpen, Clock, DollarSign, Activity } from 'lucide-react';
import { PnlTable } from '../../components/PnlTable';
import { mockPnlRiunioni, mockPnlKpiRiunioni } from '../../data/pnlMock';
import { MonthlyNotes, Note } from '../../components/pnl/MonthlyNotes';
import { CityMultiSelect } from '../../components/pnl/CityMultiSelect';

const CITIES = [
  'ADMIN-CENTRALE', 'Bologna', 'Brescia', 'Milano', 
  'Modena', 'Reggio Emilia', 'Trento', 'Verona'
];

const MONTHS = [
  { id: '01', label: 'Gen' }, { id: '02', label: 'Feb' }, { id: '03', label: 'Mar' },
  { id: '04', label: 'Apr' }, { id: '05', label: 'Mag' }, { id: '06', label: 'Giu' },
  { id: '07', label: 'Lug' }, { id: '08', label: 'Ago' }, { id: '09', label: 'Set' },
  { id: '10', label: 'Ott' }, { id: '11', label: 'Nov' }, { id: '12', label: 'Dic' }
];

const MOCK_BAR_DATA = [
  { name: 'Gen', ricavi: 490000, gross: 430000 },
  { name: 'Feb', ricavi: 513447, gross: 448215 },
  { name: 'Mar', ricavi: 520000, gross: 455000 },
  { name: 'Apr', ricavi: 480000, gross: 420000 },
  { name: 'Mag', ricavi: 530000, gross: 460000 },
  { name: 'Giu', ricavi: 540000, gross: 470000 },
  { name: 'Lug', ricavi: 450000, gross: 390000 },
  { name: 'Ago', ricavi: 380000, gross: 320000 },
  { name: 'Set', ricavi: 550000, gross: 480000 },
  { name: 'Ott', ricavi: 560000, gross: 490000 },
  { name: 'Nov', ricavi: 545000, gross: 475000 },
  { name: 'Dic', ricavi: 500000, gross: 435000 },
];

const INITIAL_NOTES: Note[] = [
  { id: '1', text: 'Ottimo andamento delle prenotazioni a Febbraio, trainato dagli eventi su Milano.', timestamp: new Date(2026, 1, 28, 10, 15) }
];

export const RiunioniPage: React.FC = () => {
  // Filters State
  const [selectedCities, setSelectedCities] = useState<string[]>(CITIES);
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('02'); // Default Febbraio
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleMonthPillClick = (m: string) => {
    setMonth(m);
    handleUpdate();
  };

  const formatTooltip = (value: number | string | Array<number | string>) => `${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;

  const ricavoPerOra = mockPnlRiunioni.find(r => r.label === 'Totale ricavi netti')?.value! / mockPnlKpiRiunioni.ore_vendute;
  const utilizzoSale = (mockPnlKpiRiunioni.sale_prenotate / mockPnlKpiRiunioni.sale_attive) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 1. HEADER PAGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Conto Economico — Riunioni</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
              <Users size={14} />
              <span className="text-xs font-bold tracking-wide">PNL Meetings</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm">P&L dedicato alle sale riunioni — filtrabile per mese e anno</p>
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

          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Anno</label>
            <select 
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mese</label>
            <select 
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            >
              <option value="">— Tutto l'anno —</option>
              {MONTHS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
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

        {/* TAB MESI A PILLOLE */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
          {MONTHS.map(m => (
            <button
              key={m.id}
              onClick={() => handleMonthPillClick(m.id)}
              className={`
                px-3 py-1.5 text-xs font-bold rounded-md transition-all border
                ${month === m.id 
                  ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500'}
              `}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* BANNER CONFRONTO MESE PRECEDENTE */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-3 text-sm shadow-sm">
        <span className="font-bold text-emerald-900">vs Gennaio 2026:</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center text-emerald-700 font-medium bg-white px-2 py-1 rounded-md border border-emerald-100 shadow-sm">
            Gross Margin +2,3% <TrendingUp size={14} className="ml-1" />
          </span>
          <span className="flex items-center text-red-600 font-medium bg-white px-2 py-1 rounded-md border border-red-100 shadow-sm">
            EBITDA -1,1% <TrendingDown size={14} className="ml-1" />
          </span>
          <span className="flex items-center text-emerald-700 font-medium bg-white px-2 py-1 rounded-md border border-emerald-100 shadow-sm">
            Ore vendute +180 h <TrendingUp size={14} className="ml-1" />
          </span>
        </div>
      </div>

      {/* 3. STRISCIA KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-800">
            <Building2 size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sale Attive</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">{mockPnlKpiRiunioni.sale_attive}</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-600">
            <Key size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prenotate</p>
          <p className="text-3xl font-black text-emerald-600 tracking-tight">{mockPnlKpiRiunioni.sale_prenotate}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-orange-500">
            <DoorOpen size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Libere</p>
          <p className="text-3xl font-black text-orange-500 tracking-tight">{mockPnlKpiRiunioni.sale_libere}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-purple-600">
            <Clock size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ore Vendute</p>
          <p className="text-3xl font-black text-purple-600 tracking-tight">{mockPnlKpiRiunioni.ore_vendute.toLocaleString('it-IT')} <span className="text-lg font-bold text-purple-400">h</span></p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-600">
            <DollarSign size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ricavo/Ora</p>
          <p className="text-3xl font-black text-blue-600 tracking-tight">{ricavoPerOra.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-blue-400">€</span></p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-800">
            <Activity size={64} />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Utilizzo Sale</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-slate-800 tracking-tight">{utilizzoSale.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</p>
          </div>
          <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${utilizzoSale > 80 ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
            {utilizzoSale > 80 ? 'Ottimo' : 'Basso'}
          </span>
        </div>
      </div>

      {/* 4. GRAFICO A BARRE MENSILE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowChart(!showChart)}
          className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            {showChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            Mostra Andamento Mensile (Ricavi vs Gross)
          </span>
        </button>
        
        {showChart && (
          <div className="p-5 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BAR_DATA} margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val / 1000}k`} />
                  <RechartsTooltip 
                    formatter={formatTooltip}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="ricavi" name="Ricavi Netti" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="gross" name="Gross Margin" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 5. TABELLA P&L */}
      <PnlTable 
        rows={mockPnlRiunioni} 
        unitCount={mockPnlKpiRiunioni.sale_attive} 
        unitLabel="€ / Sala" 
        loading={loading} 
      />

      {/* 6. NOTE DEL PERIODO */}
      <MonthlyNotes initialNotes={INITIAL_NOTES} />

    </div>
  );
};
