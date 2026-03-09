import React, { ReactNode } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface KpiSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  tooltip?: string;
}

export const KpiSection: React.FC<KpiSectionProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
  tooltip
}) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {icon}
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {tooltip && (
          <div className="group relative">
            <Info size={18} className="text-slate-400 cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
