import React, { memo } from 'react';
import { 
  Wrench, 
  Landmark, 
  Leaf, 
  Shield, 
  Recycle 
} from 'lucide-react';

interface TechnicalSectionProps {
  formData: any;
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
  getInputClass: (field: string) => string;
  getLabelClass: (field: string) => string;
  renderLabelIcon: (field: string) => React.ReactNode;
}

export const TechnicalSection = memo(({
  formData,
  isEditing,
  handleChange,
  getInputClass,
  getLabelClass,
  renderLabelIcon
}: TechnicalSectionProps) => {
  return (
    <div className="space-y-8">
      {/* SECTION 5: IMPIANTI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-orange-500">
            <Wrench size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Impianti</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={getLabelClass('heatingSystem')}>Riscaldamento {renderLabelIcon('heatingSystem')}</label>
            {isEditing ? (
              <select name="heatingSystem" value={formData.heatingSystem} onChange={(e) => handleChange('heatingSystem', e.target.value)} className={getInputClass('heatingSystem')}>
                <option value="Autonomo">Autonomo</option>
                <option value="Centralizzato">Centralizzato</option>
                <option value="Assente">Assente</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.heatingSystem}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('coolingSystem')}>Raffrescamento {renderLabelIcon('coolingSystem')}</label>
            {isEditing ? (
              <select name="coolingSystem" value={formData.coolingSystem} onChange={(e) => handleChange('coolingSystem', e.target.value)} className={getInputClass('coolingSystem')}>
                <option value="Assente">Assente</option>
                <option value="Split">Split</option>
                <option value="Canalizzato">Canalizzato</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.coolingSystem}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('hotWaterSystem')}>Acqua Calda {renderLabelIcon('hotWaterSystem')}</label>
            {isEditing ? (
              <select name="hotWaterSystem" value={formData.hotWaterSystem} onChange={(e) => handleChange('hotWaterSystem', e.target.value)} className={getInputClass('hotWaterSystem')}>
                <option value="Caldaia">Caldaia</option>
                <option value="Scaldabagno">Scaldabagno</option>
                <option value="Centralizzato">Centralizzato</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.hotWaterSystem}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('boilerType')}>Tipo Caldaia {renderLabelIcon('boilerType')}</label>
            {isEditing ? (
              <select name="boilerType" value={formData.boilerType} onChange={(e) => handleChange('boilerType', e.target.value)} className={getInputClass('boilerType')}>
                <option value="Metano">Metano</option>
                <option value="GPL">GPL</option>
                <option value="Elettrica">Elettrica</option>
                <option value="Pompa di calore">Pompa di calore</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.boilerType}</div>
            )}
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
            {isEditing ? (
              <select name="energyClass" value={formData.energyClass} onChange={(e) => handleChange('energyClass', e.target.value)} className={getInputClass('energyClass')}>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.energyClass}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('energyKwh')}>kWh/mq anno {renderLabelIcon('energyKwh')}</label>
            {isEditing ? (
              <input type="number" name="energyKwh" value={formData.energyKwh} onChange={(e) => handleChange('energyKwh', e.target.value)} className={getInputClass('energyKwh')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.energyKwh}</div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 10: ISOLA ECOLOGICA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-teal-500">
            <Recycle size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Isola Ecologica</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={getLabelClass('wasteCollectionLocation')}>Ubicazione {renderLabelIcon('wasteCollectionLocation')}</label>
            {isEditing ? (
              <input type="text" name="wasteCollectionLocation" value={formData.wasteCollectionLocation} onChange={(e) => handleChange('wasteCollectionLocation', e.target.value)} className={getInputClass('wasteCollectionLocation')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.wasteCollectionLocation}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('wasteBinTypes')}>Tipologia Bidoni {renderLabelIcon('wasteBinTypes')}</label>
            {isEditing ? (
              <input type="text" name="wasteBinTypes" value={formData.wasteBinTypes} onChange={(e) => handleChange('wasteBinTypes', e.target.value)} className={getInputClass('wasteBinTypes')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.wasteBinTypes}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('wasteCollectionDays')}>Giorni Ritiro {renderLabelIcon('wasteCollectionDays')}</label>
            {isEditing ? (
              <input type="text" name="wasteCollectionDays" value={formData.wasteCollectionDays} onChange={(e) => handleChange('wasteCollectionDays', e.target.value)} className={getInputClass('wasteCollectionDays')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.wasteCollectionDays}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('wasteAccessKeyRequired')}>Chiave Accesso {renderLabelIcon('wasteAccessKeyRequired')}</label>
            <div className="flex items-center gap-4 h-[42px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="wasteAccessKeyRequired" checked={formData.wasteAccessKeyRequired === true} onChange={() => handleChange('wasteAccessKeyRequired', true)} className="w-4 h-4 text-orange-500 focus:ring-orange-500" disabled={!isEditing} />
                <span className="text-sm text-slate-700">Sì</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="wasteAccessKeyRequired" checked={formData.wasteAccessKeyRequired === false} onChange={() => handleChange('wasteAccessKeyRequired', false)} className="w-4 h-4 text-orange-500 focus:ring-orange-500" disabled={!isEditing} />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>
          {formData.wasteAccessKeyRequired && (
            <div className="space-y-1.5">
              <label className={getLabelClass('wasteAccessKeyNumber')}>Numero Chiave {renderLabelIcon('wasteAccessKeyNumber')}</label>
              {isEditing ? (
                <input type="text" name="wasteAccessKeyNumber" value={formData.wasteAccessKeyNumber} onChange={(e) => handleChange('wasteAccessKeyNumber', e.target.value)} className={getInputClass('wasteAccessKeyNumber')} />
              ) : (
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.wasteAccessKeyNumber}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
