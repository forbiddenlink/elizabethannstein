import { NextResponse } from 'next/server'

/**
 * Lightweight uptime check. Lives outside `/api/*` so it is not gated by Arcjet
 * (monitoring bots are not classified as normal browser traffic).
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok' },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
