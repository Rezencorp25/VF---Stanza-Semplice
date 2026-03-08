import React, { useState, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
import { Booking, BookingStatus, UserRole } from '../types';
import { X, User, Shield, FileText, ReceiptEuro, CalendarClock, FileCheck, CreditCard } from 'lucide-react';
import { BookingActions } from './BookingActions';
import { TabDatiGenerali } from './TabDatiGenerali';
import { TabGarante } from './TabGarante';
import { TabContratto } from './TabContratto';
import { TabPrezzi } from './TabPrezzi';
import { TabPianoPagamenti } from './TabPianoPagamenti';
import { TabDocumenti } from './TabDocumenti';
import { TabFormPagamento } from './TabFormPagamento';

interface BookingDrawerProps {
  isOpen: boolean;
  booking: Booking | null;
  userRole?: UserRole;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  // Removed explicit children prop in favor of internal rendering to handle state
  
  onSave?: (booking: Booking) => void;
  onSaveAndClose?: (booking: Booking) => void;
  onDelete?: () => void;
  onRequestPayment?: () => void;
  onConfirmBooking?: () => void;
  onFinalConfirm?: () => void;
}

const TABS = [
  { id: 'general', label: 'Generale', icon: User },
  { id: 'guarantor', label: 'Garante', icon: Shield },
  { id: 'contract', label: 'Contratto', icon: FileCheck },
  { id: 'pricing', label: 'Prezzi', icon: ReceiptEuro },
  { id: 'payments', label: 'Piano Pagamenti', icon: CalendarClock },
  { id: 'documents', label: 'Documenti', icon: FileText },
  { id: 'form', label: 'Form & Stripe', icon: CreditCard },
];

const getStatusBadgeStyles = (status: BookingStatus) => {
  switch (status) {
    case 'attiva':
      return 'bg-green-100 text-green-700 border-green-200 ring-green-500/30';
    case 'confermata':
      return 'bg-orange-100 text-orange-700 border-orange-200 ring-orange-500/30';
    case 'trattativa':
      return 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/30';
    case 'ricevuta':
      return 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/30';
    case 'confermata_fattura_mancante':
      return 'bg-purple-100 text-purple-700 border-purple-200 ring-purple-500/30';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const formatStatus = (status: BookingStatus) => {
  return status.replace(/_/g, ' ');
};

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  booking,
  userRole = UserRole.CITY_MANAGER,
  onClose,
  activeTab,
  onTabChange,
  onSave = (_booking: Booking) => {},
  onSaveAndClose = (_booking: Booking) => {},
  onDelete = () => {},
  onRequestPayment = () => {},
  onConfirmBooking = () => {},
  onFinalConfirm = () => {}
}) => {
  // Local state for editing
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);

  // Sync local state when booking prop changes
  useEffect(() => {
    setEditedBooking(booking);
  }, [booking]);

  if (!isOpen || !editedBooking) return null;

  // Generic Change Handler for flat fields
  const handleChange = (field: keyof Booking, value: unknown) => {
    setEditedBooking(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Nested Change Handlers
  const handleGuarantorChange = (field: any, value: any) => {
    setEditedBooking(prev => prev ? {
      ...prev,
      guarantor: { ...prev.guarantor!, [field]: value }
    } : null);
  };

  const handleContractChange = (field: any, value: any) => {
    setEditedBooking(prev => prev ? {
      ...prev,
      contractDetails: { ...prev.contractDetails!, [field]: value }
    } : null);
  };

  return (
    <ModalPortal>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-[700px] bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/50">
        
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 bg-white border-b border-slate-200 shadow-sm z-20">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {editedBooking.tenantName || 'Nuova Prenotazione'}
                </h2>
                {editedBooking.status && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ring-1 ${getStatusBadgeStyles(editedBooking.status)}`}>
                    {formatStatus(editedBooking.status)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cod.</span>
                   <span className="font-mono font-medium text-slate-700">{editedBooking.roomId || 'N/A'}</span>
                </span>
                {editedBooking.checkIn && editedBooking.checkOut && (
                  <span className="font-medium">
                     {new Date(editedBooking.checkIn).toLocaleDateString('it-IT')} — {new Date(editedBooking.checkOut).toLocaleDateString('it-IT')}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs Navigation (Inside Header for Sticky effect) */}
          <div className="mt-6 flex space-x-1 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border
                    ${isActive 
                      ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm' 
                      : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative">
           <div className="max-w-4xl mx-auto">
             {activeTab === 'general' && <TabDatiGenerali booking={editedBooking} onChange={handleChange} />}
             
             {activeTab === 'guarantor' && <TabGarante guarantor={editedBooking.guarantor} onChange={handleGuarantorChange} onAdd={() => {}} />}
             
             {activeTab === 'contract' && <TabContratto contract={editedBooking.contractDetails} onChange={handleContractChange} onInitialize={() => {}} />}
             
             {activeTab === 'pricing' && <TabPrezzi billingMode={editedBooking.billingMode || 'mensile'} utilityPrice={editedBooking.utilityPrice || 50} monthlyPrices={editedBooking.monthlyPrices || []} onBillingModeChange={() => {}} onMonthlyPriceChange={() => {}} onDeletePrices={() => {}} onRecreate={() => {}} />}
             
             {activeTab === 'payments' && <TabPianoPagamenti paymentPlan={editedBooking.paymentPlan || []} onRecalculate={() => {}} onAddManual={() => {}} onTogglePaid={() => {}} />}
             
             {activeTab === 'documents' && <TabDocumenti documents={editedBooking.documents || []} onUpload={() => {}} onPreview={() => {}} onDelete={() => {}} onGeneratePDF={() => {}} />}
             
             {activeTab === 'form' && <TabFormPagamento formLink={editedBooking.formLink || null} isFormCompleted={!!editedBooking.isFormCompleted} isPaymentCompleted={!!editedBooking.isPaymentCompleted} onGenerateLink={() => {}} onCopyLink={() => {}} />}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-slate-200 z-20">
          <BookingActions 
            status={editedBooking.status || 'ricevuta'}
            userRole={userRole}
            onSave={() => onSave(editedBooking)}
            onSaveAndClose={() => onSaveAndClose(editedBooking)}
            onClose={onClose}
            onDelete={onDelete}
            onRequestPayment={onRequestPayment}
            onConfirmBooking={onConfirmBooking}
            onFinalConfirm={onFinalConfirm}
          />
        </div>

      </div>
    </ModalPortal>
  );
};