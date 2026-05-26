import * as React from "react";
import { MyDoc } from "@paracompanion/types";
import { ComplianceBadge } from "./compliance-badge";

interface DocumentCardProps {
  doc: MyDoc;
  onOpen?: (doc: MyDoc) => void;
  onShare?: (doc: MyDoc) => void;
  className?: string;
}

/**
 * DocumentCard: Clinical-grade card for document display.
 * Includes compliance status, tags, and offline availability indicator.
 */
export function DocumentCard({ doc, onOpen, onShare, className }: DocumentCardProps) {
  return (
    <div className={`group relative bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 p-5 transition-all duration-200 cursor-pointer rounded-[4px] ${className}`}>
      {/* Offline Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px] text-emerald-500/80">
          offline_pin
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="space-y-1">
          <h3 className="font-headline font-bold text-base text-on-surface truncate pr-8 leading-tight">
            {doc.display_name || doc.file_name}
          </h3>
          <p className="text-[11px] font-medium text-on-surface-variant/40 uppercase tracking-widest">
            {doc.mime_type.split('/')[1]} • {Math.round(doc.file_size_bytes / 1024)} KB
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {doc.tags.map(tag => (
            <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Compliance Status */}
        <div className="pt-2 flex flex-col gap-2">
           <ComplianceBadge date={doc.review_date} type="review" />
           <ComplianceBadge date={doc.expiry_date} type="expiry" />
        </div>

        {/* Actions Overlay (Mobile friendly hover/tap) */}
        <div className="mt-4 pt-4 border-t border-outline-variant/5 flex justify-between items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onOpen?.(doc); }}
            className="flex-1 bg-surface-container-high py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 rounded"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            View
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onShare?.(doc); }}
            className="flex-1 bg-surface-container-high py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 rounded"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
