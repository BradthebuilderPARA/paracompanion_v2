'use client'

import React, { useMemo } from 'react'
import { ExternalLink, Hash, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface LegalDocumentProps {
  content: string
  fullPageHref?: string
}

export function LegalDocument({ content, fullPageHref }: LegalDocumentProps) {
  // Simple parser to extract sections and render content
  const sections = useMemo(() => {
    const lines = content.split('\n')
    const extractedSections: { id: string; title: string }[] = []
    
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').trim()
        const id = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        extractedSections.push({ id, title })
      }
    })
    
    return extractedSections
  }, [content])

  const renderContent = () => {
    const lines = content.split('\n')
    let inList = false
    const listItems: string[] = []
    const rendered: React.ReactNode[] = []

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        rendered.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-4 space-y-2 text-sm text-on_surface leading-relaxed">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        listItems.length = 0
      }
      inList = false
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      // Handle Headings
      if (trimmed.startsWith('# ')) {
        flushList(index)
        rendered.push(
          <h1 key={index} className="text-3xl font-black mb-8 tracking-tight text-on_surface font-sans">
            {trimmed.replace('# ', '')}
          </h1>
        )
      } else if (trimmed.startsWith('## ')) {
        flushList(index)
        const title = trimmed.replace('## ', '')
        const id = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
        rendered.push(
          <h2 
            key={index} 
            id={id}
            className="text-lg font-bold mt-12 mb-4 tracking-wider text-primary/70 border-b border-surface_container_highest pb-2 font-sans scroll-mt-24"
          >
            {title}
          </h2>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList(index)
        rendered.push(
          <h3 key={index} className="text-sm font-bold mt-6 mb-2 tracking-widest text-on_surface font-sans">
            {trimmed.replace('### ', '')}
          </h3>
        )
      } 
      // Handle Lists
      else if (trimmed.startsWith('* ')) {
        inList = true
        listItems.push(trimmed.replace('* ', ''))
      } 
      // Handle Bold text and Paragraphs
      else if (trimmed.length > 0) {
        if (inList) {
          flushList(index)
        }
        
        // Improved Bold and Link processing
        // This is a very simple regex-based parser for **bold** and [link](url)
        const parts = trimmed.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g)
        const content = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-on_surface">{part.slice(2, -2)}</strong>
          }
          if (part.startsWith('[') && part.includes('](')) {
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
            if (linkMatch) {
              return (
                <a 
                  key={i} 
                  href={linkMatch[2]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-medium"
                >
                  {linkMatch[1]}
                </a>
              )
            }
          }
          return part
        })

        rendered.push(
          <p key={index} className="text-sm text-on_surface leading-relaxed mb-4 font-sans">
            {content}
          </p>
        )
      } else {
        if (inList) flushList(index)
      }
    })

    flushList(lines.length)
    return rendered
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Table of Contents - Surgical Style */}
      <div className="bg-surface-container-low p-4 sm:p-6 rounded-sm border-l-4 border-primary/20">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Hash size={16} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest font-clinical">Rapid Navigation</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
          {sections.map((section) => (
            <a 
              key={section.id} 
              href={`#${section.id}`}
              className="text-[12px] text-on_surface_variant hover:text-primary flex items-center gap-2 group transition-all"
            >
              <ChevronRight size={12} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              <span className="truncate">{section.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {fullPageHref && (
          <div className="absolute top-0 right-0">
            <Link 
              href={fullPageHref}
              target="_blank"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 pb-1 border-b border-primary/20 transition-all"
            >
              Open Full Page <ExternalLink size={12} strokeWidth={1.5} />
            </Link>
          </div>
        )}
        
        <article className="legal-document prose prose-sm max-w-none">
          {renderContent()}
        </article>
      </div>

      {/* Footer Meta */}
      <footer className="mt-12 pt-8 border-t border-surface_container_highest flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-clinical text-on_surface_variant/50 uppercase tracking-widest">
        <div>Version 1.0 — April 2026</div>
        <div>ParaCompanion Ltd — England & Wales No. 17058506</div>
      </footer>
    </div>
  )
}
