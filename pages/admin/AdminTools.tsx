import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Droplets, 
  BarChart3, 
  Eraser, 
  Download, 
  Activity, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Database,
  HardDrive,
  Clock,
  AlertOctagon
} from 'lucide-react';
import { MOCK_CITIES } from '../../constants';
import { AdminLayout } from '../../components/admin/AdminLayout';

// --- Types ---

type ToolStatus = 'idle' | 'running' | 'success' | 'error';

interface ToolLog {
  id: string;
  toolName: string;
  user: string;
  timestamp: Date;
  status: 'success' | 'error';
  details: string;
}

interface SystemStatus {
  dbConnection: boolean;
  storageUsed: string;
  storageTotal: string;
  lastSync: Date;
  jobsInQueue: number;
  recentErrors: { id: string; message: string; timestamp: Date }[];
}

// --- Components ---

const ToolCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { text: string; color: string };
  status: ToolStatus;
  progress: number;
  onRun: () => void;
  children?: React.ReactNode;
  resultMessage?: string;
}> = ({ icon, title, description, badge, status, progress, onRun, children, resultMessage }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            {icon}
          </div>
          {badge && (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
        
        {children && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            {children}
          </div>
        )}

        {status === 'running' && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Elaborazione in corso...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'success' && resultMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2 text-sm text-emerald-700">
            <CheckCircle size={16} className="mt-0.5 shrink-0" />
            <span>{resultMessage}</span>
          </div>
        )}

        {status === 'error' && resultMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-700">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{resultMessage}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button
          onClick={onRun}
          disabled={status === 'running'}
          className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            status === 'running' 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95'
          }`}
        >
          {status === 'running' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Esecuzione...
            </>
          ) : (
            <>
              <Play size={16} />
              Esegui Strumento
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Main Page ---

export const AdminTools: React.FC = () => {
  // --- State for Tools ---
  
  // Tool 1: Hash Images
  const [hashStatus, setHashStatus] = useState<ToolStatus>('idle');
  const [hashProgress, setHashProgress] = useState(0);
  const [hashResult, setHashResult] = useState('');

  // Tool 2: Watermark
  const [watermarkStatus, setWatermarkStatus] = useState<ToolStatus>('idle');
  const [watermarkProgress, setWatermarkProgress] = useState(0);
  const [watermarkResult, setWatermarkResult] = useState('');
  const [watermarkOptions, setWatermarkOptions] = useState({
    onlyMissing: true,
    dateFilter: '',
    cities: [] as string[]
  });

  // Tool 3: Room Report
  const [reportStatus, setReportStatus] = useState<ToolStatus>('idle');
  const [reportProgress, setReportProgress] = useState(0);
  const [reportResult, setReportResult] = useState('');
  const [reportOptions, setReportOptions] = useState({
    monthFrom: '',
    monthTo: '',
    cities: [] as string[],
    format: 'xlsx'
  });

  // Tool 4: Cache
  const [cacheStatus, setCacheStatus] = useState<ToolStatus>('idle');
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cacheResult, setCacheResult] = useState('');
  const [cacheOptions, setCacheOptions] = useState({
    general: true,
    images: false,
    api: false
  });

  // Tool 5: Export
  const [exportStatus, setExportStatus] = useState<ToolStatus>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState('');
  const [exportDataset, setExportDataset] = useState('objects');

  // Tool 6: System Status
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Logs
  const [logs, setLogs] = useState<ToolLog[]>([
    { id: 'log-1', toolName: 'Hash Immagini', user: 'Admin', timestamp: new Date(Date.now() - 3600000), status: 'success', details: 'Processate 2450 immagini in 45s' },
    { id: 'log-2', toolName: 'Pulizia Cache', user: 'Admin', timestamp: new Date(Date.now() - 7200000), status: 'success', details: 'Svuotata cache API' },
    { id: 'log-3', toolName: 'Export Dati', user: 'Admin', timestamp: new Date(Date.now() - 86400000), status: 'error', details: 'Timeout connessione DB' },
  ]);

  // --- Effects ---

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Actions ---

  const addLog = (toolName: string, status: 'success' | 'error', details: string) => {
    const newLog: ToolLog = {
      id: `log-${Date.now()}`,
      toolName,
      user: 'Admin', // Mock user
      timestamp: new Date(),
      status,
      details
    };
    setLogs(prev => [newLog, ...prev].slice(0, 20));
  };

  const fetchSystemStatus = () => {
    setStatusLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSystemStatus({
        dbConnection: true,
        storageUsed: '45.2 GB',
        storageTotal: '100 GB',
        lastSync: new Date(),
        jobsInQueue: Math.floor(Math.random() * 5),
        recentErrors: [
          { id: 'err-1', message: 'Image upload timeout', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
          { id: 'err-2', message: 'SMTP connection failed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) }
        ]
      });
      setStatusLoading(false);
    }, 1000);
  };

  const runHashTool = () => {
    if (!confirm('Sei sicuro di voler ricalcolare gli hash di tutte le immagini? Questa operazione potrebbe richiedere diversi minuti.')) return;
    
    setHashStatus('running');
    setHashProgress(0);
    setHashResult('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHashProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setHashStatus('success');
        const msg = 'Processate 2,450 immagini. 0 errori. Tempo: 1m 12s';
        setHashResult(msg);
        addLog('Hash Immagini', 'success', msg);
      }
    }, 200);
  };

  const runWatermarkTool = () => {
    if (!confirm('Attenzione: rigenerare i watermark è un\'operazione intensiva. Continuare?')) return;

    setWatermarkStatus('running');
    setWatermarkProgress(0);
    setWatermarkResult('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setWatermarkProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setWatermarkStatus('success');
        const msg = 'Rigenerate 120 immagini mancanti. Tempo: 45s';
        setWatermarkResult(msg);
        addLog('Ricrea Watermark', 'success', msg);
      }
    }, 100);
  };

  const runReportTool = () => {
    setReportStatus('running');
    setReportProgress(0);
    setReportResult('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setReportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setReportStatus('success');
        const msg = 'Report generato con successo: report_stanze_2023.xlsx';
        setReportResult(msg);
        addLog('Report Conteggio Stanze', 'success', msg);
      }
    }, 150);
  };

  const runCacheTool = () => {
    if (!confirm('Svuotare la cache selezionata? Il sistema potrebbe rallentare temporaneamente.')) return;

    setCacheStatus('running');
    setCacheProgress(0);
    setCacheResult('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setCacheProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setCacheStatus('success');
        const msg = 'Cache svuotata correttamente.';
        setCacheResult(msg);
        addLog('Pulizia Cache', 'success', msg);
      }
    }, 100);
  };

  const runExportTool = () => {
    setExportStatus('running');
    setExportProgress(0);
    setExportResult('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setExportStatus('success');
        const msg = `Export ${exportDataset} completato: export_${exportDataset}.csv`;
        setExportResult(msg);
        addLog('Export Massivo', 'success', msg);
      }
    }, 100);
  };

  return (
    <AdminLayout 
      title="Strumenti Admin" 
      subtitle="Utility di sistema" 
      breadcrumbs={[{ label: 'Strumenti' }]}
    >
      <div className="space-y-8">
      
      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800 shadow-sm">
        <AlertTriangle size={20} className="mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-sm">Attenzione: Impatto sulle Performance</h3>
          <p className="text-sm opacity-90 mt-1">
            Alcune di queste operazioni (es. Hash Immagini, Watermark) sono intensive per la CPU e lo storage. 
            Si consiglia di eseguirle in orari di basso traffico per evitare rallentamenti agli utenti.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Tool 1: Hash */}
        <ToolCard
          icon={<Lock size={24} />}
          title="Ricalcola Hash Immagini"
          description="Ricalcola l'hash MD5 per tutte le immagini del sistema. Necessario quando le immagini vengono sostituite o migrate manualmente."
          badge={{ text: "Manutenzione", color: "bg-purple-100 text-purple-700" }}
          status={hashStatus}
          progress={hashProgress}
          onRun={runHashTool}
          resultMessage={hashResult}
        />

        {/* Tool 2: Watermark */}
        <ToolCard
          icon={<Droplets size={24} />}
          title="Ricrea Watermark"
          description="Rigenera le versioni con watermark delle immagini a partire dagli originali. Operazione molto lenta."
          badge={{ text: "Lento ⚠️", color: "bg-amber-100 text-amber-700" }}
          status={watermarkStatus}
          progress={watermarkProgress}
          onRun={runWatermarkTool}
          resultMessage={watermarkResult}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={watermarkOptions.onlyMissing}
                onChange={(e) => setWatermarkOptions({...watermarkOptions, onlyMissing: e.target.checked})}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Solo immagini senza watermark
            </label>
            <div className="text-xs text-slate-400">
              Filtra per città: <span className="italic">Tutte</span>
            </div>
          </div>
        </ToolCard>

        {/* Tool 3: Report Stanze */}
        <ToolCard
          icon={<BarChart3 size={24} />}
          title="Report Conteggio Stanze"
          description="Genera un file Excel con il conteggio delle stanze raggruppato per città, periodo e stato di occupazione."
          badge={{ text: "Report", color: "bg-blue-100 text-blue-700" }}
          status={reportStatus}
          progress={reportProgress}
          onRun={runReportTool}
          resultMessage={reportResult}
        >
          <div className="space-y-2">
            <select 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={reportOptions.format}
              onChange={(e) => setReportOptions({...reportOptions, format: e.target.value})}
            >
              <option value="xlsx">Formato Excel (.xlsx)</option>
              <option value="csv">Formato CSV</option>
            </select>
            <div className="text-xs text-slate-400">
              Periodo: <span className="font-medium text-slate-600">Ultimi 3 mesi</span>
            </div>
          </div>
        </ToolCard>

        {/* Tool 4: Cache */}
        <ToolCard
          icon={<Eraser size={24} />}
          title="Pulizia Cache Sistema"
          description="Svuota la cache dell'applicazione (Redis/memcache). Utile dopo modifiche massicce ai dati o problemi di visualizzazione."
          badge={{ text: "Utility", color: "bg-slate-100 text-slate-700" }}
          status={cacheStatus}
          progress={cacheProgress}
          onRun={runCacheTool}
          resultMessage={cacheResult}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={cacheOptions.general}
                onChange={(e) => setCacheOptions({...cacheOptions, general: e.target.checked})}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Cache Generale
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={cacheOptions.api}
                onChange={(e) => setCacheOptions({...cacheOptions, api: e.target.checked})}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Cache API Risposte
            </label>
          </div>
        </ToolCard>

        {/* Tool 5: Export */}
        <ToolCard
          icon={<Download size={24} />}
          title="Export Massivo Dati"
          description="Esporta i dati principali del sistema in formato CSV per analisi esterne o backup."
          badge={{ text: "Data", color: "bg-emerald-100 text-emerald-700" }}
          status={exportStatus}
          progress={exportProgress}
          onRun={runExportTool}
          resultMessage={exportResult}
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Dataset</label>
            <select 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={exportDataset}
              onChange={(e) => setExportDataset(e.target.value)}
            >
              <option value="objects">Oggetti (Appartamenti/Stanze)</option>
              <option value="bookings">Prenotazioni</option>
              <option value="collaborators">Collaboratori</option>
              <option value="cities">Città e Contesti</option>
            </select>
          </div>
        </ToolCard>

        {/* Tool 6: System Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                <Activity size={24} />
              </div>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                Monitoraggio
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Stato Sistema</h3>
            <p className="text-sm text-slate-500 mb-6">Panoramica della salute del sistema e delle risorse.</p>
            
            {systemStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Database size={16} className="text-slate-400" />
                    Database
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${systemStatus.dbConnection ? 'text-emerald-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${systemStatus.dbConnection ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {systemStatus.dbConnection ? 'Connesso' : 'Errore'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <HardDrive size={16} className="text-slate-400" />
                    Storage
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {systemStatus.storageUsed} / {systemStatus.storageTotal}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <RefreshCw size={16} className="text-slate-400" />
                    Sync
                  </div>
                  <div className="text-xs text-slate-500">
                    {systemStatus.lastSync.toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock size={16} className="text-slate-400" />
                    Coda Job
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {systemStatus.jobsInQueue} in attesa
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-400">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={fetchSystemStatus}
              disabled={statusLoading}
              className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {statusLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Aggiorna Stato
            </button>
          </div>
        </div>

      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-slate-400" />
            Log Attività Recenti
          </h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Download size={14} /> Scarica Log Completo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 w-48">Data/Ora</th>
                <th className="px-6 py-3 w-48">Strumento</th>
                <th className="px-6 py-3 w-32">Utente</th>
                <th className="px-6 py-3 w-32">Esito</th>
                <th className="px-6 py-3">Dettagli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-700">
                    {log.toolName}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {log.user}
                  </td>
                  <td className="px-6 py-3">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <CheckCircle size={12} /> Successo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                        <AlertOctagon size={12} /> Errore
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500 truncate max-w-xs" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};
