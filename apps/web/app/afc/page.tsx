'use client';

import { useState, useEffect } from 'react';
import { BrandLogo } from '@repo/ui/brand-logo';
import { useRouter } from 'next/navigation';
import { calculateAfCEnhancements, AfCBand, ShiftPattern, AfCCalculationResult } from '@paracompanion/clinical/afc/calculator';
import { Calculator, AlertTriangle, Info, Clock, PoundSterling, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AfCDashboard() {
  const router = useRouter();
  
  // Default to today 20:00 to tomorrow 06:00
  const getDefaultDates = () => {
    const start = new Date();
    start.setHours(20, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 10);
    return { start, end };
  };

  const defaults = getDefaultDates();

  const [band, setBand] = useState<AfCBand>('5'); // Default Paramedic Band
  const [startTime, setStartTime] = useState<string>(
    new Date(defaults.start.getTime() - defaults.start.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState<string>(
    new Date(defaults.end.getTime() - defaults.end.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  
  const [result, setResult] = useState<AfCCalculationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    try {
      const shift: ShiftPattern = {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isPublicHoliday
      };
      
      // Basic validation
      if (shift.endTime > shift.startTime) {
        setResult(calculateAfCEnhancements(band, shift));
      } else {
        setResult(null);
      }
      setSaveStatus('idle'); // Reset status on change
    } catch (e) {
      console.error(e);
      setResult(null);
    }
  }, [band, startTime, endTime, isPublicHoliday]);

  const handleSave = async () => {
    if (!result) return;
    
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to save records.');
        router.push('/login?redirect=/afc');
        return;
      }

      const { error } = await supabase.from('user_pay_records').insert({
        user_id: user.id,
        band,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        is_public_holiday: isPublicHoliday,
        calculation_result: result
      });

      if (error) throw error;
      setSaveStatus('success');
    } catch (err) {
      console.error('Error saving pay record:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface pb-24">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <BrandLogo size={32} priority />
          <span className="text-xl font-bold tracking-tight font-headline">
            <span className="text-primary">Clinical</span>
            <span className="text-on-surface"> Dashboard</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-outline">
          AfC Enhancements
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-8 px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Calculator Input */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/10 shadow-sm">
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
              <Calculator className="text-primary" /> Agenda for Change (Section 2)
            </h2>
            
            <p className="text-sm text-on-surface-variant font-headline mb-8 border-l-2 border-primary pl-3">
              Calculate the estimated unsocial hours enhancement percentages for an individual shift. Based on NHS Employers Section 2 / Annex 5 guidance.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">AfC Pay Band</label>
                <select 
                  className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  value={band}
                  onChange={e => setBand(e.target.value as AfCBand)}
                >
                  <option value="1">Band 1</option>
                  <option value="2">Band 2</option>
                  <option value="3">Band 3</option>
                  <option value="4">Band 4</option>
                  <option value="5">Band 5 (NQP)</option>
                  <option value="6">Band 6 (Paramedic)</option>
                  <option value="7">Band 7 (Advanced)</option>
                  <option value="8a">Band 8a</option>
                  <option value="8b">Band 8b</option>
                  <option value="8c">Band 8c</option>
                  <option value="8d">Band 8d</option>
                  <option value="9">Band 9</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Public Holiday?</label>
                <select 
                  className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  value={isPublicHoliday ? 'yes' : 'no'}
                  onChange={e => setIsPublicHoliday(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Shift Start</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest">Shift End</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-surface-container-low px-4 py-3 border-none rounded font-headline text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            {result && result.totalEnhancementPercentage > 0 && (
              <div className="mt-8 bg-surface-container-low rounded p-4 flex items-start gap-3 border border-outline-variant/10">
                <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs font-headline text-on-surface-variant leading-relaxed">
                  The calculation found {result.enhancements.length} matching segment(s) for unsocial hours based on the parameters above. Peak enhancement dictates the rate applied.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/10 sticky top-24">
            <h3 className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest mb-4">Unsocial Hours Result</h3>
            
            {result ? (
              <div className="space-y-6">
                <div className="p-6 rounded bg-primary/5 text-primary border border-primary/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80 flex items-center gap-1">
                    <PoundSterling size={12} /> Total Enhancement
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black font-technical">+{result.totalEnhancementPercentage}</span>
                    <span className="text-xl font-bold font-technical">%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold font-label uppercase text-on-surface-variant tracking-widest border-b border-outline-variant/10 pb-2">Breakdown</h4>
                  
                  {result.enhancements.length > 0 ? (
                    result.enhancements.map((enh, idx) => (
                      <div key={idx} className="flex justify-between items-center text-on-surface text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-on-surface-variant" />
                          <span className="font-headline">{enh.type}</span>
                        </div>
                        <span className="font-technical font-bold text-primary">+{enh.percentage}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-headline text-on-surface-variant">
                      No unsocial hours enhancements apply to this shift pattern.
                    </div>
                  )}

                  <button 
                    onClick={handleSave}
                    disabled={isSaving || saveStatus === 'success'}
                    className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded font-bold font-label uppercase tracking-widest transition-all ${
                      saveStatus === 'success' 
                        ? 'bg-success text-on-success' 
                        : 'bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircle2 size={18} /> Record Saved
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save to Record
                      </>
                    )}
                  </button>

                  {saveStatus === 'error' && (
                    <p className="text-[10px] text-error font-bold text-center uppercase tracking-wider">
                      Failed to save record. Please try again.
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <div className="flex items-start gap-2 text-on-surface-variant bg-surface-container-low p-3 rounded">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <p className="text-[9px] leading-tight font-headline uppercase tracking-wide">
                      {result.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-center py-6 text-outline font-headline">Enter valid shift times to calculate</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
