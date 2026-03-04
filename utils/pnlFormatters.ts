export function formatEuro(v: number | null | undefined): string {
  if (v === null || v === undefined || v === 0) return "—";
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(v);
}

export function formatPercent(p: number | null | undefined): string {
  if (p === null || p === undefined) return "—";
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(p) + '%';
}

export function formatPerUnit(v: number | null | undefined, n: number): string {
  if (v === null || v === undefined || v === 0 || n === 0) return "—";
  return formatEuro(v / n);
}
