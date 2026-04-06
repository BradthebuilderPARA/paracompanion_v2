'use client'

import React from 'react'

export function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface selection:bg-clinical-accent/20">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <article className="prose prose-slate prose-inter max-w-none text-on_surface
          prose-headings:font-bold prose-headings:font-sans prose-headings:text-primary/70 prose-headings:tracking-tight
          prose-p:text-on_surface prose-p:leading-relaxed prose-p:font-sans prose-p:mb-6
          prose-li:text-on_surface prose-li:font-sans prose-li:mb-2
          prose-strong:text-on_surface prose-strong:font-bold
          prose-hr:border-surface_container_highest prose-hr:my-10
          ">
          {children}
        </article>
      </div>
    </div>
  )
}
