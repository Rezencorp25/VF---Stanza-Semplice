import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Building2, 
  LayoutDashboard, 
  Gauge, 
  Image as ImageIcon, 
  Lock, 
  FileText, 
  Calculator,
  Globe,
  Youtube,
  ListChecks,
  Wrench,
  Landmark,
  Leaf,
  Shield,
  Recycle,
  Info,
  Edit,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Apartment, Property } from '../types';
import { MOCK_PROPERTIES } from '../constants';
import { ModalPortal } from './ModalPortal';
import { GeneralInfoSection } from './edit-apartment/GeneralInfoSection';
import { FeaturesSection } from './edit-apartment/FeaturesSection';
import { TechnicalSection } from './edit-apartment/TechnicalSection';
import { PublicImagesModal, DocumentsModal } from './MediaModals';
import { AdministrativeSection } from './edit-apartment/AdministrativeSection';

interface EditApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment | null;
  onSave: (data: any) => void;
}

export const EditApartmentModal: React.FC<EditApartmentModalProps> = ({ isOpen, onClose, apartment, onSave }) => {
  if (!isOpen || !apartment) return null;

  // Find related building for default values
  const relatedBuilding = MOCK_PROPERTIES.find(p => p.id === apartment.buildingId);

  // Modal State
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Appartamento
    isEnabled: true,
    isPublished: true,
    virtualTourUrl: '',
    youtubeUrl: '',
    city: relatedBuilding?.city || '',
    buildingId: apartment.buildingId,
    competenceGroups: [] as string[],
    code: `APT-${apartment.unitNumber}`,
    contractType: 'Residenziale',
    monthlyUtilitiesPrice: '',
    annualCondoFeesAdvance: '',
    owners: '',

    // Section 2: Disposizione / Descrizione
    layoutType: 'Un livello',
    floor: apartment.floor,
    unitNumber: apartment.unitNumber,
    surface: 95, // Default from mock
    bathrooms: apartment.bathrooms,
    kitchens: 1,
    descriptionIT: '',
    descriptionEN: '',
    notes: '',

    // Section 3: Posizione Contatori
    waterMeters: 'CONDOMINIALE - IN CUCINA',
    electricityMeters: '',
    gasMeters: '',
    thermalPowerPlant: 'CONDOMINIALE',

    // Section 4: Caratteristiche
    features: {
      fridge: false, washingMachine: false, dishwasher: false, oven: false, microwave: false,
      kettle: false, iron: false, vacuum: false, coffeeMachine: false, toaster: false,
      ac: false, independentHeating: false, intercom: false, videoIntercom: false,
      concierge: false, parking: false, garage: false, cellar: false, terrace: false, balcony: false
    },

    // Section 5: Impianti
    heatingSystem: 'Autonomo',
    coolingSystem: 'Assente',
    hotWaterSystem: 'Caldaia',
    boilerType: 'Metano',

    // Section 6: Dati Catastali
    cadastralPortion: '',
    cadastralCategory: '',
    cadastralMunicipality: '',
    gasPdrType: 'Autonomo',
    tariCode: '',
    tariManager: '',

    // Section 7: IBAN
    iban: '',
    bankDescription: '',

    // Section 8: Certificazione Energetica
    energyClass: 'G',
    energyKwh: '',

    // Section 9: Assicurazione
    insuranceCompany: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',

    // Section 10: Isola Ecologica
    wasteCollectionLocation: '',
    wasteBinTypes: '',
    wasteCollectionDays: '',
    wasteAccessKeyRequired: false,
    wasteAccessKeyNumber: '',
  });

  // Initial Data for Dirty Check
  const originalDataRef = React.useRef<any>(null);
  const dirtyFieldsRef = React.useRef<Set<string>>(new Set());
  
  // Helper functions for dirty styling
  const isFieldDirty = React.useCallback((fieldName: string) => dirtyFieldsRef.current.has(fieldName), []);
  
  const isFeatureDirty = React.useCallback((featureName: string) => {
    return dirtyFieldsRef.current.has(`features.${featureName}`);
  }, []);

  const getInputClass = React.useCallback((fieldName: string, baseClass: string = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all") => {
    if (isFieldDirty(fieldName)) {
      return `${baseClass} ring-2 ring-orange-400 border-orange-400 focus:ring-orange-500`;
    }
    return `${baseClass} focus:ring-2 focus:ring-orange-500`;
  }, [isFieldDirty]);

  const getLabelClass = React.useCallback((fieldName: string, baseClass: string = "text-xs font-bold uppercase flex items-center gap-1.5") => {
    if (isFieldDirty(fieldName)) {
      return `${baseClass} text-orange-600`;
    }
    return `${baseClass} text-slate-500`;
  }, [isFieldDirty]);

  const renderLabelIcon = React.useCallback((fieldName: string) => {
    if (isFieldDirty(fieldName)) {
      return <Edit size={12} className="text-orange-500" />;
    }
    return null;
  }, [isFieldDirty]);

  // Reset form when apartment changes
  useEffect(() => {
    if (apartment) {
      const building = MOCK_PROPERTIES.find(p => p.id === apartment.buildingId);
      const initial = {
        isEnabled: true,
        isPublished: true,
        virtualTourUrl: '',
        youtubeUrl: '',
        city: building?.city || '',
        buildingId: apartment.buildingId,
        competenceGroups: [] as string[],
        code: `APT-${apartment.unitNumber}`,
        contractType: 'Residenziale',
        monthlyUtilitiesPrice: '',
        annualCondoFeesAdvance: '',
        owners: '',
        layoutType: 'Un livello',
        floor: apartment.floor,
        unitNumber: apartment.unitNumber,
        surface: 95,
        bathrooms: apartment.bathrooms,
        kitchens: 1,
        descriptionIT: '',
        descriptionEN: '',
        notes: '',
        waterMeters: 'CONDOMINIALE - IN CUCINA',
        electricityMeters: '',
        gasMeters: '',
        thermalPowerPlant: 'CONDOMINIALE',
        features: {
          fridge: false, washingMachine: false, dishwasher: false, oven: false, microwave: false,
          kettle: false, iron: false, vacuum: false, coffeeMachine: false, toaster: false,
          ac: false, independentHeating: false, intercom: false, videoIntercom: false,
          concierge: false, parking: false, garage: false, cellar: false, terrace: false, balcony: false
        },
        heatingSystem: 'Autonomo',
        coolingSystem: 'Assente',
        hotWaterSystem: 'Caldaia',
        boilerType: 'Metano',
        cadastralPortion: '',
        cadastralCategory: '',
        cadastralMunicipality: '',
        gasPdrType: 'Autonomo',
        tariCode: '',
        tariManager: '',
        iban: '',
        bankDescription: '',
        energyClass: 'G',
        energyKwh: '',
        insuranceCompany: '',
        insurancePolicyNumber: '',
        insuranceExpiryDate: '',
        wasteCollectionLocation: '',
        wasteBinTypes: '',
        wasteCollectionDays: '',
        wasteAccessKeyRequired: false,
        wasteAccessKeyNumber: '',
      };
      setFormData(initial);
      originalDataRef.current = initial;
      dirtyFieldsRef.current.clear();
      setIsEditing(false);
      setIsDirty(false);
      setShowExitConfirm(false);
    }
  }, [apartment]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Optimized dirty check
    if (originalDataRef.current) {
      const originalValue = originalDataRef.current[name];
      
      if (newValue !== originalValue) {
        dirtyFieldsRef.current.add(name);
      } else {
        dirtyFieldsRef.current.delete(name);
      }
      
      const hasDirtyFields = dirtyFieldsRef.current.size > 0;
      if (isDirty !== hasDirtyFields) {
        setIsDirty(hasDirtyFields);
      }
    }
  }, [isDirty]);

  const handleFieldChange = React.useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (originalDataRef.current) {
      const originalValue = originalDataRef.current[field];
      if (value !== originalValue) {
        dirtyFieldsRef.current.add(field);
      } else {
        dirtyFieldsRef.current.delete(field);
      }
      
      const hasDirtyFields = dirtyFieldsRef.current.size > 0;
      if (isDirty !== hasDirtyFields) {
        setIsDirty(hasDirtyFields);
      }
    }
  }, [isDirty]);

  const handleFeatureChange = React.useCallback((feature: string) => {
    // Calculate new value based on current state
    // We assume formData is up to date in this event handler
    setFormData(prev => {
        const currentFeatures = prev.features;
        const newValue = !currentFeatures[feature as keyof typeof currentFeatures];
        const featureKey = `features.${feature}`;
        
        const newFeatures = {
          ...currentFeatures,
          [feature]: newValue
        };
        
        // Update dirtyFieldsRef
        if (originalDataRef.current && originalDataRef.current.features) {
            const originalValue = originalDataRef.current.features[feature];
            if (newValue !== originalValue) {
                dirtyFieldsRef.current.add(featureKey);
            } else {
                dirtyFieldsRef.current.delete(featureKey);
            }
        }
        
        return {
          ...prev,
          features: newFeatures
        };
    });
    
    // We need to check dirty state AFTER the state update or based on ref
    // Since we are inside setFormData updater or just before, we can check ref
    // But we need to trigger re-render if isDirty changes.
    // The previous implementation had a bug where it used stale formData closure.
    // Let's fix it by using the ref for dirty check logic outside setFormData if possible
    // or just rely on the fact that we updated the ref.
    
    // Actually, we can just check the ref size.
    const hasDirtyFields = dirtyFieldsRef.current.size > 0;
    if (isDirty !== hasDirtyFields) {
      setIsDirty(hasDirtyFields);
    }
  }, [isDirty]);

  const validateForm = () => {
    const requiredFields = [
      'city', 'buildingId', 'code', 'contractType', 
      'layoutType', 'floor', 'bathrooms', 'kitchens', 
      'descriptionIT', 'descriptionEN'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Compila i campi obbligatori: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(formData.iban.replace(/\s/g, ''))) {
      alert('Formato IBAN non valido');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
    originalDataRef.current = formData;
    dirtyFieldsRef.current.clear();
    setIsDirty(false);
    // Don't close, stay in edit mode
    alert('Modifiche salvate con successo!');
  };

  const handleSaveAndClose = () => {
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };

  const handleExit = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <ModalPortal>
      <div className="w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-200 overflow-hidden">
        
        {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10 shrink-0">
        <div>
          {isEditing ? (
             <div className="flex items-center gap-2 text-orange-600 animate-in fade-in slide-in-from-left-2">
               <Edit size={20} />
               <h1 className="text-xl font-bold">Stai modificando...</h1>
             </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-left-2">
               <h1 className="text-2xl font-bold text-slate-900">Dettagli Appartamento</h1>
               <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                 <span>{relatedBuilding?.address}</span>
                 <span>/</span>
                 <span>Piano {formData.floor}</span>
                 <span>/</span>
                 <span className="font-medium text-slate-700">Int. {formData.unitNumber}</span>
               </div>
             </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-blue-200 text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Edit size={16} />
              <span>Modifica</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={() => setIsImagesModalOpen(true)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" 
            title="Immagini pubbliche"
          >
            <ImageIcon size={18} />
          </button>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" title="Immagini private">
            <Lock size={18} />
          </button>
          <button 
            onClick={() => setIsDocumentsModalOpen(true)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" 
            title="Documenti"
          >
            <FileText size={18} />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={handleExit}
            className="px-3 py-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
            title="Chiudi"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24">
        {isDirty && isEditing && (
           <div className="max-w-5xl mx-auto mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 text-orange-800 animate-in fade-in slide-in-from-top-2">
             <AlertTriangle size={20} className="text-orange-600" />
             <span className="font-medium">⚠️ Hai modifiche non salvate</span>
           </div>
        )}
        <div className={`max-w-5xl mx-auto space-y-8 ${!isEditing ? 'pointer-events-none opacity-90' : ''}`}>


          {/* SECTION 1, 2, 3: GENERAL INFO */}
          <GeneralInfoSection 
            formData={formData}
            isEditing={isEditing}
            handleChange={handleFieldChange}
            getInputClass={getInputClass}
            getLabelClass={getLabelClass}
            renderLabelIcon={renderLabelIcon}
            relatedBuilding={relatedBuilding}
          />

          {/* SECTION 2: DISPOSIZIONE / DESCRIZIONE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-500">
                <LayoutDashboard size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Disposizione / Descrizione</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Layout Details */}
              <div className="space-y-1.5">
                <label className={getLabelClass('layoutType')}>Disposizione <span className="text-red-500">*</span> {renderLabelIcon('layoutType')}</label>
                {isEditing ? (
                  <select 
                    name="layoutType"
                    value={formData.layoutType}
                    onChange={handleChange}
                    className={getInputClass('layoutType')}
                  >
                    <option value="Un livello">Un livello</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Triplex">Triplex</option>
                    <option value="Mansarda">Mansarda</option>
                    <option value="Seminterrato">Seminterrato</option>
                  </select>
                ) : (
                  <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                    {formData.layoutType}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={getLabelClass('floor')}>Piano <span className="text-red-500">*</span> {renderLabelIcon('floor')}</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className={getInputClass('floor')}
                    />
                  ) : (
                    <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                      {formData.floor}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className={getLabelClass('unitNumber')}>Interno {renderLabelIcon('unitNumber')}</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleChange}
                      className={getInputClass('unitNumber')}
                    />
                  ) : (
                    <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                      {formData.unitNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={getLabelClass('surface')}>Superficie {renderLabelIcon('surface')}</label>
                <div className="relative">
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="surface"
                      value={formData.surface}
                      onChange={handleChange}
                      className={getInputClass('surface')}
                    />
                  ) : (
                    <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                      {formData.surface}
                    </div>
                  )}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">mq</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={getLabelClass('bathrooms')}>Num. Bagni <span className="text-red-500">*</span> {renderLabelIcon('bathrooms')}</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className={getInputClass('bathrooms')}
                    />
                  ) : (
                    <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                      {formData.bathrooms}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className={getLabelClass('kitchens')}>Num. Cucine <span className="text-red-500">*</span> {renderLabelIcon('kitchens')}</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="kitchens"
                      value={formData.kitchens}
                      onChange={handleChange}
                      className={getInputClass('kitchens')}
                    />
                  ) : (
                    <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                      {formData.kitchens}
                    </div>
                  )}
                </div>
              </div>

              {/* Descriptions */}
              <div className="lg:col-span-2 space-y-4">
                {isEditing && (
                  <div className="flex justify-end">
                     <button className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline">
                       Carica la descrizione di default
                     </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className={getLabelClass('descriptionIT')}>
                    <span>Descrizione</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">IT 🇮🇹</span>
                    <span className="text-red-500">*</span>
                    {renderLabelIcon('descriptionIT')}
                  </label>
                  {isEditing ? (
                    <textarea 
                      name="descriptionIT"
                      value={formData.descriptionIT}
                      onChange={handleChange}
                      rows={4}
                      className={getInputClass('descriptionIT', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")}
                    />
                  ) : (
                    <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap">
                      {formData.descriptionIT || <span className="text-slate-400 italic">Nessuna descrizione inserita</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={getLabelClass('descriptionEN')}>
                    <span>Descrizione Inglese</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">EN 🇬🇧</span>
                    <span className="text-red-500">*</span>
                    {renderLabelIcon('descriptionEN')}
                  </label>
                  {isEditing ? (
                    <textarea 
                      name="descriptionEN"
                      value={formData.descriptionEN}
                      onChange={handleChange}
                      rows={4}
                      className={getInputClass('descriptionEN', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")}
                    />
                  ) : (
                    <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap">
                      {formData.descriptionEN || <span className="text-slate-400 italic">Nessuna descrizione inserita</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={getLabelClass('notes')}>Note {renderLabelIcon('notes')}</label>
                  {isEditing ? (
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className={getInputClass('notes', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")}
                    />
                  ) : (
                    <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 min-h-[60px] whitespace-pre-wrap">
                      {formData.notes || <span className="text-slate-400 italic">Nessuna nota</span>}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: POSIZIONE CONTATORI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-cyan-500">
                <Gauge size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Posizione Contatori</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('waterMeters')}>Contatore Acqua {renderLabelIcon('waterMeters')}</label>
                <input type="text" name="waterMeters" value={formData.waterMeters} onChange={handleChange} className={getInputClass('waterMeters')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('electricityMeters')}>Contatore Luce {renderLabelIcon('electricityMeters')}</label>
                <input type="text" name="electricityMeters" value={formData.electricityMeters} onChange={handleChange} className={getInputClass('electricityMeters')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('gasMeters')}>Contatore Gas {renderLabelIcon('gasMeters')}</label>
                <input type="text" name="gasMeters" value={formData.gasMeters} onChange={handleChange} className={getInputClass('gasMeters')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('thermalPowerPlant')}>Centrale Termica {renderLabelIcon('thermalPowerPlant')}</label>
                <input type="text" name="thermalPowerPlant" value={formData.thermalPowerPlant} onChange={handleChange} className={getInputClass('thermalPowerPlant')} />
              </div>
            </div>
          </div>

          {/* SECTION 4: CARATTERISTICHE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-indigo-500">
                <ListChecks size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Caratteristiche</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(formData.features).map(([key, value]) => (
                  <label key={key} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isEditing ? 'cursor-pointer hover:bg-slate-50 group' : ''}`}>
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => handleFeatureChange(key)}
                        disabled={!isEditing}
                        className={`peer h-5 w-5 appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 ${isEditing ? 'cursor-pointer hover:border-orange-400' : 'cursor-default opacity-70'} ${isFeatureDirty(key) ? 'ring-2 ring-orange-400 border-orange-400' : ''}`}
                      />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className={`text-sm font-medium capitalize ${isEditing ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-700'} ${isFeatureDirty(key) ? 'text-orange-600' : ''}`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()} {isFeatureDirty(key) && <Edit size={12} className="inline ml-1 text-orange-500" />}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: IMPIANTI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600">
                <Wrench size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Impianti</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('heatingSystem')}>Riscaldamento {renderLabelIcon('heatingSystem')}</label>
                <select name="heatingSystem" value={formData.heatingSystem} onChange={handleChange} className={getInputClass('heatingSystem')}>
                  <option value="Autonomo">Autonomo</option>
                  <option value="Centralizzato">Centralizzato</option>
                  <option value="Assente">Assente</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('coolingSystem')}>Raffrescamento {renderLabelIcon('coolingSystem')}</label>
                <select name="coolingSystem" value={formData.coolingSystem} onChange={handleChange} className={getInputClass('coolingSystem')}>
                  <option value="Autonomo">Autonomo</option>
                  <option value="Centralizzato">Centralizzato</option>
                  <option value="Assente">Assente</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('hotWaterSystem')}>Acqua Calda Sanitaria {renderLabelIcon('hotWaterSystem')}</label>
                <select name="hotWaterSystem" value={formData.hotWaterSystem} onChange={handleChange} className={getInputClass('hotWaterSystem')}>
                  <option value="Caldaia">Caldaia</option>
                  <option value="Scaldabagno">Scaldabagno</option>
                  <option value="Centralizzato">Centralizzato</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('boilerType')}>Tipo Caldaia {renderLabelIcon('boilerType')}</label>
                <select name="boilerType" value={formData.boilerType} onChange={handleChange} className={getInputClass('boilerType')}>
                  <option value="Metano">Metano</option>
                  <option value="GPL">GPL</option>
                  <option value="Elettrica">Elettrica</option>
                  <option value="Pompa di calore">Pompa di calore</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 6: DATI CATASTALI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-amber-600">
                <Landmark size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Dati Catastali</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('cadastralPortion')}>Porzione Materiale {renderLabelIcon('cadastralPortion')}</label>
                <input type="text" name="cadastralPortion" value={formData.cadastralPortion} onChange={handleChange} className={getInputClass('cadastralPortion')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('cadastralCategory')}>Categoria {renderLabelIcon('cadastralCategory')}</label>
                <input type="text" name="cadastralCategory" value={formData.cadastralCategory} onChange={handleChange} className={getInputClass('cadastralCategory')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('cadastralMunicipality')}>Comune Catastale {renderLabelIcon('cadastralMunicipality')}</label>
                <input type="text" name="cadastralMunicipality" value={formData.cadastralMunicipality} onChange={handleChange} className={getInputClass('cadastralMunicipality')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('gasPdrType')}>Tipologia PDR Gas {renderLabelIcon('gasPdrType')}</label>
                <select name="gasPdrType" value={formData.gasPdrType} onChange={handleChange} className={getInputClass('gasPdrType')}>
                  <option value="Autonomo">Autonomo</option>
                  <option value="Condominiale">Condominiale</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('tariCode')}>Codice TARI {renderLabelIcon('tariCode')}</label>
                <input type="text" name="tariCode" value={formData.tariCode} onChange={handleChange} className={getInputClass('tariCode')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('tariManager')}>Gestore TARI {renderLabelIcon('tariManager')}</label>
                <input type="text" name="tariManager" value={formData.tariManager} onChange={handleChange} className={getInputClass('tariManager')} />
              </div>
            </div>
          </div>

          {/* SECTION 7: IBAN */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-violet-500">
                <Landmark size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Nostro IBAN per Pagamenti Inquilini</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1.5 lg:col-span-2">
                <label className={getLabelClass('iban')}>IBAN {renderLabelIcon('iban')}</label>
                <input 
                  type="text" 
                  name="iban" 
                  value={formData.iban} 
                  onChange={handleChange} 
                  className={getInputClass('iban', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all font-mono")} 
                  placeholder="IT00 X000 0000 0000 0000 0000 000"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <label className={getLabelClass('bankDescription')}>Intestazione / Descrizione Banca {renderLabelIcon('bankDescription')}</label>
                <input type="text" name="bankDescription" value={formData.bankDescription} onChange={handleChange} className={getInputClass('bankDescription')} />
              </div>
            </div>
          </div>

          {/* SECTION 8: CERTIFICAZIONE ENERGETICA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-green-500">
                <Leaf size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Certificazione Energetica</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('energyClass')}>Classe Energetica {renderLabelIcon('energyClass')}</label>
                <select name="energyClass" value={formData.energyClass} onChange={handleChange} className={getInputClass('energyClass')}>
                  {['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('energyKwh')}>KWh/mq anno {renderLabelIcon('energyKwh')}</label>
                <input type="number" name="energyKwh" value={formData.energyKwh} onChange={handleChange} className={getInputClass('energyKwh')} />
              </div>
            </div>
          </div>

          {/* SECTION 9: ASSICURAZIONE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Assicurazione</h2>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('insuranceCompany')}>Compagnia {renderLabelIcon('insuranceCompany')}</label>
                <input type="text" name="insuranceCompany" value={formData.insuranceCompany} onChange={handleChange} className={getInputClass('insuranceCompany')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('insurancePolicyNumber')}>Numero Polizza {renderLabelIcon('insurancePolicyNumber')}</label>
                <input type="text" name="insurancePolicyNumber" value={formData.insurancePolicyNumber} onChange={handleChange} className={getInputClass('insurancePolicyNumber')} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('insuranceExpiryDate')}>Scadenza {renderLabelIcon('insuranceExpiryDate')}</label>
                <input type="date" name="insuranceExpiryDate" value={formData.insuranceExpiryDate} onChange={handleChange} className={getInputClass('insuranceExpiryDate')} />
              </div>
            </div>
          </div>

          {/* SECTION 10: ISOLA ECOLOGICA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-green-600">
                <Recycle size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Isola Ecologica</h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className={getLabelClass('wasteCollectionLocation')}>Ubicazione {renderLabelIcon('wasteCollectionLocation')}</label>
                <textarea name="wasteCollectionLocation" value={formData.wasteCollectionLocation} onChange={handleChange} rows={2} className={getInputClass('wasteCollectionLocation', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('wasteBinTypes')}>Tipologia Bidoni {renderLabelIcon('wasteBinTypes')}</label>
                <textarea name="wasteBinTypes" value={formData.wasteBinTypes} onChange={handleChange} rows={2} className={getInputClass('wasteBinTypes', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")} />
              </div>
              <div className="space-y-1.5">
                <label className={getLabelClass('wasteCollectionDays')}>Giorni di Ritiro {renderLabelIcon('wasteCollectionDays')}</label>
                <textarea name="wasteCollectionDays" value={formData.wasteCollectionDays} onChange={handleChange} rows={2} className={getInputClass('wasteCollectionDays', "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all resize-y")} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      name="wasteAccessKeyRequired"
                      checked={formData.wasteAccessKeyRequired}
                      onChange={handleChange}
                      className={`peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400 ${isFieldDirty('wasteAccessKeyRequired') ? 'ring-2 ring-orange-400 border-orange-400' : ''}`}
                    />
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${isFieldDirty('wasteAccessKeyRequired') ? 'text-orange-600' : 'text-slate-700'} group-hover:text-slate-900`}>Chiave di accesso necessaria {isFieldDirty('wasteAccessKeyRequired') && <Edit size={12} className="inline ml-1 text-orange-500" />}</span>
                </label>

                {formData.wasteAccessKeyRequired && (
                  <div className="flex-1 w-full sm:w-auto animate-in fade-in slide-in-from-left-2">
                    <input 
                      type="text" 
                      name="wasteAccessKeyNumber"
                      value={formData.wasteAccessKeyNumber}
                      onChange={handleChange}
                      className={getInputClass('wasteAccessKeyNumber', "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all")}
                      placeholder="Numero chiave / Codice"
                    />
                  </div>
                )}
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
      
      <DocumentsModal 
        isOpen={isDocumentsModalOpen} 
        onClose={() => setIsDocumentsModalOpen(false)} 
      />

      {/* FOOTER */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 z-10 shrink-0">
        {!isEditing ? (
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
          >
            Chiudi
          </button>
        ) : (
          <>
            <button 
              onClick={handleExit}
              className="px-6 py-2.5 bg-white text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              Esci
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-white border border-green-500 text-green-600 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Salva
            </button>
            <button 
              onClick={handleSaveAndClose}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md shadow-blue-200"
            >
              <Save size={18} />
              Salva e Chiudi
            </button>
          </>
        )}
      </div>

      {/* EXIT CONFIRMATION DIALOG */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-lg font-bold text-slate-900">Modifiche non salvate</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Hai delle modifiche non salvate. Se esci ora, tutte le modifiche andranno perse.
              Vuoi uscire senza salvare?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors"
              >
                Esci senza salvare
              </button>
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors"
              >
                Continua a modificare
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ModalPortal>
  );
};
