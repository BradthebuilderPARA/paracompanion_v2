'use client';

import { useRouter } from 'next/navigation';
import { BrandLogo } from '@repo/ui/brand-logo';
import { STRINGS } from '@paracompanion/strings';
import { useClinicalSessionStore } from '../../store/clinical';
import { DemographicsForm } from './components/DemographicsForm';
import { NEWS2Module } from './components/NEWS2Module';
import { PaediatricAssessmentModule } from './components/PaediatricAssessmentModule';
import { MOEWSModule } from './components/MOEWSModule';
import { TraumaModule } from './components/TraumaModule';
import { ArrestModule } from './components/ArrestModule';
import { ChevronRight } from 'lucide-react';

export default function PatientDashboard() {
  const router = useRouter();
  const { activeSession, activeModule, startSession, setActiveModule, endSession } = useClinicalSessionStore();

  return (
    <main className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface pb-24">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <BrandLogo size={32} priority />
          <span className="text-xl font-bold tracking-tight font-headline">
            <span className="text-primary">Clinical</span>
            <span className="text-on-surface"> {STRINGS.PATIENT.DASHBOARD_HEADER}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-outline">
          {STRINGS.PATIENT.MODULE_LABEL}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {!activeSession ? (
          <DemographicsForm onStartSession={startSession} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-8">
              <button 
                onClick={() => endSession()}
                className="text-on-surface-variant hover:text-on-surface font-headline font-semibold flex items-center gap-1"
              >
                Patient Session
              </button>
              <ChevronRight size={16} className="text-outline" />
              <span className="text-primary font-headline font-bold">
                {activeModule === 'NEWS2' && 'NEWS2 (Adult)'}
                {activeModule === 'PAEDS' && 'Paediatric Assessment'}
                {activeModule === 'MOEWS' && 'Maternity (MOEWS)'}
                {activeModule === 'TRAUMA' && 'Major Trauma'}
                {activeModule === 'ARREST' && 'Cardiac Arrest'}
              </span>
            </div>

            {activeModule === 'NEWS2' && <NEWS2Module />}
            {activeModule === 'PAEDS' && <PaediatricAssessmentModule />}
            {activeModule === 'MOEWS' && <MOEWSModule />}
            {activeModule === 'TRAUMA' && <TraumaModule />}
            {activeModule === 'ARREST' && <ArrestModule />}
          </div>
        )}
      </div>
    </main>
  );
}
