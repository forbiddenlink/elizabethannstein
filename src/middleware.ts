import arcjet, { detectBot, shield } from '@arcjet/next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const arcjetKey = process.env.ARCJET_KEY

const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] }),
      ],
    })
  : null

export async function middleware(request: NextRequest) {
  if (!aj) {
    return NextResponse.next()
  }
  const decision = await aj.protect(request)
  if (decision.isDenied()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
