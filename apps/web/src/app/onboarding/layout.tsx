import React from 'react'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-surface-container-low p-[0.35rem]">
        <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-12 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          {children}
        </div>
      </div>

      {/* Background Ornamentation (Architectural Detail) */}
      <div className="fixed bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <svg className="w-full h-full text-primary fill-current" viewBox="0 0 100 100">
          <path d="M0 0h1v100H0zM10 0h1v100h-1zM20 0h1v100h-1zM30 0h1v100h-1zM40 0h1v100h-1zM50 0h1v100h-1zM60 0h1v100h-1zM70 0h1v100h-1zM80 0h1v100h-1zM90 0h1v100h-1z" />
        </svg>
      </div>
    </main>
  )
}
