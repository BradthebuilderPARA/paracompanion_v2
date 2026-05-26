import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Service role key — server-side only, never exposed to the client
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Copy apps/admin/.env.example to apps/admin/.env.local',
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Copy apps/admin/.env.example to apps/admin/.env.local',
  );
}

/**
 * Standard anon client — uses Row Level Security.
 * Safe to use in client components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service-role admin client — bypasses RLS for admin queries.
 * MUST only be used in Server Components / Route Handlers / Server Actions.
 * NEVER imported into client components.
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
