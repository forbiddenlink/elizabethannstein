import 'server-only'
import { classifyProbe, type LiveResult } from './probeClassify'

export type { LiveResult }

/**
 * Ping a production URL server-side to power the "live systems" column on the home
 * page. Honest by construction: if the site doesn't respond, the dot doesn't go green.
 * Responses are cached (revalidate) so we don't hammer external hosts on every request.
 */
export async function checkStatus(url: string, timeoutMs = 4500): Promise<LiveResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'elizabethannstein.com uptime probe' },
      next: { revalidate: 300 },
    })
    // `res.url` is the final URL after redirects, so a deployment-protection redirect to the
    // Vercel login shows up as "private" instead of "live".
    return classifyProbe(res.status, res.url, Date.now() - start)
  } catch {
    return { up: false, ms: null }
  } finally {
    clearTimeout(timer)
  }
}

/** Ping many URLs concurrently; never rejects. Keyed by URL. */
export async function checkMany(urls: string[]): Promise<Record<string, LiveResult>> {
  const entries = await Promise.all(urls.map(async (url) => [url, await checkStatus(url)] as const))
  return Object.fromEntries(entries)
}
