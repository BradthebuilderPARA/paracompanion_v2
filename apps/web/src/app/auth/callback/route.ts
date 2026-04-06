import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Handles the Supabase magic-link / OAuth callback (PKCE code exchange).
 *
 * Flow:
 *  1. Exchange the one-time `code` for a user session.
 *  2. Check profiles.onboarding_complete.
 *  3. Redirect to /dashboard if complete, otherwise /onboarding.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] code exchange failed:', error.message)
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single()

        const destination = profile?.onboarding_complete ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  // Fallback: send to onboarding on any error or missing code.
  return NextResponse.redirect(`${origin}/onboarding`)
}
