'use client';

import { useState } from 'react';
import { ClipboardList, FolderKanban, Zap, Lock, X, AlertTriangle, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAccessGridProps {
  isPatientActive?: boolean;
  tier?: 'free' | 'learner' | 'practitioner';
  role?: 'practitioner' | 'student';
}

export function QuickAccessGrid({ 
  isPatientActive = false, 
  tier = 'free',
  role = 'practitioner'
}: QuickAccessGridProps) {
  const router = useRouter();
  const [showActiveWarning, setShowActiveWarning] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const modules = [
    {
      id: 'patient-session',
      title: 'New Patient Session',
      subtitle: 'Start a structured record for observations and handover.',
      icon: ClipboardList,
      href: '/patient/new',
      requiresActiveCheck: true,
      alwaysEnabled: true,
    },
    {
      id: 'guidelines',
      title: 'My Docs',
      subtitle: 'Your clinical repository. Pathways and guidelines, indexed for offline use.',
      icon: FolderKanban,
      href: '/docs',
      requiresActiveCheck: false,
      alwaysEnabled: true,
    },
    {
      id: 'history-helper',
      title: 'History Support',
      subtitle: tier === 'free' 
        ? 'Structured prompts to help you build a clearer clinical picture.' 
        : 'Advanced history-taking logic for practitioners.',
      icon: Zap,
      href: '/tools/history',
      requiresActiveCheck: false,
      isPremium: tier === 'free',
      alwaysEnabled: false,
    },
  ];

  const handleAction = (mod: typeof modules[0]) => {
    if (mod.id === 'history-helper' && tier === 'free') {
      setShowUpgradeModal(true);
      return;
    }

    if (mod.requiresActiveCheck && isPatientActive) {
      setShowActiveWarning(true);
      return;
    }

    if (isPatientActive && !mod.alwaysEnabled) {
      return;
    }

    router.push(mod.href);
  };

  return (
    <section>
      <h3 className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-bold truncate">
        {isPatientActive ? 'Clinical Operations (Lockdown)' : 'Workflow Tools'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isShielded = isPatientActive && !mod.alwaysEnabled;
          
          return (
            <button
              key={mod.id}
              onClick={() => handleAction(mod)}
              disabled={isShielded}
              className={`
                group relative text-left p-6 rounded-[0.25rem] transition-all bg-surface-container-lowest 
                shadow-[12px_12px_24px_rgba(25,28,30,0.03)] 
                flex flex-col
                ${isShielded ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
              `}
              style={{ minHeight: '160px' }}
            >
              <div className="flex justify-between items-start mb-4">
                <Icon size={24} strokeWidth={1.5} className={isShielded ? 'text-on-surface-variant' : 'text-surgical-blue'} />
                {mod.isPremium && !isShielded && (
                  <span className="bg-primary/10 text-surgical-blue text-[8px] font-bold uppercase py-0.5 px-1.5 rounded-full tracking-widest">
                    Pro
                  </span>
                )}
                {isShielded && <Lock size={14} strokeWidth={2} className="text-on-surface-variant/40" />}
              </div>
              <p className="font-sans font-bold text-lg text-on-surface mb-1 truncate">
                {mod.title}
              </p>
              <p className="font-sans text-sm text-on-surface-variant leading-normal line-clamp-2">
                {mod.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3-Way Session Interceptor */}
      {showActiveWarning && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-[4px]">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[0.35rem] shadow-[0px_24px_64px_rgba(25,28,30,0.15)] p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-50 rounded-full text-emergency-red">
                <AlertTriangle size={28} strokeWidth={1.5} />
              </div>
              <button onClick={() => setShowActiveWarning(false)} className="text-on-surface-variant hover:text-on-surface p-2">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <h4 className="font-sans font-bold text-2xl text-on-surface mb-3 tracking-tight">
              Close Current Session?
            </h4>
            <p className="text-on-surface-variant text-sm font-sans mb-8 leading-relaxed">
              Starting a new record will clear the active data from your device. You can move the current summary to your CPD log first if you need it for reflection later.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowActiveWarning(false);
                  router.push('/patient/new');
                }}
                className="w-full py-4 bg-surface-container-low text-on-surface rounded-[0.25rem] font-sans font-bold text-[10px] tracking-[0.15em] uppercase hover:bg-surface-container-high transition-all flex items-center justify-center gap-3"
              >
                <Trash2 size={16} strokeWidth={2} className="text-emergency-red" />
                Clear & Start New
              </button>
              
              <button 
                onClick={() => {
                  setShowActiveWarning(false);
                  router.push('/dashboard?saved=true');
                }}
                className="w-full py-4 bg-surgical-blue text-white rounded-[0.25rem] font-sans font-bold text-[10px] tracking-[0.15em] uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
              >
                <Save size={16} strokeWidth={2} />
                Move to CPD Log
              </button>

              <button 
                onClick={() => setShowActiveWarning(false)}
                className="w-full py-3 mt-2 text-on-surface-variant font-sans font-bold text-[10px] tracking-widest uppercase hover:text-on-surface transition-colors"
              >
                Back to Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CTA Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-[4px]">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[0.35rem] shadow-[0px_24px_48px_rgba(25,28,30,0.12)] p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-surgical-blue">
              <Zap size={36} strokeWidth={1.5} fill="currentColor" />
            </div>
            
            <h4 className="font-sans font-bold text-2xl text-on-surface mb-3 tracking-tight">
              Add History Support
            </h4>
            <p className="text-on-surface-variant text-sm font-sans mb-10 leading-relaxed px-2">
              Choose the tier that fits your situation to access advanced clinical history prompts and structured case indexing.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push('/pricing')}
                className="w-full py-5 bg-surgical-blue text-white rounded-[0.25rem] font-sans font-bold text-[11px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/25"
              >
                Choose Tier
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 text-on-surface-variant font-sans font-bold text-[10px] tracking-widest uppercase hover:text-on-surface transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
