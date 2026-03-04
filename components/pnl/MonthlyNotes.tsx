import React, { useState } from 'react';

export interface Note {
  id: string;
  text: string;
  timestamp: Date;
}

interface MonthlyNotesProps {
  initialNotes?: Note[];
}

export const MonthlyNotes: React.FC<MonthlyNotesProps> = ({ initialNotes = [] }) => {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      text: noteText.trim(),
      timestamp: new Date()
    };
    setNotes(prev => [newNote, ...prev].slice(0, 3)); // Keep only last 3
    setNoteText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Note del periodo</h3>
      
      <div className="mb-6">
        <textarea 
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          maxLength={500}
          placeholder="Aggiungi note o osservazioni per questo periodo..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none h-24 text-sm text-slate-700"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">{500 - noteText.length} caratteri rimasti</span>
          <button 
            onClick={handleSaveNote}
            disabled={!noteText.trim()}
            className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salva nota
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <p className="text-sm text-slate-700 mb-2">{note.text}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {note.timestamp.toLocaleString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-slate-400 italic">Nessuna nota presente per questo periodo.</p>
        )}
      </div>
    </div>
  );
};
