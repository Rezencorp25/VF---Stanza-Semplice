import React from 'react';
import { ViewState } from '../../types';

interface ContoEconomicoLayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const ContoEconomicoLayout: React.FC<ContoEconomicoLayoutProps> = ({ children, currentView, onNavigate }) => {
  const tabs = [
    { id: 'PNL_GENERAL', label: 'Generale' },
    { id: 'PNL_MEETINGS', label: 'Riunioni' },
    { id: 'PNL_CITIES', label: 'Per Città' },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as ViewState)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              currentView === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
