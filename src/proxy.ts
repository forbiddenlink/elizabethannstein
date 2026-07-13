import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const arcjetKey = process.env.ARCJET_KEY

// Baseline protection for every /api/* route: WAF shield + bot detection.
const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] }),
      ],
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
  if (!aj) {
    return NextResponse.next()
  }
  const decision = await aj.protect(request)
  if (decision.isDenied()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
