import React, { useState } from 'react';
import { UserRole } from '../types';
import { Menu, Bell, Search, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'Nuova prenotazione da confermare', time: '5 min fa', unread: true },
    { id: 2, text: 'Pagamento ricevuto: Mario Rossi', time: '1 ora fa', unread: true },
    { id: 3, text: 'Manutenzione richiesta: Via Roma 10', time: '2 ore fa', unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-transparent focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 rounded-lg text-slate-500 w-64 transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Cerca..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vista:</span>
          <div className="relative">
            <select 
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="appearance-none text-sm font-semibold py-1 pl-2 pr-8 border border-slate-200 rounded-md bg-white text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.CITY_MANAGER}>City Manager</option>
              <option value={UserRole.PROPERTY_MANAGER}>Property Manager</option>
              <option value={UserRole.ADMINISTRATION}>Amministrazione</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3 relative">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-sm text-slate-800">Notifiche</h3>
                    <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline">Segna tutte come lette</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-orange-50/30' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm ${n.unread ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                          {n.unread && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>}
                        </div>
                        <p className="text-xs text-slate-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800">Vedi tutte le notifiche</button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <div 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg select-none"
            >
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold border border-orange-200">
                MR
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700 leading-none">Mario Rossi</p>
                <p className="text-xs text-slate-500">City Manager</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800">Mario Rossi</p>
                    <p className="text-xs text-slate-500">mario.rossi@stanzasemplice.com</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left">
                      <UserCircle size={16} />
                      Il mio profilo
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left">
                      <Settings size={16} />
                      Impostazioni
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium">
                      <LogOut size={16} />
                      Esci
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};