import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ExternalLink, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  source: string;
  url: string;
  date: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Crescita record per lo student housing in Italia',
    summary: 'Il mercato degli alloggi per studenti registra un +15% di investimenti nel primo trimestre 2026, con Milano e Roma in testa.',
    fullText: 'Il mercato degli alloggi per studenti in Italia continua a mostrare segni di forte vitalità. Nel primo trimestre del 2026, gli investimenti nel settore hanno registrato un incremento del 15% rispetto allo stesso periodo dell\'anno precedente. Milano e Roma si confermano le città più attrattive, trainate dalla crescente domanda di posti letto da parte di studenti fuorisede e internazionali. Gli esperti prevedono che questo trend positivo continuerà per tutto l\'anno, spingendo molti operatori a espandere i propri portafogli immobiliari.',
    source: 'Il Sole 24 Ore',
    url: '#',
    date: 'Oggi'
  },
  {
    id: 'n2',
    title: 'Nuove normative sugli affitti brevi: cosa cambia',
    summary: 'Approvato il nuovo decreto che introduce regole più stringenti per le locazioni turistiche e gli affitti brevi nei centri storici.',
    fullText: 'Il governo ha recentemente approvato un nuovo decreto volto a regolamentare in modo più stringente il mercato degli affitti brevi, in particolare nei centri storici delle principali città d\'arte. Le nuove norme prevedono l\'obbligo di registrazione per tutti i proprietari e l\'introduzione di un codice identificativo nazionale (CIN). Inoltre, i comuni avranno maggiore autonomia nel limitare il numero di notti affittabili all\'anno. Queste misure mirano a contrastare lo spopolamento dei centri urbani e a garantire una maggiore equità fiscale.',
    source: 'Corriere della Sera',
    url: '#',
    date: 'Ieri'
  },
  {
    id: 'n3',
    title: 'Sostenibilità nel property management: i trend del 2026',
    summary: 'L\'efficienza energetica e le certificazioni green diventano requisiti fondamentali per valorizzare gli asset immobiliari.',
    fullText: 'La sostenibilità si conferma uno dei temi centrali per il property management nel 2026. Gli investitori e i conduttori sono sempre più attenti all\'impatto ambientale degli edifici, spingendo i gestori a implementare soluzioni per l\'efficienza energetica e a ottenere certificazioni green (come LEED o BREEAM). L\'adozione di tecnologie smart per il monitoraggio dei consumi e la gestione ottimizzata degli impianti sta diventando uno standard di mercato, contribuendo non solo a ridurre le emissioni, ma anche a incrementare il valore degli asset a lungo termine.',
    source: 'Real Estate Magazine',
    url: '#',
    date: '2 giorni fa'
  }
];

export const MarketTrendsSnapshot: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    setIsLoading(true);
    // TODO: replace with Gemini API fetch
    // Fetch news tramite Gemini API con prompt specifico per il settore property management, student housing, mercato immobiliare Italia
    // Output atteso: Array di news: { title, summary, source, url, date }
    
    // Simulating API call
    setTimeout(() => {
      setNews(MOCK_NEWS);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-orange-500" />
          <h3 className="text-lg font-bold text-slate-800">Market Trends Snapshot</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchNews}
            disabled={isLoading}
            className="text-slate-400 hover:text-orange-500 transition-colors disabled:opacity-50"
            title="Aggiorna news"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-md tracking-wider">
            NEWS
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {news.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className={`border border-slate-100 rounded-xl overflow-hidden ${
                    isExpanded ? 'bg-slate-50 shadow-md ring-1 ring-slate-200' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <motion.div 
                    layout="position"
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight flex-1">
                        {item.title}
                      </h4>
                      <div className="text-slate-400 mt-0.5">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    {!isExpanded && (
                      <motion.p 
                        layout="position"
                        className="text-sm text-slate-500 mt-2 line-clamp-2"
                      >
                        {item.summary}
                      </motion.p>
                    )}

                    <motion.div layout="position" className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-slate-200/60">
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            {item.fullText}
                          </p>
                          <div className="flex items-center justify-between">
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} />
                              LEGGI ARTICOLO COMPLETO
                            </a>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(null);
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              <X size={14} />
                              CHIUDI
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
