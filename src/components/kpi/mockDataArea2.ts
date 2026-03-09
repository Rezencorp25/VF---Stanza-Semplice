import { FilterState } from '../../types/kpi';

export const COLORS = {
  structural: ['#1B4F9C', '#4285F4', '#8AB4F8', '#D2E3FC'], // Blue shades
  orange: '#E65100',
  red: '#C62828',
  green: '#1E7D45',
  darkBg: '#1A1A1A',
  categories: ['#1B4F9C', '#C55A11', '#1E7D45', '#5B2C8D'], // Distinct colors
  funnel: ['#1B4F9C', '#1976D2', '#2196F3', '#64B5F6', '#90CAF9'] // Gradient blues
};

// Types
export interface MonthlyData {
  month: string;
  [key: string]: string | number;
}

export interface PriceDistributionData {
  range: string;
  value: number;
}

export interface RangeData {
  month: string;
  avg: number;
  min: number;
  max: number;
}

export interface CreditNoteData {
  month: string;
  value: number;
  count: number;
}

export interface FunnelStep {
  step: string;
  value: number;
  percentage: number;
  fill: string;
}

export interface Area2Data {
  structuralRevenue: MonthlyData[];
  priceDistribution: PriceDistributionData[];
  otherRevenue: MonthlyData[];
  avgRoomRevenue: RangeData[];
  creditNotes: CreditNoteData[];
  revenueFunnel: FunnelStep[];
}

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

export const getArea2Data = (filter: FilterState): Area2Data => {
  // Mock logic based on filter
  let keys: string[] = [];
  if (filter.groupBy === 'cities') {
    keys = filter.cities.length > 0 ? filter.cities : ['Milano', 'Roma', 'Torino', 'Bologna'];
  } else if (filter.groupBy === 'areas') {
    keys = filter.areas.length > 0 ? filter.areas : ['Nord', 'Centro', 'Sud'];
  } else {
    keys = filter.groups.length > 0 ? filter.groups : ['GC1', 'GC2', 'GC3'];
  }
  const activeKeys = keys.slice(0, 4);

  // 1. Structural Revenue (Stacked)
  const structuralRevenue = months.map(month => {
    const entry: MonthlyData = { month };
    let total = 0;
    activeKeys.forEach(key => {
      const val = Math.floor(Math.random() * 10000) + 5000;
      entry[key] = val;
      total += val;
    });
    entry['total'] = total;
    return entry;
  });

  // 2. Price Distribution
  const priceRanges = ['<300€', '300-400€', '400-500€', '500-600€', '>600€'];
  const priceDistribution = priceRanges.map(range => ({
    range,
    value: Math.floor(Math.random() * 50) + 10
  }));

  // 3. Other Revenue (Grouped)
  const categories = ['Servizi', 'Penali', 'Extra', 'Altro'];
  const otherRevenue = months.map(month => {
    const entry: MonthlyData = { month };
    categories.forEach(cat => {
      entry[cat] = Math.floor(Math.random() * 1000) + 100;
    });
    return entry;
  });

  // 4. Avg Room Revenue (Range)
  const avgRoomRevenue = months.map(month => {
    const avg = 450 + Math.random() * 50;
    return {
      month,
      avg: parseFloat(avg.toFixed(0)),
      min: parseFloat((avg - 50 - Math.random() * 20).toFixed(0)),
      max: parseFloat((avg + 50 + Math.random() * 20).toFixed(0))
    };
  });

  // 5. Credit Notes (Negative)
  const creditNotes = months.map(month => ({
    month,
    value: -1 * (Math.floor(Math.random() * 2000) + 100),
    count: Math.floor(Math.random() * 8)
  }));

  // 6. Revenue Funnel
  const funnelValues = [100000, 85000, 75000, 60000, 55000]; // Decreasing
  const funnelSteps = [
    'Totale Fatturato',
    'Ricavi Netti',
    'Incassato',
    'Margine Lordo',
    'Utile Operativo'
  ];
  const revenueFunnel = funnelSteps.map((step, idx) => ({
    step,
    value: funnelValues[idx],
    percentage: parseFloat(((funnelValues[idx] / funnelValues[0]) * 100).toFixed(1)),
    fill: COLORS.funnel[idx]
  }));

  return {
    structuralRevenue,
    priceDistribution,
    otherRevenue,
    avgRoomRevenue,
    creditNotes,
    revenueFunnel
  };
};
