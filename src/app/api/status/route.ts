import { NextResponse } from 'next/server'
import { FLAGSHIPS } from '@/lib/flagships'
import { checkMany } from '@/lib/liveStatus'

// Live-status pings run here, OFF the home page's render path, so the page paints
// instantly and the status dots resolve after a client fetch. Cached at the edge.
export const revalidate = 300

export async function GET() {
  const urls = FLAGSHIPS.flatMap((f) => (f.status === 'live' && f.statusUrl ? [f.statusUrl] : []))
  const statuses = await checkMany(urls)
  return NextResponse.json(statuses, {
    headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
