/**
 * Pure helpers for the live-status probe. Kept apart from `liveStatus.ts` (which is
 * `server-only`) so they can be unit tested.
 */

export interface LiveResult {
  up: boolean
  ms: number | null
  /** The site answers, but only behind a login wall (e.g. Vercel deployment protection). */
  private?: boolean
}

/**
 * True when a probe landed on an auth/login host rather than the site itself. Vercel
 * deployment protection redirects to vercel.com/sso-api or vercel.com/login; those return
 * 200 once followed, which is not evidence the demo is publicly reachable.
 */
export function isAuthWallUrl(finalUrl: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(finalUrl)
  } catch {
    return false
  }
  const host = parsed.hostname.toLowerCase()
  const path = parsed.pathname.toLowerCase()
  if (host === 'vercel.com' || host === 'www.vercel.com') {
    return path.startsWith('/login') || path.startsWith('/sso-api') || path.startsWith('/sso')
  }
  return host.startsWith('sso.') || host.startsWith('login.')
}

/** Classify a finished probe response: private (auth wall), up, or down. */
export function classifyProbe(status: number, finalUrl: string, ms: number): LiveResult {
  if (isAuthWallUrl(finalUrl)) return { up: false, ms, private: true }
  // Anything short of a server error counts as up; a 401/403 from the site itself still
  // means it is alive.
  return { up: status < 500, ms }
}
