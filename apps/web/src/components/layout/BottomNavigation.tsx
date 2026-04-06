'use client';

import { Home, Stethoscope, Calendar, School, FolderOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/dashboard' },
    { label: 'Patients', icon: Stethoscope, href: '/patient' },
    { label: 'Shifts', icon: Calendar, href: '/shifts' },
    { label: 'CPD', icon: School, href: '/cpd' },
    { label: 'Docs', icon: FolderOpen, href: '/docs' },
    { label: 'Team', icon: Users, href: '/team' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[999] bg-white border-t border-slate-200 shadow-[0px_-4px_16px_rgba(0,0,0,0.08)] flex justify-center items-stretch px-4 pb-safe pt-2 min-h-[76px]">
      <div className="w-full max-w-[1400px] flex justify-around items-stretch">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex-1 flex flex-col items-center justify-center gap-1 transition-all
              ${isActive ? 'text-surgical-blue' : 'text-slate-400'}
            `}
          >
            <div className={`
              w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
              ${isActive ? 'bg-surgical-blue/10 scale-110 shadow-sm' : 'bg-transparent'}
            `}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span className={`
              font-sans text-[10px] font-bold uppercase tracking-widest
              ${isActive ? 'text-surgical-blue scale-105' : 'text-slate-500'}
            `}>
              {item.label}
            </span>
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
