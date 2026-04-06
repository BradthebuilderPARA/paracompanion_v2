'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { UserCircle } from 'lucide-react'

export function ProfileNameStep() {
  const { setStep, setProfileData, displayName } = useOnboardingStore()
  const [localDisplayName, setLocalDisplayName] = useState(displayName)

  const handleNext = () => {
    if (localDisplayName.trim()) {
      setProfileData({ displayName: localDisplayName.trim() })
      setStep('profile-role')
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary opacity-80">
          <UserCircle size={20} strokeWidth={1.5} />
          <span className="font-clinical text-[10px] font-bold uppercase tracking-[0.2em]">Step 1 of 2</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-sans tracking-tight text-on-surface leading-tight">
          Your preferred name
        </h2>
        <p className="text-on-surface-variant leading-relaxed font-sans text-sm">
          ParaCompanion will use this name in your handover records and CPD logs.
        </p>
      </header>

      <div className="space-y-2">
        <label htmlFor="display-name" className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
          Preferred name
        </label>
        <div className="ghost-border transition-all duration-200">
          <input
            id="display-name"
            type="text"
            placeholder="e.g. Adam or Paramedic Jones"
            className="w-full bg-surface-container-high/50 border-none focus:ring-0 px-4 py-4 font-sans text-on-surface placeholder:text-outline/50"
            value={localDisplayName}
            onChange={(e) => setLocalDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            autoFocus
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button variant="ghost" onClick={() => setStep('consent')} className="w-auto">
          Back
        </Button>
        <Button
          variant="surgical"
          onClick={handleNext}
          disabled={!localDisplayName.trim()}
          className="flex-1"
          icon
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
