import * as React from "react";

interface ComplianceBadgeProps {
  date?: string;
  type: 'review' | 'expiry';
  className?: string;
}

/**
 * ComplianceBadge: Visual indicator for document review and expiry dates.
 * Follows clinical safety color coding.
 */
export function ComplianceBadge({ date, type, className }: ComplianceBadgeProps) {
  if (!date) return null;

  const targetDate = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: 'safe' | 'warning' | 'emergency' = 'safe';
  let label = type === 'review' ? 'Review' : 'Expires';

  if (diffDays < 0) {
    status = 'emergency';
  } else if (diffDays < 30) {
    status = 'warning';
  }

  const statusStyles = {
    safe: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    emergency: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]} ${className}`}>
      <span className="material-symbols-outlined text-[14px]">
        {status === 'safe' ? 'analytics' : status === 'warning' ? 'warning' : 'dangerous'}
      </span>
      {label}: {date}
    </div>
  );
}
