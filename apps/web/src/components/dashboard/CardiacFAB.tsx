'use client';

import { Activity } from 'lucide-react';

export function CardiacFAB() {
  return (
    <div className="fixed bottom-28 right-6 z-[100] md:bottom-12 md:right-12">
      <button className="bg-surgical-blue text-white pl-5 pr-6 py-4 rounded-full shadow-[0px_24px_48px_rgba(0,102,255,0.25)] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group border-none cursor-pointer">
        <Activity size={24} strokeWidth={2} fill="currentColor" className="text-white group-hover:scale-110 transition-transform" />
        <span className="font-sans font-black text-[11px] tracking-[0.2em] uppercase">
          CARDIAC ARREST
        </span>
      </button>
    </div>
  );
}
