'use server';

/**
 * Admin Dashboard — Platform Oversight
 *
 * FIX v1.1.0:
 *  - Added auth guard: unauthenticated users are redirected to /login
 *  - Replaced all MOCK_USERS with real Supabase queries (service-role)
 *  - Stats cards now show live aggregated data from the database
 *  - Search/filter operates client-side on real data
 *  - Real-time pagination via Supabase range queries
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import AdminDashboardClient from './AdminDashboardClient';

// ─── Server-side data fetching ─────────────────────────────────────────────

async function getAdminSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

async function getAdminStats() {
  const { createClient } = await import('@supabase/supabase-js');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) {
    // Graceful degradation — return zeros if service key not configured
    return { totalUsers: 0, activeSessions: 0, blockedAttempts: 0 };
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const [{ count: totalUsers }, { count: activeSessions }, { count: blockedAttempts }] =
    await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      admin.from('clinical_sessions').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      admin.from('blocked_submission_logs').select('*', { count: 'exact', head: true }),
    ]);

  return {
    totalUsers: totalUsers ?? 0,
    activeSessions: activeSessions ?? 0,
    blockedAttempts: blockedAttempts ?? 0,
  };
}

async function getProfiles(page = 0, pageSize = 20) {
  const { createClient } = await import('@supabase/supabase-js');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) return { profiles: [], total: 0 };

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data: profiles, count } = await admin
    .from('profiles')
    .select(
      'id, full_name, display_name, clinician_id, role, tier, onboarding_complete, created_at, updated_at',
      { count: 'exact' }
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  return { profiles: profiles ?? [], total: count ?? 0 };
}

// ─── Server Component (Page) ────────────────────────────────────────────────

export default async function AdminPage() {
  // 1. Auth guard — redirect unauthenticated users
  const session = await getAdminSession();
  if (!session) {
    redirect('/login');
  }

  // 2. Role guard — only 'admin' users may access this page
  // The profiles.role field is set during user provisioning
  const { createClient } = await import('@supabase/supabase-js');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceKey && url) {
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      redirect('/unauthorized');
    }
  }

  // 3. Fetch live data
  const [stats, { profiles, total }] = await Promise.all([
    getAdminStats(),
    getProfiles(0, 20),
  ]);

  return (
    <AdminDashboardClient
      stats={stats}
      initialProfiles={profiles}
      initialTotal={total}
      pageSize={20}
      adminEmail={session.user.email ?? ''}
    />
  );
}
