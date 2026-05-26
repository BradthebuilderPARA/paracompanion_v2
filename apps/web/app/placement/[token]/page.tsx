import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { submitSignOff } from './actions';

export default async function SupervisorSignOffPage({ params }: { params: { token: string } }) {
  // Create the Supabase client inside the request handler, not at module scope.
  // Module-scope initialisation runs during Next.js build-time page-data collection,
  // where env vars may not be present, causing a hard crash ("supabaseKey is required").
  // By moving this here we ensure it only executes at request time.
  //
  // We intentionally use only the public anon key here — this page is a supervisor
  // sign-off link that must never use SUPABASE_SERVICE_ROLE_KEY.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If either env var is absent (e.g. during local dev without .env.local),
  // return a 404 rather than throwing an unhandled error.
  if (!supabaseUrl || !supabaseAnonKey) {
    return notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const token = params.token;

  // Fetch the sign-off record and associated data
  const { data: signoff, error } = await supabase
    .from('competency_signoffs')
    .select(`
      *,
      shift:placement_shifts (
        id,
        user_id,
        start_time,
        end_time,
        site_name,
        role_type,
        skills:placement_skills (
          id,
          skill_name,
          competency_level
        )
      )
    `)
    .eq('magic_token', token)
    .single();

  if (error || !signoff) {
    return notFound();
  }

  const shift = signoff.shift as any;
  const isPending = signoff.status === 'pending';
  const start = new Date(shift.start_time);
  const end = new Date(shift.end_time);
  const durationHours = Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 10) / 10;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-body">
      <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant shadow-telemetry p-8 rounded-xl">
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">
          Clinical Placement Sign-Off
        </h1>
        <p className="text-on-surface-variant mb-6 text-sm">
          A Paramedic Science student has requested your validation for a recent clinical shift.
        </p>

        {/* Shift Summary block */}
        <div className="bg-surface p-4 rounded-lg mb-6 border border-outline-variant">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2 mb-2">
            <span className="font-semibold text-on-surface text-sm uppercase tracking-wide">Shift Details</span>
            {signoff.status === 'approved' && (
              <span className="bg-brand-green/10 text-brand-green px-2 py-1 rounded text-xs font-bold font-technical uppercase">Approved</span>
            )}
            {signoff.status === 'rejected' && (
              <span className="bg-emergency/10 text-emergency px-2 py-1 rounded text-xs font-bold font-technical uppercase">Rejected</span>
            )}
            {isPending && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold font-technical uppercase">Pending Validation</span>
            )}
          </div>
          
          <ul className="space-y-2 text-sm text-on-surface-variant my-4">
            <li><strong>Site:</strong> {shift.site_name}</li>
            <li><strong>Role:</strong> {shift.role_type}</li>
            <li><strong>Date:</strong> {start.toLocaleDateString()}</li>
            <li><strong>Duration:</strong> {durationHours} Hours</li>
          </ul>

          <div className="border-t border-outline-variant pt-2 mt-4">
            <span className="font-semibold text-on-surface text-sm tracking-wide">Skills Practiced</span>
            {shift.skills?.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-on-surface-variant">
                {shift.skills.map((s: any) => (
                  <li key={s.id}>{s.skill_name} - <span className="text-xs uppercase bg-surface-container-highest px-1 py-0.5 rounded font-technical">{s.competency_level}</span></li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-on-surface-variant mt-2 italic">No specific skills logged for this shift.</p>
            )}
          </div>
        </div>

        {/* Action Form or Outcome */}
        {isPending ? (
          <form action={async (formData) => {
            'use server';
            await submitSignOff(token, formData);
          }}>
            <input type="hidden" name="token" value={token} />
            
            <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="comment">
              Supervisor Feedback (Mandatory)
            </label>
            <textarea
              name="comment"
              id="comment"
              required
              rows={4}
              placeholder="Reflect on the student's performance, strengths, or areas for improvement..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-6 transition-all"
            />

            <div className="flex gap-4">
              <button 
                type="submit" 
                name="action" 
                value="reject"
                className="flex-1 py-3 px-4 rounded-md font-bold transition-colors bg-surface-container-low text-emergency hover:bg-emergency/10 border border-transparent shadow-sm"
              >
                Reject Hours
              </button>
              <button 
                type="submit" 
                name="action" 
                value="approve"
                className="flex-1 py-3 px-4 rounded-md font-bold transition-colors bg-primary text-white hover:bg-primary-focused shadow-sm"
              >
                Approve Hours
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-surface p-4 rounded-lg flex flex-col gap-2">
            <span className="font-semibold text-on-surface text-sm border-b border-outline-variant pb-2">Your Feedback</span>
            <p className="text-sm text-on-surface-variant mt-2">{signoff.comment}</p>
            <p className="text-xs text-on-surface-variant/70 mt-4 font-technical">Signed at: {new Date(signoff.signed_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
