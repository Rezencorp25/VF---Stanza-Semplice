import React, { useState } from 'react';
import { UserRole, ViewState, NavItem } from '../types';
import { NAVIGATION_ITEMS, MOCK_COLLABORATORS, MOCK_CITIES, MOCK_COMPETENCE_GROUPS, MOCK_AGENCIES } from '../constants';
import { ChevronDown, LogOut, Settings, ChevronLeft, ChevronRight, X, User } from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole, 
  currentView, 
  onNavigate, 
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['objects', 'management', 'billing', 'admin']);

  const toggleExpand = (id: string) => {
    if (isCollapsed) {
      onToggleCollapse(); // Auto-expand sidebar if clicking a parent item while collapsed
      setExpandedItems([id]);
    } else {
      setExpandedItems(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    }
  };

  const hasAccess = (itemRoles: UserRole[]) => itemRoles.includes(currentRole);

  const renderNavItem = (item: NavItem, depth = 0) => {
    if (!hasAccess(item.roles)) return null;

    const isActive = item.view === currentView || (item.subItems && item.subItems.some(sub => sub.view === currentView));
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.subItems && item.subItems.length > 0;

    // Static counts for prototype
    const getCount = (id: string) => {
      switch (id) {
        case 'buildings': return 28;
        case 'apartments': return 45;
        case 'rooms': return 127;
        case 'contracts': return 12;
        case 'collaborators': return MOCK_COLLABORATORS.length;
        case 'cities': return MOCK_CITIES.length;
        case 'competence_groups': return MOCK_COMPETENCE_GROUPS.length;
        case 'agencies': return MOCK_AGENCIES.length;
        default: return null;
      }
    };

    const count = getCount(item.id);

    return (
      <div key={item.id} className={`mb-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onNavigate(item.view);
              if (window.innerWidth < 1024) onCloseMobile();
            }
          }}
          className={`
            w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl transition-all duration-200 group relative
            ${isActive && !hasChildren 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
            ${depth > 0 && !isCollapsed ? 'ml-3 w-[calc(100%-0.75rem)] text-xs' : 'text-[13px] font-medium'}
          `}
          title={isCollapsed ? item.label : undefined}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <span className={`transition-colors duration-200 ${isActive && !hasChildren ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: depth > 0 ? 16 : 18 })}
            </span>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="tracking-wide">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              {count !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isActive && !hasChildren ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
                  {count}
                </span>
              )}
              {hasChildren && (
                <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={14} />
                </span>
              )}
            </div>
          )}
        </button>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 animate-in slide-in-from-top-1 duration-200 border-l border-slate-800 ml-5 pl-1">
            {item.subItems!.map(sub => renderNavItem(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-[#0F172A] text-white border-r border-slate-800/50 shadow-2xl transition-all duration-300 ease-out flex flex-col
        ${isMobileOpen ? 'translate-x-0 w-[85vw] sm:w-80' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
          {/* Header */}
          <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-800/50 flex-shrink-0 transition-all duration-300`}>
            <div className="flex items-center gap-3 text-white overflow-hidden whitespace-nowrap">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-orange-500/20 ring-2 ring-orange-500/20">
                S
              </div>
              {!isCollapsed && (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <span className="font-bold text-lg tracking-tight leading-none">StanzaSemplice</span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">Management</span>
                </div>
              )}
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar overflow-x-hidden">
            <div>
              {!isCollapsed && <div className="px-6 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">Dashboard</div>}
              {NAVIGATION_ITEMS.filter(i => i.id === 'dashboard').map(item => renderNavItem(item))}
            </div>

            <div>
              {!isCollapsed && <div className="px-6 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">Admin</div>}
              {NAVIGATION_ITEMS.filter(i => i.id === 'admin').map(item => renderNavItem(item))}
            </div>
            
            <div>
              {!isCollapsed && <div className="px-6 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">Gestione</div>}
              {NAVIGATION_ITEMS.filter(i => ['objects', 'people', 'calendar', 'management'].includes(i.id)).map(item => renderNavItem(item))}
            </div>

            <div>
              {!isCollapsed && <div className="px-6 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">Amministrazione</div>}
              {NAVIGATION_ITEMS.filter(i => ['billing', 'pnl'].includes(i.id)).map(item => renderNavItem(item))}
            </div>

            <div>
              {!isCollapsed && <div className="px-6 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in">Analisi</div>}
              {NAVIGATION_ITEMS.filter(i => i.id === 'kpi').map(item => renderNavItem(item))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-slate-800/50 bg-slate-900/30 flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between gap-2'}`}>
            
            {/* Mobile User Profile Summary */}
            <div className="lg:hidden w-full flex items-center gap-3 mb-2 px-2">
               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">MR</div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-white">Mario Rossi</p>
                 <p className="text-xs text-slate-500">City Manager</p>
               </div>
            </div>

            <button 
              onClick={onToggleCollapse}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden lg:block" 
              title={isCollapsed ? "Espandi" : "Riduci"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            
            {!isCollapsed && <span className="text-[10px] font-mono text-slate-600 hidden lg:block">v2.4.0</span>}
            
            <div className="flex gap-1">
               <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Impostazioni">
                <Settings size={18} />
               </button>
               <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Esci">
                <LogOut size={18} />
               </button>
            </div>
          </div>
      </aside>
    </>
  );
};