import React from 'react';
import { PnlRow } from '../types/pnl';
import { formatEuro, formatPercent, formatPerUnit } from '../utils/pnlFormatters';

interface PnlTableProps {
  rows: PnlRow[];
  unitCount: number;
  unitLabel?: string;
  loading?: boolean;
}

export const PnlTable: React.FC<PnlTableProps> = ({
  rows,
  unitCount,
  unitLabel = '€ / Stanza',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f9fafb] border-b border-slate-200">
            <tr>
              <th scope="col" className="w-[46%] py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Voce</th>
              <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">Valore (€)</th>
              <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">% Ricavi</th>
              <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">{unitLabel}</th>
            </tr>
          </thead>
          <tbody className="animate-pulse">
            {Array.from({ length: 14 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="py-3 px-4">
                  <div className={`h-4 bg-[#e5e7eb] rounded ${i % 4 === 0 ? 'w-1/3' : i % 3 === 0 ? 'w-1/2' : 'w-2/3'}`}></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-[#e5e7eb] rounded w-24 ml-auto"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-[#e5e7eb] rounded w-12 ml-auto"></div>
                </td>
                <td className="py-3 px-4 text-right bg-[#fafeff]">
                  <div className="h-4 bg-[#e5e7eb] rounded w-16 ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const renderValue = (value: number | null | undefined, isNegative?: boolean) => {
    if (value === null || value === undefined) return formatEuro(value);
    
    // If it's explicitly marked as negative, or if the value itself is negative
    const isNeg = isNegative || value < 0;
    const absValue = Math.abs(value);
    const formatted = formatEuro(absValue);
    
    if (isNeg && absValue > 0) {
      return <span className="text-[#dc2626]">({formatted})</span>;
    }
    return formatted;
  };

  const renderPerUnit = (value: number | null | undefined, isNegative?: boolean) => {
    if (value === null || value === undefined || unitCount === 0) return formatPerUnit(value, unitCount);
    
    const isNeg = isNegative || value < 0;
    const absValue = Math.abs(value);
    const formatted = formatPerUnit(absValue, unitCount);
    
    if (isNeg && absValue > 0) {
      return <span className="text-[#dc2626]">({formatted})</span>;
    }
    return formatted;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#f9fafb] border-b border-slate-200">
          <tr>
            <th scope="col" className="w-[46%] py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Voce</th>
            <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">Valore (€)</th>
            <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">% Ricavi</th>
            <th scope="col" className="py-3 px-4 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-right">{unitLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            if (row.type === 'section') {
              return (
                <tr key={index} className="bg-[#f9fafb]">
                  <td 
                    colSpan={4} 
                    className="pt-[14px] pb-[6px] px-4 text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider"
                  >
                    {row.label}
                  </td>
                </tr>
              );
            }

            let rowClass = "";
            let labelClass = "";
            let valueClass = "tabular-nums text-right py-2.5 px-4";
            let pctClass = "tabular-nums text-right py-2.5 px-4 text-[12px] text-[#6b7280]";
            let unitClass = "tabular-nums text-right py-2.5 px-4 bg-[#fafeff]";

            let badge = null;

            switch (row.type) {
              case 'row':
                rowClass = "bg-white hover:bg-[#fafafa] border-b border-slate-50 last:border-0";
                labelClass = "text-[#374151] text-sm py-2.5 px-4";
                break;
              case 'subtotal':
                rowClass = "bg-[#f0f9ff] border-t border-b border-[#e0f2fe]";
                labelClass = "text-[#111827] font-bold text-sm py-2.5 px-4";
                valueClass += " font-bold text-[#111827]";
                unitClass += " font-bold text-[#111827]";
                break;
              case 'total':
                rowClass = "bg-[#f8fafc] border-t-2 border-[#e5e7eb]";
                labelClass = "text-[#111827] font-bold text-[13.5px] py-3 px-4 flex items-center gap-2";
                valueClass += " font-bold text-[#111827] text-[13.5px]";
                unitClass += " font-bold text-[#111827] text-[13.5px]";
                badge = <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] shrink-0">=</span>;
                break;
              case 'gross':
                rowClass = "bg-[#ecfdf5] border-t-2 border-[#a7f3d0]";
                labelClass = "text-[#065f46] font-bold text-[13.5px] py-3 px-4 flex items-center gap-2";
                valueClass += " font-bold text-[#065f46] text-[13.5px]";
                unitClass += " font-bold text-[#065f46] text-[13.5px]";
                badge = <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#10b981] text-white text-[8px] shrink-0">▲</span>;
                break;
              case 'gross2':
                rowClass = "bg-[#f0fdf4] border-b border-emerald-50/50";
                labelClass = "text-[#065f46] italic text-[12.5px] py-2 px-4";
                valueClass += " text-[#065f46] text-[12.5px]";
                unitClass += " text-[#065f46] text-[12.5px]";
                break;
            }

            return (
              <tr 
                key={index} 
                className={rowClass}
                aria-label={`${row.label}: ${row.value ? formatEuro(row.value) : 'N/A'}`}
              >
                <td className={labelClass}>
                  {badge}
                  {row.label}
                </td>
                <td className={valueClass}>
                  {renderValue(row.value, row.isNegative)}
                </td>
                <td className={pctClass}>
                  {formatPercent(row.percentage)}
                </td>
                <td className={unitClass}>
                  {renderPerUnit(row.value, row.isNegative)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
