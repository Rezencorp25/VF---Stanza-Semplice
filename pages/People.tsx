import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { MOCK_OWNERS, MOCK_TENANTS, MOCK_PROPERTIES, MOCK_ROOMS } from '../constants';
import { UserCheck, Users, Mail, Phone, MoreHorizontal, Building2, BedDouble, AlertCircle, CheckCircle2, ChevronRight, Copy, Eye, Edit, Trash2 } from 'lucide-react';

interface PeopleProps {
  view: ViewState;
  highlightId: string | null;
}

export const People: React.FC<PeopleProps> = ({ view, highlightId }) => {
  // Menu State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(highlightId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-orange-500', 'ring-offset-2');
        setTimeout(() => element.classList.remove('ring-2', 'ring-orange-500', 'ring-offset-2'), 2500);
      }
    }
  }, [highlightId, view]);

  // Close menu on click outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const renderMenu = (id: string, alignRight = true) => {
    if (activeMenu !== id) return null;
    return (
      <div 
        className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
          <Eye size={14} /> Vedi Dettagli
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
          <Edit size={14} /> Modifica
        </button>
        <div className="h-px bg-slate-100 my-1" />
        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
          <Trash2 size={14} /> Elimina
        </button>
      </div>
    );
  };

  const OwnersView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {MOCK_OWNERS.map(owner => {
        const ownedProperties = MOCK_PROPERTIES.filter(p => p.ownerId === owner.id);

        return (
          <div 
            key={owner.id} 
            id={owner.id}
            className={`bg-white rounded-2xl border transition-all duration-300 group ${highlightId === owner.id ? 'border-orange-500 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 border border-white shadow-sm">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{owner.firstName} <br/> {owner.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border
                         ${owner.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}
                       `}>
                         {owner.status === 'active' ? 'Attivo' : 'Inattivo'}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={(e) => toggleMenu(e, `owner-${owner.id}`)}
                    className={`text-slate-300 hover:text-orange-600 transition-colors p-1 rounded-md hover:bg-slate-50 ${activeMenu === `owner-${owner.id}` ? 'text-orange-600 bg-slate-50' : ''}`}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {renderMenu(`owner-${owner.id}`)}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group/item">
                  <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm group-hover/item:text-orange-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <a href={`mailto:${owner.email}`} className="text-sm font-medium text-slate-700 truncate hover:text-orange-600 transition-colors">{owner.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group/item">
                   <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm group-hover/item:text-orange-500 transition-colors">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Telefono</span>
                    <span className="text-sm font-medium text-slate-700">{owner.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-4">
                <div className="flex items-center justify-between mb-3">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Immobili ({ownedProperties.length})</h4>
                </div>
                {ownedProperties.length > 0 ? (
                  <ul className="space-y-2">
                    {ownedProperties.map(prop => (
                      <li key={prop.id} className="flex items-center gap-3 text-sm text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm">
                        <Building2 size={16} className="text-orange-500 shrink-0" />
                        <span className="truncate font-medium">{prop.address}, {prop.city}</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg text-center">Nessun immobile assegnato.</p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50/80 p-4 border-t border-slate-100 rounded-b-2xl flex justify-between items-center group-hover:bg-orange-50/30 transition-colors">
               <div className="flex items-center gap-2 text-slate-500" title={owner.iban}>
                 <Copy size={14} className="cursor-pointer hover:text-orange-600" />
                 <span className="text-xs font-mono font-medium truncate max-w-[120px]">{owner.iban}</span>
               </div>
               <button className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 hover:border-orange-200 transition-all">
                 Contabilità
               </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const TenantsView = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-5">Inquilino</th>
              <th className="px-6 py-5">Contatti</th>
              <th className="px-6 py-5">Stanza Assegnata</th>
              <th className="px-6 py-5">Contratto</th>
              <th className="px-6 py-5">Pagamenti</th>
              <th className="px-6 py-5 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_TENANTS.map(tenant => {
              const assignedRoom = MOCK_ROOMS.find(r => r.id === tenant.roomId);
              
              return (
                <tr 
                  key={tenant.id} 
                  id={tenant.id}
                  className={`hover:bg-slate-50 transition-colors group ${highlightId === tenant.id ? 'bg-orange-50/60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                        {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{tenant.firstName} {tenant.lastName}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                          ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                        `}>
                          {tenant.status === 'active' ? 'Attivo' : 'Ex'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-slate-600 group-hover:text-orange-600 transition-colors cursor-pointer">
                        <Mail size={14} className="text-slate-400" /> 
                        <span className="font-medium text-xs">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} className="text-slate-400" /> 
                        <span className="font-medium text-xs">{tenant.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {assignedRoom ? (
                       <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm w-fit group-hover:border-orange-200 transition-colors">
                         <div className="p-1 bg-orange-50 text-orange-600 rounded-md">
                           <BedDouble size={16} />
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-700 text-xs">{assignedRoom.name}</span>
                           <span className="text-[10px] text-slate-400">Interno {assignedRoom.apartmentId}</span>
                         </div>
                       </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs w-32">
                        <span className="text-slate-400">Inizio:</span>
                        <span className="font-medium text-slate-700">{tenant.contractStart}</span>
                      </div>
                      <div className="flex justify-between text-xs w-32">
                        <span className="text-slate-400">Fine:</span>
                        <span className="font-medium text-slate-700">{tenant.contractEnd}</span>
                      </div>
                      <div className="w-32 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 w-2/3 rounded-full"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {tenant.paymentStatus === 'regular' ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
                         <CheckCircle2 size={14} /> Regolare
                       </span>
                     ) : (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
                         <AlertCircle size={14} /> In Ritardo
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => toggleMenu(e, `tenant-${tenant.id}`)}
                      className={`p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors ${activeMenu === `tenant-${tenant.id}` ? 'bg-orange-50 text-orange-600' : ''}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {renderMenu(`tenant-${tenant.id}`)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {view === 'PEOPLE_OWNERS' ? 'Proprietari' : 'Inquilini'}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <Users size={16} />
            <span className="text-sm font-medium">
              {view === 'PEOPLE_OWNERS' 
                ? 'Gestione anagrafica proprietari' 
                : 'Gestione contratti e inquilini'}
            </span>
          </div>
        </div>
        <button className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all">
          {view === 'PEOPLE_OWNERS' ? '+ Nuovo Proprietario' : '+ Nuovo Inquilino'}
        </button>
      </div>

      {view === 'PEOPLE_OWNERS' && <OwnersView />}
      {view === 'PEOPLE_TENANTS' && <TenantsView />}
    </div>
  );
};