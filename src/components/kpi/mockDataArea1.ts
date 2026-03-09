import { FilterState } from '../../types/kpi';

// Colors
export const COLORS = {
  blue: '#1B4F9C',
  green: '#1E7D45',
  orange: '#C55A11',
  purple: '#5B2C8D',
  red: '#C62828',
  target: '#F97316' // Orange for target line
};

// Types
export interface MonthlyData {
  month: string;
  [key: string]: string | number;
}

export interface RoomData {
  room: string;
  days: number;
  grouping: string;
}

export interface Area1Data {
  occupancy: MonthlyData[];
  activeRooms: MonthlyData[];
  availableSqM: MonthlyData[];
  reRentDays: RoomData[];
}

// Helper to generate months
const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

// Mock Data Generator
export const getArea1Data = (filter: FilterState): Area1Data => {
  // In a real app, we would filter based on filter.areas, filter.cities, filter.groups
  // For this mock, we'll generate data that looks consistent with the requested structure
  
  // Determine active grouping keys based on filter
  // Default to cities if nothing specific, or use the groupBy filter
  let keys: string[] = [];
  if (filter.groupBy === 'cities') {
    keys = filter.cities.length > 0 ? filter.cities : ['Milano', 'Roma', 'Torino', 'Bologna'];
  } else if (filter.groupBy === 'areas') {
    keys = filter.areas.length > 0 ? filter.areas : ['Nord', 'Centro', 'Sud'];
  } else {
    keys = filter.groups.length > 0 ? filter.groups : ['GC1', 'GC2', 'GC3'];
  }

  // Limit to 4 keys for the palette
  const activeKeys = keys.slice(0, 4);

  // 1. Occupancy Data (Sinusoidal)
  const occupancy = months.map((month, idx) => {
    const entry: MonthlyData = { month };
    activeKeys.forEach((key, kIdx) => {
      // Create a sinusoidal wave with some randomness
      const base = 85 + (kIdx * 2);
      const amplitude = 5 + (kIdx % 2);
      const phase = kIdx * 2;
      const value = base + amplitude * Math.sin((idx + phase) * 0.5);
      entry[key] = parseFloat(Math.min(100, Math.max(0, value)).toFixed(1));
    });
    return entry;
  });

  // 2. Active Rooms (Bar chart)
  const activeRooms = months.map((month, idx) => {
    const entry: MonthlyData = { month };
    activeKeys.forEach((key, kIdx) => {
      // Random count between 30 and 60
      const value = 30 + Math.floor(Math.random() * 30) + (kIdx * 5);
      entry[key] = value;
    });
    return entry;
  });

  // 3. Available SqM (Bar chart)
  const availableSqM = months.map((month, idx) => {
    const entry: MonthlyData = { month };
    activeKeys.forEach((key, kIdx) => {
      // Random mq between 800 and 1500
      const value = 800 + Math.floor(Math.random() * 700) + (kIdx * 100);
      entry[key] = value;
    });
    return entry;
  });

  // 4. Re-rent Days (Horizontal Bar)
  // Generate some rooms associated with the active keys
  const reRentDays: RoomData[] = [];
  activeKeys.forEach((key) => {
    for (let i = 1; i <= 3; i++) {
      reRentDays.push({
        room: `STZ-${key.substring(0, 2).toUpperCase()}-${i}`,
        days: parseFloat((3 + Math.random() * 10).toFixed(1)), // 3 to 13 days
        grouping: key
      });
    }
  });
  // Sort by days descending for better visualization
  reRentDays.sort((a, b) => b.days - a.days);

  return {
    occupancy,
    activeRooms,
    availableSqM,
    reRentDays: reRentDays.slice(0, 10) // Top 10 rooms
  };
};
