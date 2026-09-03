import type { Metadata } from 'next'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'

export const metadata: Metadata = {
  title: { absolute: 'Elizabeth Stein — Full-stack developer & designer' },
  description:
    'Full-stack developer and designer. Eighty-eight things shipped — here are the eight that matter, live in production right now. Sole developer on a Dynamics 365 platform, Algolia Agent Studio winner, npm publisher.',
  alternates: { canonical: '/' },
}

// The page renders statically and instantly; live status is fetched client-side
// from /api/status so external pings never block first paint.
export default function HomePage() {
  return <LiveSystemsIndex />
}
