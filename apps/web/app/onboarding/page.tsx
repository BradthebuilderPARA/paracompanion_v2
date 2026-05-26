'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { STRINGS } from '@paracompanion/strings';
import { useRouter } from 'next/navigation';
import { mapRoleToTier, getCompliancePayload, LEGAL_POLICIES } from '@paracompanion/clinical';
import { STRIPE_PRICES, TIER_METADATA } from '@paracompanion/types';
import { BrandLogo } from '@repo/ui/brand-logo';
import bcrypt from 'bcryptjs';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [isAnnual, setIsAnnual] = useState(true); // Default to Annual
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [clinicianId, setClinicianId] = useState('');
  
  // Consent states
  const [consents, setConsents] = useState({
    privacy: false,
    terms: false,
    clinical: false
  });

  const router = useRouter();

  const CLINICIAN_ROLES = [
    { id: 'student', label: 'Student / Apprentice Paramedic', tier: 'learner' },
    { id: 'qualified', label: 'Qualified Paramedic', tier: 'practitioner' },
    { id: 'specialist', label: 'Specialist / Critical Care', tier: 'practitioner' },
    { id: 'emt_eca', label: 'EMT / ECA / Associate', tier: 'practitioner' },
    { id: 'cfr', label: 'Community First Responder', tier: 'learner' },
    { id: 'first_aider', label: 'First Aider / Volunteer', tier: 'learner' },
    { id: 'emergency_services', label: STRINGS.ONBOARDING.EMERGENCY_SERVICES_LABEL, tier: 'practitioner' },
    { id: 'admin', label: 'Trust Admin / Academy', tier: 'practitioner' },
  ];

  const currentTier = role ? CLINICIAN_ROLES.find(r => r.id === role)?.tier : null;

  async function handleCheckout() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const tier = currentTier as 'learner' | 'practitioner';
    const priceId = isAnnual 
      ? (tier === 'learner' ? STRIPE_PRICES.LEARNER_ANNUAL : STRIPE_PRICES.PRACTITIONER_ANNUAL)
      : (tier === 'learner' ? STRIPE_PRICES.LEARNER_MONTHLY : STRIPE_PRICES.PRACTITIONER_MONTHLY);

    try {
      const resp = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          email: user.email,
        }),
      });

      const { url, error } = await resp.json();
      if (error) throw new Error(error);

      // Redirect to Stripe
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Checkout Error:', message);
      alert('Could not initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    // For free tier or later trial logic
    setStep(3);
  }

  async function handlePINSetup() {
    if (pin.length !== 4 || pin !== confirmPin) {
      alert('Please enter matching 4-digit PINs.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Hashing PIN before storage (Phase 1 Security Rule)
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(pin, salt);

      // Secure Tier Update via Edge Function (HARD RULE 651)
      const { data, error: functionError } = await supabase.functions.invoke('sync-tier', {
        body: {
          clinician_tier: 'free', // Default if skipped billing
          clinician_id: clinicianId || undefined,
          onboarding_complete: true,
          pin_hash: hash, // We pass the hash to the function to update the profile
          ...getCompliancePayload()
        }
      });

      if (functionError) throw functionError;
      
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('PIN Setup Error:', message);
      alert('Failed to secure account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const allConsentsAccepted = consents.privacy && consents.terms && consents.clinical;

  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 lg:px-24 bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <BrandLogo size={48} priority />
          <span className="text-2xl font-bold tracking-tight font-headline leading-none">
            <span className="text-brand-green">Para</span>
            <span className="text-on-surface">Companion</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-label uppercase tracking-widest text-outline">Onboarding: {step} of 4</div>
        </div>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-end pb-12 pr-12">
          <div className="space-y-6">
            <div className="h-1 w-12 bg-primary"></div>
            <h2 className="font-label text-xs uppercase tracking-[0.2em] text-outline">Professional Standards</h2>
            <p className="font-headline text-sm text-on-surface-variant leading-relaxed opacity-60">
              {step === 1 && "Start your journey with clinical-grade tools."}
              {step === 2 && "Secure your professional tier. 5 months free on annual plans."}
              {step === 3 && "Surgical precision in your pocket. Always JRCALC aligned."}
              {step === 4 && "Never store a raw PIN. BCrypt standard encryption."}
            </p>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col items-center lg:items-start justify-center">
          <div className="w-full max-w-xl bg-surface-container-low p-[0.35rem]">
            <div className="bg-surface-container-lowest p-10 lg:p-14 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
              
              {step === 1 && (
                <>
                  <div className="mb-10">
                    <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-on-surface">
                      Professional Identity
                    </h1>
                    <p className="font-headline text-on-surface-variant leading-relaxed">
                      Select your clinical role to tailor your experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {CLINICIAN_ROLES.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id);
                          setStep(2);
                        }}
                        className="w-full bg-surface-container-high px-6 py-5 text-left font-headline text-sm font-semibold hover:bg-primary-fixed transition-all flex justify-between items-center group rounded-[4px]"
                      >
                        {r.label}
                        <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && currentTier && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 text-center lg:text-left">
                    <h1 className="font-headline text-2xl sm:text-3xl lg:text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-on-surface">
                      {currentTier === 'learner' ? STRINGS.ONBOARDING.HEADER_LEARNER : STRINGS.ONBOARDING.HEADER_PROFESSIONAL}
                    </h1>
                    <p className="font-headline text-on-surface-variant text-sm">
                      {STRINGS.ONBOARDING.PRICING_SUBTITLE}
                    </p>
                  </div>

                  {/* Pricing Toggle */}
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 bg-surface-container-high/50 p-1 w-fit rounded-[4px] mx-auto lg:mx-0">
                    <button 
                      onClick={() => setIsAnnual(false)}
                      className={`px-6 py-2 text-xs font-bold font-label tracking-widest uppercase transition-all ${!isAnnual ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setIsAnnual(true)}
                      className={`px-6 py-2 text-xs font-bold font-label tracking-widest uppercase transition-all flex items-center gap-2 ${isAnnual ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
                    >
                      Annual
                      <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">5 MONTHS FREE</span>
                    </button>
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-surface-container-high border-2 border-primary/20 p-8 mb-8 relative overflow-hidden group rounded-[4px]">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <span className="material-symbols-outlined text-[120px]">verified_user</span>
                    </div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-surface">
                          {currentTier === 'learner' ? 'Learner Tier' : 'Practitioner Tier'}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium">Billed {isAnnual ? 'Annually' : 'Monthly'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold font-headline text-on-surface">
                          £{isAnnual ? (currentTier === 'learner' ? '20' : '30') : (currentTier === 'learner' ? '2.99' : '3.99')}
                        </span>
                        <span className="text-outline text-xs block font-label">{isAnnual ? '/year' : '/month'}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-sm font-body">
                        <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                        <span>Single Account, All Devices (Web, iOS, Android)</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm font-body">
                        <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                        <span>{currentTier === 'learner' ? STRINGS.ONBOARDING.PLACEMENT_TRACKER_LABEL : STRINGS.ONBOARDING.HISTORY_HELPER_LABEL}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm font-body">
                        <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                        <span>Priority Clinical Safety Updates</span>
                      </li>
                    </ul>

                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-primary text-on-primary font-label text-sm font-bold tracking-widest py-5 px-6 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-95 rounded-[4px]"
                    >
                      {loading ? 'Processing...' : `SUBSCRIBE ${isAnnual ? 'ANNUALLY' : 'MONTHLY'}`}
                      <span className="material-symbols-outlined">payments</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={handleSkip}
                      className="text-[10px] font-bold font-label uppercase tracking-[0.2em] text-outline hover:text-primary transition-colors"
                    >
                      Continue with Limited Free Version
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="mb-10">
                    <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-on-surface">
                      Legal Consent
                    </h1>
                    <p className="font-headline text-on-surface-variant leading-relaxed">
                      We take patient safety and your data privacy seriously.
                    </p>
                  </div>

                  <div className="space-y-4 mb-10">
                    <label className="flex items-start gap-4 p-4 bg-surface-container-high/50 hover:bg-surface-container-high transition-colors cursor-pointer group rounded-[4px]">
                      <input 
                        type="checkbox" 
                        checked={consents.privacy}
                        onChange={(e) => setConsents({...consents, privacy: e.target.checked})}
                        className="mt-1 w-5 h-5 rounded-[4px] border-[#c2c6d8]/30 text-[#10b981] focus:ring-[#10b981]"

                      />
                      <span className="text-sm font-headline text-on-surface leading-snug">
                        I have read and agree to the <button onClick={() => alert(LEGAL_POLICIES.PRIVACY_POLICY)} className="text-primary hover:underline">Privacy Policy</button>, <button onClick={() => alert(LEGAL_POLICIES.TERMS_OF_SERVICE)} className="text-primary hover:underline">Terms of Service</button> and <button onClick={() => alert(LEGAL_POLICIES.COOKIE_POLICY)} className="text-primary hover:underline">Cookie Policy</button>.
                      </span>
                    </label>

                    <label className="flex items-start gap-4 p-4 bg-surface-container-high/50 hover:bg-surface-container-high transition-colors cursor-pointer group rounded-[4px]">
                      <input 
                        type="checkbox" 
                        checked={consents.terms}
                        onChange={(e) => setConsents({...consents, terms: e.target.checked})}
                        className="mt-1 w-5 h-5 rounded-[4px] border-[#c2c6d8]/30 text-[#10b981] focus:ring-[#10b981]"

                      />
                      <span className="text-sm font-headline text-on-surface leading-snug">
                        I agree to the <button onClick={() => alert(LEGAL_POLICIES.SUBSCRIPTION_TERMS)} className="text-primary hover:underline">Subscription & Billing Terms</button>.
                      </span>
                    </label>

                    <div className="p-5 bg-emergency/5 border-l-4 border-emergency">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={consents.clinical}
                          onChange={(e) => setConsents({...consents, clinical: e.target.checked})}
                          className="mt-1 w-5 h-5 rounded-[4px] border-emergency/30 text-emergency focus:ring-emergency"

                        />
                        <span className="text-xs font-headline text-emergency font-bold uppercase tracking-wide leading-relaxed">
                          I UNDERSTAND THAT ENTRY OF PATIENT-IDENTIFIABLE DATA IS STRICTLY PROHIBITED AND MAY RESULT IN ACCOUNT TERMINATION.
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(4)}
                    disabled={!allConsentsAccepted}
                    className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-widest py-5 px-6 flex items-center justify-center gap-3 hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:grayscale"
                  >
                    CONTINUE TO SECURITY
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </button>
                </>
              )}

              {step === 4 && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="mb-10 text-center lg:text-left">
                    <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-on-surface">
                      Secure Unlock
                    </h1>
                    <p className="font-headline text-on-surface-variant leading-relaxed">
                      Set a 4-digit PIN to secure your clinical sessions.
                    </p>
                  </div>

                  <div className="space-y-4 mb-10 w-full max-w-sm mx-auto lg:mx-0">
                    <div className="bg-surface-container-high p-1 rounded-[4px]">
                      <input 
                        type="password"
                        placeholder="ENTER 4-DIGIT PIN"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-container-lowest px-4 py-5 font-headline text-2xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-[4px] placeholder:tracking-normal placeholder:text-sm"
                      />
                    </div>
                    <div className="bg-surface-container-high p-1 rounded-[4px] mb-8">
                       <input 
                         type="password"
                         placeholder="CONFIRM PIN"
                         maxLength={4}
                         value={confirmPin}
                         onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                         className="w-full bg-surface-container-lowest px-4 py-5 font-headline text-2xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-[4px] placeholder:tracking-normal placeholder:text-sm"
                       />
                    </div>

                    <div className="pt-4 border-t border-outline-variant/10">
                      <h3 className="text-[10px] font-bold font-label uppercase tracking-widest text-outline mb-3">Professional Registration (Optional)</h3>
                      <div className="bg-surface-container-high p-1 rounded-[4px]">
                        <input 
                          type="text"
                          placeholder="HCPC / NMC NUMBER"
                          value={clinicianId}
                          onChange={(e) => setClinicianId(e.target.value.toUpperCase())}
                          className="w-full bg-surface-container-lowest px-4 py-3 font-headline text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all rounded-[4px]"
                        />
                      </div>
                      <p className="mt-2 text-[9px] text-on-surface-variant/40 font-medium text-center italic">Required for CPD audit file exports</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePINSetup}
                    disabled={loading || pin.length !== 4 || pin !== confirmPin}
                    className="w-full bg-primary text-on-primary font-label text-sm font-bold tracking-widest py-5 px-6 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 rounded-[4px]"
                  >
                    {loading ? 'SECURING ACCOUNT...' : 'COMPLETE SETUP'}
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </button>

                  <p className="mt-8 text-center text-[10px] font-bold font-label uppercase tracking-widest text-outline">
                    Your PIN is encrypted locally and never shared in plain text.
                  </p>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-surface-container-high flex justify-between items-center text-[10px] font-bold font-label uppercase tracking-widest text-outline">
                <button
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`hover:text-primary ${step === 1 ? 'invisible' : ''}`}
                >
                  Back
                </button>
                <span>HCPC: PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
