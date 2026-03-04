import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  DoorOpen, 
  Star, 
  Armchair, 
  Wifi, 
  Globe, 
  Clipboard, 
  Calculator, 
  Image as ImageIcon, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Room, Apartment, Property } from '../types';
import { MOCK_PROPERTIES, MOCK_APARTMENTS } from '../constants';
import { PublicImagesModal } from './MediaModals';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSave: (data: any) => void;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({ isOpen, onClose, room, onSave }) => {
  if (!isOpen) return null;

  // Modal State
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Dati della Stanza
    city: '',
    competenceGroup: [] as string[],
    apartmentId: '',
    roomType: 'Stanza',
    occupancyType: 'Singola',
    code: '',
    activeFrom: '',
    activeTo: '',
    surface: '',
    basePrice: '',
    descriptionIT: '',
    descriptionEN: '',

    // Section 2: Upgrade a Richiesta
    upgrades: {
      electricBike: false, electricScooter: false, pillow: false, blankets: false, sheets: false,
      towelKit: false, hairdryer: false, iron: false, backpack: false
    },

    // Section 3: Arredi
    furnishings: {
      singleBed: false, oneHalfBed: false, doubleBed: false, wardrobe2: false, wardrobe3: false,
      desk: false, deskXL: false, chair: false, ergonomicChair: false, mirror: false,
      bookshelf: false, shoeRack: false, chestOfDrawers: false, sofa: false, armchair: false,
      tableLamp: false, coatRack: false, nightstand: false
    },

    // Section 4: Dotazioni
    amenities: {
      privateBath: false, ensuiteBath: false, balcony: false, ledTV: false, smartTV: false,
      ac: false, tvAntenna: false, terrace: false, livingArea: false, lanConnection: false,
      alexa: false, netflix: false, disneyPlus: false, spotify: false
    },

    // Section 5: Pubblicazione Web e Disponibilità
    doNotPublish: false,
    availabilityType: 'Calcolata dalle prenotazioni',
    forceAvailableFrom: '',

    // Section 6: Note
    internalNotes: ''
  });

  // Initialize form data when room changes
  useEffect(() => {
    if (room && room.id) {
      const apartment = MOCK_APARTMENTS.find(a => a.id === room.apartmentId);
      const building = MOCK_PROPERTIES.find(p => p.id === room.buildingId);
      
      setFormData(prev => ({
        ...prev,
        city: building?.city || '',
        apartmentId: room.apartmentId,
        code: room.name, // Using name as code for mock
        basePrice: room.price ? room.price.toString() : '',
        roomType: room.type === 'single' ? 'Stanza' : room.type === 'double' ? 'Stanza' : 'Suite',
        occupancyType: room.type === 'single' ? 'Singola' : room.type === 'double' ? 'Doppia' : 'Tripla',
        // Reset other fields or map them if they existed in the mock
      }));
    } else {
        // Default values for new room
        setFormData(prev => ({
            ...prev,
            city: '',
            competenceGroup: [],
            apartmentId: '',
            roomType: 'Stanza',
            occupancyType: 'Singola',
            code: '',
            activeFrom: new Date().toISOString().split('T')[0],
            activeTo: '',
            surface: '',
            basePrice: '',
            descriptionIT: '',
            descriptionEN: '',
            upgrades: {
              electricBike: false, electricScooter: false, pillow: false, blankets: false, sheets: false,
              towelKit: false, hairdryer: false, iron: false, backpack: false
            },
            furnishings: {
              singleBed: false, oneHalfBed: false, doubleBed: false, wardrobe2: false, wardrobe3: false,
              desk: false, deskXL: false, chair: false, ergonomicChair: false, mirror: false,
              bookshelf: false, shoeRack: false, chestOfDrawers: false, sofa: false, armchair: false,
              tableLamp: false, coatRack: false, nightstand: false
            },
            amenities: {
              privateBath: false, ensuiteBath: false, balcony: false, ledTV: false, smartTV: false,
              ac: false, tvAntenna: false, terrace: false, livingArea: false, lanConnection: false,
              alexa: false, netflix: false, disneyPlus: false, spotify: false
            },
            doNotPublish: false,
            availabilityType: 'Calcolata dalle prenotazioni',
            forceAvailableFrom: '',
            internalNotes: ''
        }));
    }
  }, [room]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxGroupChange = (group: 'upgrades' | 'furnishings' | 'amenities', key: string) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !(prev[group] as any)[key]
      }
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.code || !formData.basePrice || !formData.apartmentId) {
        alert('Compila i campi obbligatori (*)');
        return;
    }
    onSave(formData);
    alert('Stanza salvata con successo!');
  };

  const handleSaveAndClose = () => {
    if (!formData.code || !formData.basePrice || !formData.apartmentId) {
        alert('Compila i campi obbligatori (*)');
        return;
    }
    onSave(formData);
    alert('Stanza salvata con successo!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in fade-in duration-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Modifica Stanza</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{formData.code || 'NUOVA'}</span>
            <span>•</span>
            <span>{MOCK_APARTMENTS.find(a => a.id === formData.apartmentId)?.unitNumber ? `Int. ${MOCK_APARTMENTS.find(a => a.id === formData.apartmentId)?.unitNumber}` : 'Seleziona appartamento'}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 hover:text-orange-600 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save size={16} />
            <span className="hidden lg:inline">Salva</span>
          </button>
          
          <button 
            onClick={handleSaveAndClose}
            className="px-4 py-2 bg-orange-500 text-white font-semibold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-md shadow-orange-200"
          >
            <Save size={16} />
            <span className="hidden lg:inline">Salva e chiudi</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={() => setIsImagesModalOpen(true)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2" 
            title="Immagini pubbliche"
          >
            <ImageIcon size={18} />
            <span className="hidden sm:inline text-sm font-medium">Immagini</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={onClose}
            className="px-3 py-2 bg-red-50 text-red-500 border border-transparent hover:border-red-100 hover:bg-red-100 rounded-lg transition-colors"
            title="Chiudi"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* SECTION 1: DATI DELLA STANZA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-orange-500">
                <DoorOpen size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Dati della Stanza</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Città</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Gruppo di Competenza</label>
                <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[42px] flex items-center">
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-semibold border border-orange-200">
                    {formData.city || 'Generale'} (1)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Appartamento <span className="text-red-500">*</span></label>
                <select 
                  name="apartmentId"
                  value={formData.apartmentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="">Seleziona Appartamento</option>
                  {MOCK_APARTMENTS.map(apt => {
                      const building = MOCK_PROPERTIES.find(p => p.id === apt.buildingId);
                      return (
                        <option key={apt.id} value={apt.id}>
                            {building?.address} - Int. {apt.unitNumber}
                        </option>
                      );
                  })}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo di Locale <span className="text-red-500">*</span></label>
                <select 
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="Stanza">Stanza</option>
                  <option value="Studio">Studio</option>
                  <option value="Posto letto">Posto letto</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Occupazione</label>
                <select 
                  name="occupancyType"
                  value={formData.occupancyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="Singola">Singola</option>
                  <option value="Doppia">Doppia</option>
                  <option value="Tripla">Tripla</option>
                  <option value="Quadrupla">Quadrupla</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Codice Stanza <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono"
                  />
                  <button className="px-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors" title="Calcola prossimo codice">
                    <Calculator size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Attiva Dal <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="activeFrom"
                  value={formData.activeFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Attiva Fino Al</label>
                <input 
                  type="date" 
                  name="activeTo"
                  value={formData.activeTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Superficie</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="surface"
                    value={formData.surface}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">mq</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Importo Base <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  <input 
                    type="number" 
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">/mese</span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-end">
                   <button 
                    onClick={() => setFormData(prev => ({ ...prev, descriptionIT: 'Descrizione standard...', descriptionEN: 'Standard description...' }))}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline"
                   >
                     Carica la descrizione di default
                   </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <span>Descrizione</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">IT 🇮🇹</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="descriptionIT"
                    value={formData.descriptionIT}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <span>Descrizione Inglese</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">EN 🇬🇧</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="descriptionEN"
                    value={formData.descriptionEN}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-y"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: UPGRADE A RICHIESTA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-amber-500">
                <Star size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Upgrade a Richiesta</h2>
            </div>
            
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 text-xs font-medium text-amber-800">
              ⚠️ I seguenti campi vengono tutti esportati al sito web
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.upgrades).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => handleCheckboxGroupChange('upgrades', key)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                      />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: ARREDI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-indigo-500">
                <Armchair size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Arredi</h2>
            </div>
            
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 text-xs font-medium text-amber-800">
              ⚠️ I seguenti campi vengono tutti esportati al sito web
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.furnishings).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => handleCheckboxGroupChange('furnishings', key)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                      />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: DOTAZIONI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-500">
                <Wifi size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Dotazioni</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.amenities).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => handleCheckboxGroupChange('amenities', key)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                      />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: PUBBLICAZIONE WEB E DISPONIBILITÀ */}
          <div className="bg-[#EFF6FF] rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm text-blue-600">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Pubblicazione Web e Disponibilità</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-3 text-blue-800 text-sm bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p>Usando questi campi puoi bloccare la pubblicazione della stanza sul web e forzare lo stato di disponibilità sovrascrivendo il calcolo automatico dalle prenotazioni.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    name="doNotPublish"
                    checked={formData.doNotPublish}
                    onChange={handleChange}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400"
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Non voglio che questa stanza sia pubblicata sul web</span>
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo Disponibilità <span className="text-red-500">*</span></label>
                  <select 
                    name="availabilityType"
                    value={formData.availabilityType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Calcolata dalle prenotazioni">Calcolata dalle prenotazioni</option>
                    <option value="Forza Disponibile">Forza Disponibile</option>
                    <option value="Forza Occupata">Forza Occupata</option>
                  </select>
                </div>

                {formData.availabilityType === 'Forza Disponibile' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Disponibile Dal</label>
                    <input 
                      type="date" 
                      name="forceAvailableFrom"
                      value={formData.forceAvailableFrom}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 6: NOTE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-500">
                <Clipboard size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Note</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Note Interne</label>
                <textarea 
                  name="internalNotes"
                  value={formData.internalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MEDIA MODALS */}
      <PublicImagesModal 
        isOpen={isImagesModalOpen} 
        onClose={() => setIsImagesModalOpen(false)} 
      />
    </div>
  );
};
