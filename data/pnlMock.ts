import { PnlRow, PnlKpi, PnlKpiRiunioni } from '../types/pnl';

export const mockPnlKpiGenerale: PnlKpi = {
  stanze_attive: 866,
  stanze_affittate: 805,
  stanze_libere: 61,
  tasso_occupazione: 92.96
};

export const mockPnlGenerale: PnlRow[] = [
  { type: 'section', label: 'Ricavi' },
  { type: 'row', label: 'Ricavi strutturali', value: 3594859.85, percentage: 98.23 },
  { type: 'row', label: 'Ricavi quote utenze', value: 248463.64, percentage: 6.93 },
  { type: 'row', label: 'Note di credito', value: 306813.20, percentage: 8.38, isNegative: true },
  { type: 'subtotal', label: 'Ricavi strutturali netti', value: 3535510.29, percentage: 96.63 },
  { type: 'row', label: 'Altri ricavi', value: 64958.81, percentage: 1.77 },
  { type: 'row', label: 'Note di credito (altri ricavi)', value: 4581.40, percentage: 0.13, isNegative: true },
  { type: 'row', label: 'Registrazione contratti', value: 12617.49, percentage: 0.35 },
  { type: 'total', label: 'Totale ricavi netti', value: 3584270.21, percentage: 97.94 },
  { type: 'section', label: 'Costi per il Gross' },
  { type: 'row', label: 'Affitti passivi', value: 264186.50, percentage: 7.37 },
  { type: 'row', label: 'Spese condominiali ed utilities', value: 87967.69, percentage: 2.45 },
  { type: 'row', label: 'Spese di mantenimento immobili', value: 7931.14, percentage: 0.22 },
  { type: 'row', label: 'Spese per pulizie', value: 370.00, percentage: 0.01 },
  { type: 'subtotal', label: 'Totale costi per il gross', value: 360455.33, percentage: 10.06 },
  { type: 'gross', label: 'Gross Margin', value: 3223814.88, percentage: 89.94 },
  { type: 'gross2', label: 'Gross includendo la quota ristrutturazioni', value: 3223814.88, percentage: 89.94 },
  { type: 'section', label: 'Costi Operativi' },
  { type: 'row', label: 'Commissioni bancarie, fintech e carte di credito', value: 4229.37, percentage: 0.12 },
  { type: 'row', label: 'Personale', value: 19760.50, percentage: 0.55 },
  { type: 'row', label: 'Affitto uffici', value: 8696.04, percentage: 0.24 },
  { type: 'row', label: 'Affitto altre strutture', value: 0, percentage: null },
  { type: 'row', label: "Articoli d'ufficio", value: 348.30, percentage: 0.01 },
  { type: 'row', label: 'Marketing', value: 8161.09, percentage: 0.23 },
  { type: 'row', label: 'Contabilità e commercialisti', value: 3789.91, percentage: 0.10 },
  { type: 'row', label: 'Software e abbonamenti', value: 5240.00, percentage: 0.15 },
  { type: 'row', label: 'Consulenze', value: 2100.00, percentage: 0.06 },
  { type: 'subtotal', label: 'Totale costi operativi', value: 52325.21, percentage: 1.46 },
  { type: 'gross', label: 'EBITDA', value: 3171489.67, percentage: 88.48 }
];

export const mockPnlKpiRiunioni: PnlKpiRiunioni = {
  sale_attive: 857,
  sale_prenotate: 768,
  sale_libere: 89,
  ore_vendute: 2340
};

export const mockPnlRiunioni: PnlRow[] = [
  { type: 'section', label: 'Ricavi' },
  { type: 'row', label: 'Ricavi strutturali', value: 484969.02, percentage: 92.56 },
  { type: 'row', label: 'Ricavi quote utenze', value: 33445.46, percentage: 6.51 },
  { type: 'row', label: 'Note di credito', value: 42458.88, percentage: 8.10, isNegative: true },
  { type: 'subtotal', label: 'Ricavi strutturali netti', value: 475955.60, percentage: 90.84 },
  { type: 'row', label: 'Altri ricavi', value: 39004.54, percentage: 7.44 },
  { type: 'row', label: 'Note di credito (altri ricavi)', value: 676.45, percentage: 0.13, isNegative: true },
  { type: 'row', label: 'Registrazione contratti', value: 836.69, percentage: 0.16 },
  { type: 'total', label: 'Totale ricavi netti', value: 513447.00, percentage: 97.99 },
  { type: 'section', label: 'Costi per il Gross' },
  { type: 'row', label: 'Affitti passivi', value: 38791.69, percentage: 7.56 },
  { type: 'row', label: 'Spese condominiali ed utilities', value: 25918.75, percentage: 5.05 },
  { type: 'row', label: 'Spese di mantenimento immobili', value: 520.98, percentage: 0.10 },
  { type: 'row', label: 'Spese per pulizie', value: 0, percentage: null },
  { type: 'subtotal', label: 'Totale costi per il gross', value: 65231.42, percentage: 12.70 },
  { type: 'gross', label: 'Gross Margin', value: 448215.58, percentage: 87.30 },
  { type: 'gross2', label: 'Gross includendo la quota ristrutturazioni', value: 448215.58, percentage: 87.30 },
  { type: 'section', label: 'Costi Operativi' },
  { type: 'row', label: 'Commissioni bancarie, fintech e carte di credito', value: 535.09, percentage: 0.10 },
  { type: 'row', label: 'Personale', value: 19399.99, percentage: 3.78 },
  { type: 'row', label: 'Affitto uffici', value: 2954.60, percentage: 0.58 },
  { type: 'row', label: 'Affitto altre strutture', value: 0, percentage: null },
  { type: 'row', label: "Articoli d'ufficio", value: 80.00, percentage: 0.02 },
  { type: 'row', label: 'Marketing', value: 3092.50, percentage: 0.60 },
  { type: 'row', label: 'Contabilità e commercialisti', value: 1733.91, percentage: 0.34 },
  { type: 'row', label: 'Software e abbonamenti', value: 1240.00, percentage: 0.24 },
  { type: 'row', label: 'Attrezzature sala', value: 620.00, percentage: 0.12 },
  { type: 'subtotal', label: 'Totale costi operativi', value: 29656.09, percentage: 5.78 },
  { type: 'gross', label: 'EBITDA', value: 418559.49, percentage: 81.52 }
];
