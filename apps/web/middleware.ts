// This stub satisfies the Next.js 16 build scanner which still detects middleware.ts.
// All session management is handled by proxy.ts (the Next.js 16 convention).
// This file should be deleted once it's safe to do so from the repo.
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

// Empty matcher — this middleware never actually runs.
export const config = {
  matcher: [],
}
