import type { Metadata } from 'next'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'
import { FLAGSHIPS } from '@/lib/flagships'
import { allProjects, getProjectById } from '@/lib/galaxyData'

export const metadata: Metadata = {
  title: { absolute: 'Elizabeth Stein, full-stack engineer and designer' },
  description:
    'Full-stack engineer and designer. Sole developer on a Dynamics 365 platform in production, Algolia Agent Studio Challenge winner, npm publisher. Eighty-nine projects, from production systems to experiments.',
  alternates: { canonical: '/' },
}

// The page renders statically and instantly; live status is fetched client-side
// from /api/status so external pings never block first paint.
export default function HomePage() {
  const projectIds = allProjects.map((p) => p.id)
  const featuredProjects = Object.fromEntries(
    FLAGSHIPS.flatMap((f) => {
      const project = getProjectById(f.id)
      return project ? [[f.id, { tags: project.tags, role: project.role }]] : []
    })
  )
  return <LiveSystemsIndex projectIds={projectIds} featuredProjects={featuredProjects} />
}
