import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  breadcrumbs = [],
  actions
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-slate-500 mt-1 text-sm font-medium">{subtitle}</p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[60vh]">
        {children}
      </div>
    </div>
  );
};
