'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, Check, Info, X, Loader2, Landmark, GraduationCap } from 'lucide-react'

interface LookupItem {
  id: string
  name: string
  subtitle?: string
  short_code?: string
}

interface SearchableLookupProps {
  type: 'trust' | 'university'
  onSelect: (id: string | null) => void
  selectedId: string | null
  label: string
  placeholder: string
  explanation: string
}

export function SearchableLookup({ type, onSelect, selectedId, label, placeholder, explanation }: SearchableLookupProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LookupItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedName, setSelectedName] = useState('')
  const supabase = createClient()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch initial selected name if id exists
  useEffect(() => {
    async function fetchSelected() {
      if (!selectedId) {
        setSelectedName('')
        return
      }

      if (type === 'trust') {
        const { data, error } = await supabase
          .from('ambulance_trusts')
          .select('trust_name')
          .eq('id', selectedId)
          .single()
        if (error) {
          console.error('Error fetching trust:', error)
          return
        }
        if (typeof data?.trust_name === 'string') {
          setSelectedName(data.trust_name)
        }
      } else {
        const { data, error } = await supabase
          .from('universities')
          .select('uni_name')
          .eq('id', selectedId)
          .single()
        if (error) {
          console.error('Error fetching university:', error)
          return
        }
        if (typeof data?.uni_name === 'string') {
          setSelectedName(data.uni_name)
        }
      }
    }
    fetchSelected()
  }, [selectedId, type, supabase])

  // Search logic
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      let items: LookupItem[] = []

      if (type === 'trust') {
        const { data, error } = await supabase
          .from('ambulance_trusts')
          .select('id, trust_name, short_code, region')
          .or(`trust_name.ilike.%${searchQuery}%,short_code.ilike.%${searchQuery}%,region.ilike.%${searchQuery}%`)
          .limit(10)

        if (error) throw error

        if (data) {
          items = data.map((item) => ({
            id: item.id,
            name: item.trust_name,
            short_code: item.short_code ?? undefined,
            subtitle: item.region,
          }))
        }
      } else {
        const { data, error } = await supabase
          .from('universities')
          .select('id, uni_name, short_name, country')
          .or(`uni_name.ilike.%${searchQuery}%,short_name.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%`)
          .limit(10)

        if (error) throw error

        if (data) {
          items = data.map((item) => ({
            id: item.id,
            name: item.uni_name,
            short_code: item.short_name ?? undefined,
            subtitle: item.country,
          }))
        }
      }

      setResults(items)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [type, supabase])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && !selectedName) {
        performSearch(query)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, selectedName, performSearch])

  const handleSelect = (item: LookupItem) => {
    onSelect(item.id)
    setSelectedName(item.name)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const handleClear = () => {
    onSelect(null)
    setSelectedName('')
    setQuery('')
    setResults([])
  }

  return (
    <div className="space-y-4" ref={wrapperRef}>
      <div className="space-y-2">
        <label className="block font-clinical text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
          {label}
        </label>
        
        <div className="relative group">
          <div className={`ghost-border transition-all duration-300 ${isOpen ? 'ring-1 ring-primary/30 shadow-lg' : ''}`}>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-outline/50 group-hover:text-primary transition-colors">
                {type === 'trust' ? <Landmark size={18} strokeWidth={1.5} /> : <GraduationCap size={18} strokeWidth={1.5} />}
              </div>
              
              <input 
                type="text"
                placeholder={selectedName || placeholder}
                className={`w-full bg-surface-container-high/30 border-none focus:ring-0 pl-12 pr-12 py-4 font-sans text-on-surface placeholder:text-outline/70 ${selectedName ? 'font-medium' : ''}`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedName('')
                  setIsOpen(true)
                }}
                onFocus={() => { setIsOpen(true); setIsFocused(true) }}
                onBlur={() => { if (!selectedName) setIsFocused(false) }}
              />

              <div className="absolute right-4 flex items-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin text-primary" />}
                {selectedName && (
                  <button 
                    onClick={handleClear}
                    className="p-1 hover:bg-primary/10 rounded-[0.25rem] text-outline/50 hover:text-primary transition-all"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
                {!selectedName && !loading && <Search size={16} className="text-outline/30" />}
              </div>
            </div>
          </div>

          {/* Results Dropdown */}
          {isOpen && (query.length >= 2 || results.length > 0) && (
            <div className="absolute z-50 w-full mt-2 bg-surface-container-high border border-outline/10 shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {results.length > 0 ? (
                <div className="max-h-[50vh] sm:max-h-[300px] overflow-y-auto py-2">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 text-left transition-colors group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-on-surface leading-tight group-hover/item:text-primary transition-colors">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          {item.short_code && (
                            <span className="text-[9px] font-clinical font-black tracking-widest px-1.5 py-0.5 bg-primary/10 text-primary rounded-[2px] uppercase">
                              {item.short_code}
                            </span>
                          )}
                          <span className="text-[10px] text-on-surface-variant font-sans opacity-60">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                      {selectedId === item.id && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 && !loading ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-[11px] font-clinical uppercase tracking-widest text-on-surface-variant opacity-50">
                    No matching {type} found
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Explanation Box — visible only after focus or when a selection is made */}
      {(isFocused || !!selectedName) && (
        <div className="flex gap-3 p-4 bg-primary/5 border border-primary/10 rounded-sm animate-in fade-in duration-300">
          <Info size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[11px] text-on-surface leading-normal opacity-80">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
