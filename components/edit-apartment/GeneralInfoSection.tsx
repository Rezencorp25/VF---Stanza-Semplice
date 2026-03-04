import React, { memo } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Gauge, 
  Globe, 
  Youtube, 
  Edit 
} from 'lucide-react';

interface GeneralInfoSectionProps {
  formData: any;
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
  getInputClass: (field: string, extraClasses?: string) => string;
  getLabelClass: (field: string, extraClasses?: string) => string;
  renderLabelIcon: (field: string) => React.ReactNode;
  relatedBuilding: any;
}

export const GeneralInfoSection = memo(({
  formData,
  isEditing,
  handleChange,
  getInputClass,
  getLabelClass,
  renderLabelIcon,
  relatedBuilding
}: GeneralInfoSectionProps) => {
  return (
    <div className="space-y-8">
      {/* SECTION 1: APPARTAMENTO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600">
            <Building2 size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Appartamento</h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Toggles */}
          <div className="lg:col-span-2 flex gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => handleChange('isEnabled', e.target.checked)}
                  className="sr-only peer"
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">Abilitato</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleChange('isPublished', e.target.checked)}
                  className="sr-only peer"
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">Pubblicato</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('city')}>Città <span className="text-red-500">*</span> {renderLabelIcon('city')}</label>
            {isEditing ? (
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={getInputClass('city')}
              />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                {formData.city}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('buildingId')}>Edificio <span className="text-red-500">*</span> {renderLabelIcon('buildingId')}</label>
            <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" />
              {relatedBuilding?.name || 'Nessun edificio selezionato'}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('code')}>Codice <span className="text-red-500">*</span> {renderLabelIcon('code')}</label>
            {isEditing ? (
              <input 
                type="text" 
                name="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className={getInputClass('code')}
              />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                {formData.code}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('contractType')}>Tipo Contratto <span className="text-red-500">*</span> {renderLabelIcon('contractType')}</label>
            {isEditing ? (
              <select 
                name="contractType"
                value={formData.contractType}
                onChange={(e) => handleChange('contractType', e.target.value)}
                className={getInputClass('contractType')}
              >
                <option value="Residenziale">Residenziale</option>
                <option value="Transitorio">Transitorio</option>
                <option value="Studenti">Studenti</option>
                <option value="Commerciale">Commerciale</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                {formData.contractType}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('monthlyUtilitiesPrice')}>Prezzo Utenze Mensile {renderLabelIcon('monthlyUtilitiesPrice')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              {isEditing ? (
                <input 
                  type="number" 
                  name="monthlyUtilitiesPrice"
                  value={formData.monthlyUtilitiesPrice}
                  onChange={(e) => handleChange('monthlyUtilitiesPrice', e.target.value)}
                  className={getInputClass('monthlyUtilitiesPrice', "w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all")}
                  placeholder="0.00"
                />
              ) : (
                <div className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                  {formData.monthlyUtilitiesPrice || '0.00'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('annualCondoFeesAdvance')}>Anticipo Condominiali Annue {renderLabelIcon('annualCondoFeesAdvance')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              {isEditing ? (
                <input 
                  type="number" 
                  name="annualCondoFeesAdvance"
                  value={formData.annualCondoFeesAdvance}
                  onChange={(e) => handleChange('annualCondoFeesAdvance', e.target.value)}
                  className={getInputClass('annualCondoFeesAdvance', "w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all")}
                  placeholder="0.00"
                />
              ) : (
                <div className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                  {formData.annualCondoFeesAdvance || '0.00'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={getLabelClass('owners')}>Proprietari {renderLabelIcon('owners')}</label>
            {isEditing ? (
              <input 
                type="text" 
                name="owners"
                value={formData.owners}
                onChange={(e) => handleChange('owners', e.target.value)}
                className={getInputClass('owners')}
                placeholder="Cerca proprietario..."
              />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                {formData.owners || '-'}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={getLabelClass('virtualTourUrl')}>Virtual Tour URL {renderLabelIcon('virtualTourUrl')}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                {isEditing ? (
                  <input 
                    type="url" 
                    name="virtualTourUrl"
                    value={formData.virtualTourUrl}
                    onChange={(e) => handleChange('virtualTourUrl', e.target.value)}
                    className={getInputClass('virtualTourUrl', "w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all")}
                    placeholder="https://..."
                  />
                ) : (
                  <div className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-blue-600 underline truncate">
                    {formData.virtualTourUrl || '-'}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={getLabelClass('youtubeUrl')}>YouTube URL {renderLabelIcon('youtubeUrl')}</label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                {isEditing ? (
                  <input 
                    type="url" 
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                    className={getInputClass('youtubeUrl', "w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all")}
                    placeholder="https://youtube.com/..."
                  />
                ) : (
                  <div className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-blue-600 underline truncate">
                    {formData.youtubeUrl || '-'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                onChange={(e) => handleChange('layoutType', e.target.value)}
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
                  onChange={(e) => handleChange('floor', e.target.value)}
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
                  onChange={(e) => handleChange('unitNumber', e.target.value)}
                  className={getInputClass('unitNumber')}
                />
              ) : (
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                  {formData.unitNumber}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className={getLabelClass('surface')}>Mq {renderLabelIcon('surface')}</label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="surface"
                  value={formData.surface}
                  onChange={(e) => handleChange('surface', e.target.value)}
                  className={getInputClass('surface')}
                />
              ) : (
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                  {formData.surface}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className={getLabelClass('bathrooms')}>Bagni {renderLabelIcon('bathrooms')}</label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => handleChange('bathrooms', e.target.value)}
                  className={getInputClass('bathrooms')}
                />
              ) : (
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">
                  {formData.bathrooms}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className={getLabelClass('kitchens')}>Cucine {renderLabelIcon('kitchens')}</label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="kitchens"
                  value={formData.kitchens}
                  onChange={(e) => handleChange('kitchens', e.target.value)}
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
                  onChange={(e) => handleChange('descriptionIT', e.target.value)}
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
                  onChange={(e) => handleChange('descriptionEN', e.target.value)}
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
                  onChange={(e) => handleChange('notes', e.target.value)}
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
            {isEditing ? (
              <input type="text" name="waterMeters" value={formData.waterMeters} onChange={(e) => handleChange('waterMeters', e.target.value)} className={getInputClass('waterMeters')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.waterMeters}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('electricityMeters')}>Contatore Luce {renderLabelIcon('electricityMeters')}</label>
            {isEditing ? (
              <input type="text" name="electricityMeters" value={formData.electricityMeters} onChange={(e) => handleChange('electricityMeters', e.target.value)} className={getInputClass('electricityMeters')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.electricityMeters}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('gasMeters')}>Contatore Gas {renderLabelIcon('gasMeters')}</label>
            {isEditing ? (
              <input type="text" name="gasMeters" value={formData.gasMeters} onChange={(e) => handleChange('gasMeters', e.target.value)} className={getInputClass('gasMeters')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.gasMeters}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('thermalPowerPlant')}>Centrale Termica {renderLabelIcon('thermalPowerPlant')}</label>
            {isEditing ? (
              <input type="text" name="thermalPowerPlant" value={formData.thermalPowerPlant} onChange={(e) => handleChange('thermalPowerPlant', e.target.value)} className={getInputClass('thermalPowerPlant')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.thermalPowerPlant}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
