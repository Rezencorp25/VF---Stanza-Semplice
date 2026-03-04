import React, { memo } from 'react';
import { ListChecks } from 'lucide-react';

interface FeaturesSectionProps {
  features: any;
  isEditing: boolean;
  handleFeatureChange: (feature: string) => void;
  isFeatureDirty: (feature: string) => boolean;
}

export const FeaturesSection = memo(({
  features,
  isEditing,
  handleFeatureChange,
  isFeatureDirty
}: FeaturesSectionProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-purple-500">
          <ListChecks size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Caratteristiche</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(features).map(([key, value]) => (
            <label 
              key={key} 
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none
                ${value 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                }
                ${isFeatureDirty(key) ? 'ring-2 ring-orange-400 border-orange-400' : ''}
              `}
            >
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={value as boolean}
                  onChange={() => handleFeatureChange(key)}
                  className="sr-only peer"
                  disabled={!isEditing}
                />
                <div className={`
                  w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                  ${value 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-slate-300'
                  }
                `}>
                  {value && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
});
