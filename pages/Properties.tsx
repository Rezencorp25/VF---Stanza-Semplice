
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PROPERTIES, MOCK_APARTMENTS, MOCK_ROOMS, MOCK_OWNERS, MOCK_COMPETENCE_GROUPS } from '../constants';
import { ViewState, Property, Apartment } from '../types';
import { BuildingDrawer } from '../components/BuildingDrawer';
import { NewBuildingModal } from '../components/NewBuildingModal';
import { EditApartmentModal } from '../components/EditApartmentModal';
import { EditRoomModal } from '../components/EditRoomModal';
import { EmptyState, DeleteConfirmationModal } from '../components/SharedUI';
import { useToast } from '../components/Toast';
import { useProperties } from '../hooks/useProperties';
import { useApartments } from '../hooks/useApartments';
import { 
  Building2, 
  MapPin, 
  MoreHorizontal, 
  BedDouble, 
  CheckCircle, 
  DoorOpen, 
  ArrowRight,
  Filter,
  RefreshCw,
  Bath,
  Maximize,
  Key,
  UserCheck,
  Search,
  LayoutGrid,
  X,
  AlertTriangle,
  Hammer,
  GraduationCap,
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart,
  Users,
  Euro,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  Phone,
  User,
  Grid,
  List as ListIcon,
  Calendar,
  Info,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FixedSizeList } from 'react-window';
// @ts-ignore
type ListChildComponentProps = any;
import { LazyImage } from '../components/LazyImage';

// --- VIRTUALIZED ROWS ---

const ApartmentRow = React.memo(({ index, style, data }: ListChildComponentProps) => {
  const apt = data.items[index];
  if (!apt) return null;

  const { onEdit, onDelete, onNavigate, setFilterApartmentId, getBuilding, getOwner, MOCK_ROOMS } = data;
  const building = getBuilding(apt.buildingId);
  
  // Calculate Stats on the fly using Mock Rooms
  const aptRooms = MOCK_ROOMS.filter((r: any) => r.apartmentId === apt.id);
  const totalRooms = aptRooms.length;
  const occupiedRooms = aptRooms.filter((r: any) => r.status === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const totalRevenue = aptRooms.reduce((acc: number, r: any) => acc + r.price, 0);

  // Determine status badge
  const isAvailable = apt.status === 'active' && occupancyRate < 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {/* Image Section */}
      <div className="h-48 bg-slate-200 relative overflow-hidden shrink-0 rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <LazyImage 
            src={`https://picsum.photos/seed/${apt.id}/800/400`} 
            alt={`Apartment ${apt.unitNumber}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            containerClassName="w-full h-full"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border border-white/20 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap
              ${apt.status === 'active' ? (isAvailable ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white') : 
                'bg-amber-500/90 text-white'}
            `}>
               {apt.status === 'active' ? (isAvailable ? <DoorOpen size={12}/> : <CheckCircle size={12}/>) : <AlertTriangle size={12}/>}
               <span>
                  {apt.status === 'active' ? (isAvailable ? 'Disponibile' : 'Completo') : 'Manutenzione'}
               </span>
            </div>
          </div>

          {/* Menu Button (Top Right) */}
          <div className="absolute top-4 right-4 z-20">
             <div className="relative">
                <button 
                  onClick={(e) => data.toggleMenu(e, `apt-${apt.id}`)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {data.renderMenu(`apt-${apt.id}`, true, undefined, undefined, () => onDelete(apt.id, `Int. ${apt.unitNumber}`))}
             </div>
          </div>

          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h3 className="font-bold text-xl drop-shadow-sm">Interno {apt.unitNumber}</h3>
            <div className="flex items-center gap-1 text-slate-200 text-sm mt-0.5 font-medium">
              <Building2 size={14} />
              <span>{building?.address} - Piano {apt.floor}</span>
            </div>
          </div>
      </div>
      
      {/* Content Body */}
      <div className="p-6 flex flex-col flex-1 relative bg-white rounded-b-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rendita Stimata</span>
            <span className="text-sm font-bold text-slate-800">€ {totalRevenue}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1">
              <BedDouble size={20} className="text-orange-500 mb-1" />
              <span className="font-bold text-slate-800 text-lg leading-none">{totalRooms}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stanze</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1">
              <Bath size={20} className="text-blue-500 mb-1" />
              <span className="font-bold text-slate-800 text-lg leading-none">{apt.bathrooms}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagni</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1">
              <Maximize size={20} className="text-emerald-500 mb-1" />
              <span className="font-bold text-slate-800 text-lg leading-none">{apt.mq || '-'}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MQ</span>
           </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-6">
           <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupazione</span>
              <span className="text-sm font-bold text-slate-800">{occupiedRooms}/{totalRooms}</span>
           </div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                style={{width: `${occupancyRate}%`}} 
              />
           </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => onEdit(apt)}
            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Edit size={16} />
            <span>Modifica</span>
          </button>
          <button 
            onClick={() => {
              setFilterApartmentId(apt.id);
              onNavigate('OBJECTS_ROOMS');
            }}
            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-200 active:scale-95"
          >
            <span>Gestisci Stanze</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

const RoomRow = React.memo(({ index, style, data }: ListChildComponentProps) => {
  const room = data.items[index];
  if (!room) return null;

  const { getApartment, getBuilding, onNavigateToPerson, setEditingRoom, toggleMenu, renderMenu, activePriceTooltipId, setActivePriceTooltipId } = data;
  const apt = getApartment(room.apartmentId);
  const bld = getBuilding(room.buildingId);
  const isFirstRows = index < 2;

  return (
    <div style={style} className="border-b border-slate-100">
      <div className="flex items-center hover:bg-slate-50 transition-colors group h-full">
        <div className="px-6 py-4 flex-1 flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
            <Key size={18} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-base">{room.name}</p>
            <button 
              onClick={() => {
                if (apt) {
                  data.setEditingApartment(apt);
                  data.setFilterBuildingId(apt.buildingId);
                }
              }}
              className="text-xs font-medium text-slate-500 mt-0.5 hover:text-orange-600 hover:underline text-left flex items-center gap-1"
            >
              {bld?.address}, Int. {apt?.unitNumber} <ArrowRight size={10} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 w-32">
          <span className="capitalize px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
            {room.type === 'single' ? 'Singola' : room.type === 'double' ? 'Doppia' : 'Suite'}
          </span>
        </div>
        <div className="px-6 py-4 w-40 font-bold text-slate-700 relative">
          <div className="flex items-center gap-2">
            <span>€ {room.price}<span className="text-xs font-normal text-slate-400">/mese</span></span>
            <button 
              className={`price-tooltip-trigger p-1 rounded-full hover:bg-orange-50 transition-colors ${activePriceTooltipId === room.id ? 'bg-orange-50 text-orange-500' : 'text-slate-300 hover:text-orange-500'}`}
              onClick={(e) => {
                e.stopPropagation();
                setActivePriceTooltipId(activePriceTooltipId === room.id ? null : room.id);
              }}
            >
              <Info size={14} />
            </button>
          </div>
          {activePriceTooltipId === room.id && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 z-50 w-[280px] bg-white rounded-xl shadow-xl border border-slate-100 p-0 animate-in fade-in zoom-in-95 duration-200"
              style={isFirstRows ? { top: '100%', marginTop: '8px' } : { bottom: '100%', marginBottom: '8px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 rounded-t-xl">
                <TrendingUp size={16} className="text-slate-500" />
                <h4 className="font-bold text-slate-800 text-sm">Andamento Prezzi</h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Prezzo annuncio</span>
                  <span className="font-bold text-blue-500">€ 550 <span className="text-xs font-normal text-slate-400">/mese</span></span>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Prezzo target</span>
                  <span className="font-bold text-orange-500">€ 520 <span className="text-xs font-normal text-slate-400">/mese</span></span>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Prezzo contratto</span>
                  <span className={`font-bold ${room.price >= 520 ? 'text-emerald-500' : 'text-red-500'}`}>
                    € {room.price} <span className="text-xs font-normal text-slate-400">/mese</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 w-40">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${room.status === 'available' ? 'bg-green-100 text-green-700' : 
              room.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
          `}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              room.status === 'available' ? 'bg-green-500' : 
              room.status === 'occupied' ? 'bg-blue-500' : 'bg-slate-500'
            }`}></div>
            {room.status === 'available' ? 'Libera' : room.status === 'occupied' ? 'Affittata' : 'Manutenzione'}
          </span>
        </div>
        <div className="px-6 py-4 w-48">
          {room.tenantName ? (
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-transparent hover:border-slate-200 transition-colors w-fit">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                 {room.tenantName.charAt(0)}
               </div>
               <div className="flex flex-col">
                 <span className="text-slate-700 font-semibold text-xs">{room.tenantName}</span>
                 {room.tenantId && (
                   <button 
                    onClick={() => onNavigateToPerson('PEOPLE_TENANTS', room.tenantId!)}
                    className="text-[10px] text-orange-500 text-left font-medium hover:underline hover:text-orange-700"
                   >
                     Vedi Profilo
                   </button>
                 )}
               </div>
            </div>
          ) : (
            <span className="text-slate-400 italic text-xs px-2">-</span>
          )}
        </div>
        <div className="px-6 py-4 w-24 text-right">
          <button 
            onClick={(e) => toggleMenu(e, `room-${room.id}`)}
            className={`p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors ${data.activeMenu === `room-${room.id}` ? 'bg-orange-50 text-orange-600' : ''}`}
          >
            <MoreHorizontal size={20} />
          </button>
          {renderMenu(`room-${room.id}`, true, undefined, () => setEditingRoom(room))}
        </div>
      </div>
    </div>
  );
});

const RoomCardRow = React.memo(({ index, style, data }: ListChildComponentProps) => {
  const room = data.items[index];
  if (!room) return null;

  const { getApartment, getBuilding, setEditingRoom, toggleMenu, renderMenu } = data;
  const apt = getApartment(room.apartmentId);
  const bld = getBuilding(room.buildingId);
  
  const statusColor = room.status === 'available' ? 'bg-green-500/90' : 
                      room.status === 'occupied' ? 'bg-blue-500/90' : 'bg-slate-500/90';
  const statusLabel = room.status === 'available' ? 'Disponibile' : 
                      room.status === 'occupied' ? 'Affittata' : 'Manutenzione';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col overflow-hidden h-full relative">
      <div className="h-40 bg-slate-100 relative shrink-0 rounded-t-2xl">
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
         <LazyImage 
            src={`https://picsum.photos/seed/${room.id}/400/300`} 
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            containerClassName="w-full h-full"
         />
         <div className="absolute top-3 left-3 flex gap-2 z-20">
            <div className={`flex items-center gap-1.5 ${statusColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/20`}>
              {room.status === 'available' ? <CheckCircle size={10}/> : room.status === 'occupied' ? <Key size={10}/> : <AlertTriangle size={10}/>}
              <span>{statusLabel}</span>
            </div>
         </div>
         
         <div className="absolute top-3 right-3 z-20">
           <div className="relative">
              <button 
                onClick={(e) => toggleMenu(e, `room-grid-${room.id}`)}
                className="w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {renderMenu(`room-grid-${room.id}`, true, undefined, () => setEditingRoom(room))}
           </div>
         </div>

         <div className="absolute bottom-3 left-3 z-20 text-white">
           <h3 className="font-bold text-lg drop-shadow-sm line-clamp-1" title={room.name}>{room.name}</h3>
           <div className="flex items-center gap-1 text-slate-200 text-xs mt-0.5 font-medium">
             <Building2 size={12} />
             <span className="line-clamp-1">{bld?.address} - Int. {apt?.unitNumber}</span>
           </div>
         </div>
      </div>
      <div className="p-4 flex flex-col flex-1 bg-white rounded-b-2xl">
         <div className="mb-3 flex-1">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <BedDouble size={14} className="text-orange-500" />
                  <span className="text-xs font-bold">{room.type === 'single' ? '1' : '2'} Posti</span>
               </div>
               {apt && (
                 <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-100">
                   Piano {apt.floor}
                 </span>
               )}
            </div>
         </div>
         <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-left">
               <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Canone</span>
               <span className="font-bold text-slate-800">€ {room.price}<span className="text-xs font-normal text-slate-400">/mo</span></span>
            </div>
            <button 
              onClick={() => setEditingRoom(room)}
              className="px-3 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all shadow-sm active:scale-95"
            >
              <Edit size={12} />
              <span>Modifica</span>
            </button>
         </div>
      </div>
    </div>
  );
});

// --- SKELETONS ---
const BuildingCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200 relative">
      <div className="absolute top-4 left-4 w-24 h-6 bg-slate-300 rounded-full"></div>
    </div>
    <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
      <div className="flex justify-between items-center mb-4">
        <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 h-16 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 h-16 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="mt-auto w-full h-12 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

const ApartmentCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200 relative">
      <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300 rounded-full"></div>
    </div>
    <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="w-24 h-4 bg-slate-200 rounded"></div>
          <div className="w-32 h-6 bg-slate-200 rounded"></div>
        </div>
        <div className="w-16 h-8 bg-slate-200 rounded"></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="h-16 bg-slate-200 rounded-xl"></div>
        <div className="h-16 bg-slate-200 rounded-xl"></div>
        <div className="h-16 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6"></div>
      <div className="mt-auto grid grid-cols-2 gap-3">
        <div className="h-10 bg-slate-200 rounded-xl"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

interface PropertiesProps {
  view: ViewState;
  onNavigate: (view: ViewState, params?: any) => void;
  onNavigateToPerson: (view: ViewState, personId: string) => void;
  navParams?: any;
  onClearParams?: () => void;
}

export const Properties: React.FC<PropertiesProps> = ({ view, onNavigate, onNavigateToPerson, navParams, onClearParams }) => {
  const { showToast } = useToast();
  
  // Data Hooks
  const [filterBuildingId, setFilterBuildingId] = useState<string | null>(null);
  
  const { 
    properties, 
    loading: loadingBuildings, 
    loadingMore: loadingMoreBuildings, 
    hasMore: hasMoreBuildings, 
    loadMore: loadMoreBuildings, 
    totalCount: totalBuildings 
  } = useProperties();

  const {
    apartments,
    loading: loadingApartments,
    loadingMore: loadingMoreApartments,
    hasMore: hasMoreApartments,
    loadMore: loadMoreApartments,
    totalCount: totalApartments
  } = useApartments(filterBuildingId);
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'building' | 'apartment' | 'room'; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Navigation & Drill-down state
  const [filterApartmentId, setFilterApartmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Navigation Params
  useEffect(() => {
    if (navParams && onClearParams) {
      if (navParams.targetId && navParams.action === 'edit_apartment') {
        // We might need to fetch the specific apartment if not loaded, 
        // but for now we check if it's in the loaded apartments or fallback to mock if needed (or just wait for full implementation)
        const apt = apartments.find(a => a.id === navParams.targetId) || MOCK_APARTMENTS.find(a => a.id === navParams.targetId);
        if (apt) {
          setEditingApartment(apt);
          setFilterBuildingId(apt.buildingId);
        }
      }
      onClearParams();
    }
  }, [navParams, onClearParams, apartments]);

  // --- NEW FILTERS STATE (Lifted for Buildings View) ---
  const [bFilterCity, setBFilterCity] = useState('');
  const [bFilterMunicipality, setBFilterMunicipality] = useState('');
  const [bFilterName, setBFilterName] = useState(''); // Nome condominio o alias (Text input)
  const [bFilterAddress, setBFilterAddress] = useState('');
  const [bFilterAdmin, setBFilterAdmin] = useState('');
  const [bFilterAdminPhone, setBFilterAdminPhone] = useState('');

  // UX State
  const [expandedOccupancyId, setExpandedOccupancyId] = useState<string | null>(null);
  const [occupancyTimeframe, setOccupancyTimeframe] = useState<string>('1Y');
  
  // Menu State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Detail Drawer State
  const [selectedBuilding, setSelectedBuilding] = useState<Property | null>(null);

  // New Building Modal State
  const [isNewBuildingModalOpen, setIsNewBuildingModalOpen] = useState(false);

  // Edit Apartment Modal State
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // --- CASCADING LOGIC EFFECTS ---
  
  // 1. Reset filtri dipendenti quando cambia la Città
  useEffect(() => {
    setBFilterMunicipality('');
    setBFilterAddress('');
    setBFilterAdmin('');
    setBFilterAdminPhone('');
  }, [bFilterCity]);

  // 2. Reset filtri dipendenti quando cambia il Comune
  useEffect(() => {
    if (bFilterMunicipality) { // Solo se viene selezionato, non se viene resettato da città
        setBFilterAddress('');
        setBFilterAdmin('');
        setBFilterAdminPhone('');
    }
  }, [bFilterMunicipality]);

  // 3. Reset Amministratore se cambia Indirizzo
  useEffect(() => {
    if (bFilterAddress) {
        setBFilterAdmin('');
        setBFilterAdminPhone('');
    }
  }, [bFilterAddress]);

  // 4. AUTO-FILL TELEFONO AMMINISTRATORE
  useEffect(() => {
    if (bFilterAdmin) {
      // Cerca il primo fabbricato che ha questo amministratore e prendi il numero
      const propertyWithAdmin = properties.find(p => p.adminName === bFilterAdmin);
      if (propertyWithAdmin && propertyWithAdmin.adminPhone) {
        setBFilterAdminPhone(propertyWithAdmin.adminPhone);
      } else {
        setBFilterAdminPhone('Nessun telefono');
      }
    } else {
      setBFilterAdminPhone('');
    }
  }, [bFilterAdmin, properties]);


  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleOpenDetail = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    setSelectedBuilding(property);
    setActiveMenu(null);
  };

  const renderMenu = (id: string, alignRight = true, property?: Property, onEdit?: () => void, onDelete?: () => void) => {
    if (activeMenu !== id) return null;
    return (
      <div 
        className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={(e) => {
            if (property) handleOpenDetail(e, property);
            setActiveMenu(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <Eye size={14} /> Vedi Dettagli
        </button>
        {onEdit && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <Edit size={14} /> Modifica
          </button>
        )}
        <div className="h-px bg-slate-100 my-1" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete();
            setActiveMenu(null);
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
        >
          <Trash2 size={14} /> Elimina
        </button>
      </div>
    );
  };

  // Helper to get parent info
  // Use loaded properties if available, fallback to mock for now to avoid breaking other views
  const getBuilding = (id: string) => properties.find(p => p.id === id) || MOCK_PROPERTIES.find(p => p.id === id);
  const getApartment = (id: string) => apartments.find(a => a.id === id) || MOCK_APARTMENTS.find(a => a.id === id);
  const getOwner = (id: string) => MOCK_OWNERS.find(o => o.id === id);

  // Helper to generate mock chart data based on timeframe
  const getChartData = (timeframe: string, currentOccupancy: number) => {
    const points = timeframe === '1M' ? 30 : timeframe === '3M' ? 12 : timeframe === '6M' ? 24 : timeframe === '9M' ? 36 : timeframe === '1Y' ? 12 : 10;
    const data = [];
    let base = currentOccupancy;
    
    // Create a smooth curve ending at current occupancy
    for (let i = points; i >= 0; i--) {
        // Random fluctuation but keeping it somewhat sinusoidal/organic
        const volatility = timeframe === '1M' ? 2 : 5; 
        const wave = Math.sin(i * 0.5) * volatility; 
        const random = Math.random() * volatility - (volatility/2);
        let val = Math.min(100, Math.max(0, Math.round(base + wave + random)));
        
        // Force the last point to be the current occupancy
        if (i === 0) val = currentOccupancy;

        data.push({
            name: i.toString(),
            value: val
        });
        // Slowly drift the base backwards
        base = base + (Math.random() > 0.5 ? 1 : -1); 
    }
    return data.reverse();
  };

  // --- LOGIC FOR BUILDINGS FILTERING (Lifted) ---
  const filteredProperties = useMemo(() => {
    if (view !== 'OBJECTS_BUILDINGS') return [];

    return properties.filter(p => {
      // 1. Città
      if (bFilterCity && !p.city.toLowerCase().includes(bFilterCity.toLowerCase())) return false;
      
      // 2. Comune
      if (bFilterMunicipality && !(p.municipality || '').toLowerCase().includes(bFilterMunicipality.toLowerCase())) return false;
      
      // 3. Nome (Condominio)
      if (bFilterName && !(p.condoName || '').toLowerCase().includes(bFilterName.toLowerCase())) return false;
      
      // 4. Indirizzo
      if (bFilterAddress && !p.address.toLowerCase().includes(bFilterAddress.toLowerCase())) return false;
      
      // 5. Amministratore
      if (bFilterAdmin && !(p.adminName || '').toLowerCase().includes(bFilterAdmin.toLowerCase())) return false;
      
      // Global Search fallback if needed
      if (searchQuery && !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [properties, view, searchQuery, bFilterCity, bFilterMunicipality, bFilterName, bFilterAddress, bFilterAdmin]);

  // --- DELETE HANDLER ---
  const handleDelete = async () => {
    if (!deleteModal) return;
    
    setIsDeleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would actually delete the item from state/backend
    console.log(`Deleted ${deleteModal.type}: ${deleteModal.id}`);
    
    showToast(`${deleteModal.type === 'building' ? 'Fabbricato' : deleteModal.type === 'apartment' ? 'Appartamento' : 'Stanza'} eliminato con successo`, 'success');
    
    setIsDeleting(false);
    setDeleteModal(null);
  };

  // --- EXPORT HANDLER ---
  const handleExport = () => {
    if (view === 'OBJECTS_BUILDINGS') {
      const headers = "Città;Comune;Nome Condominio;Indirizzo;Amministratore;Tel. Amministratore;Unità;Occupazione\n";
      const rows = filteredProperties.map(p => 
        `${p.city};${p.municipality || ''};${p.condoName || ''};${p.address};${p.adminName || ''};${p.adminPhone || ''};${p.units};${p.occupancy}%`
      ).join("\n");

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `export_fabbricati_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Export disponibile solo per la vista Fabbricati in questa demo.");
    }
  };

  // --- Views Components ---

  const BuildingsView = () => {
    
    // --- DERIVED OPTIONS FOR DROPDOWNS ---
    const options = useMemo(() => {
        let filtered = properties;

        // Filtra base per le opzioni successive
        if (bFilterCity) filtered = filtered.filter(p => p.city === bFilterCity);
        if (bFilterMunicipality) filtered = filtered.filter(p => p.municipality === bFilterMunicipality);
        if (bFilterAddress) filtered = filtered.filter(p => p.address === bFilterAddress);

        return {
            cities: [...new Set(properties.map(p => p.city))].sort(),
            municipalities: [...new Set(properties.filter(p => !bFilterCity || p.city === bFilterCity).map(p => p.municipality).filter(Boolean))].sort(),
            addresses: [...new Set(filtered.map(p => p.address))].sort(),
            admins: [...new Set(filtered.map(p => p.adminName).filter(Boolean))].sort()
        };
    }, [properties, bFilterCity, bFilterMunicipality, bFilterAddress]);

    return (
      <div className="space-y-6">
        
        {/* FILTER BAR REDESIGNED */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
          
          <div className="flex items-center gap-2 mb-4 text-slate-400">
             <Filter size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Filtri Avanzati</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* Città (Dropdown) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Città</label>
              <div className="relative group">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                <select 
                  value={bFilterCity}
                  onChange={(e) => setBFilterCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer appearance-none text-slate-700 font-medium hover:bg-slate-100"
                >
                  <option value="">Tutte le città</option>
                  {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                </div>
              </div>
            </div>

            {/* Comune (Dropdown) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Comune</label>
              <div className="relative group">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                <select 
                  value={bFilterMunicipality}
                  onChange={(e) => setBFilterMunicipality(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer appearance-none text-slate-700 font-medium hover:bg-slate-100"
                >
                  <option value="">Tutti i comuni</option>
                  {options.municipalities.map(m => <option key={m} value={m as string}>{m}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                </div>
              </div>
            </div>

            {/* Nome (Text Input - Manuale) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nome</label>
              <div className="relative group">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                <input 
                  type="text" 
                  value={bFilterName}
                  onChange={(e) => setBFilterName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 text-slate-700"
                  placeholder="Nome condominio..."
                />
              </div>
            </div>

            {/* Indirizzo (Dropdown Filtered) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Indirizzo</label>
              <div className="relative group">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                <select 
                  value={bFilterAddress}
                  onChange={(e) => setBFilterAddress(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer appearance-none text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-50"
                  disabled={options.addresses.length === 0}
                >
                  <option value="">Tutti gli indirizzi</option>
                  {options.addresses.map(addr => <option key={addr} value={addr}>{addr}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                </div>
              </div>
            </div>

            {/* Amministratore (Dropdown Filtered) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Amministratore</label>
              <div className="relative group">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                <select 
                  value={bFilterAdmin}
                  onChange={(e) => setBFilterAdmin(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer appearance-none text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-50"
                  disabled={options.admins.length === 0}
                >
                  <option value="">Tutti gli amministratori</option>
                  {options.admins.map(adm => <option key={adm as string} value={adm as string}>{adm as string}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                </div>
              </div>
            </div>

            {/* Tel. Amm. (Auto-populated Read-only) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tel. amm.</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={bFilterAdminPhone}
                  readOnly
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 font-medium cursor-not-allowed"
                  placeholder="-"
                />
              </div>
            </div>

          </div>
        </div>

        {loadingBuildings && properties.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <BuildingCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const owner = getOwner(prop.ownerId);
              const isOccupancyExpanded = expandedOccupancyId === prop.id;
              
              // Mock Data for Analytics
              const totalUnits = prop.units * 3; // Approx rooms
              const occupiedUnits = Math.round(totalUnits * (prop.occupancy / 100));
              const trend = prop.occupancy > 90 ? 'up' : prop.occupancy < 70 ? 'down' : 'neutral';
              
              // Chart Data Generation
              const chartData = getChartData(occupancyTimeframe, prop.occupancy);

              return (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
                  {/* Image Section */}
                  <div className="h-48 bg-slate-200 relative overflow-hidden shrink-0 rounded-t-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <LazyImage 
                        src={prop.image || `https://picsum.photos/seed/${prop.id}/800/400`} 
                        alt="Property" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        containerClassName="w-full h-full"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <div className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border border-white/20 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap
                          ${prop.status === 'active' ? 'bg-green-500/90 text-white' : 
                            prop.status === 'renovation' ? 'bg-amber-500/90 text-white' : 'bg-red-500/90 text-white'}
                        `}>
                           {prop.status === 'active' ? <CheckCircle size={12}/> : prop.status === 'renovation' ? <Hammer size={12}/> : <AlertTriangle size={12}/>}
                           <span>
                              {prop.status === 'active' ? 'Attivo' : prop.status === 'renovation' ? 'Cantiere' : 'Manutenzione'}
                           </span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <h3 className="font-bold text-xl drop-shadow-sm">{prop.address}</h3>
                        <div className="flex items-center gap-1 text-slate-200 text-sm mt-0.5 font-medium">
                          <MapPin size={14} />
                          <span>{prop.city}</span>
                        </div>
                      </div>
                  </div>
                  
                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-1 relative bg-white rounded-b-2xl">
                    
                    {/* Owner Row - Collapsible */}
                    <div className={`
                      flex justify-between items-start transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isOccupancyExpanded ? 'max-h-0 opacity-0 mb-0 overflow-hidden' : 'max-h-20 opacity-100 mb-4'}
                    `}>
                      {owner ? (
                        <button 
                          onClick={() => onNavigateToPerson('PEOPLE_OWNERS', owner.id)}
                          className="flex items-center gap-2 bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors group/owner"
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs border border-white shadow-sm">
                            {owner.firstName.charAt(0)}{owner.lastName.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-slate-600 group-hover/owner:text-orange-600">{owner.firstName} {owner.lastName}</span>
                        </button>
                      ) : <div />}
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleMenu(e, `owner-${prop.id}`)}
                          className={`text-slate-300 hover:text-orange-600 transition-colors p-1 rounded-md hover:bg-slate-100 ${activeMenu === `owner-${prop.id}` ? 'text-orange-600 bg-slate-100' : ''}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {renderMenu(`owner-${prop.id}`, true, prop)}
                      </div>
                    </div>

                    {/* Info Grid / Expanded Section - Using FLEX for smoother transition */}
                    <div className="flex flex-col flex-1 mb-6 relative">
                       <div className="flex gap-4">
                          
                          {/* Units Box - Animated width/flex-basis for smooth disappearance */}
                          <div className={`
                            bg-slate-50 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
                            ${isOccupancyExpanded 
                              ? 'w-0 flex-[0] opacity-0 p-0 m-0 border-0' 
                              : 'flex-1 opacity-100 p-3 flex items-center gap-3 border border-transparent'}
                          `}>
                             {/* Content wrapped to prevent squishing during transition */}
                             <div className="flex items-center gap-3 min-w-[100px]">
                                <div className="p-2 bg-white text-orange-600 rounded-lg shadow-sm">
                                  <Building2 size={18} />
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unità</p>
                                  <p className="font-bold text-slate-700 text-lg leading-none">{prop.units}</p>
                                </div>
                             </div>
                          </div>

                          {/* Occupancy Box (Expandable) */}
                          <div 
                            onClick={() => !isOccupancyExpanded && setExpandedOccupancyId(prop.id)}
                            className={`
                               rounded-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden relative
                               ${isOccupancyExpanded 
                                  ? 'flex-[100%] bg-slate-50 border border-slate-200 shadow-inner p-4 cursor-default h-[280px]' 
                                  : 'flex-1 bg-slate-50 p-3 hover:bg-slate-100 cursor-pointer flex items-center gap-3 h-[68px]'
                               }
                            `}
                          >
                            {isOccupancyExpanded ? (
                               /* EXPANDED CONTENT */
                               <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                                  <div className="flex justify-between items-start mb-1">
                                     <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                          <PieChart size={12} /> Trend Occupazione
                                        </p>
                                        <div className="flex items-baseline gap-2 mt-0.5">
                                          <h4 className="font-bold text-slate-800 text-3xl">{prop.occupancy}%</h4>
                                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5
                                            ${trend === 'up' ? 'text-green-600 bg-green-100' : trend === 'down' ? 'text-red-600 bg-red-100' : 'text-slate-500 bg-slate-200'}
                                          `}>
                                            {trend === 'up' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                                            {trend === 'up' ? '+2.4%' : trend === 'down' ? '-1.2%' : '0%'}
                                          </span>
                                        </div>
                                     </div>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); setExpandedOccupancyId(null); }}
                                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors"
                                     >
                                        <X size={18} />
                                     </button>
                                  </div>
                                  
                                  {/* Timeframe Selectors */}
                                  <div className="flex justify-start gap-1 mb-2 overflow-x-auto pb-1 no-scrollbar">
                                    {['1M', '3M', '6M', '9M', '1Y', 'YTD'].map(tf => (
                                      <button
                                        key={tf}
                                        onClick={(e) => { e.stopPropagation(); setOccupancyTimeframe(tf); }}
                                        className={`
                                          px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors border
                                          ${occupancyTimeframe === tf 
                                            ? 'bg-orange-50 text-white border-orange-500' 
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'}
                                        `}
                                      >
                                        {tf}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Chart Area */}
                                  <div className="w-full h-[80px] mb-2 min-w-0">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                      <AreaChart data={chartData}>
                                        <defs>
                                          <linearGradient id={`colorOccupancy-${prop.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide domain={[0, 100]} />
                                        <Area 
                                          type="monotone" 
                                          dataKey="value" 
                                          stroke="#f97316" 
                                          strokeWidth={3} 
                                          fillOpacity={1} 
                                          fill={`url(#colorOccupancy-${prop.id})`} 
                                          animationDuration={700}
                                        />
                                      </AreaChart>
                                    </ResponsiveContainer>
                                  </div>

                                  {/* Large KPI Footer */}
                                  <div className="mt-auto bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                      <div className="flex justify-between items-end mb-2">
                                          <div>
                                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Totale Unità Occupate</p>
                                              <div className="flex items-baseline gap-1.5">
                                                  <span className="text-2xl font-bold text-slate-800 leading-none">{occupiedUnits}</span>
                                                  <span className="text-sm font-semibold text-slate-400">/ {totalUnits}</span>
                                              </div>
                                          </div>
                                          <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                                              <Users size={18} />
                                          </div>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                                            style={{width: `${prop.occupancy}%`}} 
                                          />
                                      </div>
                                  </div>
                               </div>
                            ) : (
                               /* COLLAPSED CONTENT */
                               <div className="flex items-center gap-3 min-w-[150px]">
                                  <div className="p-2 bg-white text-teal-600 rounded-lg shadow-sm">
                                    <CheckCircle size={18} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Occupazione</p>
                                    <p className="font-bold text-slate-700 text-lg leading-none">{prop.occupancy}%</p>
                                  </div>
                               </div>
                            )}
                          </div>
                       </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => {
                          setFilterBuildingId(prop.id);
                          onNavigate('OBJECTS_APARTMENTS');
                        }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:scale-[0.98] rounded-xl transition-all shadow-md shadow-orange-200"
                      >
                        <span>Gestisci Appartamenti</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredProperties.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                  icon={<Building2 size={32} className="text-slate-300" />}
                  title="Nessun fabbricato trovato"
                  description="Non ci sono fabbricati che corrispondono ai filtri selezionati. Prova a modificare i criteri di ricerca."
                  action={{
                    label: "Cancella tutti i filtri",
                    onClick: () => {
                      setBFilterCity('');
                      setBFilterMunicipality('');
                      setBFilterName('');
                      setBFilterAddress('');
                      setBFilterAdmin('');
                      setBFilterAdminPhone('');
                      setSearchQuery('');
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* PAGINATION / LOAD MORE */}
        {hasMoreBuildings && !loadingBuildings && filteredProperties.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-8 gap-3 animate-in fade-in slide-in-from-bottom-4">
             <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
               Visualizzando {properties.length} di {totalBuildings} fabbricati
             </div>
             <button 
               onClick={loadMoreBuildings}
               disabled={loadingMoreBuildings}
               className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
             >
               {loadingMoreBuildings ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
               {loadingMoreBuildings ? 'Caricamento in corso...' : 'Carica altri risultati'}
             </button>
          </div>
        )}
      </div>
    );
  };

  const ApartmentsView = () => {
    // Filter States
    const [aFilterUnit, setAFilterUnit] = useState('');
    const [aFilterGroup, setAFilterGroup] = useState('');
    const [aFilterAddress, setAFilterAddress] = useState('');
    const [aFilterCity, setAFilterCity] = useState('');
    const [aFilterFloor, setAFilterFloor] = useState('');
    const [aFilterMq, setAFilterMq] = useState('');
    const [aFilterRooms, setAFilterRooms] = useState('');
    const [aFilterContract, setAFilterContract] = useState('');
    const [aFilterStatus, setAFilterStatus] = useState('');

    // Helper to get competence group for a building
    const getCompetenceGroup = (buildingId: string) => {
      if (!MOCK_COMPETENCE_GROUPS || !Array.isArray(MOCK_COMPETENCE_GROUPS)) return undefined;
      return MOCK_COMPETENCE_GROUPS.find(g => g.objectIds && g.objectIds.includes(buildingId));
    };

    const displayApartments = useMemo(() => {
      let filtered = apartments;
      
      // Global Search (kept for backward compatibility if needed, but we have specific filters now)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(apt => {
          const building = getBuilding(apt.buildingId);
          return (
            apt.unitNumber.toLowerCase().includes(query) ||
            (building?.address || '').toLowerCase().includes(query)
          );
        });
      }

      // Specific Filters
      if (filterBuildingId) {
        filtered = filtered.filter(a => a.buildingId === filterBuildingId);
      }

      if (aFilterUnit) {
        filtered = filtered.filter(a => a.unitNumber.toLowerCase().includes(aFilterUnit.toLowerCase()));
      }

      if (aFilterFloor) {
        filtered = filtered.filter(a => a.floor.toString() === aFilterFloor);
      }

      if (aFilterMq) {
        filtered = filtered.filter(a => (a.mq || 0) >= parseInt(aFilterMq));
      }

      if (aFilterRooms) {
        filtered = filtered.filter(a => a.roomsCount >= parseInt(aFilterRooms));
      }

      if (aFilterStatus) {
        filtered = filtered.filter(a => a.status === aFilterStatus);
      }

      // Filters requiring Building/Group join
      if (aFilterGroup || aFilterAddress || aFilterCity || aFilterContract) {
        filtered = filtered.filter(a => {
          const building = getBuilding(a.buildingId);
          if (!building) return false;
          
          const group = getCompetenceGroup(building.id);

          const matchGroup = aFilterGroup ? (group?.name || '').toLowerCase().includes(aFilterGroup.toLowerCase()) : true;
          const matchAddress = aFilterAddress ? building.address.toLowerCase().includes(aFilterAddress.toLowerCase()) : true;
          const matchCity = aFilterCity ? building.city.toLowerCase().includes(aFilterCity.toLowerCase()) : true;
          const matchContract = aFilterContract ? building.contractType === aFilterContract : true;

          return matchGroup && matchAddress && matchCity && matchContract;
        });
      }
      
      return filtered;
    }, [apartments, filterBuildingId, searchQuery, aFilterUnit, aFilterGroup, aFilterAddress, aFilterCity, aFilterFloor, aFilterMq, aFilterRooms, aFilterContract, aFilterStatus]);

    const clearFilters = () => {
      setFilterBuildingId(null);
      setAFilterUnit('');
      setAFilterGroup('');
      setAFilterAddress('');
      setAFilterCity('');
      setAFilterFloor('');
      setAFilterMq('');
      setAFilterRooms('');
      setAFilterContract('');
      setAFilterStatus('');
      setSearchQuery('');
    };

    return (
      <div className="space-y-6">
        
        {/* FILTERS BAR - Table-like Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 overflow-x-auto">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-slate-400">
               <Filter size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Filtri Avanzati</span>
             </div>
             <button 
                onClick={clearFilters}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
             >
                <RefreshCw size={12} />
                Reset
             </button>
           </div>
           
           <div className="min-w-[1000px] grid grid-cols-9 gap-3">
              {/* Codice / Unit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Codice/Int.</label>
                <input 
                  type="text"
                  value={aFilterUnit}
                  onChange={(e) => setAFilterUnit(e.target.value)}
                  placeholder="Es. 1, A..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Gruppo Competenza */}
              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gruppo Comp.</label>
                <input 
                  type="text"
                  value={aFilterGroup}
                  onChange={(e) => setAFilterGroup(e.target.value)}
                  placeholder="Cerca gruppo..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Indirizzo */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Indirizzo</label>
                <input 
                  type="text"
                  value={aFilterAddress}
                  onChange={(e) => setAFilterAddress(e.target.value)}
                  placeholder="Via Roma 10..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Città */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Città</label>
                <input 
                  type="text"
                  value={aFilterCity}
                  onChange={(e) => setAFilterCity(e.target.value)}
                  placeholder="Milano..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Piano */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Piano</label>
                <input 
                  type="number"
                  value={aFilterFloor}
                  onChange={(e) => setAFilterFloor(e.target.value)}
                  placeholder="Es. 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* MQ */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mq. Min</label>
                <input 
                  type="number"
                  value={aFilterMq}
                  onChange={(e) => setAFilterMq(e.target.value)}
                  placeholder="Min mq"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* N. Stanze */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">N. Stanze</label>
                <input 
                  type="number"
                  value={aFilterRooms}
                  onChange={(e) => setAFilterRooms(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Tipologia */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Contratto</label>
                <select 
                  value={aFilterContract}
                  onChange={(e) => setAFilterContract(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                >
                  <option value="">Tutti</option>
                  <option value="student">Studenti</option>
                  <option value="worker">Lavoratori</option>
                </select>
              </div>
            </div>
        </div>

        {loadingApartments && apartments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <ApartmentCardSkeleton key={i} />)}
          </div>
        ) : displayApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayApartments.map((apt, index) => (
              <ApartmentRow 
                key={apt.id}
                index={index}
                style={{}}
                data={{
                  items: displayApartments,
                  onEdit: setEditingApartment,
                  onDelete: (id: string, name: string) => setDeleteModal({ isOpen: true, type: 'apartment', id, name }),
                  onNavigate,
                  setFilterApartmentId,
                  getBuilding,
                  getOwner,
                  MOCK_ROOMS,
                  toggleMenu,
                  renderMenu
                }}
              />
            ))}
          </div>
        ) : (
          <div className="col-span-full">
            <EmptyState 
              icon={<Building2 size={32} className="text-slate-300" />}
              title="Nessun appartamento trovato"
              description="Non ci sono appartamenti che corrispondono ai filtri selezionati."
              action={{
                label: "Mostra tutti",
                onClick: () => setFilterBuildingId(null)
              }}
            />
          </div>
        )}

        {/* PAGINATION / LOAD MORE */}
        {hasMoreApartments && !loadingApartments && displayApartments.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-8 gap-3 animate-in fade-in slide-in-from-bottom-4">
             <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
               Visualizzando {apartments.length} di {totalApartments} appartamenti
             </div>
             <button 
               onClick={loadMoreApartments}
               disabled={loadingMoreApartments}
               className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
             >
               {loadingMoreApartments ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
               {loadingMoreApartments ? 'Caricamento in corso...' : 'Carica altri risultati'}
             </button>
          </div>
        )}
      </div>
    );
  };

  const RoomsView = () => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
      const saved = localStorage.getItem('stanze_view_mode');
      return (saved === 'list' || saved === 'grid') ? saved : 'list';
    });
    
    useEffect(() => {
      localStorage.setItem('stanze_view_mode', viewMode);
    }, [viewMode]);

    const [rFilterStatus, setRFilterStatus] = useState<string>('all');
    const [rFilterDateStart, setRFilterDateStart] = useState<string>('');
    const [rFilterDateEnd, setRFilterDateEnd] = useState<string>('');

    const [activePriceTooltipId, setActivePriceTooltipId] = useState<string | null>(null);

    // Close tooltip on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (activePriceTooltipId && !(event.target as Element).closest('.price-tooltip-trigger')) {
          setActivePriceTooltipId(null);
        }
      };
      
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setActivePriceTooltipId(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEsc);
      };
    }, [activePriceTooltipId]);

    const displayRooms = MOCK_ROOMS.filter(r => {
      if (filterApartmentId && r.apartmentId !== filterApartmentId) return false;
      if (filterBuildingId && r.buildingId !== filterBuildingId) return false;
      if (rFilterStatus !== 'all' && r.status !== rFilterStatus) return false;
      if (searchQuery) {
        const matchesName = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTenant = r.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        if (!matchesName && !matchesTenant) return false;
      }
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           {/* View Selector */}
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <ListIcon size={18} />
               <span className="hidden sm:inline">Lista</span>
             </button>
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Grid size={18} />
               <span className="hidden sm:inline">Griglia</span>
             </button>
           </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-wrap">
             {/* Building Filter */}
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full md:w-auto min-w-[200px]">
               <Filter size={16} className="text-slate-400" />
               <select 
                value={filterBuildingId || ''} 
                onChange={(e) => {
                  setFilterBuildingId(e.target.value || null);
                  setFilterApartmentId(null);
                }}
                className="bg-transparent border-none text-slate-700 text-sm w-full focus:ring-0 cursor-pointer outline-none"
              >
                <option value="">Tutti i Fabbricati</option>
                {MOCK_PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
             </div>
            
            {/* Apartment Filter */}
            <div className={`flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full md:w-auto min-w-[200px] transition-opacity ${!filterBuildingId ? 'opacity-50' : 'opacity-100'}`}>
              <DoorOpen size={16} className="text-slate-400" />
              <select 
                value={filterApartmentId || ''} 
                onChange={(e) => setFilterApartmentId(e.target.value || null)}
                disabled={!filterBuildingId}
                className="bg-transparent border-none text-slate-700 text-sm w-full focus:ring-0 cursor-pointer disabled:cursor-not-allowed outline-none"
              >
                <option value="">Tutti gli Appartamenti</option>
                {filterBuildingId && MOCK_APARTMENTS
                  .filter(a => a.buildingId === filterBuildingId)
                  .map(a => <option key={a.id} value={a.id}>Int. {a.unitNumber}</option>)
                }
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full md:w-auto min-w-[150px]">
              <div className={`w-2 h-2 rounded-full ${
                rFilterStatus === 'available' ? 'bg-green-500' : 
                rFilterStatus === 'occupied' ? 'bg-blue-500' : 
                rFilterStatus === 'maintenance' ? 'bg-slate-500' : 'bg-slate-300'
              }`}></div>
              <select 
                value={rFilterStatus} 
                onChange={(e) => setRFilterStatus(e.target.value)}
                className="bg-transparent border-none text-slate-700 text-sm w-full focus:ring-0 cursor-pointer outline-none"
              >
                <option value="all">Tutti gli stati</option>
                <option value="available">Libera</option>
                <option value="occupied">Affittata</option>
                <option value="maintenance">Manutenzione</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full md:w-auto">
              <Calendar size={16} className="text-slate-400" />
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={rFilterDateStart}
                  onChange={(e) => setRFilterDateStart(e.target.value)}
                  className="bg-transparent border-none text-slate-700 text-sm w-28 focus:ring-0 cursor-pointer outline-none p-0"
                  placeholder="Dal"
                />
                <span className="text-slate-400">→</span>
                <input 
                  type="date" 
                  value={rFilterDateEnd}
                  onChange={(e) => setRFilterDateEnd(e.target.value)}
                  className="bg-transparent border-none text-slate-700 text-sm w-28 focus:ring-0 cursor-pointer outline-none p-0"
                  placeholder="Al"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full xl:w-auto mt-4 xl:mt-0">
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95"
              onClick={() => {
                // Mock refresh logic
                alert('Lista aggiornata!');
              }}
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Aggiorna</span>
            </button>

            <button 
              className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors"
              title="Legenda stati"
            >
              <Info size={18} />
            </button>

            {(filterBuildingId || filterApartmentId || rFilterStatus !== 'all' || rFilterDateStart || rFilterDateEnd) && (
              <button 
                onClick={() => {
                  setFilterBuildingId(null);
                  setFilterApartmentId(null);
                  setRFilterStatus('all');
                  setRFilterDateStart('');
                  setRFilterDateEnd('');
                  setSearchQuery('');
                }}
                className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ml-auto xl:ml-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Header */}
                <div className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200 flex items-center">
                  <div className="px-6 py-5 flex-1">Stanza</div>
                  <div className="px-6 py-5 w-32">Tipologia</div>
                  <div className="px-6 py-5 w-40">Prezzo</div>
                  <div className="px-6 py-5 w-40">Stato</div>
                  <div className="px-6 py-5 w-48">Inquilino</div>
                  <div className="px-6 py-5 w-24 text-right">Azioni</div>
                </div>
                
                {/* Virtualized Body */}
                {displayRooms.length > 0 ? (
                  <div className="h-[600px]">
                    <FixedSizeList
                      height={600}
                      itemCount={displayRooms.length}
                      itemSize={80}
                      width="100%"
                      itemData={{
                        items: displayRooms,
                        getApartment,
                        getBuilding,
                        onNavigateToPerson,
                        setEditingRoom,
                        toggleMenu,
                        renderMenu,
                        activePriceTooltipId,
                        setActivePriceTooltipId,
                        activeMenu,
                        setEditingApartment,
                        setFilterBuildingId
                      }}
                    >
                      {RoomRow}
                    </FixedSizeList>
                  </div>
                ) : (
                  <div className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <span className="font-medium">Nessuna stanza trovata</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {displayRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayRooms.map((room, index) => (
                  <RoomCardRow 
                    key={room.id}
                    index={index}
                    style={{}}
                    data={{
                      items: displayRooms,
                      getApartment,
                      getBuilding,
                      setEditingRoom,
                      toggleMenu,
                      renderMenu
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full">
                <EmptyState 
                  icon={<Key size={32} className="text-slate-300" />}
                  title="Nessuna stanza trovata"
                  description="Non ci sono stanze che corrispondono ai filtri selezionati."
                  action={{
                    label: "Mostra tutte",
                    onClick: () => {
                      setFilterBuildingId(null);
                      setFilterApartmentId(null);
                      setRFilterStatus('all');
                      setRFilterDateStart('');
                      setRFilterDateEnd('');
                      setSearchQuery('');
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const [editingRoom, setEditingRoom] = useState<any | null>(null);

  // --- Main Render ---

  const getTitle = () => {
    switch(view) {
      case 'OBJECTS_BUILDINGS': return 'Fabbricati';
      case 'OBJECTS_APARTMENTS': return 'Appartamenti';
      case 'OBJECTS_ROOMS': return 'Stanze';
      default: return 'Oggetti';
    }
  };

  const handleNewItem = () => {
    if (view === 'OBJECTS_BUILDINGS') {
      setIsNewBuildingModalOpen(true);
    } else if (view === 'OBJECTS_APARTMENTS') {
      setEditingApartment({} as any); 
    } else if (view === 'OBJECTS_ROOMS') {
      setEditingRoom({} as any); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <LayoutGrid size={16} />
            <span className="text-sm font-medium">Gestione del patrimonio immobiliare</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cerca..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm w-64"
            />
          </div>
          
          {/* Export Button (Visible only for Buildings View for this demo) */}
          {view === 'OBJECTS_BUILDINGS' && (
            <button 
              onClick={handleExport}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
            >
              <FileSpreadsheet size={18} />
              <span className="hidden sm:inline">Esporta</span>
            </button>
          )}

          <button 
            onClick={handleNewItem}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Maximize size={18} />
            <span>Nuovo</span>
          </button>
        </div>
      </div>

      {view === 'OBJECTS_BUILDINGS' && <BuildingsView />}
      {view === 'OBJECTS_APARTMENTS' && <ApartmentsView />}
      {view === 'OBJECTS_ROOMS' && <RoomsView />}

      <BuildingDrawer 
        isOpen={!!selectedBuilding} 
        property={selectedBuilding} 
        onClose={() => setSelectedBuilding(null)}
        onSave={(updated) => {
          console.log('Saved:', updated);
          setSelectedBuilding(null);
        }}
      />

      <NewBuildingModal 
        isOpen={isNewBuildingModalOpen}
        onClose={() => setIsNewBuildingModalOpen(false)}
        onSave={(data) => {
          console.log('New Building Created:', data);
          // Here you would typically add the new building to the state/backend
        }}
      />

      <EditApartmentModal 
        isOpen={!!editingApartment}
        apartment={editingApartment}
        onClose={() => setEditingApartment(null)}
        onSave={(data) => {
          console.log('Apartment Updated:', data);
          setEditingApartment(null);
        }}
      />

      <EditRoomModal 
        isOpen={!!editingRoom}
        room={editingRoom}
        onClose={() => setEditingRoom(null)}
        onSave={(data) => {
          console.log('Room Updated:', data);
          setEditingRoom(null);
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteModal}
        title={`Elimina ${deleteModal?.type === 'building' ? 'Fabbricato' : deleteModal?.type === 'apartment' ? 'Appartamento' : 'Stanza'}`}
        itemName={deleteModal?.name || ''}
        onConfirm={handleDelete}
        onClose={() => setDeleteModal(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
