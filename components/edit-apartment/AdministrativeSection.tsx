import React, { memo } from 'react';
import { 
  Landmark, 
  Shield, 
  FileText 
} from 'lucide-react';

interface AdministrativeSectionProps {
  formData: any;
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
  getInputClass: (field: string) => string;
  getLabelClass: (field: string) => string;
  renderLabelIcon: (field: string) => React.ReactNode;
}

export const AdministrativeSection = memo(({
  formData,
  isEditing,
  handleChange,
  getInputClass,
  getLabelClass,
  renderLabelIcon
}: AdministrativeSectionProps) => {
  return (
    <div className="space-y-8">
      {/* SECTION 6: DATI CATASTALI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-indigo-500">
            <FileText size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Dati Catastali</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={getLabelClass('cadastralPortion')}>Porzione Materiale {renderLabelIcon('cadastralPortion')}</label>
            {isEditing ? (
              <input type="text" name="cadastralPortion" value={formData.cadastralPortion} onChange={(e) => handleChange('cadastralPortion', e.target.value)} className={getInputClass('cadastralPortion')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.cadastralPortion}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('cadastralCategory')}>Categoria {renderLabelIcon('cadastralCategory')}</label>
            {isEditing ? (
              <input type="text" name="cadastralCategory" value={formData.cadastralCategory} onChange={(e) => handleChange('cadastralCategory', e.target.value)} className={getInputClass('cadastralCategory')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.cadastralCategory}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('cadastralMunicipality')}>Comune Catastale {renderLabelIcon('cadastralMunicipality')}</label>
            {isEditing ? (
              <input type="text" name="cadastralMunicipality" value={formData.cadastralMunicipality} onChange={(e) => handleChange('cadastralMunicipality', e.target.value)} className={getInputClass('cadastralMunicipality')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.cadastralMunicipality}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('gasPdrType')}>Tipo PDR Gas {renderLabelIcon('gasPdrType')}</label>
            {isEditing ? (
              <select name="gasPdrType" value={formData.gasPdrType} onChange={(e) => handleChange('gasPdrType', e.target.value)} className={getInputClass('gasPdrType')}>
                <option value="Autonomo">Autonomo</option>
                <option value="Condominiale">Condominiale</option>
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.gasPdrType}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('tariCode')}>Codice TARI {renderLabelIcon('tariCode')}</label>
            {isEditing ? (
              <input type="text" name="tariCode" value={formData.tariCode} onChange={(e) => handleChange('tariCode', e.target.value)} className={getInputClass('tariCode')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.tariCode}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('tariManager')}>Gestore TARI {renderLabelIcon('tariManager')}</label>
            {isEditing ? (
              <input type="text" name="tariManager" value={formData.tariManager} onChange={(e) => handleChange('tariManager', e.target.value)} className={getInputClass('tariManager')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.tariManager}</div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 7: IBAN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-emerald-500">
            <Landmark size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Dati Bancari (IBAN)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <label className={getLabelClass('iban')}>IBAN {renderLabelIcon('iban')}</label>
            {isEditing ? (
              <input type="text" name="iban" value={formData.iban} onChange={(e) => handleChange('iban', e.target.value)} className={getInputClass('iban')} placeholder="IT00X0000000000000000000000" />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium font-mono">{formData.iban}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('bankDescription')}>Intestatario / Banca {renderLabelIcon('bankDescription')}</label>
            {isEditing ? (
              <input type="text" name="bankDescription" value={formData.bankDescription} onChange={(e) => handleChange('bankDescription', e.target.value)} className={getInputClass('bankDescription')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.bankDescription}</div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 9: ASSICURAZIONE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-rose-500">
            <Shield size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Assicurazione</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={getLabelClass('insuranceCompany')}>Compagnia {renderLabelIcon('insuranceCompany')}</label>
            {isEditing ? (
              <input type="text" name="insuranceCompany" value={formData.insuranceCompany} onChange={(e) => handleChange('insuranceCompany', e.target.value)} className={getInputClass('insuranceCompany')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.insuranceCompany}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('insurancePolicyNumber')}>Numero Polizza {renderLabelIcon('insurancePolicyNumber')}</label>
            {isEditing ? (
              <input type="text" name="insurancePolicyNumber" value={formData.insurancePolicyNumber} onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)} className={getInputClass('insurancePolicyNumber')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.insurancePolicyNumber}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={getLabelClass('insuranceExpiryDate')}>Scadenza {renderLabelIcon('insuranceExpiryDate')}</label>
            {isEditing ? (
              <input type="date" name="insuranceExpiryDate" value={formData.insuranceExpiryDate} onChange={(e) => handleChange('insuranceExpiryDate', e.target.value)} className={getInputClass('insuranceExpiryDate')} />
            ) : (
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium">{formData.insuranceExpiryDate}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
