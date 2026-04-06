'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { 
  LayoutDashboard, 
  Wrench, 
  BookOpen, 
  Menu, 
  X,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardEdit,
  CloudLightning,
  CloudOff,
  Cloud,
  ShieldCheck,
  RefreshCw,
  Briefcase,
  IdCard,
  User
} from 'lucide-react';

interface HeaderProps {
  variant?: 'full' | 'minimal' | 'dashboard';
}

export function Header({ variant = 'full' }: HeaderProps) {
  const pathname = usePathname();
  const { user, loading, rerollAvatar } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);

  const syncStatus = 'online' as any; // Connected via state in future

  // Close menus on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: close menus on route change
    setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: close menus on route change
    setIsProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!isProfileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isProfileOpen]);

  const handleReroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRerolling(true);
    await rerollAvatar();
    setTimeout(() => setIsRerolling(false), 500);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
    { name: 'Support tools', href: '/tools', icon: <Wrench size={20} strokeWidth={1.5} /> },
    { name: 'CPD Hub', href: '/cpd', icon: <BookOpen size={20} strokeWidth={1.5} /> },
    { name: 'My Patient', href: '/patient/active', icon: <ClipboardEdit size={20} strokeWidth={1.5} /> },
  ];

  return (
    <>
      <header className="fixed top-0 z-50 bg-white border-b border-outline-variant/10 w-full px-6 py-4 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-8">
          
          {/* Left: Branding */}
          <Link href="/dashboard" className="no-underline shrink-0 flex items-center gap-3">
            <BrandLogo size="md" showText={true} />
          </Link>

          {/* Right: Operational Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Airlock Sync Indicator */}
            {pathname?.startsWith('/dashboard') && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[0.25rem] bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                {syncStatus === 'online' && <Cloud size={16} strokeWidth={2} className="text-adult-emerald" />}
                {syncStatus === 'syncing' && <CloudLightning size={16} strokeWidth={2} className="text-primary animate-pulse" />}
                {syncStatus === 'offline' && <CloudOff size={16} strokeWidth={2} className="text-emergency-red" />}
                <span className="hidden sm:inline font-sans text-[9px] tracking-[0.15em] uppercase font-black text-on-surface-variant">
                  {syncStatus}
                </span>
              </div>
            )}

            {/* Profile / Identity Card */}
            <div className="relative" data-profile-menu>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-[0.25rem] bg-surface-container-low border border-outline-variant/10 overflow-hidden hover:border-surgical-blue/30 transition-all flex items-center justify-center group"
                aria-label="Clinician Identity"
              >
                {user?.avatar_seed ? (
                  <img 
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user.avatar_seed}&backgroundColor=f8fafc&shapeColor=0066FF`} 
                    alt="Clinical Identity"
                    className="w-full h-full p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <User size={20} strokeWidth={1.5} className="text-on-surface-variant" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute top-[130%] right-0 w-[280px] bg-white rounded-[0.25rem] shadow-[0px_16px_48px_rgba(0,0,0,0.12)] border border-outline-variant/20 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Clinician Identity Card */}
                  <div className="p-5 border-b border-outline-variant/10 bg-surface-container-lowest">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative group/avatar">
                        <div className="w-14 h-14 bg-white border border-outline-variant/20 rounded-[0.125rem] overflow-hidden p-1 shadow-sm">
                          <img 
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user?.avatar_seed || 'default'}&backgroundColor=ffffff&shapeColor=0066FF`} 
                            alt="Identity"
                          />
                        </div>
                        <button 
                          onClick={handleReroll}
                          className={`absolute -bottom-1 -right-1 p-1.5 bg-white border border-outline-variant/20 rounded-full shadow-lg text-surgical-blue hover:scale-110 transition-all ${isRerolling ? 'animate-spin' : ''}`}
                          title="Reroll Pattern"
                        >
                          <RefreshCw size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-black text-lg text-on-surface truncate leading-tight">
                          {user?.display_name || 'Clinician'}
                        </p>
                        <p className="font-sans text-[11px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">
                          {user?.clinician_role || 'Role Pending'}
                        </p>
                        {user?.hcpc_number && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <ShieldCheck size={12} className="text-adult-emerald shrink-0" />
                            <span className="clinical-data text-[10px] text-on-surface-variant font-bold tracking-wider">
                              HCPC: {user.hcpc_number}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/80 font-sans font-medium bg-surface-container-low px-2 py-1 rounded-[0.125rem]">
                        <Briefcase size={12} />
                        <span className="truncate">{user?.employer_name || 'No Affiliation Set'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="bg-surgical-blue/5 text-surgical-blue text-[8px] font-black uppercase py-0.5 px-2 rounded-full tracking-widest border border-surgical-blue/10">
                          {user?.subscription_tier || 'Free'} Tier
                        </span>
                        <Link href="/pricing" className="text-surgical-blue text-[9px] font-black uppercase tracking-widest hover:underline">
                          Choose Tier
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Professional Tools */}
                  <div className="p-3 bg-white">
                    <p className="px-3 py-2 text-on-surface-variant text-[9px] font-black uppercase tracking-widest">Settings</p>
                    <Link href="/account/identity" className="flex items-center gap-3 px-3 py-2.5 no-underline text-on-surface hover:bg-surface-container-lowest transition-colors rounded-[0.125rem] text-[13px] font-bold font-sans">
                      <IdCard size={16} strokeWidth={2} className="text-on-surface-variant/70" />
                      Professional ID
                    </Link>
                    <Link href="/settings/clinical" className="flex items-center gap-3 px-3 py-2.5 no-underline text-on-surface hover:bg-surface-container-lowest transition-colors rounded-[0.125rem] text-[13px] font-bold font-sans">
                      <Settings size={16} strokeWidth={2} className="text-on-surface-variant/70" />
                      Clinical Config
                    </Link>
                    <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 no-underline text-on-surface hover:bg-surface-container-lowest transition-colors rounded-[0.125rem] text-[13px] font-bold font-sans">
                      <HelpCircle size={16} strokeWidth={2} className="text-on-surface-variant/70" />
                      Help & Support
                    </Link>
                  </div>

                  <div className="p-3 border-t border-outline-variant/10 bg-red-50/30">
                    <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 border-none bg-transparent cursor-pointer text-emergency-red font-black text-[11px] tracking-widest uppercase rounded-[0.125rem] hover:bg-red-50 transition-colors transition-all">
                      <LogOut size={16} strokeWidth={2.5} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-2 text-on-surface hover:opacity-70 transition-opacity"
              aria-label="Open clinical menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Side Command Center (Full Height Drawer) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-on-surface/40 backdrop-blur-[4px] flex justify-end"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full max-w-[360px] h-full bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.12)] p-8 flex flex-col animate-[slideIn_0.3s_cubic-bezier(0.4,0,0.2,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-12">
              <BrandLogo size="md" showText={true} />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-on-surface-variant hover:opacity-70 transition-opacity"
                aria-label="Close menu"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-on-surface-variant uppercase tracking-[0.2em] mb-6 text-[10px] font-black">Menu</p>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3.5 rounded-[0.125rem] no-underline flex items-center gap-4 transition-all duration-200 ${
                        isActive 
                          ? 'bg-surgical-blue/5 text-surgical-blue border-l-4 border-surgical-blue pl-3' 
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-70'}`}>{link.icon}</span>
                      <span className={`text-[15px] ${isActive ? 'font-black' : 'font-bold font-sans'}`}>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto space-y-4">
              <div className="p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-[0.125rem]">
                <p className="text-on-surface-variant text-[9px] font-black uppercase tracking-[0.2em] mb-3">Sync Status</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white border border-outline-variant/20 rounded-[0.125rem] flex items-center justify-center text-adult-emerald shadow-sm">
                    <Cloud size={24} strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-on-surface font-black text-[13px] leading-tight">Airlock Active</p>
                    <p className="text-on-surface-variant text-[11px] font-medium">All data sanitised</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={async () => {
                  const supabase = (await import('@/utils/supabase/client')).createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="w-full flex items-center justify-center gap-3 py-4 border-2 border-emergency-red/10 text-emergency-red font-black text-[11px] tracking-widest uppercase rounded-[0.125rem] hover:bg-red-50 transition-all active:scale-[0.98]"
              >
                <LogOut size={16} strokeWidth={2.5} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content jump */}
      <div className="h-[76px]" />

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
