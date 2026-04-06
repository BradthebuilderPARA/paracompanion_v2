'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { HelpCircle } from 'lucide-react'

export function WelcomeStep() {
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const setEmail = useOnboardingStore((state) => state.setEmail)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Sign-in link sent. Check your inbox to continue.')
      setEmail(emailInput)
    }
    setLoading(false)
  }

  const handleDevLogin = async (type: 'free' | 'learner' | 'practitioner' | 'admin') => {
    setLoading(true)
    const email = `test.${type}@paracompanion.dev`
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'TestPass123!',
    })
    
    if (error) {
      setMessage(`Dev Login Error: ${error.message}`)
    } else {
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-tight text-on-surface">
          Clinician Setup
        </h1>
        <p className="font-sans text-on-surface-variant leading-relaxed max-w-lg">
          ParaCompanion is your private documentation instrument. Enter your email address to receive a secure sign-in link.
        </p>
      </header>

      <div className="space-y-8">
        <form onSubmit={handleMagicLink} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
              Email address
            </label>
            <div className="ghost-border transition-all duration-200">
              <input 
                id="email"
                type="email"
                placeholder="yourname@nhs.net"
                className="w-full bg-surface-container-high border-none focus:ring-0 px-4 py-4 font-sans text-on-surface placeholder:text-outline/50"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" variant="surgical" loading={loading} icon>
            Send sign-in link
          </Button>
        </form>

        {message && (
          <p className="text-xs font-clinical font-bold uppercase tracking-widest text-primary p-4 bg-primary/5 border border-primary/10 rounded-sm text-center">
            {message}
          </p>
        )}

        {/* Action Footer */}
        <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button className="font-clinical text-[9px] font-bold uppercase tracking-[0.2em] text-outline hover:text-primary transition-colors flex items-center gap-2">
            <HelpCircle size={14} strokeWidth={1.5} />
            Trouble signing in?
          </button>
          <a href="#" className="font-clinical text-[9px] font-bold uppercase tracking-[0.2em] text-primary border-b border-transparent hover:border-primary transition-all">
            Contact support
          </a>
        </div>

        {/* Dev Cluster — development only, never visible in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-16 pt-8 border-t border-outline-variant/5">
            <div className="flex justify-center mb-6">
              <span className="font-clinical text-[8px] uppercase tracking-[0.3em] text-outline/40 px-2 py-1 border border-outline-variant/10">
                System Protocol // Dev Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <Button variant="secondary" onClick={() => handleDevLogin('free')} loading={loading}>Free Tier</Button>
              <Button variant="secondary" onClick={() => handleDevLogin('practitioner')} loading={loading}>Practitioner</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
