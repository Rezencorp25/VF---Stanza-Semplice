import React from 'react';

interface CityMultiSelectProps {
  cities: string[];
  selectedCities: string[];
  onChange: (selected: string[]) => void;
}

export const CityMultiSelect: React.FC<CityMultiSelectProps> = ({ cities, selectedCities, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions as HTMLCollectionOf<HTMLOptionElement>).map(option => option.value);
    onChange(options);
  };

  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Città</label>
      <select 
        multiple 
        value={selectedCities}
        onChange={handleChange}
        className="w-full h-[90px] p-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all custom-scrollbar"
      >
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
};
