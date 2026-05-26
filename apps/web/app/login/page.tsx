'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { STRINGS } from '@paracompanion/strings';
import { useRouter } from 'next/navigation';
import { BrandLogo } from "@repo/ui/brand-logo";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(STRINGS.AUTH.SIGN_IN_SENT);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 lg:px-24 bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Bar for Context (Simplified) */}
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <BrandLogo size={48} priority />
          <span className="text-2xl font-bold tracking-tight font-headline leading-none">
            <span className="text-brand-green">Para</span>
            <span className="text-on-surface">Companion</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          <span className="text-primary font-semibold text-sm font-headline">Authentication</span>
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
              Structured documentation and support for paramedics and healthcare professionals.
            </p>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-center lg:items-start justify-center">
          <div className="w-full max-w-md bg-surface-container-low p-[0.35rem]">
            <div className="bg-surface-container-lowest p-10 lg:p-14 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
              {/* Header */}
              <div className="mb-10">
                <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-on-surface">
                  Log in to <span className="text-brand-green">Para</span>Companion
                </h1>
                <p className="font-headline text-on-surface-variant leading-relaxed">
                  Enter your clinician or university email address.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Email Address
                  </label>
                  <div className="ghost-border">
                    <input
                      type="email"
                      className="w-full bg-surface-container-high border-none focus:ring-0 px-4 py-4 font-body text-on-surface placeholder:text-outline/50"
                      placeholder="clinician@nhs.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-widest py-5 px-6 flex items-center justify-center gap-3 hover:opacity-90 transition-all duration-200 active:scale-95"
                >
                  {loading ? 'Sending...' : 'Send sign-in link'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>

              {message && (
                <p className="mt-4 text-center text-sm font-label text-primary-container">
                  {message}
                </p>
              )}

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-surface-container-high flex flex-col sm:flex-row justify-between items-center gap-4">
                <button className="font-label text-[10px] font-bold uppercase tracking-widest text-outline hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">help</span>
                  {STRINGS.AUTH.LOGIN_ASSISTANCE}
                </button>
                <button className="font-label text-[10px] font-bold uppercase tracking-widest text-primary border-b border-transparent hover:border-primary transition-all">
                  {STRINGS.AUTH.CLINICAL_SUPPORT}
                </button>
              </div>
            </div>
          </div>

          {/* Technical Data Cluster removed for clarity */}
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
