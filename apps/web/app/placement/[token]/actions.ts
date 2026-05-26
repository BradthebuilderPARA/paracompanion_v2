'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Helper — creates a Supabase admin client at call-time (not module scope).
// Module-scope initialisation runs during Next.js build-time module evaluation,
// where env vars may not be present, causing hard crashes.
// SUPABASE_SERVICE_ROLE_KEY falls back to the anon key for environments
// where only the anon key is configured (e.g. preview deployments).
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY)'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function submitSignOff(token: string, formData: FormData) {
  const comment = formData.get('comment') as string;
  const action = formData.get('action') as 'approve' | 'reject';

  if (!comment || comment.trim().length === 0) {
    return { error: 'Please leave a mandatory comment.' };
  }

  const supabase = getSupabaseAdmin();

  // Find the sign-off record
  const { data: signoff, error: signoffErr } = await supabase
    .from('competency_signoffs')
    .select('id, shift_id, status')
    .eq('magic_token', token)
    .single();

  if (signoffErr || !signoff) {
    return { error: 'Invalid or expired sign-off link.' };
  }

  if (signoff.status !== 'pending') {
    return { error: 'This request has already been processed.' };
  }

  // Update the sign-off record
  const status = action === 'approve' ? 'approved' : 'rejected';

  const { error: updateErr } = await supabase
    .from('competency_signoffs')
    .update({
      status,
      comment: comment,
      signed_at: new Date().toISOString(),
    })
    .eq('id', signoff.id);

  if (updateErr) {
    return { error: 'Failed to update sign-off record.' };
  }

  // Update the parent shift
  const { error: shiftErr } = await supabase
    .from('placement_shifts')
    .update({ signoff_status: status })
    .eq('id', signoff.shift_id);

  if (shiftErr) {
    return { error: 'Failed to update shift status.' };
  }

  revalidatePath(`/placement/${token}`);
  return { success: true };
}
