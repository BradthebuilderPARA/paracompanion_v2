'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { ActivePatientBanner } from '@/components/dashboard/ActivePatientBanner';
import { ShiftAwareness } from '@/components/dashboard/ShiftAwareness';
import { QuickAccessGrid } from '@/components/dashboard/QuickAccessGrid';
import { LearningFeed } from '@/components/dashboard/LearningFeed';
import { CrewConnectivity } from '@/components/dashboard/CrewConnectivity';
import { CardiacFAB } from '@/components/dashboard/CardiacFAB';
import { BottomNavigation } from '@/components/layout/BottomNavigation';

export default function DashboardHome() {
  const { user, loading } = useUser();
  const [isPatientActive, setIsPatientActive] = useState(true);

  if (loading) {
    return (
      <div className="flex-1 bg-surface min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-surgical-blue/20 border-t-surgical-blue rounded-full animate-spin" />
      </div>
    );
  }

  const userName = user?.display_name || 'Clinician';
  const userRole = (user?.clinician_role?.toLowerCase().includes('student') ? 'student' : 'practitioner') as 'practitioner' | 'student';
  const userTier = user?.subscription_tier || 'free';

  return (
    <div className="flex-1 bg-surface min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-12 pb-32">
        
        {/* Absolute Top: Active Patient Interceptor */}
        {isPatientActive && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <ActivePatientBanner 
              onEndSession={() => setIsPatientActive(false)}
            />
          </div>
        )}

        {/* Hero Display Section - Hidden during active sessions to remove clutter */}
        {!isPatientActive && (
          <section className="py-12 border-b border-outline-variant/10 mb-12 animate-in fade-in slide-in-from-top-2 duration-700">
            <h2 className="text-6xl md:text-8xl font-sans font-light tracking-tighter leading-[0.85] text-on-surface">
              Good Evening, <span className="text-surgical-blue font-black tracking-tight">{userName}.</span>
            </h2>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context (4 cols) */}
          <div className="lg:col-span-4 space-y-12">
            <ShiftAwareness role={userRole} />
            <CrewConnectivity />
          </div>

          {/* Right Column: Operations (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <QuickAccessGrid 
              isPatientActive={isPatientActive} 
              tier={userTier}
              role={userRole}
            />
            
            {/* Learning Feed (Progressive Disclosure) */}
            {!isPatientActive && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <LearningFeed />
              </div>
            )}
          </div>
        </div>
      </main>

      <CardiacFAB />
      <BottomNavigation />
    </div>
  );
}
