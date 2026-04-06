'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Rocket, ExternalLink } from 'lucide-react'

export function CompleteStep() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 py-10 flex flex-col items-center text-center">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce duration-[2000ms]">
        <CheckCircle2 size={48} strokeWidth={1.5} />
      </div>

      <header className="space-y-4 max-w-md">
        <h2 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight text-on-surface leading-tight">
          You're all set
        </h2>
        <p className="text-on-surface-variant leading-relaxed font-sans text-sm">
          Your ParaCompanion profile has been created successfully. You can now access all clinical features on your mobile device.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm pt-4">
        <Button
          variant="surgical"
          onClick={() => window.location.href = '/dashboard'}
          className="w-full h-16 text-lg"
          icon
        >
          Enter Command Centre
        </Button>
        
        <p className="text-[10px] uppercase font-clinical tracking-[0.2em] text-on-surface-variant mt-4 leading-relaxed font-bold">
          Your profile is active across all devices. Syncing now.
        </p>
      </div>

      <div className="pt-12 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex flex-col items-center gap-1">
          <Rocket size={20} />
          <span className="text-[8px] font-clinical font-bold uppercase tracking-widest">v3.0 Live</span>
        </div>
      </div>
    </div>
  )
}
