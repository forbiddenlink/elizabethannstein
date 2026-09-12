import type { ArcjetDecision } from '@arcjet/next'
import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { arcjetClient } from '@/lib/arcjetClient'

const arcjetKey = process.env.ARCJET_KEY

// Fail loud in production: with no key, the shield, bot detection, AND the
// per-IP rate limiter below all silently no-op (fail-open). This surfaces the
// deploy-config mistake in logs/Sentry instead of shipping unprotected APIs.
if (!arcjetKey && process.env.NODE_ENV === 'production') {
  console.error(
    '[proxy] ARCJET_KEY is not set in production — API shield, bot detection, and rate limiting are DISABLED.'
  )
}

// WAF shield on every /api/* route. Cheap, and never blocks legit crawlers.
const ajShield = arcjetKey
  ? arcjet({ key: arcjetKey, client: arcjetClient, rules: [shield({ mode: 'LIVE' })] })
  : null

// Bot detection for API routes — but NOT /api/og. Those routes render Open
// Graph preview images that are fetched by social / link-preview crawlers
// (Twitterbot, facebookexternalhit, LinkedInBot, Slackbot). detectBot would
// 403 them and break link previews on every shared page, so /api/og is exempt
// and guarded by shield only.
const ajBot = arcjetKey
  ? arcjet({
      key: arcjetKey,
      client: arcjetClient,
      rules: [detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] })],
    })
  : null

// Stricter per-IP rate limit ONLY for the endpoints that cost money or send
// email, so a single client cannot run up Resend sends or paid LLM calls.
// /api/og and other cheap routes are intentionally left off this limiter.
const ajRateLimited = arcjetKey
  ? arcjet({
      key: arcjetKey,
      client: arcjetClient,
      rules: [slidingWindow({ mode: 'LIVE', interval: '1m', max: 10 })],
    })
  : null

const RATE_LIMITED_PATHS = ['/api/contact', '/api/chat']

// Arcjet fails open: an errored decision (decide API down, bad key, broken
// transport) allows the request. Keep that for availability, but log it, or
// the shield, bot check, and rate limit can all be off with nothing to show.
function logIfErrored(check: string, decision: ArcjetDecision) {
  if (decision.reason.isError()) {
    console.error(`[proxy] Arcjet ${check} check errored and failed open:`, decision.reason.message)
  }
}

export async function proxy(request: NextRequest) {
  if (!ajShield) {
    return NextResponse.next()
  }
  // WAF shield runs on every /api/* route.
  const shieldDecision = await ajShield.protect(request)
  logIfErrored('shield', shieldDecision)
  if (shieldDecision.isDenied()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // Bot detection everywhere except two public, read-only endpoints:
  //  - /api/og: fetched by social / link-preview crawlers
  //  - /api/status: fetched client-side by the home page to render live uptime;
  //    it exposes only up/latency for public URLs, so bot-blocking it would only
  //    break the feature with no security benefit. Shield still guards both.
  const botExempt = ['/api/og', '/api/status']
  if (ajBot && !botExempt.some((p) => request.nextUrl.pathname.startsWith(p))) {
    const botDecision = await ajBot.protect(request)
    logIfErrored('bot', botDecision)
    if (botDecision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }
  if (
    ajRateLimited &&
    RATE_LIMITED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const limit = await ajRateLimited.protect(request)
    logIfErrored('rate limit', limit)
    if (limit.isDenied()) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down and try again shortly.' },
        { status: 429 }
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
