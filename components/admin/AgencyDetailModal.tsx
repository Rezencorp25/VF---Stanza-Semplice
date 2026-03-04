import React, { useEffect, useRef, useState } from 'react';
import { X, Edit, Building2, Users, MapPin, Globe, Phone, Mail, FileText, Image, Network, Download, Upload, UserCheck, Calendar } from 'lucide-react';
import { Agency } from '../../types';
import { MOCK_COLLABORATORS } from '../../constants';

interface AgencyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
  onEdit: () => void;
}

export const AgencyDetailModal: React.FC<AgencyDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  agency, 
  onEdit 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !agency) return;

    const initMapDettaglioAgenzia = async () => {
      if (!mapRef.current) return;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      try {
        let lat, lng;
        
        // Geocode address
        const query = `${agency.address}, ${agency.city} ${agency.zipCode}, Italy`.trim();
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
        const result = await response.json();
        
        if (result && result.length > 0) {
          lat = parseFloat(result[0].lat);
          lng = parseFloat(result[0].lon);
        }

        if (lat && lng) {
          // @ts-ignore
          if (!window.L) {
            throw new Error('Leaflet non caricato');
          }

          // @ts-ignore
          const map = window.L.map(mapRef.current).setView([lat, lng], 15);
          mapInstance.current = map;

          // @ts-ignore
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // @ts-ignore
          window.L.marker([lat, lng]).addTo(map)
            .bindPopup(agency.name)
            .openPopup();
            
          setMapError(null);
        } else {
          setMapError("Coordinate non trovate per l'indirizzo");
        }

      } catch (error) {
        console.error("Errore mappa:", error);
        setMapError("Errore caricamento mappa");
      }
    };

    const timer = setTimeout(() => {
      initMapDettaglioAgenzia();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, agency]);

  if (!isOpen || !agency) return null;

  const manager = MOCK_COLLABORATORS.find(c => c.id === agency.managerId);
  const collaborators = MOCK_COLLABORATORS.filter(c => agency.collaboratorIds?.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="relative h-32 bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent z-10" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: agency.brandColor }}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 relative z-20">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-lg p-2 flex items-center justify-center border border-slate-100">
              {agency.logoUrl ? (
                <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div 
                  className="w-full h-full rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: agency.brandColor || '#cbd5e1' }}
                >
                  {agency.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono font-bold border border-slate-200">
                  {agency.code}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                  {agency.legalForm}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{agency.name}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <MapPin size={16} />
                <span>{agency.address}, {agency.zipCode} {agency.city} ({agency.province})</span>
              </div>
            </div>
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-colors flex items-center gap-2"
            >
              <Edit size={18} />
              Modifica
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Manager, Contacts & Corporate */}
            <div className="space-y-6">
              
              {/* Manager */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck size={14} />
                  Responsabile Filiale
                </h3>
                {manager ? (
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{manager.firstName} {manager.lastName}</div>
                      <div className="text-xs text-slate-500">{manager.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-400 text-sm text-center">
                    Nessun responsabile assegnato
                  </div>
                )}
              </div>

              {/* Contacts */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contatti</h3>
                
                <a href={`tel:${agency.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <span className="font-medium">{agency.phone}</span>
                </a>

                <a href={`mailto:${agency.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <span className="font-medium truncate">{agency.email}</span>
                </a>

                {agency.website && (
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Globe size={16} />
                    </div>
                    <span className="font-medium truncate">{agency.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>

              {/* Corporate Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} />
                  Dati Societari
                </h3>
                
                <div className="grid grid-cols-1 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Codice Fiscale</span>
                    <span className="font-mono font-medium text-slate-700 text-sm">{agency.taxCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Partita IVA</span>
                    <span className="font-mono font-medium text-slate-700 text-sm">{agency.vatNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">REA</span>
                    <span className="font-medium text-slate-700 text-sm">{agency.reaNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">PEC</span>
                    <span className="font-medium text-slate-700 text-sm truncate max-w-[150px]" title={agency.pec}>{agency.pec || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Cap. Sociale</span>
                    <span className="font-medium text-slate-700 text-sm">€ {agency.shareCapital?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} />
                  Date
                </h3>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Creato il: <span className="font-mono text-slate-700">{agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : '-'}</span></div>
                </div>
              </div>

            </div>

            {/* Right Column: Map, Collaborators & Documents */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Map */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} />
                  Posizione Sede
                </h3>
                <div className="w-full h-[280px] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
                  <div ref={mapRef} className="w-full h-full z-0"></div>
                  {mapError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-4 text-center z-10">
                      <MapPin size={32} className="mb-2 text-slate-300" />
                      <span className="text-xs font-medium">Mappa non disponibile</span>
                      <span className="text-[10px] mt-1 text-slate-400">{mapError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Collaborators */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} />
                    Collaboratori Assegnati
                  </h3>
                  {collaborators.length > 0 ? (
                    <div className="space-y-2">
                      {collaborators.map(col => (
                        <div key={col.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                            {col.firstName.charAt(0)}{col.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700">{col.firstName} {col.lastName}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{col.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic">Nessun collaboratore assegnato.</div>
                  )}
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={14} />
                      Documenti
                    </h3>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Upload size={12} /> Carica
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Visura Camerale</div>
                          <div className="text-xs text-slate-400">PDF • 1.2 MB</div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
