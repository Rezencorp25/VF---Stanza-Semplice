import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';
import { MonthRangePicker } from './MonthRangePicker';
import { FilterState, GroupByOption, MonthYear } from '../../types/kpi';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  onRefresh: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onRefresh
}) => {
  const handleGroupByChange = (value: string[]) => {
    if (value.length > 0) {
      onFilterChange({ ...filterState, groupBy: value[0] as GroupByOption });
    }
  };

  const handleAreasChange = (areas: string[]) => {
    onFilterChange({ ...filterState, areas });
  };

  const handleCitiesChange = (cities: string[]) => {
    onFilterChange({ ...filterState, cities });
  };

  const handleGroupsChange = (groups: string[]) => {
    onFilterChange({ ...filterState, groups });
  };

  const handleDateRangeChange = (from: MonthYear, to: MonthYear) => {
    onFilterChange({ ...filterState, fromMonth: from, toMonth: to });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 w-full">
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
        <Filter size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Raggruppa per:</span>
        <select 
          value={filterState.groupBy}
          onChange={(e) => onFilterChange({ ...filterState, groupBy: e.target.value as GroupByOption })}
          className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
        >
          <option value="areas">Aree</option>
          <option value="cities">Città</option>
          <option value="groups">Gruppi di competenza</option>
        </select>
      </div>

      <FilterDropdown 
        label="Aree" 
        options={['Nord', 'Centro', 'Sud']} 
        selected={filterState.areas} 
        onChange={handleAreasChange} 
        isMulti
      />

      <FilterDropdown 
        label="Città" 
        options={['Milano', 'Roma', 'Torino', 'Bologna', 'Verona']} 
        selected={filterState.cities} 
        onChange={handleCitiesChange} 
        isMulti
      />

      <FilterDropdown 
        label="Gruppi" 
        options={['GC1', 'GC2', 'GC3']} 
        selected={filterState.groups} 
        onChange={handleGroupsChange} 
        isMulti
      />

      <MonthRangePicker 
        from={filterState.fromMonth} 
        to={filterState.toMonth} 
        onChange={handleDateRangeChange} 
      />

      <button 
        onClick={onRefresh}
        className="ml-auto flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm active:scale-95"
      >
        <RefreshCw size={16} />
        <span>Aggiorna</span>
      </button>
    </div>
  );
};
