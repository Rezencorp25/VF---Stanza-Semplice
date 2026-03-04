
// --- 1. COSTANTI ---

export const CITTA_DISPONIBILI = ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Lugano', 'Como'];

// Lista appartamenti per filtri a cascata (Città -> Appartamento)
export const APPARTAMENTI_PER_FILTRO = [
  { id: 'mi1', citta: 'Milano', nome: 'Via Roma 10' },
  { id: 'mi2', citta: 'Milano', nome: 'Via Turati 12' },
  { id: 'mi3', citta: 'Milano', nome: 'Viale Kennedy 88' },
  { id: 'to1', citta: 'Torino', nome: 'Corso Italia 45' },
  { id: 'to2', citta: 'Torino', nome: 'Via Po 15' },
  { id: 'rm1', citta: 'Roma', nome: 'Piazza Verdi 3' },
  { id: 'rm2', citta: 'Roma', nome: 'Via Gioberti 3' },
  { id: 'bo1', citta: 'Bologna', nome: 'Via Napoli 12' },
  { id: 'bo2', citta: 'Bologna', nome: 'Via Zamboni 8' },
  { id: 'fi1', citta: 'Firenze', nome: 'Via dei Servi 22' },
];

export const STATI_FATTURA = {
  bozza: { 
    label: 'Bozza', 
    color: 'text-slate-600 border-slate-200', 
    bgColor: 'bg-slate-100' 
  },
  emessa: { 
    label: 'Emessa', 
    color: 'text-blue-600 border-blue-200', 
    bgColor: 'bg-blue-100' 
  },
  inviata_sdi: { 
    label: 'Inviata SDI', 
    color: 'text-purple-600 border-purple-200', 
    bgColor: 'bg-purple-100' 
  },
  scartata: { 
    label: 'Scartata', 
    color: 'text-red-600 border-red-200', 
    bgColor: 'bg-red-100' 
  },
  pagata: { 
    label: 'Pagata', 
    color: 'text-green-600 border-green-200', 
    bgColor: 'bg-green-100' 
  }
};

export const METODI_PAGAMENTO = [
  { value: 'bonifico', label: 'Bonifico Bancario', emoji: '🏦' },
  { value: 'stripe', label: 'Stripe', emoji: '💳' },
  { value: 'contanti', label: 'Contanti', emoji: '💵' },
  { value: 'assegno', label: 'Assegno', emoji: '📝' },
  { value: 'housing_anywhere', label: 'HousingAnywhere', emoji: '🏠' },
];

export const PAGANTI_TIPO = [
  { value: 'inquilino', label: 'Inquilino stesso' },
  { value: 'garante', label: 'Garante' },
  { value: 'genitore', label: 'Genitore' },
  { value: 'agenzia', label: 'Agenzia (es. HousingAnywhere)' },
  { value: 'altro', label: 'Altro' },
];

export const CATEGORIE_COSTO = [
  { value: 'utenze', label: 'Utenze', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'manutenzione', label: 'Manutenzione', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'affitto_passivo', label: 'Affitto Passivo', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'pulizie', label: 'Pulizie', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { value: 'assicurazione', label: 'Assicurazione', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'amministrazione', label: 'Amministrazione', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'marketing', label: 'Marketing', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'altro', label: 'Altro', color: 'bg-gray-100 text-gray-700 border-gray-200' }
];

// --- INTERFACCIA COSTO ---
export interface Costo {
  id: string;
  fornitore: string;
  descrizione: string;
  importo_imponibile: number;
  iva_percentuale: number; // 0, 4, 10, 22
  importo_iva: number;
  importo_totale: number;
  data_fattura: string; // YYYY-MM-DD
  mese_competenza: string; // YYYY-MM
  data_competenza_inizio?: string; // YYYY-MM-DD
  data_competenza_fine?: string; // YYYY-MM-DD
  categoria: string;
  citta: string;
  appartamento?: string;
  numero_fattura_fornitore?: string;
  esportato_profis: boolean;
  data_export_profis?: string;
  note?: string;
}

// --- 2. LOGICA GENERAZIONE DATI SMART ---

export const PRENOTAZIONI_ATTIVE = [
  { id: 'P001', inquilino: 'Marco Bianchi', inquilino_id: 'I001', appartamento: 'Via Turati 12 - Milano', citta: 'Milano', agenzia: 'Stanza Semplice SRL', canone_mensile: 650, data_inizio: '2025-09-01', data_fine: '2026-07-31', tipologia: 'Fattura', mensilita: ['09/2025','10/2025','11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P002', inquilino: 'Anna Rossi', inquilino_id: 'I002', appartamento: 'Corso Re Umberto 45 - Torino', citta: 'Torino', agenzia: 'Stanza Semplice SRL', canone_mensile: 520, data_inizio: '2025-10-01', data_fine: '2026-06-30', tipologia: 'Fattura', mensilita: ['10/2025','11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P003', inquilino: 'Lucas Weber', inquilino_id: 'I003', appartamento: 'Via Zamboni 8 - Bologna', citta: 'Bologna', agenzia: 'Stanza Semplice SRL', canone_mensile: 480, data_inizio: '2025-11-01', data_fine: '2026-05-31', tipologia: 'Nota di Credito', mensilita: ['11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P004', inquilino: 'Sofia Martínez', inquilino_id: 'I004', appartamento: 'Via dei Servi 22 - Firenze', citta: 'Firenze', agenzia: 'Stanza Semplice SRL', canone_mensile: 590, data_inizio: '2025-09-15', data_fine: '2026-08-14', tipologia: 'Fattura', mensilita: ['09/2025','10/2025','11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P005', inquilino: 'Yuki Tanaka', inquilino_id: 'I005', appartamento: 'Via Gioberti 3 - Roma', citta: 'Roma', agenzia: 'Stanza Semplice SRL', canone_mensile: 710, data_inizio: '2025-08-01', data_fine: '2026-07-31', tipologia: 'Fattura', mensilita: ['08/2025','09/2025','10/2025','11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P006', inquilino: 'Pierre Dupont', inquilino_id: 'I006', appartamento: 'Via Turati 12 - Milano', citta: 'Milano', agenzia: 'Stanza Semplice SRL', canone_mensile: 620, data_inizio: '2025-12-01', data_fine: '2026-06-30', tipologia: 'Fattura', mensilita: ['12/2025','01/2026','02/2026'] },
  { id: 'P007', inquilino: 'Elena Kovač', inquilino_id: 'I007', appartamento: 'Via Po 15 - Torino', citta: 'Torino', agenzia: 'Stanza Semplice SRL', canone_mensile: 540, data_inizio: '2025-10-01', data_fine: '2026-09-30', tipologia: 'Fattura', mensilita: ['10/2025','11/2025','12/2025','01/2026','02/2026'] },
  { id: 'P008', inquilino: 'Andrei Popescu', inquilino_id: 'I008', appartamento: 'Via Marconi 7 - Bologna', citta: 'Bologna', agenzia: 'Stanza Semplice SRL', canone_mensile: 460, data_inizio: '2026-01-15', data_fine: '2026-07-14', tipologia: 'Nota di Credito', mensilita: ['01/2026','02/2026'] },
];

// Helper per convertire formato data mock (DD/MM/YYYY) in formato app (YYYY-MM-DD o YYYY-MM)
const convertToISOMonth = (monthStr: string) => {
  const [mm, yyyy] = monthStr.split('/');
  return `${yyyy}-${mm}`;
};

export const MOCK_FATTURE = PRENOTAZIONI_ATTIVE.flatMap((p, pIndex) =>
  p.mensilita.map((mese, i) => {
    const isCurrentMonth = mese === '02/2026'; 
    const isPast = !isCurrentMonth;
    let stato = 'bozza';
    if (isPast) {
      const rand = Math.random();
      if (rand > 0.6) stato = 'pagata';
      else if (rand > 0.3) stato = 'inviata_sdi';
      else stato = 'emessa';
    }
    const numero_fattura = stato === 'bozza' ? null : `SS-2026-${String(100 + pIndex * 10 + i)}`;
    const [mm, yyyy] = mese.split('/');
    const data_emissione = stato === 'bozza' 
      ? null 
      : `${yyyy}-${mm}-01`;

    return {
      id: `F-${p.id}-${i}`,
      numero_fattura: numero_fattura,
      inquilino_nome: p.inquilino,
      inquilino_id: p.inquilino_id,
      agenzia: p.agenzia,
      citta: p.citta,
      appartamento_nome: p.appartamento,
      importo_lordo: p.canone_mensile,
      mese_competenza: convertToISOMonth(mese),
      data_emissione: data_emissione,
      stato: stato,
      tipologia: p.tipologia, 
      sez: 'SUB', 
      xml: isPast && Math.random() > 0.1, 
      pdf: isPast && Math.random() > 0.1, 
      note: stato === 'bozza' ? 'Generata automaticamente da contratto attivo' : '',
      isAutoGenerated: false 
    };
  })
);

export const MOCK_PAGAMENTI = [
  { id: "pay_001", tipo: "Pagamento", data_pagamento: "2026-02-06", importo_ricevuto: 610, effettuato_da: { inquilino_id: "I001", nome_completo: "Marco Bianchi", id_display: "I001" }, pagante: null, note: "", importato_automaticamente: false, stripe_payment_id: null, n_pagamenti_uguali_stessa_data: 1, citta: "Milano", appartamento_ref: "Via Turati 12", mese_competenza: "2026-02" },
  { id: "pay_002", tipo: "Pagamento", data_pagamento: "2026-02-05", importo_ricevuto: 520, effettuato_da: { inquilino_id: "I002", nome_completo: "Anna Rossi", id_display: "I002" }, pagante: "Genitore", note: "Bonifico Papà", importato_automaticamente: false, stripe_payment_id: null, n_pagamenti_uguali_stessa_data: 1, citta: "Torino", appartamento_ref: "Corso Re Umberto 45", mese_competenza: "2026-02" },
  { id: "pay_003", tipo: "Pagamento", data_pagamento: "2026-02-04", importo_ricevuto: 480, effettuato_da: { inquilino_id: "I003", nome_completo: "Lucas Weber", id_display: "I003" }, pagante: null, note: "Stripe Auto", importato_automaticamente: true, stripe_payment_id: "ch_123", n_pagamenti_uguali_stessa_data: 1, citta: "Bologna", appartamento_ref: "Via Zamboni 8", mese_competenza: "2026-02" },
  { id: "pay_004", tipo: "Pagamento", data_pagamento: "2026-01-05", importo_ricevuto: 650, effettuato_da: { inquilino_id: "I001", nome_completo: "Marco Bianchi", id_display: "I001" }, pagante: null, note: "", importato_automaticamente: false, stripe_payment_id: null, n_pagamenti_uguali_stessa_data: 1, citta: "Milano", appartamento_ref: "Via Turati 12", mese_competenza: "2026-01" },
  { id: "pay_005", tipo: "Pagamento", data_pagamento: "2026-01-07", importo_ricevuto: 520, effettuato_da: { inquilino_id: "I002", nome_completo: "Anna Rossi", id_display: "I002" }, pagante: null, note: "", importato_automaticamente: false, stripe_payment_id: null, n_pagamenti_uguali_stessa_data: 1, citta: "Torino", appartamento_ref: "Corso Re Umberto 45", mese_competenza: "2026-01" },
];

export const TOTALE_PAGAMENTI_DB = 15534;

export const MOCK_INQUILINI = [
  { id: 'I001', nome: 'Marco', cognome: 'Bianchi', email: 'marco.bianchi@email.com', appartamento_nome: 'Via Turati 12 - Milano', citta: 'Milano', saldo_attuale: 0 },
  { id: 'I002', nome: 'Anna', cognome: 'Rossi', email: 'anna.rossi@email.com', appartamento_nome: 'Corso Re Umberto 45 - Torino', citta: 'Torino', saldo_attuale: 0 },
  { id: 'I003', nome: 'Lucas', cognome: 'Weber', email: 'lucas.weber@email.com', appartamento_nome: 'Via Zamboni 8 - Bologna', citta: 'Bologna', saldo_attuale: 0 },
  { id: 'I004', nome: 'Sofia', cognome: 'Martínez', email: 'sofia.martinez@email.com', appartamento_nome: 'Via dei Servi 22 - Firenze', citta: 'Firenze', saldo_attuale: -590 }, // Insoluto
  { id: 'I005', nome: 'Yuki', cognome: 'Tanaka', email: 'yuki.tanaka@email.com', appartamento_nome: 'Via Gioberti 3 - Roma', citta: 'Roma', saldo_attuale: -1420 }, // Insoluto grave
  { id: 'I006', nome: 'Pierre', cognome: 'Dupont', email: 'pierre.dupont@email.com', appartamento_nome: 'Via Turati 12 - Milano', citta: 'Milano', saldo_attuale: 0 },
  { id: 'I007', nome: 'Elena', cognome: 'Kovač', email: 'elena.kovac@email.com', appartamento_nome: 'Via Po 15 - Torino', citta: 'Torino', saldo_attuale: -540 }, // Insoluto
  { id: 'I008', nome: 'Andrei', cognome: 'Popescu', email: 'andrei.popescu@email.com', appartamento_nome: 'Via Marconi 7 - Bologna', citta: 'Bologna', saldo_attuale: 0 },
];

export const MOCK_PIANO_PAGAMENTI = PRENOTAZIONI_ATTIVE.flatMap((p, i) => {
  // Genera un piano pagamenti mensile per ogni prenotazione
  const start = new Date(p.data_inizio);
  const end = new Date(p.data_fine);
  const piani = [];
  let current = new Date(start);
  
  while (current <= end) {
    const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    piani.push({
      id: `plan_${p.id}_${monthStr}`,
      inquilino_id: p.inquilino_id,
      importo_previsto: p.canone_mensile,
      mese_competenza: monthStr,
      descrizione: `Canone ${monthStr}`
    });
    current.setMonth(current.getMonth() + 1);
  }
  return piani;
});

export const MOCK_COSTI: Costo[] = [
  { id: 'c1', fornitore: 'Enel Energia', descrizione: 'Bolletta Luce Gennaio', categoria: 'utenze', citta: 'Milano', appartamento: 'Via Roma 10', importo_imponibile: 100, iva_percentuale: 10, importo_iva: 10, importo_totale: 110, data_fattura: '2026-01-15', mese_competenza: '2026-01', data_competenza_inizio: '2026-01-01', data_competenza_fine: '2026-01-31', esportato_profis: false },
  { id: 'c2', fornitore: 'Idraulico Express', descrizione: 'Riparazione tubatura bagno', categoria: 'manutenzione', citta: 'Roma', appartamento: 'Piazza Verdi 3', importo_imponibile: 200, iva_percentuale: 22, importo_iva: 44, importo_totale: 244, data_fattura: '2026-02-04', mese_competenza: '2026-02', data_competenza_inizio: '2026-02-04', data_competenza_fine: '2026-02-04', esportato_profis: true, data_export_profis: '2026-02-05' },
  { id: 'c3', fornitore: 'Impresa Pulizie Splendor', descrizione: 'Pulizie periodiche condominio', categoria: 'pulizie', citta: 'Torino', appartamento: 'Corso Italia 45', importo_imponibile: 150, iva_percentuale: 22, importo_iva: 33, importo_totale: 183, data_fattura: '2026-02-01', mese_competenza: '2026-02', data_competenza_inizio: '2026-02-01', data_competenza_fine: '2026-02-28', esportato_profis: false },
  { id: 'c4', fornitore: 'Condominio Via Napoli', descrizione: 'Spese condominiali 1 trim', categoria: 'affitto_passivo', citta: 'Bologna', appartamento: 'Via Napoli 12', importo_imponibile: 400, iva_percentuale: 0, importo_iva: 0, importo_totale: 400, data_fattura: '2026-01-15', mese_competenza: '2026-01', data_competenza_inizio: '2026-01-01', data_competenza_fine: '2026-03-31', esportato_profis: true, data_export_profis: '2026-01-20' },
  { id: 'c5', fornitore: 'Google Ads', descrizione: 'Campagna pubblicitaria stanze', categoria: 'marketing', citta: 'Milano', importo_imponibile: 300, iva_percentuale: 22, importo_iva: 66, importo_totale: 366, data_fattura: '2026-02-03', mese_competenza: '2026-02', data_competenza_inizio: '2026-02-01', data_competenza_fine: '2026-02-28', esportato_profis: false },
  { id: 'c6', fornitore: 'Commercialista Rossi', descrizione: 'Consulenza fiscale', categoria: 'amministrazione', citta: 'Milano', importo_imponibile: 500, iva_percentuale: 22, importo_iva: 110, importo_totale: 610, data_fattura: '2026-01-30', mese_competenza: '2026-01', data_competenza_inizio: '2026-01-01', data_competenza_fine: '2026-01-31', esportato_profis: true, data_export_profis: '2026-02-01' },
];
