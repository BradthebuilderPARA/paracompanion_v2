import Link from 'next/link';
import { BrandLogo } from "@repo/ui/brand-logo";
import { STRINGS } from '@paracompanion/strings';

export default function Home() {
  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 lg:px-24 bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Bar */}
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <BrandLogo size={48} priority />
          <span className="text-2xl font-bold tracking-tight font-headline leading-none">
            <span className="text-brand-green">Para</span>
            <span className="text-on-surface">Companion</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/login" className="text-primary font-semibold text-sm font-headline">Login</Link>
          <span className="text-on-surface-variant font-headline text-sm opacity-40">Framework</span>
          <span className="text-on-surface-variant font-headline text-sm opacity-40">Docs</span>
        </nav>
        <div className="flex items-center gap-3">
           <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-lg transition-colors">settings</button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Branding Margin */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-end pb-12 pr-12">
          <div className="space-y-6">
            <div className="h-1 w-12 bg-primary"></div>
            <h2 className="font-label text-xs uppercase tracking-[0.2em]">
              <span className="text-brand-green">Para</span>
              <span className="text-on-surface-variant/60">Companion</span>
            </h2>
            <p className="font-headline text-sm text-on-surface-variant leading-relaxed opacity-60">
              {STRINGS.BRAND.AUDIENCE}
            </p>
          </div>
        </div>

        {/* Interaction Area (Hero) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-center lg:items-start justify-center">
          <div className="w-full max-w-2xl bg-surface-container-low p-[0.35rem]">
            <div className="bg-surface-container-lowest p-10 lg:p-14 shadow-[0px_12px_32_rgba(25,28,30,0.04)]">
              {/* Header */}
              <div className="mb-10">
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-[3.5rem] font-extrabold tracking-tight leading-none mb-6 text-on-surface">
                  {STRINGS.BRAND.TAGLINE}
                </h1>
                <p className="font-headline text-xl text-on-surface-variant leading-relaxed mb-8">
                  Structured documentation and support for paramedics and healthcare professionals.
                </p>
                
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-widest py-5 px-10 flex items-center justify-center gap-3 hover:opacity-90 transition-all duration-200 active:scale-95 shadow-xl shadow-primary/20"
                  >
                    Create Free Account
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Phase Modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 pt-8 border-t border-surface-container-high opacity-80">
                <div className="p-4 bg-surface/50">
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Phase 1</span>
                  <p className="text-xs font-headline text-on-surface-variant leading-relaxed">Structured Handover.</p>
                </div>
                <div className="p-4 bg-surface/50">
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Phase 2</span>
                  <p className="text-xs font-headline text-on-surface-variant leading-relaxed">Incident Timeline.</p>
                </div>
                <div className="p-4 bg-surface/50">
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Phase 3</span>
                  <p className="text-xs font-headline text-on-surface-variant leading-relaxed">Reflective CPD.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ornamentation */}
      <div className="fixed bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <svg className="w-full h-full text-primary fill-current" viewBox="0 0 100 100">
          <path d="M0 0h1v100H0zM10 0h1v100h-1zM20 0h1v100h-1zM30 0h1v100h-1zM40 0h1v100h-1zM50 0h1v100h-1z" />
        </svg>
      </div>
    </main>
  );
}
