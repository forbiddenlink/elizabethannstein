import type { Metadata } from 'next'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'

export const metadata: Metadata = {
  title: { absolute: 'Elizabeth Stein, full-stack engineer and designer' },
  description:
    'Full-stack engineer and designer. Sole developer on a Dynamics 365 platform in production, Algolia Agent Studio Challenge winner, npm publisher. Eighty-seven projects, from production systems to experiments.',
  alternates: { canonical: '/' },
}

// The page renders statically and instantly; live status is fetched client-side
// from /api/status so external pings never block first paint.
export default function HomePage() {
  return <LiveSystemsIndex />
}
