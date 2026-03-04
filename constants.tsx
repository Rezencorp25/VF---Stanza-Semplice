import React from 'react';
import { UserRole, NavItem, ViewState, Property, Apartment, Room, Owner, Tenant, Contract, Collaborator, City, CompetenceGroup, ContextDescription, Agency } from './types';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CalendarDays, 
  Wrench, 
  ReceiptEuro, 
  BarChart3, 
  PieChart, 
  Briefcase,
  Home,
  BedDouble,
  FileText,
  UserCheck,
  CalendarCheck,
  SprayCan,
  Megaphone,
  AlarmClock,
  Banknote,
  Wallet,
  ShieldCheck,
  Map,
  Network,
  BookOpen,
  Landmark,
  MapPin
} from 'lucide-react';

export const APP_NAME = "StanzaSemplice Manager";

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    view: 'DASHBOARD',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER, UserRole.ADMINISTRATION]
  },
  {
    id: 'admin',
    label: 'Admin Tools',
    icon: <ShieldCheck size={20} />,
    view: 'ADMIN_DASHBOARD',
    roles: [UserRole.ADMIN],
    subItems: [
      { id: 'collaborators', label: 'Collaboratori', icon: <Users size={16}/>, view: 'ADMIN_EMPLOYEES', roles: [UserRole.ADMIN] },
      { id: 'cities', label: 'Città', icon: <Map size={16}/>, view: 'ADMIN_CITIES', roles: [UserRole.ADMIN] },
      { id: 'competence_groups', label: 'Gruppi Comp.', icon: <Network size={16}/>, view: 'ADMIN_COMPETENCE_GROUPS', roles: [UserRole.ADMIN] },
      { id: 'contexts', label: 'Contesti', icon: <BookOpen size={16}/>, view: 'ADMIN_CONTEXTS', roles: [UserRole.ADMIN] },
      { id: 'agencies', label: 'Filiali', icon: <Landmark size={16}/>, view: 'ADMIN_AGENCIES', roles: [UserRole.ADMIN] },
      { id: 'tools', label: 'Strumenti', icon: <Wrench size={16}/>, view: 'ADMIN_TOOLS', roles: [UserRole.ADMIN] },
    ]
  },
  {
    id: 'objects',
    label: 'Oggetti',
    icon: <Building2 size={20} />,
    view: 'OBJECTS_BUILDINGS',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER],
    subItems: [
      { id: 'buildings', label: 'Fabbricati', icon: <Home size={16}/>, view: 'OBJECTS_BUILDINGS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'apartments', label: 'Appartamenti', icon: <Building2 size={16}/>, view: 'OBJECTS_APARTMENTS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'rooms', label: 'Stanze', icon: <BedDouble size={16}/>, view: 'OBJECTS_ROOMS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'contracts', label: 'Contratti', icon: <FileText size={16}/>, view: 'OBJECTS_CONTRACTS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] }, // Prop manager might be restricted on contracts
    ]
  },
  {
    id: 'people',
    label: 'Persone',
    icon: <Users size={20} />,
    view: 'PEOPLE_OWNERS',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER],
    subItems: [
      { id: 'owners', label: 'Proprietari', icon: <UserCheck size={16}/>, view: 'PEOPLE_OWNERS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] },
      { id: 'tenants', label: 'Inquilini', icon: <Users size={16}/>, view: 'PEOPLE_TENANTS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
    ]
  },
  {
    id: 'calendar',
    label: 'Calendario',
    icon: <CalendarDays size={20} />,
    view: 'CALENDAR',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER],
  },
  {
    id: 'management',
    label: 'Gestione',
    icon: <Wrench size={20} />,
    view: 'MANAGEMENT_RESERVATIONS',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER],
    subItems: [
      { id: 'reservations', label: 'Prenotazioni', icon: <CalendarCheck size={16}/>, view: 'MANAGEMENT_RESERVATIONS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'cleaning', label: 'Pulizie', icon: <SprayCan size={16}/>, view: 'MANAGEMENT_CLEANING', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'maintenance', label: 'Manutenzioni', icon: <Wrench size={16}/>, view: 'MANAGEMENT_MAINTENANCE', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.PROPERTY_MANAGER] },
      { id: 'ads', label: 'Pubblicità', icon: <Megaphone size={16}/>, view: 'MANAGEMENT_ADS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] },
      { id: 'deadlines', label: 'Scadenziario', icon: <AlarmClock size={16}/>, view: 'MANAGEMENT_DEADLINES', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] },
    ]
  },
  {
    id: 'billing',
    label: 'Fatturazione',
    icon: <ReceiptEuro size={20} />,
    view: 'BILLING_INVOICES',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.ADMINISTRATION],
    subItems: [
      { id: 'invoices', label: 'Fatture', icon: <FileText size={16}/>, view: 'BILLING_INVOICES', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.ADMINISTRATION] },
      { id: 'received', label: 'Pagamenti Ric.', icon: <Banknote size={16}/>, view: 'BILLING_PAYMENTS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.ADMINISTRATION] },
      { id: 'costs', label: 'Costi', icon: <Wallet size={16}/>, view: 'BILLING_COSTS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.ADMINISTRATION] },
      { id: 'cashflow', label: 'Cashflow Inq.', icon: <BarChart3 size={16}/>, view: 'BILLING_CASHFLOW', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER, UserRole.ADMINISTRATION] },
    ]
  },
  {
    id: 'pnl',
    label: 'Conto Economico',
    icon: <PieChart size={20} />,
    view: 'PNL_GENERAL',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER],
    subItems: [
      { id: 'pnl_gen', label: 'Generale', icon: <PieChart size={16}/>, view: 'PNL_GENERAL', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] },
      { id: 'pnl_cities', label: 'Per Città', icon: <MapPin size={16}/>, view: 'PNL_CITIES', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER], badge: 'Nuovo' },
      { id: 'pnl_meet', label: 'Riunioni', icon: <Users size={16}/>, view: 'PNL_MEETINGS', roles: [UserRole.ADMIN, UserRole.CITY_MANAGER] },
    ]
  },
  {
    id: 'kpi',
    label: 'KPI',
    icon: <BarChart3 size={20} />,
    view: 'KPI',
    roles: [UserRole.ADMIN, UserRole.CITY_MANAGER],
  },
  {
    id: 'amministrazione',
    label: 'Amministrazione',
    icon: <Briefcase size={20} />,
    view: 'ADMIN_PAYROLL',
    roles: [UserRole.ADMIN, UserRole.ADMINISTRATION],
    subItems: [
      { id: 'payroll', label: 'Paghe/Fatture', icon: <ReceiptEuro size={16}/>, view: 'ADMIN_PAYROLL', roles: [UserRole.ADMIN, UserRole.ADMINISTRATION] },
    ]
  }
];

export const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario.rossi@stanzasemplice.com',
    phone: '+39 333 1234567',
    role: 'ADMIN',
    status: 'active',
    assignedCities: ['all'],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z',
    lastLogin: '2023-10-25T09:15:00Z',
    notes: 'Fondatore e Amministratore Delegato'
  },
  {
    id: 'col-2',
    firstName: 'Luigi',
    lastName: 'Verdi',
    email: 'luigi.verdi@stanzasemplice.com',
    phone: '+39 333 9876543',
    role: 'CITY_MANAGER',
    status: 'active',
    assignedCities: ['Milano', 'Torino'],
    branchId: 'Milano Centrale',
    createdAt: '2023-02-10T11:20:00Z',
    updatedAt: '2023-08-05T16:45:00Z',
    lastLogin: '2023-10-24T18:00:00Z',
    notes: 'Responsabile area Nord-Ovest'
  },
  {
    id: 'col-3',
    firstName: 'Anna',
    lastName: 'Bianchi',
    email: 'anna.bianchi@stanzasemplice.com',
    phone: '+39 333 5556667',
    role: 'OPERATOR',
    status: 'active',
    assignedCities: ['Roma'],
    branchId: 'Roma Termini',
    createdAt: '2023-03-05T09:00:00Z',
    updatedAt: '2023-09-12T10:15:00Z',
    lastLogin: '2023-10-25T08:30:00Z',
    notes: 'Addetta alle visite e check-in'
  },
  {
    id: 'col-4',
    firstName: 'Giulia',
    lastName: 'Neri',
    email: 'giulia.neri@stanzasemplice.com',
    phone: '+39 333 1112223',
    role: 'VIEWER',
    status: 'inactive',
    assignedCities: ['Bologna'],
    createdAt: '2023-04-20T14:00:00Z',
    updatedAt: '2023-10-01T09:00:00Z',
    lastLogin: '2023-09-30T17:00:00Z',
    notes: 'Consulente esterno - Accesso temporaneo scaduto'
  },
  {
    id: 'col-5',
    firstName: 'Paolo',
    lastName: 'Gialli',
    email: 'paolo.gialli@stanzasemplice.com',
    phone: '+39 333 4445556',
    role: 'CITY_MANAGER',
    status: 'active',
    assignedCities: ['Bologna', 'Firenze'],
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    lastLogin: '2023-10-23T11:45:00Z'
  },
  {
    id: 'col-6',
    firstName: 'Nuovo',
    lastName: 'Utente',
    email: 'nuovo.utente@stanzasemplice.com',
    phone: '+39 333 0000000',
    role: 'CITY_MANAGER',
    status: 'active',
    assignedCities: ['Bologna'],
    assignedGroupIds: ['cg-4'],
    branchId: 'ag-3',
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
    mustChangePassword: true,
    passwordTemporanea: 'TempPass123!'
  }
];

export const MOCK_CITIES: City[] = [
  {
    id: 'city-1',
    code: 'BOL',
    name: 'Bologna',
    province: 'BO',
    region: 'Emilia-Romagna',
    area: 'Nord-est',
    marketValuePerSqm: 3200,
    publicName: 'Bologna',
    status: 'active',
    objectsCount: 45,
    availableRoomsCount: 12,
    assignedCollaboratorsCount: 5,
    description: 'Città universitaria per eccellenza, ricca di storia e cultura.',
    coordinates: { lat: 44.4949, lng: 11.3426 },
    imageUrl: 'https://picsum.photos/seed/bologna/800/600'
  },
  {
    id: 'city-2',
    code: 'MOD',
    name: 'Modena',
    province: 'MO',
    region: 'Emilia-Romagna',
    area: 'Nord-est',
    marketValuePerSqm: 2400,
    publicName: 'Modena',
    status: 'active',
    objectsCount: 22,
    availableRoomsCount: 5,
    assignedCollaboratorsCount: 2,
    description: 'Terra dei motori e del buon cibo.',
    coordinates: { lat: 44.6471, lng: 10.9252 },
    imageUrl: 'https://picsum.photos/seed/modena/800/600'
  },
  {
    id: 'city-3',
    code: 'MLN',
    name: 'Milano',
    province: 'MI',
    region: 'Lombardia',
    area: 'Nord-ovest',
    marketValuePerSqm: 5200,
    publicName: 'Milano',
    status: 'active',
    objectsCount: 120,
    availableRoomsCount: 35,
    assignedCollaboratorsCount: 15,
    description: 'Capitale della moda e del design.',
    coordinates: { lat: 45.4642, lng: 9.1900 },
    imageUrl: 'https://picsum.photos/seed/milano/800/600'
  },
  {
    id: 'city-4',
    code: 'BSC',
    name: 'Brescia',
    province: 'BS',
    region: 'Lombardia',
    area: 'Nord-ovest',
    marketValuePerSqm: 1900,
    publicName: 'Brescia',
    status: 'active',
    objectsCount: 18,
    availableRoomsCount: 3,
    assignedCollaboratorsCount: 2,
    description: 'La Leonessa d\'Italia.',
    coordinates: { lat: 45.5416, lng: 10.2118 },
    imageUrl: 'https://picsum.photos/seed/brescia/800/600'
  },
  {
    id: 'city-5',
    code: 'VRN',
    name: 'Verona',
    province: 'VR',
    region: 'Veneto',
    area: 'Nord-est',
    marketValuePerSqm: 2800,
    publicName: 'Verona',
    status: 'active',
    objectsCount: 30,
    availableRoomsCount: 8,
    assignedCollaboratorsCount: 4,
    description: 'La città dell\'amore e dell\'Arena.',
    coordinates: { lat: 45.4384, lng: 10.9916 },
    imageUrl: 'https://picsum.photos/seed/verona/800/600'
  },
  {
    id: 'city-6',
    code: 'TRN',
    name: 'Trento',
    province: 'TN',
    region: 'Trentino-Alto Adige',
    area: 'Nord-est',
    marketValuePerSqm: 3500,
    publicName: 'Trento',
    status: 'inactive',
    objectsCount: 0,
    availableRoomsCount: 0,
    assignedCollaboratorsCount: 0,
    description: 'Nel cuore delle Alpi.',
    coordinates: { lat: 46.0748, lng: 11.1217 },
    imageUrl: 'https://picsum.photos/seed/trento/800/600'
  },
  {
    id: 'city-7',
    code: 'RGE',
    name: 'Reggio Emilia',
    province: 'RE',
    region: 'Emilia-Romagna',
    area: 'Nord-est',
    marketValuePerSqm: 1800,
    publicName: 'Reggio Emilia',
    status: 'active',
    objectsCount: 15,
    availableRoomsCount: 4,
    assignedCollaboratorsCount: 2,
    description: 'Città del Tricolore.',
    coordinates: { lat: 44.6990, lng: 10.6300 },
    imageUrl: 'https://picsum.photos/seed/reggio/800/600'
  }
];

export const MOCK_COMPETENCE_GROUPS: CompetenceGroup[] = [
  // Bologna (BO) 1-6
  { id: 'cg-1', code: 'Bologna (BO) 1', name: 'Bologna Centro', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'active', collaboratorIds: ['col-4'], objectIds: ['1', '2'], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-2', code: 'Bologna (BO) 2', name: 'Bologna Università', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: ['3'], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-3', code: 'Bologna (BO) 3', name: 'Bologna Fiera', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-4', code: 'Bologna (BO) 4', name: 'Bologna Stazione', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-5', code: 'Bologna (BO) 5', name: 'Bologna Ospedale', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-6', code: 'Bologna (BO) 6', name: 'Bologna Periferia', agency: 'Stanza Semplice SRL', cityId: 'city-1', managerId: 'col-5', status: 'inactive', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Modena (MO) 1-4
  { id: 'cg-7', code: 'Modena (MO) 1', name: 'Modena Centro', agency: 'Stanza Semplice SRL', cityId: 'city-2', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-8', code: 'Modena (MO) 2', name: 'Modena Nord', agency: 'Stanza Semplice SRL', cityId: 'city-2', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-9', code: 'Modena (MO) 3', name: 'Modena Sud', agency: 'Stanza Semplice SRL', cityId: 'city-2', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-10', code: 'Modena (MO) 4', name: 'Modena Est', agency: 'Stanza Semplice SRL', cityId: 'city-2', managerId: 'col-5', status: 'inactive', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Milano (MI) 1 (Stanza Semplice) & 2 (Dueda Rooms)
  { id: 'cg-11', code: 'Milano (MI) 1', name: 'Milano Centrale', agency: 'Stanza Semplice SRL', cityId: 'city-3', managerId: 'col-2', status: 'active', collaboratorIds: ['col-2'], objectIds: ['4', '5'], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-12', code: 'Milano (MI) 2', name: 'Milano Dueda', agency: 'Dueda Rooms SRL', cityId: 'city-3', managerId: 'col-2', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Verona (VR) 1
  { id: 'cg-13', code: 'Verona (VR) 1', name: 'Verona Centro', agency: 'Stanza Semplice SRL', cityId: 'city-5', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Brescia (BS) 1-2
  { id: 'cg-14', code: 'Brescia (BS) 1', name: 'Brescia Centro', agency: 'Stanza Semplice SRL', cityId: 'city-4', managerId: 'col-2', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 'cg-15', code: 'Brescia (BS) 2', name: 'Brescia Nord', agency: 'Stanza Semplice SRL', cityId: 'city-4', managerId: 'col-2', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Trento (TN) 1
  { id: 'cg-16', code: 'Trento (TN) 1', name: 'Trento Centro', agency: 'Stanza Semplice SRL', cityId: 'city-6', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

  // Reggio Emilia (RE) 1
  { id: 'cg-17', code: 'Reggio Emilia (RE) 1', name: 'Reggio Centro', agency: 'Stanza Semplice SRL', cityId: 'city-7', managerId: 'col-5', status: 'active', collaboratorIds: [], objectIds: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
];

export const MOCK_CONTEXT_DESCRIPTIONS: ContextDescription[] = [
  {
    id: 'ctx-1',
    name: 'Alto - Lussuoso/Signorile',
    code: 'alto-lussuoso',
    qualityLevel: 4,
    color: '#F59E0B', // Amber/Gold
    description: 'Quartiere esclusivo e prestigioso, caratterizzato da edifici storici o di recente costruzione con finiture di lusso. Zona molto sicura, ben servita e frequentata da un target alto-spendete. Ideale per chi cerca il massimo comfort e rappresentanza.',
    internalNotes: 'Utilizzare solo per immobili in centro storico ZTL o zone residenziali di pregio (es. Colli a Bologna, Brera a Milano).',
    objectsCount: 15,
    updatedAt: '2023-10-15T10:00:00Z'
  },
  {
    id: 'ctx-2',
    name: 'Medio - Borghese',
    code: 'medio-borghese',
    qualityLevel: 3,
    color: '#3B82F6', // Blue
    description: 'Zona residenziale tranquilla e ben abitata, con ottimi servizi e collegamenti. Edifici curati, presenza di parchi e negozi di vicinato. Contesto ideale per studenti e giovani lavoratori che cercano qualità della vita e sicurezza.',
    internalNotes: 'Standard per la maggior parte degli appartamenti StanzaSemplice. Zone semicentrali o residenziali consolidate.',
    objectsCount: 85,
    updatedAt: '2023-09-20T14:30:00Z'
  },
  {
    id: 'ctx-3',
    name: 'Normale - Residenziale classico',
    code: 'normale-residenziale',
    qualityLevel: 2,
    color: '#10B981', // Emerald/Green
    description: 'Quartiere popolare ma dignitoso, ben collegato con i mezzi pubblici. Zona vivace e multiculturale, con alta densità di servizi essenziali e supermercati. Ottimo rapporto qualità/prezzo.',
    internalNotes: 'Zone periferiche ma non degradate. Attenzione alla vicinanza con stazioni o zone industriali.',
    objectsCount: 42,
    updatedAt: '2023-08-05T09:15:00Z'
  },
  {
    id: 'ctx-4',
    name: 'Popolare - Basso',
    code: 'popolare-basso',
    qualityLevel: 1,
    color: '#F97316', // Orange
    description: 'Zona periferica o di recente riqualificazione. Prezzi molto competitivi. Collegamenti presenti ma meno frequenti nelle ore notturne. Adatto a chi cerca la massima convenienza economica.',
    internalNotes: 'Da valutare attentamente. Evitare zone con problemi di sicurezza noti. Usare solo se il prezzo è davvero aggressivo.',
    objectsCount: 8,
    updatedAt: '2023-07-10T11:00:00Z'
  }
];

export const MOCK_AGENCIES: Agency[] = [
  {
    id: 'ag-1',
    name: 'Stanza Semplice SRL',
    code: 'STANZASEMPLICE',
    legalForm: 'SRL',
    taxCode: '04549860239',
    vatNumber: '04549860239',
    reaNumber: 'VR-429714',
    shareCapital: 10000,
    paidUpCapital: 10000,
    address: 'Via dei Mutilati 3',
    zipCode: '37122',
    city: 'Verona',
    province: 'VR',
    region: 'Veneto',
    phone: '3792407216',
    email: 'amministrazione@stanzasemplice.com',
    website: 'https://www.stanzasemplice.com',
    brandColor: '#F97316', // Orange
    competenceGroupsCount: 16,
    collaboratorsCount: 25,
    objectsCount: 180,
    roomsCount: 650,
    imagesCount: 2450,
    documentsCount: 850,
    status: 'active',
    managerId: 'col-1',
    collaboratorIds: ['col-2', 'col-3'],
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'ag-2',
    name: 'Dueda Rooms SRL',
    code: 'MILANO FILIALE 1',
    legalForm: 'SRL',
    taxCode: '10427410963',
    vatNumber: '10427410963',
    reaNumber: 'MB-2531146',
    shareCapital: 10000,
    paidUpCapital: 2500,
    address: 'Via Roma 15',
    zipCode: '20877',
    city: 'Roncello',
    province: 'MB',
    region: 'Lombardia',
    phone: '3934217504',
    email: 'milano1@stanzasemplice.com',
    website: 'https://www.stanzasemplice.com',
    brandColor: '#3B82F6', // Blue
    competenceGroupsCount: 1,
    collaboratorsCount: 4,
    objectsCount: 25,
    roomsCount: 85,
    imagesCount: 320,
    documentsCount: 120,
    status: 'active',
    managerId: 'col-2',
    collaboratorIds: ['col-4'],
    createdAt: '2023-02-01T00:00:00Z'
  }
];

export const MOCK_KPI_DATA = [
  { name: 'Occupancy Rate', value: '94%', change: '+2.4%', trend: 'up' },
  { name: 'Revenue (YTD)', value: '€1.2M', change: '+12%', trend: 'up' },
  { name: 'Open Maintenance', value: '14', change: '-3', trend: 'down' }, // down is good for maintenance
  { name: 'Active Tenants', value: '842', change: '+15', trend: 'up' },
];

export const MOCK_OWNERS: Owner[] = [
  { id: 'own-1', firstName: 'Giuseppe', lastName: 'Verdi', email: 'g.verdi@email.com', phone: '+39 333 1234567', iban: 'IT99C1234567890123456789012', status: 'active', propertiesCount: 2 },
  { id: 'own-2', firstName: 'Antonio', lastName: 'Bianchi', email: 'a.bianchi@email.com', phone: '+39 333 9876543', iban: 'IT88D1234567890123456789012', status: 'active', propertiesCount: 1 },
  { id: 'own-3', firstName: 'Maria', lastName: 'Rossi', email: 'm.rossi@email.com', phone: '+39 333 5556667', iban: 'IT77E1234567890123456789012', status: 'active', propertiesCount: 1 },
];

export const MOCK_PROPERTIES: Property[] = [
  { 
    id: '1', 
    ownerId: 'own-1', 
    address: 'Via Roma 10', 
    city: 'Milano', 
    units: 3, 
    occupancy: 100, 
    status: 'active', 
    contractType: 'student',
    
    // Details
    toponym: 'Via',
    streetName: 'Roma 10',
    neighborhood: 'Centro',
    condoName: 'Condominio Roma',
    taxCode: '80012345678',
    context: 'residenziale',
    contextDesc: 'Zona residenziale tranquilla ben collegata.',
    internalNotes: 'Portone sempre aperto fino alle 18:00.',
    municipality: 'Milano',
    zipCode: '20121',
    province: 'MI',
    country: 'Italia',
    
    // Admin
    noAdmin: false,
    adminName: 'Studio Gestione Immobili',
    adminPhone: '0212345678',
    adminCell: '3339876543',
    adminEmail: 'amministrazione@studiogi.it'
  },
  { 
    id: '2', 
    ownerId: 'own-1', 
    address: 'Corso Italia 45', 
    city: 'Torino', 
    units: 2, 
    occupancy: 85, 
    status: 'active', 
    contractType: 'worker',
    
    // Details
    toponym: 'Corso',
    streetName: 'Italia 45',
    neighborhood: 'Crocetta',
    condoName: 'Palazzo Reale',
    taxCode: '90087654321',
    context: 'centro',
    contextDesc: 'Zona di pregio, stabile d\'epoca.',
    municipality: 'Torino',
    zipCode: '10121',
    province: 'TO',
    
    // Admin
    noAdmin: true
  },
  { 
    id: '3', 
    ownerId: 'own-2', 
    address: 'Via Napoli 12', 
    city: 'Bologna', 
    units: 1, 
    occupancy: 100, 
    status: 'renovation', 
    contractType: 'student',
    
    toponym: 'Via',
    streetName: 'Napoli 12',
    municipality: 'Bologna',
    zipCode: '40100',
    province: 'BO'
  },
  { 
    id: '4', 
    ownerId: 'own-3', 
    address: 'Piazza Verdi 3', 
    city: 'Roma', 
    units: 2, 
    occupancy: 90, 
    status: 'active', 
    contractType: 'student',
    
    toponym: 'Piazza',
    streetName: 'Verdi 3',
    municipality: 'Roma',
    zipCode: '00198',
    province: 'RM'
  },
  { 
    id: '5', 
    ownerId: 'own-2', 
    address: 'Viale Kennedy 88', 
    city: 'Milano', 
    units: 4, 
    occupancy: 75, 
    status: 'maintenance', 
    contractType: 'worker',
    
    toponym: 'Viale',
    streetName: 'Kennedy 88',
    municipality: 'Milano',
    zipCode: '20100',
    province: 'MI'
  },
];

export const MOCK_APARTMENTS: Apartment[] = [
  // Via Roma 10 (id: 1)
  { id: '101', buildingId: '1', unitNumber: '1', floor: 1, roomsCount: 4, bathrooms: 2, status: 'active', mq: 95 },
  { id: '102', buildingId: '1', unitNumber: '2', floor: 2, roomsCount: 3, bathrooms: 1, status: 'active', mq: 80 },
  { id: '103', buildingId: '1', unitNumber: '3', floor: 3, roomsCount: 4, bathrooms: 2, status: 'maintenance', mq: 100 },
  
  // Corso Italia 45 (id: 2)
  { id: '201', buildingId: '2', unitNumber: 'A', floor: 1, roomsCount: 5, bathrooms: 2, status: 'active', mq: 120 },
  { id: '202', buildingId: '2', unitNumber: 'B', floor: 2, roomsCount: 4, bathrooms: 2, status: 'active', mq: 110 },

  // Via Napoli 12 (id: 3)
  { id: '301', buildingId: '3', unitNumber: '12', floor: 4, roomsCount: 3, bathrooms: 1, status: 'renovation', mq: 85 },
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 't-1', firstName: 'Marco', lastName: 'Rossi', email: 'marco.r@mail.com', phone: '3331112223', roomId: '101-1', contractStart: '2024-01-01', contractEnd: '2025-01-01', status: 'active', paymentStatus: 'regular' },
  { id: 't-2', firstName: 'Giulia', lastName: 'Bianchi', email: 'giulia.b@mail.com', phone: '3334445556', roomId: '101-2', contractStart: '2023-09-01', contractEnd: '2024-09-01', status: 'active', paymentStatus: 'late' },
  { id: 't-3', firstName: 'Luca', lastName: 'Verdi', email: 'luca.v@mail.com', phone: '3337778889', roomId: '101-4', contractStart: '2024-02-01', contractEnd: '2025-02-01', status: 'active', paymentStatus: 'regular' },
  { id: 't-4', firstName: 'Sofia', lastName: 'Neri', email: 'sofia.n@mail.com', phone: '3330001112', roomId: '102-1', contractStart: '2023-10-15', contractEnd: '2024-10-15', status: 'active', paymentStatus: 'regular' },
  { id: 't-5', firstName: 'Elena', lastName: 'Gialli', email: 'elena.g@mail.com', phone: '3332223334', roomId: '102-2', contractStart: '2024-01-15', contractEnd: '2025-01-15', status: 'active', paymentStatus: 'regular' },
  { id: 't-6', firstName: 'Paolo', lastName: 'Viola', email: 'paolo.v@mail.com', phone: '3335559999', roomId: '201-2', contractStart: '2023-12-01', contractEnd: '2024-12-01', status: 'active', paymentStatus: 'regular' },
];

export const MOCK_ROOMS: Room[] = [
  // Apt 101
  { id: '101-1', apartmentId: '101', buildingId: '1', name: 'Stanza 1', type: 'single', price: 450, status: 'occupied', tenantId: 't-1', tenantName: 'Marco Rossi' },
  { id: '101-2', apartmentId: '101', buildingId: '1', name: 'Stanza 2', type: 'double', price: 600, status: 'occupied', tenantId: 't-2', tenantName: 'Giulia Bianchi' },
  { id: '101-3', apartmentId: '101', buildingId: '1', name: 'Stanza 3', type: 'single', price: 450, status: 'available' },
  { id: '101-4', apartmentId: '101', buildingId: '1', name: 'Stanza 4', type: 'suite', price: 750, status: 'occupied', tenantId: 't-3', tenantName: 'Luca Verdi' },

  // Apt 102
  { id: '102-1', apartmentId: '102', buildingId: '1', name: 'Stanza 1', type: 'single', price: 480, status: 'occupied', tenantId: 't-4', tenantName: 'Sofia Neri' },
  { id: '102-2', apartmentId: '102', buildingId: '1', name: 'Stanza 2', type: 'single', price: 480, status: 'occupied', tenantId: 't-5', tenantName: 'Elena Gialli' },
  { id: '102-3', apartmentId: '102', buildingId: '1', name: 'Stanza 3', type: 'double', price: 650, status: 'maintenance' },

  // Apt 201
  { id: '201-1', apartmentId: '201', buildingId: '2', name: 'Stanza Blu', type: 'single', price: 400, status: 'available' },
  { id: '201-2', apartmentId: '201', buildingId: '2', name: 'Stanza Rossa', type: 'single', price: 400, status: 'occupied', tenantId: 't-6', tenantName: 'Paolo Viola' },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c-1',
    apartmentId: '101',
    buildingId: '1',
    type: '4+4',
    taxCode: 'T123456',
    ownerIds: ['own-1'],
    startDate: '2023-01-01',
    endDate: '2027-01-01',
    firstExpirationDate: '2027-01-01',
    annualAmount: 12000,
    status: 'active'
  },
  {
    id: 'c-2',
    apartmentId: '102',
    buildingId: '1',
    type: '3+2',
    taxCode: 'T654321',
    ownerIds: ['own-1', 'own-2'],
    startDate: '2020-05-01',
    endDate: '2023-05-01',
    firstExpirationDate: '2023-05-01',
    annualAmount: 10500,
    status: 'expired'
  },
  {
    id: 'c-3',
    apartmentId: '201',
    buildingId: '2',
    type: 'Transitorio',
    taxCode: 'T987654',
    ownerIds: ['own-1'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    firstExpirationDate: '2024-12-31',
    annualAmount: 8000,
    status: 'expiring'
  },
  {
    id: 'c-4',
    apartmentId: '301',
    buildingId: '3',
    type: '4+4',
    taxCode: 'T456789',
    ownerIds: ['own-2'],
    startDate: '2022-06-01',
    endDate: '2026-06-01',
    firstExpirationDate: '2026-06-01',
    annualAmount: 9600,
    status: 'active'
  }
];