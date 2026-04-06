import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Route prefixes that are always publicly accessible.
 * No authentication or onboarding check is applied to these paths.
 */
const PUBLIC_PREFIXES = [
  '/onboarding',
  '/auth',
  // Legal / informational pages — visible to everyone
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/billing-terms',
  '/about-us',
  '/contact-us',
  // Next.js internals
  '/_next',
  '/favicon.ico',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix + '/') ||
      pathname.startsWith(prefix + '?'),
  )
}

/**
 * Handles session refreshes and enforces the onboarding gate in Next.js v16 Proxy.
 *
 * Rules:
 *  - Public routes → always allowed through.
 *  - Protected route + no session  → redirect /onboarding.
 *  - Protected route + session but onboarding_complete != true → redirect /onboarding.
 *  - Protected route + session + onboarding_complete = true → allowed through.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Always allow public routes through without any further checks.
  if (isPublicRoute(pathname)) {
    return response
  }

  // Protected route: user must be authenticated.
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/onboarding'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated user: they must have completed onboarding.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  if (profileError) {
    // PGRST116 means no rows found — user has no profile yet, send to onboarding.
    // Any other error code is an unexpected DB failure; fail-secure by redirecting
    // to onboarding so that incomplete users cannot slip through.
    console.error('[proxy] profile fetch error:', profileError.code, profileError.message)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/onboarding'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  if (!profile?.onboarding_complete) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/onboarding'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
