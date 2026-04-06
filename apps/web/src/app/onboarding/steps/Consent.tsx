'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { 
  PrivacyPolicyContent, 
  TermsOfServiceContent, 
  CookiePolicyContent 
} from '@/components/legal/LegalContent'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { Check, ShieldCheck, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function ConsentStep() {
  const { setStep, setProfileData, agreedToTerms, agreedToPrivacy, agreedToMarketing } = useOnboardingStore()
  const [localAgreedTerms, setLocalAgreedTerms] = useState(agreedToTerms)
  const [localAgreedPrivacy, setLocalAgreedPrivacy] = useState(agreedToPrivacy)
  const [localAgreedMarketing, setLocalAgreedMarketing] = useState(agreedToMarketing)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Modal states
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })
  }, [])

  const handleNext = () => {
    if (localAgreedTerms && localAgreedPrivacy) {
      setProfileData({
        agreedToTerms: localAgreedTerms,
        agreedToPrivacy: localAgreedPrivacy,
        agreedToMarketing: localAgreedMarketing,
      })
      setStep('profile-name')
    }
  }

  const Checkbox = ({ 
    label, 
    checked, 
    onChange, 
    required = false, 
    onLinkClick = null, 
    linkText = '' 
  }: {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    required?: boolean
    onLinkClick?: (() => void) | null
    linkText?: string
  }) => (
    <div 
      className={`relative flex items-start gap-4 p-5 transition-all duration-300 cursor-pointer ghost-border ${checked ? 'bg-primary/5' : 'bg-surface-container-high/50 hover:bg-surface-container-high'}`}
      onClick={() => onChange(!checked)}
    >
      <div className={`mt-1 h-5 w-5 rounded-sm flex items-center justify-center transition-all duration-300 border ${checked ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-outline-variant'}`}>
        {checked && <Check size={14} strokeWidth={3} />}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-[13px] font-semibold text-on-surface leading-snug select-none font-sans">
          {label} {required && <span className="text-primary">*</span>}
        </p>
        {onLinkClick && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onLinkClick()
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all font-clinical flex items-center gap-1"
          >
            {linkText} <ArrowRight size={10} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary opacity-80">
          <ShieldCheck size={20} strokeWidth={1.5} />
          <span className="font-clinical text-[10px] font-bold uppercase tracking-[0.2em]">Data &amp; privacy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-sans tracking-tight text-on-surface leading-tight">
          Your agreements
        </h2>
        <p className="text-on-surface-variant leading-relaxed font-sans text-sm">
          ParaCompanion stores your documentation securely and in accordance with HCPC standards. Review and confirm each agreement below to continue.
        </p>
      </header>

      <div className="space-y-4">
        <Checkbox 
          label="I'm a UK clinician or student and I agree to the terms."
          checked={localAgreedTerms}
          onChange={setLocalAgreedTerms}
          required
          onLinkClick={() => setShowTerms(true)}
          linkText="Review Terms"
        />
        <Checkbox 
          label="I've read the privacy policy and I'm happy to proceed."
          checked={localAgreedPrivacy}
          onChange={setLocalAgreedPrivacy}
          required
          onLinkClick={() => setShowPrivacy(true)}
          linkText="Review Privacy"
        />
        <Checkbox 
          label="Send the occasional update about new features."
          checked={localAgreedMarketing}
          onChange={setLocalAgreedMarketing}
        />
      </div>

      <div className="flex items-center gap-4 pt-6">
        {/* Hide back button for authenticated users — prevents welcome→consent→welcome loop */}
        {!isAuthenticated && (
          <Button variant="ghost" onClick={() => setStep('welcome')} className="w-auto">
            Back
          </Button>
        )}
        <Button 
          variant="surgical"
          onClick={handleNext} 
          disabled={!localAgreedTerms || !localAgreedPrivacy}
          className="flex-1"
          icon
        >
          Agree and continue
        </Button>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </Modal>

      <Modal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>

      <Modal 
        isOpen={showCookies} 
        onClose={() => setShowCookies(false)} 
        title="Cookie Policy"
      >
        <CookiePolicyContent />
      </Modal>
    </div>
  )
}
