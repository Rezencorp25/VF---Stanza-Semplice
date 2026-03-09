export interface MonthYear {
  month: number; // 1-12
  year: number;
}

export type GroupByOption = 'cities' | 'areas' | 'groups';

export interface FilterState {
  groupBy: GroupByOption;
  areas: string[];
  cities: string[];
  groups: string[];
  fromMonth: MonthYear;
  toMonth: MonthYear;
}

export interface KpiDataResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}
