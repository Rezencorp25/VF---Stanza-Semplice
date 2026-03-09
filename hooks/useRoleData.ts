import { useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface KpiData {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  link: string;
  linkParams?: any;
}

export interface AlertData {
  id: string;
  category: 'pagamenti' | 'manutenzione' | 'occupazione';
  city: string;
  title: string;
  description: string;
  value: number; // Used for threshold logic
  link: string;
}

export type TimeRange = 'today' | '7days' | '30days' | '90days' | 'ytd' | '12months';

export interface RevenueDataPoint {
  name: string;
  value: number;
}

interface RoleData {
  role: UserRole;
  cities: string[];
  properties: string[];
  kpis: KpiData[];
  alerts: AlertData[];
  revenueData: Record<TimeRange, RevenueDataPoint[]>;
}

// Helper to generate mock data
const generateMockData = (multiplier: number): Record<TimeRange, RevenueDataPoint[]> => ({
  today: [
    { name: '00:00', value: 100 * multiplier }, { name: '04:00', value: 120 * multiplier },
    { name: '08:00', value: 300 * multiplier }, { name: '12:00', value: 450 * multiplier },
    { name: '16:00', value: 600 * multiplier }, { name: '20:00', value: 500 * multiplier }
  ],
  '7days': [
    { name: 'Lun', value: 1200 * multiplier }, { name: 'Mar', value: 1500 * multiplier },
    { name: 'Mer', value: 1100 * multiplier }, { name: 'Gio', value: 1800 * multiplier },
    { name: 'Ven', value: 2000 * multiplier }, { name: 'Sab', value: 2500 * multiplier },
    { name: 'Dom', value: 2200 * multiplier }
  ],
  '30days': [
    { name: '1-5', value: 8000 * multiplier }, { name: '6-10', value: 8500 * multiplier },
    { name: '11-15', value: 9000 * multiplier }, { name: '16-20', value: 8200 * multiplier },
    { name: '21-25', value: 9500 * multiplier }, { name: '26-30', value: 10000 * multiplier }
  ],
  '90days': [
    { name: 'Sett 1', value: 15000 * multiplier }, { name: 'Sett 4', value: 16000 * multiplier },
    { name: 'Sett 8', value: 18000 * multiplier }, { name: 'Sett 12', value: 20000 * multiplier }
  ],
  ytd: [
    { name: 'Gen', value: 40000 * multiplier }, { name: 'Feb', value: 30000 * multiplier },
    { name: 'Mar', value: 50000 * multiplier }, { name: 'Apr', value: 45000 * multiplier },
    { name: 'Mag', value: 60000 * multiplier }, { name: 'Giu', value: 55000 * multiplier },
    { name: 'Lug', value: 70000 * multiplier }
  ],
  '12months': [
    { name: 'Ago', value: 65000 * multiplier }, { name: 'Set', value: 68000 * multiplier },
    { name: 'Ott', value: 72000 * multiplier }, { name: 'Nov', value: 75000 * multiplier },
    { name: 'Dic', value: 80000 * multiplier }, { name: 'Gen', value: 40000 * multiplier },
    { name: 'Feb', value: 30000 * multiplier }, { name: 'Mar', value: 50000 * multiplier },
    { name: 'Apr', value: 45000 * multiplier }, { name: 'Mag', value: 60000 * multiplier },
    { name: 'Giu', value: 55000 * multiplier }, { name: 'Lug', value: 70000 * multiplier }
  ]
});

export const useRoleData = (currentRole: UserRole): RoleData => {
  const [data, setData] = useState<RoleData>({
    role: currentRole,
    cities: [],
    properties: [],
    kpis: [],
    alerts: [],
    revenueData: generateMockData(1)
  });

  useEffect(() => {
    // TODO: replace with Firestore query
    // Example: const q = query(collection(db, 'kpis'), where('role', '==', currentRole));
    // For revenue: query(collection(db, 'revenue'), where('date', '>=', startDate), where('role', '==', currentRole))
    
    if (currentRole === UserRole.CITY_MANAGER) {
      setData({
        role: currentRole,
        cities: ['Milano', 'Roma', 'Torino', 'Bologna'],
        properties: [],
        kpis: [
          { id: 'occ', name: 'Occupancy nel tempo', value: '91%', change: '+1.2%', trend: 'up', link: 'KPI', linkParams: { areaId: 'occupancy' } },
          { id: 'rev', name: 'Ricavi Strutturali', value: '€450K', change: '+8%', trend: 'up', link: 'KPI', linkParams: { areaId: 'financial' } },
          { id: 'ten', name: 'Stanze attive', value: '312', change: '+5', trend: 'up', link: 'KPI', linkParams: { areaId: 'occupancy' } }
        ],
        alerts: [
          { id: 'a1', category: 'pagamenti', city: 'Torino', title: 'Affitti non pagati', description: '3 insoluti questo mese', value: 3, link: 'BILLING_PAYMENTS' },
          { id: 'a2', category: 'manutenzione', city: 'Milano', title: 'Ticket critici', description: '5 ticket aperti da > 48h', value: 5, link: 'MANAGEMENT_MAINTENANCE' },
          { id: 'a3', category: 'occupazione', city: 'Roma', title: 'Calo occupazione', description: '-2% stimato prossimo mese', value: -2, link: 'OBJECTS_ROOMS' }
        ],
        revenueData: generateMockData(0.5) // 50% of admin revenue
      });
    } else if (currentRole === UserRole.PROPERTY_MANAGER) {
      setData({
        role: currentRole,
        cities: [],
        properties: ['Via Roma 10', 'Corso Italia 45'],
        kpis: [
          { id: 'occ', name: 'Occupancy nel tempo', value: '98%', change: '+0.5%', trend: 'up', link: 'KPI', linkParams: { areaId: 'occupancy' } },
          { id: 'rev', name: 'Ricavi Strutturali', value: '€85K', change: '-2%', trend: 'down', link: 'KPI', linkParams: { areaId: 'financial' } },
          { id: 'ten', name: 'Stanze attive', value: '45', change: '0', trend: 'neutral', link: 'KPI', linkParams: { areaId: 'occupancy' } }
        ],
        alerts: [
          { id: 'a1', category: 'pagamenti', city: 'Via Roma 10', title: 'Affitti non pagati', description: '0 insoluti', value: 0, link: 'BILLING_PAYMENTS' },
          { id: 'a2', category: 'manutenzione', city: 'Corso Italia 45', title: 'Ticket critici', description: '1 ticket aperto', value: 1, link: 'MANAGEMENT_MAINTENANCE' },
          { id: 'a3', category: 'occupazione', city: 'Via Roma 10', title: 'Calo occupazione', description: 'Nessun calo previsto', value: 0, link: 'OBJECTS_ROOMS' }
        ],
        revenueData: generateMockData(0.1) // 10% of admin revenue
      });
    } else {
      // Default to Admin view
      setData({
        role: currentRole,
        cities: [],
        properties: [],
        kpis: [
          { id: 'occ', name: 'Occupancy nel tempo', value: '94%', change: '+2.4%', trend: 'up', link: 'KPI', linkParams: { areaId: 'occupancy' } },
          { id: 'rev', name: 'Ricavi Strutturali', value: '€1.2M', change: '+12%', trend: 'up', link: 'KPI', linkParams: { areaId: 'financial' } },
          { id: 'ten', name: 'Stanze attive', value: '842', change: '+15', trend: 'up', link: 'KPI', linkParams: { areaId: 'occupancy' } }
        ],
        alerts: [
          { id: 'a1', category: 'pagamenti', city: 'Reggio Emilia', title: 'Affitti non pagati', description: '8 insoluti questo mese', value: 8, link: 'BILLING_PAYMENTS' },
          { id: 'a2', category: 'manutenzione', city: 'Bologna', title: 'Ticket critici', description: '12 ticket aperti da > 48h', value: 12, link: 'MANAGEMENT_MAINTENANCE' },
          { id: 'a3', category: 'occupazione', city: 'Torino', title: 'Calo occupazione', description: '-5% stimato prossimo mese', value: -5, link: 'OBJECTS_ROOMS' }
        ],
        revenueData: generateMockData(1) // 100% revenue
      });
    }
  }, [currentRole]);

  return data;
};
