import React from 'react'
import { ArrowRight } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'surgical' | 'outline'
  loading?: boolean
  icon?: boolean
}

export function Button({ 
  variant = 'primary', 
  loading = false, 
  icon = false,
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const base = "w-full min-h-[3rem] px-6 rounded-sm font-label text-[0.75rem] uppercase font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
  
  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    surgical: "surgical-gradient text-white hover:opacity-90",
    secondary: "bg-surface-container-highest text-on-surface hover:bg-outline-variant/30",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/5",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
  }

  return (
    <button 
      className={`${base} ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-wait' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {children}
          {icon && <ArrowRight size={16} strokeWidth={1.5} className="ml-1" />}
        </>
      )}
    </button>
  )
}
