import { useState, useEffect } from 'react';
import { calculateNEWS2, NEWS2Params, NEWS2Result, SpO2Scale, Consciousness } from '@paracompanion/clinical';
import { STRINGS } from '@paracompanion/strings';
import { Activity, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { useClinicalSessionStore } from '../../../store/clinical';

export function NEWS2Module() {
  const { addObservation, endSession } = useClinicalSessionStore();
  
  const [params, setParams] = useState<NEWS2Params>({
    respirationRate: 16,
    spO2: 98,
    spO2Scale: 'scale1',
    airOrOxygen: 'air',
    systolicBP: 120,
    pulseRate: 70,
    consciousness: 'A',
    temperature: 36.5
  });
  
  const [result, setResult] = useState<NEWS2Result | null>(null);

  useEffect(() => {
    try {
      setResult(calculateNEWS2(params));
    } catch (e) {
      console.error(e);
    }
  }, [params]);

  const handleChange = (field: keyof NEWS2Params, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (result) {
      addObservation(params, result);
      endSession();
    }
  };

  const getRiskColor = (risk?: string) => {
    switch(risk) {
      case 'low': return 'text-emerald-600 bg-emerald-50';
      case 'low-medium': return 'text-amber-600 bg-amber-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> {STRINGS.PATIENT.VITALS_NEWS2}
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Resp Rate (bpm)</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.respirationRate}
                onChange={e => handleChange('respirationRate', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">SpO2 (%)</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.spO2}
                onChange={e => handleChange('spO2', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">SpO2 Scale</label>
              <select 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                value={params.spO2Scale}
                onChange={e => handleChange('spO2Scale', e.target.value as SpO2Scale)}
              >
                <option value="scale1">Scale 1 (Normal)</option>
                <option value="scale2">Scale 2 (Hypercapnic)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Air or Oxygen?</label>
              <select 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                value={params.airOrOxygen}
                onChange={e => handleChange('airOrOxygen', e.target.value as 'air' | 'oxygen')}
              >
                <option value="air">Air</option>
                <option value="oxygen">Oxygen</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Systolic BP</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.systolicBP}
                onChange={e => handleChange('systolicBP', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Pulse Rate</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.pulseRate}
                onChange={e => handleChange('pulseRate', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Consciousness</label>
              <select 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                value={params.consciousness}
                onChange={e => handleChange('consciousness', e.target.value as Consciousness)}
              >
                <option value="A">Alert (A)</option>
                <option value="C">Confusion (C)</option>
                <option value="V">Voice (V)</option>
                <option value="P">Pain (P)</option>
                <option value="U">Unresponsive (U)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Temperature (°C)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.temperature}
                onChange={e => handleChange('temperature', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 sticky top-24">
          <h3 className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest mb-4">{STRINGS.PATIENT.CALCULATED_RESULT}</h3>
          
          {result ? (
            <div className="space-y-6">
              <div className={`p-6 rounded ${getRiskColor(result.riskLevel)} border border-current/10 flex flex-col items-center justify-center`}>
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Total Score</span>
                <span className="text-5xl font-black font-headline">{result.score}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-on-surface">
                  <AlertTriangle size={18} className="mt-0.5" />
                  <div>
                    <span className="block font-bold font-headline">Risk Level</span>
                    <span className="text-sm text-on-surface-variant capitalize">{result.riskLevel}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-on-surface mt-4">
                  <CheckCircle size={18} className="mt-0.5 text-primary" />
                  <div>
                    <span className="block font-bold font-headline">Action</span>
                    <span className="text-sm text-on-surface-variant leading-tight">{result.recommendedAction}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/10">
                <button 
                  onClick={handleSave} 
                  className="w-full bg-primary text-on-primary py-4 rounded font-bold font-label tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition"
                >
                  Save & End Session
                  <Save size={18} />
                </button>
              </div>
            </div>
          ) : (
             <div className="text-center py-6 text-outline font-headline">Enter values to calculate</div>
          )}
        </div>
      </div>
    </div>
  );
}
