import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../types';

interface BreadcrumbsProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const VIEW_LABELS: Record<string, string> = {
  'DASHBOARD': 'Dashboard',
  'OBJECTS_BUILDINGS': 'Fabbricati',
  'OBJECTS_APARTMENTS': 'Appartamenti',
  'OBJECTS_ROOMS': 'Stanze',
  'OBJECTS_CONTRACTS': 'Contratti',
  'PEOPLE_OWNERS': 'Proprietari',
  'PEOPLE_TENANTS': 'Inquilini',
  'MANAGEMENT_CLEANING': 'Pulizie',
  'MANAGEMENT_MAINTENANCE': 'Manutenzione',
  'MANAGEMENT_DEADLINES': 'Scadenze',
  'BILLING_INVOICES': 'Fatture',
  'BILLING_PAYMENTS': 'Pagamenti',
  'BILLING_COSTS': 'Costi',
  'BILLING_CASHFLOW': 'Cashflow',
  'CALENDAR': 'Calendario',
  'PNL_GENERAL': 'Conto Economico',
  'ADMIN_DASHBOARD': 'Dashboard Admin',
  'ADMIN_EMPLOYEES': 'Collaboratori',
  'ADMIN_CITIES': 'Città',
  'ADMIN_COMPETENCE_GROUPS': 'Gruppi di Competenza',
  'ADMIN_CONTEXTS': 'Contesti',
  'ADMIN_AGENCIES': 'Agenzie',
  'ADMIN_TOOLS': 'Strumenti Admin'
};

const VIEW_PARENTS: Record<string, { view: ViewState, label: string }> = {
  'OBJECTS_BUILDINGS': { view: 'DASHBOARD', label: 'Immobili' },
  'OBJECTS_APARTMENTS': { view: 'DASHBOARD', label: 'Immobili' },
  'OBJECTS_ROOMS': { view: 'DASHBOARD', label: 'Immobili' },
  'OBJECTS_CONTRACTS': { view: 'DASHBOARD', label: 'Immobili' },
  'PEOPLE_OWNERS': { view: 'DASHBOARD', label: 'Persone' },
  'PEOPLE_TENANTS': { view: 'DASHBOARD', label: 'Persone' },
  'MANAGEMENT_CLEANING': { view: 'DASHBOARD', label: 'Gestione' },
  'MANAGEMENT_MAINTENANCE': { view: 'DASHBOARD', label: 'Gestione' },
  'MANAGEMENT_DEADLINES': { view: 'DASHBOARD', label: 'Gestione' },
  'BILLING_INVOICES': { view: 'DASHBOARD', label: 'Amministrazione' },
  'BILLING_PAYMENTS': { view: 'DASHBOARD', label: 'Amministrazione' },
  'BILLING_COSTS': { view: 'DASHBOARD', label: 'Amministrazione' },
  'BILLING_CASHFLOW': { view: 'DASHBOARD', label: 'Amministrazione' },
  'ADMIN_EMPLOYEES': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
  'ADMIN_CITIES': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
  'ADMIN_COMPETENCE_GROUPS': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
  'ADMIN_CONTEXTS': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
  'ADMIN_AGENCIES': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
  'ADMIN_TOOLS': { view: 'ADMIN_DASHBOARD', label: 'Admin' },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentView, onNavigate }) => {
  const parts = [];
  
  // Home
  parts.push({ label: 'Home', view: 'DASHBOARD' as ViewState, icon: <Home size={14} /> });

  // Parent Category (if any)
  if (VIEW_PARENTS[currentView]) {
    parts.push({ 
      label: VIEW_PARENTS[currentView].label, 
      view: VIEW_PARENTS[currentView].view 
    });
  }

  // Current Page
  if (currentView !== 'DASHBOARD') {
    parts.push({ 
      label: VIEW_LABELS[currentView] || currentView, 
      view: currentView,
      active: true
    });
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 animate-in fade-in slide-in-from-left-2">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="text-slate-300" />}
          <button 
            onClick={() => !part.active && onNavigate(part.view)}
            disabled={part.active}
            className={`flex items-center gap-1.5 transition-colors ${part.active ? 'font-bold text-slate-800 cursor-default' : 'hover:text-orange-500'}`}
          >
            {part.icon}
            <span>{part.label}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
