import type { Metadata } from 'next'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'
import { FLAGSHIPS } from '@/lib/flagships'
import { checkMany } from '@/lib/liveStatus'

// Live-status pings are cached and refreshed every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: 'Elizabeth Stein — Full-stack developer & designer' },
  description:
    'Full-stack developer and designer. Eighty-six things shipped — here are the eight that matter, live in production right now. Sole developer on a Dynamics 365 platform, Algolia Agent Studio winner, npm publisher.',
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const urls = FLAGSHIPS.flatMap((f) => (f.status === 'live' && f.statusUrl ? [f.statusUrl] : []))
  const statuses = await checkMany(urls)
  return <LiveSystemsIndex statuses={statuses} />
}
