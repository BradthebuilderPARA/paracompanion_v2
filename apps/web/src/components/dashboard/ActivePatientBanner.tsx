'use client';

import { Activity, AlertTriangle, Play, Square } from 'lucide-react';
import Link from 'next/link';

interface ActivePatientBannerProps {
  patientId?: string;
  timeActive?: string;
  onEndSession?: () => void;
}

export function ActivePatientBanner({ 
  patientId = 'PT-8942-A', 
  timeActive = '14m 22s',
  onEndSession 
}: ActivePatientBannerProps) {
  return (
    <div className="bg-adult-emerald text-white p-4 md:p-6 rounded-[0.5rem] shadow-[0px_12px_32px_rgba(5,150,105,0.2)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-2 bg-white/20 rounded-full shrink-0">
          <Activity size={24} strokeWidth={2} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[10px] tracking-widest uppercase font-bold bg-white/20 px-2 py-0.5 rounded-[0.125rem]">
              Active Session
            </span>
            <span className="clinical-data text-[11px] tracking-widest uppercase text-white/90">
              {timeActive}
            </span>
          </div>
          <h2 className="font-sans font-bold text-lg md:text-xl">
            Active Record: <span className="clinical-data tracking-wider">{patientId}</span>
          </h2>
          <p className="font-sans text-sm text-white/90 mt-1 flex items-center gap-1.5 line-clamp-1">
            <AlertTriangle size={14} strokeWidth={2} />
            Focus is on the patient. Non-essential tools are disabled.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
        <button 
          onClick={onEndSession}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.25rem] border border-white/30 text-white font-label text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          <Square size={14} strokeWidth={2} />
          End Session
        </button>
        <Link 
          href={`/patient/${patientId}`}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.25rem] bg-surface-container-lowest text-adult-emerald font-label text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors no-underline"
        >
          <Play size={14} strokeWidth={2} />
          Resume Patient
        </Link>
      </div>
    </div>
  );
}
