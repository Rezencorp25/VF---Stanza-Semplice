
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import { Management } from './pages/Management';
import { People } from './pages/People';
import { Login } from './pages/Login';
import { Planning } from './pages/Planning';
import { Invoices } from './pages/Invoices';
import { PagamentiSection } from './components/PagamentiSection'; 
import { CostiSection } from './components/CostiSection'; 
import { CashflowSection } from './components/CashflowSection'; // Importazione Cashflow
import KPI from './pages/KPI';
import { Contracts } from './pages/Contracts';
import { Collaborators } from './pages/admin/Collaborators';
import { Cities } from './pages/admin/Cities';
import { CompetenceGroups } from './pages/admin/CompetenceGroups';
import { ContextDescriptions } from './pages/admin/ContextDescriptions';
import { Agencies } from './pages/admin/Agencies';
import { AdminTools } from './pages/admin/AdminTools';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLayout } from './components/admin/AdminLayout';
import { Breadcrumbs } from './components/Breadcrumbs';
import { UserRole, ViewState } from './types';
import { ForcePasswordChangeModal } from './components/ForcePasswordChangeModal';

import { GeneralePage } from './pages/conto-economico/GeneralePage';
import { RiunioniPage } from './pages/conto-economico/RiunioniPage';
import { DrilldownPage } from './pages/conto-economico/DrilldownPage';
import { ContoEconomicoLayout } from './pages/conto-economico/ContoEconomicoLayout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

// Simple placeholder for pages not fully implemented to keep the file count within limits
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
    <div className="text-6xl mb-4 opacity-20">🚧</div>
    <h2 className="text-2xl font-bold text-slate-600 mb-2">{title}</h2>
    <p>Questa sezione è in fase di sviluppo per questa demo.</p>
  </div>
);

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // App State
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [navParams, setNavParams] = useState<any>(null);
  
  // State to handle highlighting specific items when navigating
  const [highlightedPersonId, setHighlightedPersonId] = useState<string | null>(null);

  React.useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (email: string) => {
    try {
      // Mock login check
      console.log("Mock login for:", email);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check Firestore for user status
      // Note: In a real app, this check would happen on the backend or via Firebase Auth custom claims/blocking functions.
      // Here we do a client-side check for demonstration.
      /* Firebase implementation commented out
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        if (userData.status === 'inactive') {
          alert('Account disattivato. Contatta l\'amministratore.');
          return;
        }
      }
      */
    } catch (error) {
      console.error("Error checking user status:", error);
      // Proceeding for demo if check fails or user not found in Firestore (e.g. admin not in 'users' collection yet)
    }

    setIsAuthenticated(true);
    // Simulazione controllo Firestore: se l'utente ha mustChangePassword: true
    // Per test, lo impostiamo a false di default, ma può essere cambiato
    // setMustChangePassword(true); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('DASHBOARD');
  };

  const handlePasswordChanged = () => {
    setMustChangePassword(false);
  };

  const handleNavigateToPerson = (view: ViewState, personId: string) => {
    setHighlightedPersonId(personId);
    setCurrentView(view);
  };

  const handleNavigate = (view: ViewState, params?: any) => {
    setHighlightedPersonId(null); // Clear highlight on normal navigation
    setCurrentView(view);
    if (params) {
      setNavParams(params);
    } else {
      setNavParams(null);
    }
  };

  const clearNavParams = () => setNavParams(null);

  // Render the active view
  const renderContent = () => {
    // Admin Route Guard
    if (currentView.startsWith('ADMIN_') && currentRole !== UserRole.ADMIN) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Accesso Negato</h2>
          <p>Questa sezione è riservata agli amministratori.</p>
        </div>
      );
    }

    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard currentRole={currentRole} onNavigate={handleNavigate} />;
      case 'OBJECTS_BUILDINGS':
      case 'OBJECTS_APARTMENTS':
      case 'OBJECTS_ROOMS':
        return (
          <Properties 
            view={currentView} 
            onNavigate={handleNavigate} 
            onNavigateToPerson={handleNavigateToPerson} 
            navParams={navParams}
            onClearParams={clearNavParams}
          />
        );
      case 'OBJECTS_CONTRACTS':
        return <Contracts onNavigate={handleNavigate} />;
      case 'PEOPLE_OWNERS':
      case 'PEOPLE_TENANTS':
        return <People view={currentView} highlightId={highlightedPersonId} />;
      case 'MANAGEMENT_CLEANING':
      case 'MANAGEMENT_MAINTENANCE':
      case 'MANAGEMENT_DEADLINES':
        return <Management view={currentView} />;
      case 'BILLING_INVOICES':
        return <Invoices />;
      case 'BILLING_PAYMENTS':
        return <PagamentiSection />; 
      case 'BILLING_COSTS':
        return <CostiSection />; 
      case 'BILLING_CASHFLOW':
        return <CashflowSection />; // Implementazione completa
      case 'CALENDAR':
        return <Planning />;
      case 'PNL_GENERAL':
      case 'PNL_MEETINGS':
      case 'PNL_CITIES':
        return (
          <ContoEconomicoLayout currentView={currentView} onNavigate={setCurrentView}>
            {currentView === 'PNL_GENERAL' && <GeneralePage onNavigate={setCurrentView} />}
            {currentView === 'PNL_MEETINGS' && <RiunioniPage />}
            {currentView === 'PNL_CITIES' && <DrilldownPage />}
          </ContoEconomicoLayout>
        );
      
      case 'KPI':
        return <KPI initialArea={navParams?.areaId} />;

      // --- Admin Section ---
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'ADMIN_EMPLOYEES':
        return <Collaborators />;
      case 'ADMIN_CITIES':
        return <Cities />;
      case 'ADMIN_COMPETENCE_GROUPS':
        return <CompetenceGroups />;
      case 'ADMIN_CONTEXTS':
        return <ContextDescriptions />;
      case 'ADMIN_AGENCIES':
        return <Agencies />;
      case 'ADMIN_TOOLS':
        return <AdminTools />;
        
      default:
        return <PlaceholderPage title={currentView.replace('_', ' ')} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-orange-500/20">
          <span className="text-white text-3xl font-bold">S</span>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight animate-pulse">StanzaSemplice</h1>
        <p className="text-slate-400 text-sm mt-2">Caricamento in corso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex animate-in fade-in duration-300">
      {/* Modale Cambio Password Obbligatorio */}
      <ForcePasswordChangeModal 
        isOpen={mustChangePassword} 
        onSuccess={handlePasswordChanged} 
      />

      {/* Navigation */}
      <Sidebar 
        currentRole={currentRole}
        currentView={currentView}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <Header 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {currentView !== 'DASHBOARD' && (
              <Breadcrumbs currentView={currentView} onNavigate={handleNavigate} />
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
