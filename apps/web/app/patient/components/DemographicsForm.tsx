import { useState } from 'react';
import { PatientDemographics } from '@paracompanion/clinical';
import { ClinicalModule } from '../../../store/clinical';

interface DemographicsFormProps {
  onStartSession: (demographics: PatientDemographics & { type: ClinicalModule }) => void;
}

export function DemographicsForm({ onStartSession }: DemographicsFormProps) {
  const [age, setAge] = useState<string>('');
  const [ageUnit, setAgeUnit] = useState<'years' | 'months'>('years');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [isPregnant, setIsPregnant] = useState(false);
  const [gestationWeeks, setGestationWeeks] = useState<string>('');
  const [isCardiacArrest, setIsCardiacArrest] = useState(false);
  const [isMajorTrauma, setIsMajorTrauma] = useState(false);

  const handleStart = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) return alert('Please enter a valid age');

    let type: ClinicalModule = 'NEWS2';
    
    if (isCardiacArrest) {
      type = 'ARREST';
    } else if (isMajorTrauma) {
      type = 'TRAUMA';
    } else if (isPregnant) {
      type = 'MOEWS';
    } else if (ageUnit === 'months' || ageNum < 16) {
      type = 'PAEDS';
    }

    onStartSession({
      age: ageNum,
      ageUnit,
      sex,
      pregnant: isPregnant,
      gestationWeeks: isPregnant && gestationWeeks ? parseInt(gestationWeeks, 10) : undefined,
      type
    });
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 max-w-lg mx-auto mt-12">
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Patient Demographics</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Age</label>
            <input 
              type="number" 
              className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="e.g. 45"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Unit</label>
            <select 
              className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
              value={ageUnit}
              onChange={e => setAgeUnit(e.target.value as 'years' | 'months')}
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Sex at Birth</label>
          <select 
            className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            value={sex}
            onChange={e => setSex(e.target.value as 'Male' | 'Female' | 'Other')}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {sex === 'Female' && (
          <div className="flex items-center gap-2 mt-4">
            <input 
              type="checkbox" 
              id="pregnant"
              checked={isPregnant}
              onChange={e => setIsPregnant(e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <label htmlFor="pregnant" className="font-headline text-on-surface">Patient is Pregnant or ≤6 weeks postpartum</label>
          </div>
        )}

        {isPregnant && (
          <div className="space-y-2 pl-7 mt-2">
            <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Gestation (Weeks)</label>
            <input 
              type="number" 
              className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
              value={gestationWeeks}
              onChange={e => setGestationWeeks(e.target.value)}
              placeholder="e.g. 32"
            />
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-outline-variant/10 space-y-3">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="trauma"
              checked={isMajorTrauma}
              onChange={e => { setIsMajorTrauma(e.target.checked); setIsCardiacArrest(false); }}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <label htmlFor="trauma" className="font-headline text-on-surface">Major Trauma</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="arrest"
              checked={isCardiacArrest}
              onChange={e => { setIsCardiacArrest(e.target.checked); setIsMajorTrauma(false); }}
              className="w-5 h-5 rounded border-outline-variant text-red-600 focus:ring-red-600"
            />
            <label htmlFor="arrest" className="font-headline text-red-600 font-bold">Cardiac Arrest</label>
          </div>
        </div>

        <button 
          onClick={handleStart} 
          className="w-full bg-primary text-on-primary py-4 rounded font-bold font-label tracking-wide uppercase mt-8 hover:bg-primary/90 transition"
        >
          Start Clinical Session
        </button>
      </div>
    </div>
  );
}
