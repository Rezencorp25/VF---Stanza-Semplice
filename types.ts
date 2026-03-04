import React from 'react';

// Define the user roles based on the requirements
export enum UserRole {
  ADMIN = 'ADMIN', // I due soci
  CITY_MANAGER = 'CITY_MANAGER', // 15 profili
  PROPERTY_MANAGER = 'PROPERTY_MANAGER', // Restrizioni
  ADMINISTRATION = 'ADMINISTRATION', // Pagamenti e dipendenti
}

export type ViewState = 
  | 'DASHBOARD'
  | 'OBJECTS_BUILDINGS'
  | 'OBJECTS_APARTMENTS'
  | 'OBJECTS_ROOMS'
  | 'OBJECTS_CONTRACTS'
  | 'PEOPLE_OWNERS'
  | 'PEOPLE_TENANTS'
  | 'CALENDAR'
  | 'MANAGEMENT_RESERVATIONS'
  | 'MANAGEMENT_CLEANING'
  | 'MANAGEMENT_MAINTENANCE'
  | 'MANAGEMENT_ADS'
  | 'MANAGEMENT_DEADLINES'
  | 'BILLING_INVOICES'
  | 'BILLING_PAYMENTS'
  | 'BILLING_COSTS'
  | 'BILLING_CASHFLOW'
  | 'PNL_GENERAL' // Conto Economico
  | 'PNL_MEETINGS'
  | 'PNL_CITIES'
  | 'KPI'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_EMPLOYEES'
  | 'ADMIN_CITIES'
  | 'ADMIN_COMPETENCE_GROUPS'
  | 'ADMIN_CONTEXTS'
  | 'ADMIN_AGENCIES'
  | 'ADMIN_TOOLS'
  | 'ADMIN_PAYROLL';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: ViewState;
  roles: UserRole[]; // Which roles can see this
  subItems?: NavItem[];
  badge?: string; // Add badge property
}

export interface KpiData {
  name: string;
  value: number | string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Property {
  id: string;
  ownerId: string; // Link to Owner
  address: string;
  city: string;
  units: number;
  occupancy: number; // percentage
  status: 'active' | 'maintenance' | 'renovation';
  contractType?: 'student' | 'worker'; // New field for filtering
  image?: string;
  createdAt?: string;
  
  // Dettagli Anagrafica Fabbricato
  neighborhood?: string;
  condoName?: string;
  taxCode?: string; // Codice Fiscale Condominio
  context?: string;
  contextDesc?: string;
  internalNotes?: string;

  // Dettagli Indirizzo
  toponym?: string; // Via, Piazza, Viale
  streetName?: string; // Indirizzo senza toponimo
  municipality?: string; // Comune
  zipCode?: string;
  province?: string;
  country?: string;

  // Amministratore
  noAdmin?: boolean;
  adminName?: string;
  adminPhone?: string;
  adminCell?: string;
  adminTollFree?: string;
  adminEmail?: string;
}

export interface Apartment {
  id: string;
  buildingId: string;
  floor: number;
  unitNumber: string;
  roomsCount: number;
  bathrooms: number;
  status: 'active' | 'maintenance' | 'renovation';
  mq?: number;
  createdAt?: string;
}

export interface Room {
  id: string;
  apartmentId: string;
  buildingId: string; // Denormalized for easier filtering
  name: string;
  type: 'single' | 'double' | 'suite';
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  tenantId?: string; // Link to Tenant
  tenantName?: string; // Display helper
  nextAvailability?: string;
  code?: string;
  city?: string;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  iban: string;
  status: 'active' | 'inactive';
  propertiesCount: number;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string; // Current room
  contractStart: string;
  contractEnd: string;
  status: 'active' | 'pending' | 'past';
  paymentStatus: 'regular' | 'late';
}

export interface Contract {
  id: string;
  apartmentId: string;
  buildingId: string; // Denormalized for easier filtering
  type: string; // e.g., "4+4", "3+2", "Transitorio"
  taxCode: string; // Codice A.E.
  ownerIds: string[]; // List of owner IDs
  startDate: string;
  endDate: string;
  firstExpirationDate: string;
  annualAmount: number;
  status: 'active' | 'expiring' | 'expired' | 'terminated';
}

// --- Planning Module Types ---

export type BookingStatus = 
  | "ricevuta" 
  | "trattativa" 
  | "confermata" 
  | "confermata_fattura_mancante" 
  | "attiva";

export type EventType = 
  | "prenotazione" 
  | "pulizia" 
  | "manutenzione" 
  | "fattura";

// PlanningRoom: Specialized view of a Room for the Planning module
export interface PlanningRoom {
  id: string;
  code: string;  // es. "APT-01/S1"
  apartmentName: string;
  city: string;
  competenceGroupId: string;
}

export interface Guarantor {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  documentType: string;
  documentNumber: string;
}

export interface ContractDetails {
  agencyCode: string;
  registrationNumber: string;
  series: string;
  stipulationDate: Date | null;
  registrationDate: Date | null;
}

export type BillingMode = "mensile" | "bimestrale" | "trimestrale" | "semestrale" | "annuale";

export interface MonthlyPriceRow {
  month: number; // 0-11
  year: number;
  roomPrice: number;
  utilityShare: number;
  clubCost: number;
}

export interface PaymentDeadline {
  id: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
}

export type DocumentType = 
  | "id_inquilino" 
  | "cf_inquilino" 
  | "id_garante" 
  | "garanzia_garante" 
  | "contabile" 
  | "iscrizione_uni" 
  | "contratto_subaffitto" 
  | "privacy" 
  | "regolamento";

export interface DocumentItem {
  id: string;
  type: DocumentType;
  fileName: string | null;
  uploadedAt: Date | null;
}

export interface Booking {
  id: string;
  roomId: string;
  tenantName: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  source: string;  // provenienza contatto
  profession?: 'Studente' | 'Lavoratore' | 'Altro';
  deposit: number;
  notes: string;
  guarantor?: Guarantor;
  contractDetails?: ContractDetails;
  
  // Billing fields
  billingMode?: BillingMode;
  utilityPrice?: number;
  monthlyPrices?: MonthlyPriceRow[];

  // Payment Plan
  paymentPlan?: PaymentDeadline[];

  // Documents
  documents?: DocumentItem[];
  
  // Onboarding / Form fields
  formLink?: string | null;
  isFormCompleted?: boolean;
  isPaymentCompleted?: boolean;
  
  isDeleted: boolean;
}

export interface CalendarEvent {
  id: string;
  roomId: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  label: string;
  bookingId?: string;  // opzionale, solo per type === "prenotazione"
  status?: BookingStatus; // opzionale, per visualizzazione colori
}

export interface CompetenceGroup {
  id: string;
  code: string; // es. "Bologna (BO) 1"
  name: string; // Often same as code or descriptive
  agency: string; // es. "Stanza Semplice SRL"
  cityId: string;
  managerId?: string; // Collaborator ID
  status: 'active' | 'inactive';
  notes?: string;
  description?: string;
  color?: string;
  collaboratorIds: string[];
  objectIds: string[]; // Building IDs usually
  createdAt: string;
  updatedAt: string;
  
  // Legacy support if needed, or just map roomIds to objectIds logic
  roomIds?: string[]; 
}

export interface ContextDescription {
  id: string;
  name: string;
  code: string;
  qualityLevel: number; // 1-4
  color: string;
  description: string;
  internalNotes?: string;
  objectsCount: number;
  updatedAt: string;
}

export interface Agency {
  id: string;
  name: string; // Ragione Sociale
  code: string; // Codice Agenzia
  legalForm: string; // SRL, SPA, etc.
  taxCode: string; // Codice Fiscale
  vatNumber?: string; // Partita IVA
  reaNumber?: string; // Registro Imprese
  shareCapital?: number; // Capitale Sociale
  paidUpCapital?: number; // Capitale Versato
  
  // Sede Legale
  address: string;
  zipCode: string;
  city: string;
  province: string;
  region?: string;
  
  // Contatti
  phone: string;
  email: string;
  pec?: string;
  website?: string;
  
  // Branding
  logoUrl?: string;
  brandColor?: string;
  
  // Stats (denormalized for list view)
  competenceGroupsCount: number;
  collaboratorsCount: number;
  objectsCount: number;
  roomsCount: number;
  
  // Report data
  imagesCount?: number;
  documentsCount?: number;

  // New fields for Filiali CRUD
  managerId?: string; // Responsabile (uid)
  collaboratorIds?: string[]; // Collaboratori: [uid]
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CalendarFilters {
  period: { month: number; year: number };
  eventTypes: EventType[];
  bookingStatusFilter: "active" | "deleted" | "all";
  roomType: "all" | "stanza" | "pertinenza";
  viewMode: "days" | "months" | "years";
  cities: string[];
  competenceGroupIds: string[];
}

// --- Collaborator Types ---

export type CollaboratorRole = 'ADMIN' | 'CITY_MANAGER' | 'OPERATOR' | 'VIEWER';

export interface Collaborator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: CollaboratorRole;
  status: 'active' | 'inactive';
  assignedCities: string[]; // "all" or specific city names
  assignedGroupIds?: string[]; // IDs of assigned competence groups
  branchId?: string; // ID of the assigned branch (filiale)
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  password?: string; // Only for mock/creation purposes
  forcePasswordReset?: boolean;
  mustChangePassword?: boolean;
  passwordTemporanea?: string;
}

export interface ActivityLog {
  id: string;
  collaboratorId: string;
  action: string;
  target: string;
  timestamp: string;
}

// --- City Types ---

export type GeographicArea = 'Nord-ovest' | 'Nord-est' | 'Centro' | 'Sud' | 'Isole';

export interface City {
  id: string;
  code: string; // Sigla (es. BOL)
  name: string;
  province: string; // Sigla (es. BO)
  region: string;
  area: GeographicArea;
  marketValuePerSqm: number;
  publicName: string;
  description?: string;
  status: 'active' | 'inactive';
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  objectsCount: number; // Denormalized or calculated
  availableRoomsCount?: number; // For detail view
  assignedCollaboratorsCount?: number; // For detail view
  createdAt?: string;
}