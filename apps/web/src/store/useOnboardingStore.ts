import { create } from 'zustand'

export type OnboardingStep = 'welcome' | 'consent' | 'profile-name' | 'profile-role' | 'complete'

export interface OnboardingState {
  step: OnboardingStep
  email: string
  displayName: string
  clinicianRole: string | null
  registrationNumber: string
  trustId: string | null
  universityId: string | null
  onboardingPath: 'clinical' | 'non-clinical' | 'student' | null
  agreedToTerms: boolean
  agreedToPrivacy: boolean
  agreedToMarketing: boolean
  
  // Actions
  setStep: (step: OnboardingStep) => void
  setEmail: (email: string) => void
  setProfileData: (data: Partial<OnboardingState>) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 'welcome',
  email: '',
  displayName: '',
  clinicianRole: null,
  registrationNumber: '',
  trustId: null,
  universityId: null,
  onboardingPath: null,
  agreedToTerms: false,
  agreedToPrivacy: false,
  agreedToMarketing: false,

  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setProfileData: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({
    step: 'welcome',
    email: '',
    displayName: '',
    clinicianRole: null,
    registrationNumber: '',
    trustId: null,
    universityId: null,
    onboardingPath: null,
    agreedToTerms: false,
    agreedToPrivacy: false,
    agreedToMarketing: false,
  }),
}))
