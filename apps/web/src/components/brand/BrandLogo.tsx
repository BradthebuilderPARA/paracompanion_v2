'use client';

import Image from 'next/image';
import { tokens } from '@/lib/tokens';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'label-sm' },
  md: { icon: 40, text: 'label-md' },
  lg: { icon: 56, text: 'label-lg' },
  xl: { icon: 72, text: 'headline-sm' },
};

export function BrandLogo({ size = 'md', showText = false, className = '' }: BrandLogoProps) {
  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ cursor: 'pointer' }}>
      <div 
        style={{ 
          width: currentSize.icon, 
          height: currentSize.icon, 
          position: 'relative',
          flexShrink: 0 
        }}
      >
        <Image
          src="/logo.svg"
          alt="ParaCompanion Logo"
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>
      
      {showText && (
        <span 
          style={{ 
            fontFamily: 'var(--font-sans)', // Inter
            fontWeight: 800, // Extra bold for distance visibility
            letterSpacing: '-0.03em',
            fontSize: size === 'sm' ? '1.125rem' : size === 'md' ? '1.25rem' : size === 'lg' ? '1.75rem' : '2.25rem',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <span style={{ color: '#059669' }}>Para</span>
          <span style={{ color: tokens.color.on_surface }}>Companion</span>
        </span>
      )}
    </div>
  );
}
