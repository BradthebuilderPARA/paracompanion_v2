'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 mt-auto px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:gap-5 items-center text-center">
        {/* Row 1: Brand + Copyright — stacks on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-on-surface-variant font-sans text-sm">
          <Link href="/dashboard" className="no-underline flex items-center">
            <span className="font-extrabold text-adult-emerald">Para</span>
            <span className="font-extrabold text-on-surface">Companion</span>
          </Link>
          
          {/* Responsive: Dividers hidden on mobile, shown on sm+ */}
          <span className="hidden sm:inline text-outline-variant/40 select-none pointer-events-none">|</span>
          <span>© {currentYear}</span>
          <span className="hidden sm:inline text-outline-variant/40 select-none pointer-events-none">|</span>
          <span>Company No. 17058506</span>
          
          {/* Responsive: About/Contact stack below on mobile */}
          <span className="hidden sm:inline text-outline-variant/40 select-none pointer-events-none">|</span>
          <div className="flex gap-3 sm:gap-4">
            <Link href="/about" className="no-underline text-on-surface-variant font-medium hover:text-on-surface transition-colors">
              About the project
            </Link>
            <Link href="/contact" className="no-underline text-on-surface-variant font-medium hover:text-on-surface transition-colors">
              Contact me
            </Link>
          </div>
        </div>

        {/* Row 2: Legal links — wrap naturally */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-on-surface-variant font-sans text-xs">
          <Link href="/privacy-policy" className="no-underline text-on-surface-variant hover:text-on-surface transition-colors font-medium">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="no-underline text-on-surface-variant hover:text-on-surface transition-colors font-medium">
            Terms of Service
          </Link>
          <Link href="/cookie-policy" className="no-underline text-on-surface-variant hover:text-on-surface transition-colors font-medium">
            Cookie Policy
          </Link>
          <Link href="/billing-terms" className="no-underline text-on-surface-variant hover:text-on-surface transition-colors font-medium">
            Billing Terms
          </Link>
          <Link href="/status" className="no-underline text-on-surface-variant hover:text-on-surface transition-colors font-medium">
            System status
          </Link>
        </div>
      </div>
    </footer>
  );
}
