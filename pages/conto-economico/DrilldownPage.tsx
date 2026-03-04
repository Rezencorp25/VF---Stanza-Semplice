import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { ChevronDown, ChevronUp, Loader2, MapPin } from 'lucide-react';
import { PnlTable } from '../../components/PnlTable';
import { mockPnlGenerale } from '../../data/pnlMock';
import { PnlRow } from '../../types/pnl';

const MONTHS = [
  { id: '01', label: 'Gen' }, { id: '02', label: 'Feb' }, { id: '03', label: 'Mar' },
  { id: '04', label: 'Apr' }, { id: '05', label: 'Mag' }, { id: '06', label: 'Giu' },
  { id: '07', label: 'Lug' }, { id: '08', label: 'Ago' }, { id: '09', label: 'Set' },
  { id: '10', label: 'Ott' }, { id: '11', label: 'Nov' }, { id: '12', label: 'Dic' }
];

const TOTAL_RICAVI = 3584270.21;
const NAZIONALE_OCCUPAZIONE = 92.9;
const NAZIONALE_GROSS = 89.94;

const CITIES_DATA = [
  { id: 'BOL', name: 'Bologna', volume: 0.30, stanze: 260, occupazione: 93, grossPct: 90.2, ebitdaPct: 88.5 },
  { id: 'MIL', name: 'Milano', volume: 0.25, stanze: 180, occupazione: 89, grossPct: 88.1, ebitdaPct: 86.5 },
  { id: 'VER', name: 'Verona', volume: 0.15, stanze: 140, occupazione: 94, grossPct: 91.0, ebitdaPct: 89.5 },
  { id: 'MOD', name: 'Modena', volume: 0.12, stanze: 115, occupazione: 91, grossPct: 89.4, ebitdaPct: 88.0 },
  { id: 'BRE', name: 'Brescia', volume: 0.08, stanze: 80, occupazione: 87, grossPct: 87.3, ebitdaPct: 85.5 },
  { id: 'TRE', name: 'Trento', volume: 0.06, stanze: 60, occupazione: 95, grossPct: 92.1, ebitdaPct: 90.5 },
  { id: 'REG', name: 'Reggio Emilia', volume: 0.04, stanze: 45, occupazione: 88, grossPct: 88.6, ebitdaPct: 87.0 },
];

// Helper to scale the mock PNL for a specific city
const getCityPnl = (volume: number, grossPct: number, ebitdaPct: number): PnlRow[] => {
  return mockPnlGenerale.map(row => {
    if (row.type === 'section') return row;
    
    let newValue = row.value ? row.value * volume : null;
    let newPct = row.percentage;

    // Adjust specific totals to match the city's specific percentages
    if (row.label === 'Gross Margin' || row.label === 'Gross includendo la quota ristrutturazioni') {
      newPct = grossPct;
      newValue = (TOTAL_RICAVI * volume) * (grossPct / 100);
    } else if (row.label === 'EBITDA') {
      newPct = ebitdaPct;
      newValue = (TOTAL_RICAVI * volume) * (ebitdaPct / 100);
    }

    return {
      ...row,
      value: newValue,
      percentage: newPct
    };
  });
};

const formatEuro = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
const formatPct = (val: number) => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val) + '%';

export const DrilldownPage: React.FC = () => {
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const toggleCity = (cityId: string) => {
    setExpandedCity(expandedCity === cityId ? null : cityId);
  };

  // Calculate min/max for the comparative table
  const tableData = useMemo(() => {
    const data = CITIES_DATA.map(city => {
      const ricavi = TOTAL_RICAVI * city.volume;
      const gross = ricavi * (city.grossPct / 100);
      const ebitda = ricavi * (city.ebitdaPct / 100);
      return { ...city, ricavi, gross, ebitda };
    });

    const getMinMax = (key: keyof typeof data[0]) => {
      const values = data.map(d => d[key] as number);
      return { min: Math.min(...values), max: Math.max(...values) };
    };

    return {
      data,
      bounds: {
        ricavi: getMinMax('ricavi'),
        gross: getMinMax('gross'),
        grossPct: getMinMax('grossPct'),
        ebitda: getMinMax('ebitda'),
        ebitdaPct: getMinMax('ebitdaPct'),
        stanze: getMinMax('stanze'),
        occupazione: getMinMax('occupazione')
      }
    };
  }, []);

  const getCellClass = (val: number, bounds: { min: number, max: number }, inverse = false) => {
    const isBest = inverse ? val === bounds.min : val === bounds.max;
    const isWorst = inverse ? val === bounds.max : val === bounds.min;
    if (isBest) return 'bg-[#dcfce7] text-emerald-800 font-bold';
    if (isWorst) return 'bg-[#fee2e2] text-red-800 font-bold';
    return '';
  };

  const getOccupazioneColor = (val: number) => {
    if (val > 85) return 'text-[#059669]';
    if (val >= 70) return 'text-[#f97316]';
    return 'text-[#dc2626]';
  };

  const getOccupazioneBg = (val: number) => {
    if (val > 85) return 'bg-[#059669]';
    if (val >= 70) return 'bg-[#f97316]';
    return 'bg-[#dc2626]';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-800">Confronto Città — Conto Economico</h1>
        </div>
        <p className="text-slate-500 text-sm">Analisi comparativa delle performance economiche per città</p>
      </div>

      {/* FILTRI */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 lg:px-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
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
      </div>

      {/* SEZIONE 1: GRIGLIA CARD CITTÀ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {CITIES_DATA.map((city) => {
          const ricavi = TOTAL_RICAVI * city.volume;
          const gross = ricavi * (city.grossPct / 100);
          const ebitda = ricavi * (city.ebitdaPct / 100);
          const diffMedia = city.grossPct - NAZIONALE_GROSS;
          const isExpanded = expandedCity === city.id;

          return (
            <div key={city.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 font-mono text-xs font-bold rounded">
                    {city.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{city.name}</h3>
                </div>
                <div className="text-[11px] font-medium">
                  {diffMedia >= 0 ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+{formatPct(diffMedia)} vs media</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full">{formatPct(diffMedia)} vs media</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stanze N°</p>
                  <p className="text-lg font-bold text-slate-700">{city.stanze}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Occupazione</p>
                  <p className={`text-lg font-bold ${getOccupazioneColor(city.occupazione)}`}>{city.occupazione}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Margin</p>
                  <p className="text-lg font-bold text-emerald-600">{formatPct(city.grossPct)}</p>
                </div>
              </div>

              <div className="mb-5">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getOccupazioneBg(city.occupazione)}`} 
                    style={{ width: `${city.occupazione}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ricavi Netti</p>
                  <p className="text-sm font-bold text-slate-800">{formatEuro(ricavi)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Margin</p>
                  <p className="text-sm font-bold text-slate-800">{formatEuro(gross)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">EBITDA</p>
                  <p className="text-sm font-bold text-slate-800">{formatEuro(ebitda)}</p>
                </div>
              </div>

              <button 
                onClick={() => toggleCity(city.id)}
                className="mt-auto w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                {isExpanded ? 'Chiudi dettaglio' : 'Vedi dettaglio'}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                  <PnlTable 
                    rows={getCityPnl(city.volume, city.grossPct, city.ebitdaPct)} 
                    unitCount={city.stanze} 
                    loading={loading}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEZIONE 3: GRAFICO COMPARATIVO */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Confronto Margini per Città</h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={CITIES_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val}%`} domain={[80, 95]} />
              <RechartsTooltip 
                formatter={(value: number) => `${formatPct(value)}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={NAZIONALE_GROSS} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Media Naz. Gross', fill: '#64748b', fontSize: 10 }} />
              <Bar dataKey="grossPct" name="Gross Margin %" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="ebitdaPct" name="EBITDA %" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEZIONE 2: TABELLA COMPARATIVA */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Tabella Comparativa Dettagliata</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f9fafb] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider sticky left-0 bg-[#f9fafb]">Metrica</th>
                {tableData.data.map(city => (
                  <th key={city.id} className="py-3 px-4 text-right">
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded">
                      {city.id}
                    </span>
                  </th>
                ))}
                <th className="py-3 px-4 text-right text-[11px] font-bold text-slate-800 uppercase tracking-wider bg-slate-50">Totale</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">Ricavi Netti (€)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.ricavi, tableData.bounds.ricavi)}`}>
                    {formatEuro(city.ricavi)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatEuro(TOTAL_RICAVI)}</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">Gross Margin (€)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.gross, tableData.bounds.gross)}`}>
                    {formatEuro(city.gross)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatEuro(TOTAL_RICAVI * (NAZIONALE_GROSS/100))}</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">Gross Margin (%)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.grossPct, tableData.bounds.grossPct)}`}>
                    {formatPct(city.grossPct)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatPct(NAZIONALE_GROSS)}</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">EBITDA (€)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.ebitda, tableData.bounds.ebitda)}`}>
                    {formatEuro(city.ebitda)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatEuro(3171489.67)}</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">EBITDA (%)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.ebitdaPct, tableData.bounds.ebitdaPct)}`}>
                    {formatPct(city.ebitdaPct)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatPct(88.48)}</td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">N° Stanze</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.stanze, tableData.bounds.stanze)}`}>
                    {city.stanze}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">880</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700 sticky left-0 bg-white">Occupazione (%)</td>
                {tableData.data.map(city => (
                  <td key={city.id} className={`py-3 px-4 text-right tabular-nums ${getCellClass(city.occupazione, tableData.bounds.occupazione)}`}>
                    {formatPct(city.occupazione)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-bold bg-slate-50">{formatPct(NAZIONALE_OCCUPAZIONE)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
