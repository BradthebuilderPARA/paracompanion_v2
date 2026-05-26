import { useState } from 'react';
import { calculateMOEWS, MOEWSParams, MOEWSResult } from '@paracompanion/clinical';
import { Activity, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { useClinicalSessionStore } from '../../../store/clinical';

export function MOEWSModule() {
  const { addObservation, endSession } = useClinicalSessionStore();
  
  const [params, setParams] = useState<MOEWSParams>({
    respirationRate: 16,
    spO2: 98,
    onOxygen: false,
    temperature: 36.5,
    systolicBP: 120,
    diastolicBP: 80,
    pulseRate: 70,
    acvpu: 'A',
    redFlags: {}
  });
  
  const [result, setResult] = useState<MOEWSResult | null>(null);

  const handleCalculate = () => {
    try {
      setResult(calculateMOEWS(params));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (field: keyof MOEWSParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (result) {
      addObservation(params, result);
      endSession();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> Maternity Assessment (MOEWS)
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Resp Rate</label>
              <input type="number" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.respirationRate} onChange={e => handleChange('respirationRate', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">SpO2 (%)</label>
              <input type="number" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.spO2} onChange={e => handleChange('spO2', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Temperature (°C)</label>
              <input type="number" step="0.1" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.temperature} onChange={e => handleChange('temperature', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Pulse Rate</label>
              <input type="number" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.pulseRate} onChange={e => handleChange('pulseRate', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Systolic BP</label>
              <input type="number" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.systolicBP} onChange={e => handleChange('systolicBP', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Diastolic BP</label>
              <input type="number" className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.diastolicBP} onChange={e => handleChange('diastolicBP', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Consciousness</label>
              <select className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none" value={params.acvpu} onChange={e => handleChange('acvpu', e.target.value)}>
                <option value="A">Alert (A)</option>
                <option value="C">Confusion (C)</option>
                <option value="V">Voice (V)</option>
                <option value="P">Pain (P)</option>
                <option value="U">Unresponsive (U)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <button onClick={handleCalculate} className="w-full bg-surface-container-high text-on-surface py-3 rounded font-bold hover:bg-surface-container-highest transition">Calculate MOEWS</button>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 sticky top-24">
          <h3 className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest mb-4">Calculated Result</h3>
          {result ? (
            <div className="space-y-6">
              <div className="p-6 rounded bg-surface-container border border-current/10 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Risk Level</span>
                <span className="text-2xl font-black font-headline capitalize">{result.riskLevel}</span>
              </div>
              <div className="pt-6 border-t border-outline-variant/10">
                <button onClick={handleSave} className="w-full bg-primary text-on-primary py-4 rounded font-bold font-label tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition">Save & End Session<Save size={18} /></button>
              </div>
            </div>
          ) : (
             <div className="text-center py-6 text-outline font-headline">Enter values to assess</div>
          )}
        </div>
      </div>
    </div>
  );
}
