'use client'

import React, { useEffect, useState } from 'react'
import { WelcomeStep } from './steps/Welcome'
import { ConsentStep } from './steps/Consent'
import { ProfileNameStep } from './steps/ProfileName'
import { ProfileRoleStep } from './steps/ProfileRole'
import { CompleteStep } from './steps/Complete'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const { step, setStep } = useOnboardingStore()
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session && step === 'welcome') {
        setStep('consent')
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-accent border-t-transparent" />
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeStep />
      case 'consent':
        return <ConsentStep />
      case 'profile-name':
        return <ProfileNameStep />
      case 'profile-role':
        return <ProfileRoleStep />
      case 'complete':
        return <CompleteStep />
      default:
        return <WelcomeStep />
    }
  }

  return (
    <div className="min-h-[400px]">
      {renderStep()}
    </div>
  )
}
