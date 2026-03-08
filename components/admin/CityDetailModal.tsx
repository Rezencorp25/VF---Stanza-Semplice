import React, { useEffect, useRef, useState } from 'react';
import { ModalPortal } from '../ModalPortal';
import { X, Edit, MapPin, Building2, Users, Home } from 'lucide-react';
import { City } from '../../types';

interface CityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
  onEdit: () => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  city, 
  onEdit 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !city) return;

    const initMapDettaglioCitta = async () => {
      if (!mapRef.current) return;

      // IMPORTANTE: se il modal viene aperto/chiuso più volte, distruggi la mappa precedente
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      try {
        let lat = city.coordinates?.lat;
        let lng = city.coordinates?.lng;

        // Se non ha lat/lng → chiama Nominatim per geocodificare
        if (!lat || !lng) {
          const query = `${city.name} ${city.province || ''} Italy`.trim();
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
          const result = await response.json();
          
          if (result && result.length > 0) {
            lat = parseFloat(result[0].lat);
            lng = parseFloat(result[0].lon);
          }
        }

        if (lat && lng) {
          // @ts-ignore
          if (!window.L) {
            throw new Error('Leaflet non caricato');
          }

          // INIZIALIZZAZIONE LEAFLET
          // @ts-ignore
          const map = window.L.map(mapRef.current).setView([lat, lng], 13);
          mapInstance.current = map;

          // @ts-ignore
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // @ts-ignore
          window.L.marker([lat, lng]).addTo(map)
            .bindPopup(city.name)
            .openPopup();
            
          setMapError(null);
        } else {
          setMapError("Coordinate non trovate");
        }

      } catch (error) {
        console.error("Errore mappa:", error);
        setMapError("Errore caricamento mappa");
      }
    };

    // Piccolo delay per assicurarsi che il div sia renderizzato
    const timer = setTimeout(() => {
      initMapDettaglioCitta();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, city]);

  if (!isOpen || !city) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative">
        
        {/* Pulsante di chiusura fisso in alto a destra */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors shadow-lg"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        {/* Header with Cover Image */}
        <div className="relative h-48 bg-slate-200 rounded-t-2xl overflow-hidden">
          {city.imageUrl ? (
            <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Building2 size={48} />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs font-mono backdrop-blur-sm">
                    {city.code}
                  </span>
                  <span className="text-white/80 text-sm font-medium">{city.region}</span>
                </div>
                <h2 className="text-3xl font-bold text-white drop-shadow-md">
                  {city.name}
                </h2>
              </div>
              <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm shadow-lg"
              >
                <Edit size={16} /> Modifica
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Oggetti Totali</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{city.objectsCount}</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Home size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Stanze Libere</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{city.availableRoomsCount || 0}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Users size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">Collaboratori</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{city.assignedCollaboratorsCount || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Info */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dettagli Mercato</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Valore Medio / mq</span>
                    <span className="font-bold text-slate-800">€ {city.marketValuePerSqm.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Area Geografica</span>
                    <span className="font-medium text-slate-700">{city.area}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Regione</span>
                    <span className="font-medium text-slate-700">{city.region}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Provincia</span>
                    <span className="font-medium text-slate-700">{city.province}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Paese</span>
                    <span className="font-medium text-slate-700">Italia</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Stato</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${city.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {city.status === 'active' ? 'Attiva' : 'Inattiva'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 text-sm">Data Creazione</span>
                    <span className="font-medium text-slate-700">
                      {city.createdAt ? new Date(city.createdAt).toLocaleDateString('it-IT') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descrizione Pubblica</h3>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-600 text-sm leading-relaxed">
                  {city.description || "Nessuna descrizione inserita."}
                </div>
              </div>

            </div>

            {/* Right Column: Map & Groups */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} />
                Posizione
              </h3>

              <div className="w-full h-[280px] bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 shadow-inner">
                <div ref={mapRef} id="map-dettaglio-citta" className="w-full h-full z-0"></div>
                {mapError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-4 text-center z-10">
                    <MapPin size={32} className="mb-2 text-slate-300" />
                    <span className="text-xs font-medium">Mappa non disponibile</span>
                    <span className="text-[10px] mt-1 text-slate-400">
                      {mapError}
                    </span>
                    {city.coordinates && (
                      <span className="text-[10px] mt-2 font-mono bg-slate-200 px-2 py-1 rounded">
                        {city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gruppi di Competenza</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 transition-colors cursor-pointer">
                    Team {city.name} Centro
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 transition-colors cursor-pointer">
                    Team {city.name} Periferia
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
