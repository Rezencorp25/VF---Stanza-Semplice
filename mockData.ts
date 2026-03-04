import { 
  CompetenceGroup, 
  Room, 
  Booking, 
  CalendarEvent, 
  UserRole, 
  Apartment,
  Guarantor,
  ContractDetails,
  PaymentDeadline,
  DocumentItem,
  MonthlyPriceRow,
  DocumentType,
  City,
  Agency,
  Collaborator,
  Property
} from './types';
import { addMonths } from 'date-fns';

// 1. GRUPPI DI COMPETENZA
export const mockCompetenceGroups: CompetenceGroup[] = [
  { 
    id: "g1", 
    name: "Team Milano Centro", 
    code: "MI-CEN", 
    agency: "Stanza Semplice SRL", 
    cityId: "city-3", 
    status: "active", 
    collaboratorIds: [], 
    objectIds: [], 
    createdAt: "2023-01-01", 
    updatedAt: "2023-01-01", 
    roomIds: ["r1", "r2", "r3"] 
  },
  { 
    id: "g2", 
    name: "Team Milano Nord", 
    code: "MI-NOR", 
    agency: "Stanza Semplice SRL", 
    cityId: "city-3", 
    status: "active", 
    collaboratorIds: [], 
    objectIds: [], 
    createdAt: "2023-01-01", 
    updatedAt: "2023-01-01", 
    roomIds: ["r4", "r5"] 
  },
  { 
    id: "g3", 
    name: "Team Roma", 
    code: "RM-ALL", 
    agency: "Stanza Semplice SRL", 
    cityId: "city-4", 
    status: "active", 
    collaboratorIds: [], 
    objectIds: [], 
    createdAt: "2023-01-01", 
    updatedAt: "2023-01-01", 
    roomIds: ["r6", "r7", "r8"] 
  }
];

// Mock Appartamenti necessari per riferimenti
export const mockApartments: Apartment[] = [
  { id: "APT-MI-01", buildingId: "bld-1", floor: 1, unitNumber: "A1", roomsCount: 3, bathrooms: 1, status: "active" },
  { id: "APT-MI-02", buildingId: "bld-1", floor: 2, unitNumber: "A2", roomsCount: 2, bathrooms: 1, status: "active" },
  { id: "APT-RM-01", buildingId: "bld-2", floor: 1, unitNumber: "B1", roomsCount: 3, bathrooms: 2, status: "active" },
];

// 2. STANZE
// Estendiamo il tipo Room per includere i campi richiesti dal prompt per il test, 
// anche se non strettamente nell'interfaccia base Room (verranno usati tramite cast o estensione logica)
export const mockRooms: (Room & { apartmentName: string; city: string; competenceGroupId: string })[] = [
  // APT-MI-01 (Milano) - Team Milano Centro (g1)
  { 
    id: "r1", code: "APT-MI-01/S1", name: "Stanza 1 (Singola)", apartmentId: "APT-MI-01", buildingId: "bld-1", type: "single", price: 600, status: "occupied", 
    apartmentName: "APT-MI-01", city: "Milano", competenceGroupId: "g1" 
  },
  { 
    id: "r2", code: "APT-MI-01/S2", name: "Stanza 2 (Doppia)", apartmentId: "APT-MI-01", buildingId: "bld-1", type: "double", price: 450, status: "occupied", 
    apartmentName: "APT-MI-01", city: "Milano", competenceGroupId: "g1" 
  },
  { 
    id: "r3", code: "APT-MI-01/S3", name: "Stanza 3 (Singola)", apartmentId: "APT-MI-01", buildingId: "bld-1", type: "single", price: 580, status: "occupied", 
    apartmentName: "APT-MI-01", city: "Milano", competenceGroupId: "g1" 
  },
  
  // APT-MI-02 (Milano) - Team Milano Nord (g2)
  { 
    id: "r4", code: "APT-MI-02/S1", name: "Stanza 1 (Singola)", apartmentId: "APT-MI-02", buildingId: "bld-1", type: "single", price: 550, status: "occupied", 
    apartmentName: "APT-MI-02", city: "Milano", competenceGroupId: "g2" 
  },
  { 
    id: "r5", code: "APT-MI-02/S2", name: "Stanza 2 (Suite)", apartmentId: "APT-MI-02", buildingId: "bld-1", type: "suite", price: 750, status: "occupied", 
    apartmentName: "APT-MI-02", city: "Milano", competenceGroupId: "g2" 
  },

  // APT-RM-01 (Roma) - Team Roma (g3)
  { 
    id: "r6", code: "APT-RM-01/S1", name: "Stanza 1 (Singola)", apartmentId: "APT-RM-01", buildingId: "bld-2", type: "single", price: 500, status: "occupied", 
    apartmentName: "APT-RM-01", city: "Roma", competenceGroupId: "g3" 
  },
  { 
    id: "r7", code: "APT-RM-01/S2", name: "Stanza 2 (Singola)", apartmentId: "APT-RM-01", buildingId: "bld-2", type: "single", price: 500, status: "occupied", 
    apartmentName: "APT-RM-01", city: "Roma", competenceGroupId: "g3" 
  },
  { 
    id: "r8", code: "APT-RM-01/S3", name: "Stanza 3 (Doppia)", apartmentId: "APT-RM-01", buildingId: "bld-2", type: "double", price: 400, status: "occupied", 
    apartmentName: "APT-RM-01", city: "Roma", competenceGroupId: "g3" 
  }
];

// 3. PRENOTAZIONI
export const mockBookings: Booking[] = [
  // r1: Ricevuta
  {
    id: "b1", roomId: "r1", tenantName: "Marco Bianchi", status: "ricevuta", source: "Idealista", deposit: 1500, notes: "", isDeleted: false,
    checkIn: new Date(2026, 1, 1), checkOut: new Date(2026, 6, 31) // 1 feb - 31 lug 2026
  },
  // r2: Trattativa
  {
    id: "b2", roomId: "r2", tenantName: "Sofia Russo", status: "trattativa", source: "HousingAnywhere", deposit: 1200, notes: "", isDeleted: false,
    checkIn: new Date(2026, 2, 15), checkOut: new Date(2026, 8, 14) // 15 mar - 14 set 2026
  },
  // r3: Confermata
  {
    id: "b3", roomId: "r3", tenantName: "Luca Ferrari", status: "confermata", source: "Diretto", deposit: 1800, notes: "", isDeleted: false,
    checkIn: new Date(2026, 0, 1), checkOut: new Date(2026, 5, 30) // 1 gen - 30 giu 2026
  },
  // r4: Confermata Fattura Mancante
  {
    id: "b4", roomId: "r4", tenantName: "Anna Conti", status: "confermata_fattura_mancante", source: "Immobiliare.it", deposit: 900, notes: "", isDeleted: false,
    checkIn: new Date(2026, 3, 1), checkOut: new Date(2026, 11, 31) // 1 apr - 31 dic 2026
  },
  // r5: Attiva (Booking Complessa - Dettaglio sotto)
  {
    id: "b5", roomId: "r5", tenantName: "Paolo Marino", status: "attiva", source: "Spotahome", deposit: 2000, notes: "", isDeleted: false,
    checkIn: new Date(2025, 10, 1), checkOut: new Date(2026, 9, 31) // 1 nov 2025 - 31 ott 2026
  },
  // r6: Eliminata (ma con status attiva nel record storico)
  {
    id: "b6", roomId: "r6", tenantName: "Elena Greco", status: "attiva", source: "Idealista", deposit: 1000, notes: "Cancellata per mancato pagamento", isDeleted: true,
    checkIn: new Date(2026, 0, 1), checkOut: new Date(2026, 1, 28) // 1 gen - 28 feb 2026
  },
  // r7: Attiva
  {
    id: "b7", roomId: "r7", tenantName: "Giuseppe Verdi", status: "attiva", source: "Diretto", deposit: 1000, notes: "", isDeleted: false,
    checkIn: new Date(2026, 0, 15), checkOut: new Date(2026, 6, 15)
  },
  // r8: Attiva
  {
    id: "b8", roomId: "r8", tenantName: "Maria Rossi", status: "attiva", source: "Facebook", deposit: 1000, notes: "", isDeleted: false,
    checkIn: new Date(2026, 2, 1), checkOut: new Date(2026, 8, 30)
  }
];

// 5. DATI DETTAGLIO PRENOTAZIONE (b5 - Paolo Marino)
const monthlyPricesB5: MonthlyPriceRow[] = Array.from({ length: 12 }, (_, i) => {
  const date = addMonths(new Date(2025, 10, 1), i);
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
    roomPrice: 650,
    utilityShare: 80,
    clubCost: 20
  };
});

const paymentPlanB5: PaymentDeadline[] = Array.from({ length: 12 }, (_, i) => {
  const date = addMonths(new Date(2025, 10, 1), i);
  return {
    id: `pp-${i}`,
    dueDate: date,
    amount: 750, // 650 + 80 + 20
    isPaid: i < 4 // Prime 4 pagate (Nov, Dic, Gen, Feb)
  };
});

const documentsB5: DocumentItem[] = [
  { id: "d1", type: "id_inquilino", fileName: "carta_identita_paolo.pdf", uploadedAt: new Date(2025, 9, 25) },
  { id: "d2", type: "cf_inquilino", fileName: "cf_paolo.pdf", uploadedAt: new Date(2025, 9, 25) },
  { id: "d3", type: "contratto_subaffitto", fileName: "contratto_firmato.pdf", uploadedAt: new Date(2025, 10, 1) },
  { id: "d4", type: "privacy", fileName: "privacy_signed.pdf", uploadedAt: new Date(2025, 10, 1) },
  // Placeholder per gli altri
  { id: "d5", type: "id_garante", fileName: null, uploadedAt: null },
  { id: "d6", type: "garanzia_garante", fileName: null, uploadedAt: null },
  { id: "d7", type: "contabile", fileName: null, uploadedAt: null },
  { id: "d8", type: "iscrizione_uni", fileName: null, uploadedAt: null },
  { id: "d9", type: "regolamento", fileName: null, uploadedAt: null },
];

export const mockBookingDetail: Booking = {
  ...mockBookings.find(b => b.id === "b5")!,
  guarantor: {
    firstName: "Giorgio",
    lastName: "Marino",
    fiscalCode: "MRNGDR70A01F205X",
    phone: "+39 333 9988776",
    email: "giorgio.marino@email.com",
    address: "Via Torquato Tasso 5",
    city: "Milano",
    documentType: "Carta d'Identità",
    documentNumber: "AX4521897"
  },
  contractDetails: {
    agencyCode: "123456789",
    registrationNumber: "2025/001",
    series: "1T",
    stipulationDate: new Date(2025, 10, 1),
    registrationDate: new Date(2025, 10, 15)
  },
  monthlyPrices: monthlyPricesB5,
  paymentPlan: paymentPlanB5,
  documents: documentsB5,
  formLink: "https://form.stanzasemplice.it/compilazione/b5",
  isFormCompleted: true,
  isPaymentCompleted: false
};

// 4. EVENTI CALENDARIO
export const mockCalendarEvents: CalendarEvent[] = [
  // Generati dalle prenotazioni
  ...mockBookings.map(b => ({
    id: b.id,
    roomId: b.roomId,
    type: "prenotazione" as const,
    startDate: b.checkIn,
    endDate: b.checkOut,
    label: b.tenantName,
    status: b.status,
    bookingId: b.id
  })),
  // Eventi Extra
  { id: "ev-cl1", roomId: "r1", type: "pulizia", startDate: new Date(2026, 1, 10), endDate: new Date(2026, 1, 10), label: "Pulizia Cambio" },
  { id: "ev-cl2", roomId: "r4", type: "pulizia", startDate: new Date(2026, 1, 20), endDate: new Date(2026, 1, 20), label: "Pulizia Periodica" },
  { id: "ev-mn1", roomId: "r3", type: "manutenzione", startDate: new Date(2026, 1, 15), endDate: new Date(2026, 1, 17), label: "Riparazione Bagno" }, // 3 giorni
  { id: "ev-inv1", roomId: "r5", type: "fattura", startDate: new Date(2026, 1, 28), endDate: new Date(2026, 1, 28), label: "Emissione Fattura" }
];

// 6. DATI UTENTE MOCK
export const mockAdmin = { id: "u1", name: "Admin Test", role: UserRole.ADMIN };
export const mockCityManager = { id: "u2", name: "Mario Rossi", role: UserRole.CITY_MANAGER };
export const mockOperator = { id: "u3", name: "Giulia Bianchi", role: UserRole.ADMINISTRATION };

// 7. CITIES MOCK
export const mockCities: City[] = [
  {
    id: "city-1",
    code: "MI",
    name: "Milano",
    province: "MI",
    region: "Lombardia",
    area: "Nord-ovest",
    marketValuePerSqm: 5000,
    publicName: "Milano",
    status: "active",
    objectsCount: 15,
    availableRoomsCount: 5,
    assignedCollaboratorsCount: 3,
    createdAt: "2023-01-01"
  },
  {
    id: "city-2",
    code: "RM",
    name: "Roma",
    province: "RM",
    region: "Lazio",
    area: "Centro",
    marketValuePerSqm: 4000,
    publicName: "Roma",
    status: "active",
    objectsCount: 10,
    availableRoomsCount: 2,
    assignedCollaboratorsCount: 2,
    createdAt: "2023-01-01"
  },
  {
    id: "city-3",
    code: "BO",
    name: "Bologna",
    province: "BO",
    region: "Emilia-Romagna",
    area: "Nord-est",
    marketValuePerSqm: 3500,
    publicName: "Bologna",
    status: "active",
    objectsCount: 8,
    availableRoomsCount: 1,
    assignedCollaboratorsCount: 1,
    createdAt: "2023-01-01"
  }
];

// 8. AGENCIES MOCK
export const mockAgencies: Agency[] = [
  {
    id: "ag-1",
    name: "Stanza Semplice SRL",
    code: "SS-HQ",
    legalForm: "SRL",
    taxCode: "12345678901",
    address: "Via Roma 1",
    zipCode: "20100",
    city: "Milano",
    province: "MI",
    phone: "+39 02 1234567",
    email: "info@stanzasemplice.it",
    competenceGroupsCount: 3,
    collaboratorsCount: 5,
    objectsCount: 20,
    roomsCount: 60,
    status: "active",
    createdAt: "2023-01-01"
  }
];

// 9. COLLABORATORS MOCK
export const mockCollaborators: Collaborator[] = [
  {
    id: "col-1",
    firstName: "Mario",
    lastName: "Rossi",
    email: "mario.rossi@example.com",
    phone: "+39 333 1234567",
    role: "CITY_MANAGER",
    status: "active",
    assignedCities: ["Milano"],
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    id: "col-2",
    firstName: "Luigi",
    lastName: "Verdi",
    email: "luigi.verdi@example.com",
    phone: "+39 333 7654321",
    role: "OPERATOR",
    status: "active",
    assignedCities: ["Roma"],
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  }
];

// 10. PROPERTIES MOCK
export const mockProperties: Property[] = [
  {
    id: "prop-1",
    ownerId: "own-1",
    address: "Via Dante 10",
    city: "Milano",
    units: 3,
    occupancy: 100,
    status: "active",
    contractType: "student",
    createdAt: "2023-01-01"
  },
  {
    id: "prop-2",
    ownerId: "own-2",
    address: "Via Garibaldi 20",
    city: "Roma",
    units: 2,
    occupancy: 50,
    status: "active",
    contractType: "worker",
    createdAt: "2023-01-01"
  }
];
