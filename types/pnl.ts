export type PnlRowType = 'section' | 'row' | 'subtotal' | 'total' | 'gross' | 'gross2';

export interface PnlRow {
  type: PnlRowType;
  label: string;
  value?: number | null;
  percentage?: number | null;
  isNegative?: boolean;
}

export interface PnlKpi {
  stanze_attive: number;
  stanze_affittate: number;
  stanze_libere: number;
  tasso_occupazione: number;
}

export interface PnlKpiRiunioni {
  sale_attive: number;
  sale_prenotate: number;
  sale_libere: number;
  ore_vendute: number;
}

export interface PnlFiltersGenerale {
  cities: string[];
  dateFrom: string;   // formato "YYYY-MM"
  dateTo: string;
}

export interface PnlFiltersRiunioni {
  cities: string[];
  year: number;
  month: number | null;  // null = tutto l'anno
}
