'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore, OnboardingState } from '@/store/useOnboardingStore'
import { Stethoscope } from 'lucide-react'
import { SearchableLookup } from '../components/SearchableLookup'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function ProfileRoleStep() {
  const { 
    setStep, setProfileData,
    displayName, clinicianRole, registrationNumber,
    trustId, universityId, onboardingPath,
    agreedToMarketing
  } = useOnboardingStore()

  const [localPath, setLocalPath] = useState<OnboardingState['onboardingPath']>(onboardingPath || 'clinical')
  const [localRole, setLocalRole] = useState(clinicianRole || '')
  const [localReg, setLocalReg] = useState(registrationNumber)
  const [localTrustId, setLocalTrustId] = useState(trustId)
  const [localUniId, setLocalUniId] = useState(universityId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()
  const router = useRouter()

  const handleComplete = async () => {
    if (!localPath) return

    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    try {
      // Save profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          clinician_role: localRole || null,
          hcpc_number: localReg,
          registration_type: localRole === 'paramedic' ? 'hcpc' : 'other',
          role_category: localPath,
          trust_id: localTrustId,
          university_id: localUniId,
          onboarding_complete: true,
          terms_version: 'v1.3',
          privacy_version: 'v1.3',
          accepted_terms_at: new Date().toISOString(),
          accepted_privacy_at: new Date().toISOString(),
          newsletter_opt_in: agreedToMarketing,
        })
        .eq('id', user.id)

      if (profileError) {
        throw profileError
      }

      // Log consent
      const { error: consentError } = await supabase
        .from('consent_logs')
        .insert({
          user_id: user.id,
          consent_version: 'v1.3',
          terms_version: 'v1.3',
          privacy_version: 'v1.3',
          marketing_consent: agreedToMarketing,
          cpd_consent: true,
          agreed_at: new Date().toISOString(),
        })

      if (consentError) {
        throw consentError
      }

      setProfileData({
        onboardingPath: localPath,
        clinicianRole: localRole || null,
        registrationNumber: localReg,
        trustId: localTrustId,
        universityId: localUniId,
      })

      setStep('complete')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(`Could not save your profile. ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const PathOption = ({ id, label, description }: { id: string; label: string; description: string }) => (
    <div
      className={`p-4 transition-all duration-300 cursor-pointer ghost-border ${localPath === id ? 'bg-primary text-white shadow-sm border-primary' : 'bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface'}`}
      onClick={() => {
        setLocalPath(id as OnboardingState['onboardingPath'])
        if (id !== localPath) {
          setLocalRole('')
          setLocalTrustId(null)
          setLocalUniId(null)
        }
      }}
    >
      <p className="font-bold text-[13px] leading-tight font-sans tracking-tight">{label}</p>
      <p className={`text-[9px] mt-1 uppercase font-clinical tracking-widest ${localPath === id ? 'text-white/70' : 'text-on-surface-variant/60'}`}>
        {description}
      </p>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 pb-8">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary opacity-80">
          <Stethoscope size={20} strokeWidth={1.5} />
          <span className="font-clinical text-[10px] font-bold uppercase tracking-[0.2em]">Step 2 of 2</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-sans tracking-tight text-on-surface leading-tight">
          Your role
        </h2>
        <p className="text-on-surface-variant leading-relaxed font-sans text-sm">
          Select your primary role. ParaCompanion uses this to format your handover records. All fields below the role selection are optional and can be completed later in your account settings.
        </p>
      </header>

      {/* Path selection */}
      <div className="space-y-3">
        <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Primary focus
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PathOption id="clinical" label="Clinical" description="Paramedic / EMT / Nurse" />
          <PathOption id="non-clinical" label="Non-Clinical" description="Police / Fire / Dispatch" />
          <PathOption id="student" label="Student" description="Uni / Academy" />
        </div>
      </div>

      {/* Dynamic fields — all optional */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

        {localPath === 'clinical' && (
          <>
            <div className="space-y-2">
              <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                Specific role <span className="normal-case font-sans font-normal text-outline/50 tracking-normal text-[11px]">— optional</span>
              </label>
              <select
                className="w-full bg-surface-container-high/50 ghost-border px-4 py-4 font-sans text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                value={localRole}
                onChange={(e) => setLocalRole(e.target.value)}
              >
                <option value="">Select your role...</option>
                <option value="paramedic">Paramedic</option>
                <option value="specialist_paramedic">Specialist Paramedic</option>
                <option value="emt">EMT / AAP</option>
                <option value="nurse">Nurse</option>
                <option value="doctor">Doctor</option>
                <option value="eca">ECA / Support</option>
              </select>
            </div>

            <SearchableLookup
              type="trust"
              label="Ambulance Trust / Employer"
              placeholder="Search for your Trust (e.g. LAS, EMAS)..."
              selectedId={localTrustId}
              onSelect={setLocalTrustId}
              explanation="ParaCompanion uses your Trust to apply region-specific handover formatting."
            />
            <button
              onClick={() => setLocalTrustId(null)}
              className="text-[10px] font-clinical font-bold uppercase tracking-widest text-outline/50 hover:text-primary transition-colors"
            >
              Skip →
            </button>

            {localRole === 'paramedic' && (
              <div className="space-y-2 animate-in fade-in scale-95 duration-500">
                <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                  HCPC Registration Number <span className="normal-case font-sans font-normal text-outline/50 tracking-normal text-[11px]">— optional, add in account settings after setup</span>
                </label>
                <div className="ghost-border">
                  <input
                    type="text"
                    placeholder="e.g. PA123456"
                    className="w-full bg-surface-container-high/50 border-none focus:ring-0 px-4 py-4 font-sans text-on-surface placeholder:text-outline/50"
                    value={localReg}
                    onChange={(e) => setLocalReg(e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {localPath === 'non-clinical' && (
          <>
            <div className="space-y-2">
              <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                Specific role <span className="normal-case font-sans font-normal text-outline/50 tracking-normal text-[11px]">— optional</span>
              </label>
              <div className="ghost-border">
                <input
                  type="text"
                  placeholder="e.g. Police Officer, Firefighter, Dispatcher"
                  className="w-full bg-surface-container-high/50 border-none focus:ring-0 px-4 py-4 font-sans text-on-surface placeholder:text-outline/50"
                  value={localRole}
                  onChange={(e) => setLocalRole(e.target.value)}
                />
              </div>
            </div>

            <SearchableLookup
              type="trust"
              label="Service / Employer"
              placeholder="Search for your service or skip..."
              selectedId={localTrustId}
              onSelect={setLocalTrustId}
              explanation="ParaCompanion uses your service to apply relevant workflow formatting."
            />
            <button
              onClick={() => setLocalTrustId(null)}
              className="text-[10px] font-clinical font-bold uppercase tracking-widest text-outline/50 hover:text-primary transition-colors"
            >
              Skip →
            </button>
          </>
        )}

        {localPath === 'student' && (
          <>
            <SearchableLookup
              type="university"
              label="University / Institution"
              placeholder="Search for your Uni (e.g. UWE, ARU)..."
              selectedId={localUniId}
              onSelect={setLocalUniId}
              explanation="ParaCompanion uses your institution to provide academic-specific documentation features."
            />
            <button
              onClick={() => setLocalUniId(null)}
              className="text-[10px] font-clinical font-bold uppercase tracking-widest text-outline/50 hover:text-primary transition-colors"
            >
              Skip →
            </button>

            <div className="space-y-2">
              <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                Student focus <span className="normal-case font-sans font-normal text-outline/50 tracking-normal text-[11px]">— optional</span>
              </label>
              <select
                className="w-full bg-surface-container-high/50 ghost-border px-4 py-4 font-sans text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                value={localRole}
                onChange={(e) => setLocalRole(e.target.value)}
              >
                <option value="">Select your focus...</option>
                <option value="student_paramedic">Student Paramedic</option>
                <option value="student_nurse">Student Nurse</option>
                <option value="student_doctor">Medical Student</option>
                <option value="aap_learner">AAP Learner</option>
                <option value="other_student">Other Healthcare Student</option>
              </select>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs font-clinical font-bold uppercase tracking-widest text-red-600 p-4 bg-red-50 border border-red-100 rounded-sm text-center">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-4">
        <Button variant="ghost" onClick={() => setStep('profile-name')} className="w-auto">
          Back
        </Button>
        <Button
          variant="surgical"
          onClick={handleComplete}
          loading={loading}
          disabled={!localPath}
          className="flex-1"
          icon
        >
          Complete setup
        </Button>
      </div>
    </div>
  )
}
