import { FilterState } from '../../types/kpi';

export const COLORS = {
  grossMargin: {
    target: '#F97316',
    above: '#E8F5E9',
    below: '#FFEBEE',
    line: '#1E7D45'
  },
  costs: {
    fixed: '#595959',
    variable: '#C55A11'
  },
  rent: {
    passive: '#C62828',
    revenue: '#1E7D45'
  },
  scatter: {
    positive: '#1E7D45',
    negative: '#C62828'
  },
  expansion: {
    bar: '#E65100',
    trend: '#C55A11'
  }
};

// Types
export interface MonthlyData {
  month: string;
  [key: string]: string | number;
}

export interface GrossMarginData {
  month: string;
  value: number;
  target: number;
}

export interface CostData {
  month: string;
  fixed: number;
  variable: number;
}

export interface RentData {
  room: string;
  passive: number;
  revenue: number;
}

export interface ScatterData {
  room: string;
  margin: number;
}

export interface ExpansionData {
  month: string;
  leads: number;
  trend: number;
}

export interface Area3Data {
  grossMargin: GrossMarginData[];
  operationalCosts: CostData[];
  rentComparison: RentData[];
  marginDistribution: ScatterData[];
  expansionPerformance: ExpansionData[];
}

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

export const getArea3Data = (filter: FilterState): Area3Data => {
  // Mock logic based on filter
  
  // 1. Gross Margin %
  const grossMargin = months.map(month => ({
    month,
    value: parseFloat((35 + Math.random() * 15).toFixed(1)), // 35-50%
    target: 40
  }));

  // 2. Operational Costs (Stacked)
  const operationalCosts = months.map(month => ({
    month,
    fixed: Math.floor(Math.random() * 5000) + 10000,
    variable: Math.floor(Math.random() * 3000) + 2000
  }));

  // 3. Passive Rents vs Room Revenue
  const rooms = ['R-101', 'R-102', 'R-103', 'R-104', 'R-105', 'R-106', 'R-107', 'R-108'];
  const rentComparison = rooms.map(room => ({
    room,
    passive: Math.floor(Math.random() * 400) + 300,
    revenue: Math.floor(Math.random() * 600) + 400
  }));

  // 4. Margin Distribution (Scatter)
  const marginDistribution = [];
  for (let i = 0; i < 30; i++) {
    marginDistribution.push({
      room: `R-${100 + i}`,
      margin: Math.floor(Math.random() * 800) - 200 // -200 to +600
    });
  }

  // 5. Expansion Performance
  const expansionPerformance = months.map((month, idx) => {
    const leads = Math.floor(Math.random() * 50) + 20 + (idx * 2);
    return {
      month,
      leads,
      trend: leads * 0.9 // Simple trend
    };
  });

  return {
    grossMargin,
    operationalCosts,
    rentComparison,
    marginDistribution,
    expansionPerformance
  };
};
