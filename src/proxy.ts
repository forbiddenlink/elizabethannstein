import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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
const ajShield = arcjetKey ? arcjet({ key: arcjetKey, rules: [shield({ mode: 'LIVE' })] }) : null

// Bot detection for API routes — but NOT /api/og. Those routes render Open
// Graph preview images that are fetched by social / link-preview crawlers
// (Twitterbot, facebookexternalhit, LinkedInBot, Slackbot). detectBot would
// 403 them and break link previews on every shared page, so /api/og is exempt
// and guarded by shield only.
const ajBot = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] })],
    })
  : null

// Stricter per-IP rate limit ONLY for the endpoints that cost money or send
// email, so a single client cannot run up Resend sends or paid LLM calls.
// /api/og and other cheap routes are intentionally left off this limiter.
const ajRateLimited = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [slidingWindow({ mode: 'LIVE', interval: '1m', max: 10 })],
    })
  : null

const RATE_LIMITED_PATHS = ['/api/contact', '/api/chat']

export async function proxy(request: NextRequest) {
  if (!ajShield) {
    return NextResponse.next()
  }
  // WAF shield runs on every /api/* route.
  const shieldDecision = await ajShield.protect(request)
  if (shieldDecision.isDenied()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // Bot detection everywhere except the crawler-facing OG image endpoint.
  if (ajBot && !request.nextUrl.pathname.startsWith('/api/og')) {
    const botDecision = await ajBot.protect(request)
    if (botDecision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }
  if (
    ajRateLimited &&
    RATE_LIMITED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const limit = await ajRateLimited.protect(request)
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
