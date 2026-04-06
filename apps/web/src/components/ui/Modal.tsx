'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Glassmorphism Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/20 backdrop-blur-[20px] transition-opacity duration-500"
        onClick={onClose}
      />
      
      {/* Responsive: Modal scales padding on mobile */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-container-lowest rounded-[0.25rem] shadow-[0px_12px_32px_rgba(25,28,30,0.06)] overflow-hidden animate-in zoom-in-95 fade-in duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-surface-container-low/40">
          <h3 className="text-base sm:text-lg font-bold font-sans text-on-surface tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-[0.25rem] hover:bg-surface-container-highest transition-colors text-on-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Responsive: Content padding reduces on mobile */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 font-sans leading-relaxed text-on-surface">
          {children}
        </div>

        {/* Footer — close button meets 48px touch target */}
        <div className="p-3 sm:p-4 bg-surface-container-low/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 min-h-[48px] bg-on-surface text-surface font-sans text-sm font-semibold rounded-[0.25rem] hover:bg-on-surface/90 transition-all active:opacity-80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
