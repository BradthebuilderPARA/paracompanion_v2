import { useState } from 'react';
import { assessPaediatric, PaediatricAssessmentParams, PaediatricAssessmentResult } from '@paracompanion/clinical';
import { Activity, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { useClinicalSessionStore } from '../../../store/clinical';

export function PaediatricAssessmentModule() {
  const { activeSession, addObservation, endSession } = useClinicalSessionStore();
  const demographics = activeSession?.demographics;
  
  const [params, setParams] = useState<Partial<PaediatricAssessmentParams>>({
    ageInMonths: demographics?.ageUnit === 'months' ? demographics.age : (demographics?.age || 0) * 12,
    respirationRate: 0,
    heartRate: 0,
    temperature: 36.5,
  });
  
  const [result, setResult] = useState<PaediatricAssessmentResult | null>(null);

  const handleCalculate = () => {
    try {
      setResult(assessPaediatric(params as PaediatricAssessmentParams));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (field: keyof PaediatricAssessmentParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const toggleFlag = (field: keyof PaediatricAssessmentParams) => {
    setParams(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    if (result) {
      addObservation(params, result);
      endSession();
    }
  };

  const getRiskColor = (risk?: string) => {
    switch(risk) {
      case 'green': return 'text-emerald-600 bg-emerald-50';
      case 'amber': return 'text-amber-600 bg-amber-50';
      case 'red': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> Paediatric Assessment (JRCALC)
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Heart Rate</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.heartRate || ''}
                onChange={e => handleChange('heartRate', parseInt(e.target.value) || undefined)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Resp Rate</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.respirationRate || ''}
                onChange={e => handleChange('respirationRate', parseInt(e.target.value) || undefined)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Temperature (°C)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={params.temperature || ''}
                onChange={e => handleChange('temperature', parseFloat(e.target.value) || undefined)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Activity/Behaviour</label>
              <select 
                className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                value={params.activity || 'normal'}
                onChange={e => handleChange('activity', e.target.value)}
              >
                <option value="normal">Normal / Responds to social cues</option>
                <option value="not_responding_normally">Not responding normally</option>
                <option value="no_response_to_social_cues">No response to social cues</option>
                <option value="difficult_to_rouse">Difficult to rouse / unresponsive</option>
              </select>
            </div>
          </div>

          <h3 className="text-sm font-bold font-headline text-on-surface mt-8 mb-4">Red Flags</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!params.grunting} onChange={() => toggleFlag('grunting')} className="w-5 h-5 rounded text-primary" />
              <span>Grunting</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!params.nonBlanchingRash} onChange={() => toggleFlag('nonBlanchingRash')} className="w-5 h-5 rounded text-primary" />
              <span>Non-blanching rash</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!params.bulgingFontanelle} onChange={() => toggleFlag('bulgingFontanelle')} className="w-5 h-5 rounded text-primary" />
              <span>Bulging Fontanelle</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!params.neckStiffness} onChange={() => toggleFlag('neckStiffness')} className="w-5 h-5 rounded text-primary" />
              <span>Neck Stiffness</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!params.focalNeurological} onChange={() => toggleFlag('focalNeurological')} className="w-5 h-5 rounded text-primary" />
              <span>Focal Neurological Signs</span>
            </label>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <button 
              onClick={handleCalculate}
              className="w-full bg-surface-container-high text-on-surface py-3 rounded font-bold hover:bg-surface-container-highest transition"
            >
              Calculate Assessment
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 sticky top-24">
          <h3 className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest mb-4">Calculated Result</h3>
          
          {result ? (
            <div className="space-y-6">
              <div className={`p-6 rounded ${getRiskColor(result.trafficLight)} border border-current/10 flex flex-col items-center justify-center`}>
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Risk Level</span>
                <span className="text-4xl font-black font-headline uppercase">{result.trafficLight}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-on-surface">
                  <AlertTriangle size={18} className="mt-0.5 text-red-600" />
                  <div>
                    <span className="block font-bold font-headline">Red Flags Triggered</span>
                    <ul className="list-disc pl-4 text-sm text-on-surface-variant">
                      {result.redFlagsTriggered.length > 0 ? result.redFlagsTriggered.map((flag, i) => <li key={i}>{flag}</li>) : <li>None</li>}
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-on-surface mt-4">
                  <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
                  <div>
                    <span className="block font-bold font-headline">Amber Flags Triggered</span>
                    <ul className="list-disc pl-4 text-sm text-on-surface-variant">
                      {result.amberFlagsTriggered.length > 0 ? result.amberFlagsTriggered.map((flag, i) => <li key={i}>{flag}</li>) : <li>None</li>}
                    </ul>
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
             <div className="text-center py-6 text-outline font-headline">Enter values to assess</div>
          )}
        </div>
      </div>
    </div>
  );
}
