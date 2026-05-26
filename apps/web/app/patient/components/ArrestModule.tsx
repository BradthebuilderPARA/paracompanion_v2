import { useState } from 'react';
import { ArrestSessionState } from '@paracompanion/clinical';
import { Activity, Save } from 'lucide-react';
import { useClinicalSessionStore } from '../../../store/clinical';

export function ArrestModule() {
  const { endSession } = useClinicalSessionStore();
  
  const [arrestState, setArrestState] = useState<Partial<ArrestSessionState>>({});

  const handleSave = () => {
    endSession();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Activity className="text-red-600" /> Cardiac Arrest
          </h2>
          <div className="text-outline italic">
            Web interface for Cardiac Arrest is currently a simplified stub for testing. Please use the mobile app for full CPR metronome and intervention tracking.
          </div>
        </div>
      </div>
      <div className="md:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 sticky top-24">
          <button onClick={handleSave} className="w-full bg-red-600 text-white py-4 rounded font-bold font-label tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition">End Arrest Session<Save size={18} /></button>
        </div>
      </div>
    </div>
  );
}
