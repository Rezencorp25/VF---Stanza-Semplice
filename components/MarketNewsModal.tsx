import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { X, Newspaper, Sparkles, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Keyword = 'Housing Market' | 'Student & Mobility' | 'Costi & Regulation';

const KEYWORDS: { id: Keyword; label: string; subtitle: string }[] = [
  {
    id: 'Housing Market',
    label: 'Housing Market',
    subtitle: 'Notizie relative all’andamento del mercato immobiliare e degli affitti, con particolare attenzione alle città universitarie e al mercato delle stanze.'
  },
  {
    id: 'Student & Mobility',
    label: 'Student & Mobility',
    subtitle: 'Notizie legate al mondo universitario, allo student housing, alla mobilità degli studenti e dei giovani lavoratori.'
  },
  {
    id: 'Costi & Regulation',
    label: 'Costi & Regulation',
    subtitle: 'Notizie relative ai costi di gestione degli immobili, come energia e utilities, e agli aggiornamenti normativi o regolatori che possono influenzare il settore degli affitti.'
  }
];

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  source: string;
  url: string;
  date: string;
  region?: string;
  category?: string;
  impact?: 'Alto' | 'Medio' | 'Basso';
}

const MOCK_NEWS: Record<Keyword, NewsItem[]> = {
  'Housing Market': [
    {
      id: 'hm1',
      title: 'Crescita record per lo student housing in Italia',
      summary: 'Il mercato degli alloggi per studenti registra un +15% di investimenti nel primo trimestre 2026, con Milano e Roma in testa.',
      fullText: 'Il mercato degli alloggi per studenti in Italia continua a mostrare segni di forte vitalità. Nel primo trimestre del 2026, gli investimenti nel settore hanno registrato un incremento del 15% rispetto allo stesso periodo dell\'anno precedente. Milano e Roma si confermano le città più attrattive, trainate dalla crescente domanda di posti letto da parte di studenti fuorisede e internazionali. Gli esperti prevedono che questo trend positivo continuerà per tutto l\'anno, spingendo molti operatori a espandere i propri portafogli immobiliari.',
      source: 'Il Sole 24 Ore',
      url: '#',
      date: 'Oggi',
      region: 'Nazionale',
      category: 'Investimenti',
      impact: 'Alto'
    },
    {
      id: 'hm2',
      title: 'Nuove normative sugli affitti brevi: cosa cambia',
      summary: 'Approvato il nuovo decreto che introduce regole più stringenti per le locazioni turistiche e gli affitti brevi nei centri storici.',
      fullText: 'Il governo ha recentemente approvato un nuovo decreto volto a regolamentare in modo più stringente il mercato degli affitti brevi, in particolare nei centri storici delle principali città d\'arte. Le nuove norme prevedono l\'obbligo di registrazione per tutti i proprietari e l\'introduzione di un codice identificativo nazionale (CIN). Inoltre, i comuni avranno maggiore autonomia nel limitare il numero di notti affittabili all\'anno. Queste misure mirano a contrastare lo spopolamento dei centri urbani e a garantire una maggiore equità fiscale.',
      source: 'Corriere della Sera',
      url: '#',
      date: 'Ieri',
      region: 'Nazionale',
      category: 'Normative',
      impact: 'Alto'
    }
  ],
  'Student & Mobility': [
    {
      id: 'sm1',
      title: 'Aumento delle immatricolazioni nelle università del Nord',
      summary: 'Le università del Nord Italia registrano un boom di iscritti, aumentando la pressione sulla ricerca di alloggi.',
      fullText: 'Le principali università del Nord Italia, tra cui Politecnico di Milano e Università di Bologna, hanno registrato un aumento record delle immatricolazioni per l\'anno accademico 2026/2027. Questo afflusso di nuovi studenti, molti dei quali provenienti da altre regioni o dall\'estero, sta mettendo a dura prova il mercato degli affitti locali. La domanda di stanze singole e posti letto ha superato di gran lunga l\'offerta, portando a un ulteriore incremento dei canoni di locazione.',
      source: 'La Repubblica',
      url: '#',
      date: 'Oggi',
      region: 'Nord Italia',
      category: 'Trend',
      impact: 'Medio'
    },
    {
      id: 'sm2',
      title: 'Nuovi fondi per le borse di studio e la mobilità internazionale',
      summary: 'Il Ministero dell\'Università stanzia nuovi fondi per supportare gli studenti fuorisede e i programmi Erasmus.',
      fullText: 'Il Ministero dell\'Università e della Ricerca ha annunciato un nuovo pacchetto di fondi destinati a incrementare il numero e l\'importo delle borse di studio per gli studenti fuorisede. Inoltre, sono previsti incentivi per i programmi di mobilità internazionale come l\'Erasmus+. Queste misure mirano a garantire il diritto allo studio e ad agevolare gli studenti nel far fronte ai crescenti costi di vitto e alloggio nelle principali città universitarie.',
      source: 'Ansa',
      url: '#',
      date: '2 giorni fa',
      region: 'Nazionale',
      category: 'Investimenti',
      impact: 'Medio'
    }
  ],
  'Costi & Regulation': [
    {
      id: 'cr1',
      title: 'Sostenibilità nel property management: i trend del 2026',
      summary: 'L\'efficienza energetica e le certificazioni green diventano requisiti fondamentali per valorizzare gli asset immobiliari.',
      fullText: 'La sostenibilità si conferma uno dei temi centrali per il property management nel 2026. Gli investitori e i conduttori sono sempre più attenti all\'impatto ambientale degli edifici, spingendo i gestori a implementare soluzioni per l\'efficienza energetica e a ottenere certificazioni green (come LEED o BREEAM). L\'adozione di tecnologie smart per il monitoraggio dei consumi e la gestione ottimizzata degli impianti sta diventando uno standard di mercato, contribuendo non solo a ridurre le emissioni, ma anche a incrementare il valore degli asset a lungo termine.',
      source: 'Real Estate Magazine',
      url: '#',
      date: '2 giorni fa',
      region: 'Nazionale',
      category: 'Sostenibilità',
      impact: 'Medio'
    },
    {
      id: 'cr2',
      title: 'Caro bollette: l\'impatto sui costi di gestione condominiale',
      summary: 'L\'aumento dei costi dell\'energia continua a pesare sui bilanci condominiali, spingendo verso soluzioni di efficientamento.',
      fullText: 'Nonostante una parziale stabilizzazione dei mercati energetici, i costi delle utilities rimangono elevati, incidendo significativamente sulle spese condominiali. Molti amministratori e property manager stanno accelerando i piani di riqualificazione energetica, installando pannelli solari, pompe di calore e sistemi di isolamento termico. L\'obiettivo è ridurre la dipendenza dalle fonti fossili e contenere i costi di gestione a lungo termine, rendendo gli immobili più appetibili sul mercato.',
      source: 'Il Sole 24 Ore',
      url: '#',
      date: '3 giorni fa',
      region: 'Nazionale',
      category: 'Trend',
      impact: 'Alto'
    }
  ]
};

export const MarketNewsModal: React.FC<MarketNewsModalProps> = ({ isOpen, onClose }) => {
  const [activeKeyword, setActiveKeyword] = useState<Keyword>('Housing Market');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [regionFilter, setRegionFilter] = useState('Tutte');
  const [categoryFilter, setCategoryFilter] = useState('Tutte');
  const [timeFilter, setTimeFilter] = useState('Ultimo mese');
  const [impactFilter, setImpactFilter] = useState('Tutti');

  const fetchNews = async (keyword: Keyword) => {
    setIsLoading(true);
    setExpandedId(null);
    // Simulating API call
    setTimeout(() => {
      setNews(MOCK_NEWS[keyword]);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNews(activeKeyword);
    }
  }, [isOpen, activeKeyword]);

  if (!isOpen) return null;

  const activeKeywordData = KEYWORDS.find(k => k.id === activeKeyword);

  // Apply filters to news
  const filteredNews = news.filter(item => {
    if (regionFilter !== 'Tutte' && item.region !== regionFilter && item.region !== 'Nazionale') return false;
    if (categoryFilter !== 'Tutte' && item.category !== categoryFilter) return false;
    if (impactFilter !== 'Tutti' && item.impact !== impactFilter) return false;
    // Time filter logic would go here in a real app
    return true;
  });

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                <Newspaper size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Market News</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Keywords Tabs */}
          <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 shrink-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {KEYWORDS.map((keyword) => (
                <button
                  key={keyword.id}
                  onClick={() => setActiveKeyword(keyword.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeKeyword === keyword.id
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {keyword.label}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKeyword}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg"
              >
                <p className="text-sm text-blue-800 leading-relaxed">
                  {activeKeywordData?.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            
            {/* Secondary Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 mr-2">
                <Filter size={16} />
                <span className="text-sm font-bold">Filtri:</span>
              </div>
              
              <select 
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
                <option value="Tutte">Tutte le regioni</option>
                <option value="Lombardia">Lombardia</option>
                <option value="Lazio">Lazio</option>
                <option value="Emilia-Romagna">Emilia-Romagna</option>
                <option value="Piemonte">Piemonte</option>
                <option value="Nord Italia">Nord Italia</option>
              </select>

              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
                <option value="Tutte">Tutte le categorie</option>
                <option value="Investimenti">Investimenti</option>
                <option value="Normative">Normative</option>
                <option value="Trend">Trend</option>
                <option value="Sostenibilità">Sostenibilità</option>
              </select>

              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
                <option value="Ultimi 7 giorni">Ultimi 7 giorni</option>
                <option value="Ultimo mese">Ultimo mese</option>
                <option value="Ultimi 3 mesi">Ultimi 3 mesi</option>
                <option value="Ultimo anno">Ultimo anno</option>
              </select>

              <select 
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
                <option value="Tutti">Tutti gli impatti</option>
                <option value="Alto">Impatto Alto</option>
                <option value="Medio">Impatto Medio</option>
                <option value="Basso">Impatto Basso</option>
              </select>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-orange-500" />
                <h3 className="text-lg font-bold text-slate-800">Ultime Notizie</h3>
              </div>
              <button 
                onClick={() => fetchNews(activeKeyword)}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Aggiorna
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl"></div>
                  ))}
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
                  <h4 className="text-lg font-bold text-slate-700 mb-2">Nessuna notizia trovata</h4>
                  <p className="text-slate-500">Prova a modificare i filtri per vedere più risultati.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {filteredNews.map((item) => {
                    const isExpanded = expandedId === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'border-orange-300 shadow-md ring-1 ring-orange-100' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div 
                          className="p-5 cursor-pointer flex gap-4"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          <div className="flex-1">
                            <h4 className={`font-bold text-base mb-2 transition-colors ${isExpanded ? 'text-orange-600' : 'text-slate-800'}`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {item.summary}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-4 text-xs font-medium text-slate-400">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start pt-1">
                            <button className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                  {item.fullText}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {item.region && (
                                    <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded-md">
                                      {item.region}
                                    </span>
                                  )}
                                  {item.category && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                                      {item.category}
                                    </span>
                                  )}
                                  {item.impact && (
                                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                      item.impact === 'Alto' ? 'bg-red-100 text-red-700' :
                                      item.impact === 'Medio' ? 'bg-orange-100 text-orange-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      Impatto {item.impact}
                                    </span>
                                  )}
                                </div>

                                <a 
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Leggi articolo completo
                                  <ExternalLink size={14} />
                                </a>
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
        </div>
      </div>
    </ModalPortal>
  );
};
