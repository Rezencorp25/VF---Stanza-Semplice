import React from 'react';
import { ViewState } from '../types';
import { Wrench, CalendarCheck, Clock, CheckSquare } from 'lucide-react';

interface ManagementProps {
  view: ViewState;
}

export const Management: React.FC<ManagementProps> = ({ view }) => {
  const getTitle = () => {
    switch(view) {
      case 'MANAGEMENT_CLEANING': return 'Gestione Pulizie';
      case 'MANAGEMENT_MAINTENANCE': return 'Manutenzioni & Cantieri';
      case 'MANAGEMENT_DEADLINES': return 'Scadenziario';
      default: return 'Gestione';
    }
  };

  const tasks = [
    { id: 1, title: 'Riparazione Caldaia', loc: 'Via Roma 10', status: 'In Corso', priority: 'high' },
    { id: 2, title: 'Pulizia Ordinaria', loc: 'Corso Italia 45', status: 'Programmata', priority: 'medium' },
    { id: 3, title: 'Tinteggiatura Stanza 4', loc: 'Via Napoli 12', status: 'In Attesa', priority: 'low' },
    { id: 4, title: 'Verifica Impianto Elettrico', loc: 'Piazza Verdi 3', status: 'Completata', priority: 'high' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Filtra</button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">+ Nuovo Intervento</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Attività</th>
              <th className="px-6 py-4">Luogo</th>
              <th className="px-6 py-4">Priorità</th>
              <th className="px-6 py-4">Stato</th>
              <th className="px-6 py-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded text-slate-600">
                      {view === 'MANAGEMENT_CLEANING' ? <CheckSquare size={16}/> : <Wrench size={16} />}
                    </div>
                    <span className="font-medium text-slate-800">{task.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{task.loc}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200'}
                  `}>
                    <Clock size={12} />
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Bassa'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${task.status === 'Completata' ? 'bg-green-100 text-green-700' : 
                      task.status === 'In Corso' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                  `}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-orange-600 hover:text-orange-800 font-medium text-sm">Gestisci</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};