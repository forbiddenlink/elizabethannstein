import type { Metadata } from 'next'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { WorkPageClient } from '@/components/work/WorkPageClient'
import { SITE, STATS } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'

const workDescription = `Full-stack development, AI integration, design systems, and enterprise work across ${STATS.projectCount} projects. Browse the portfolio.`

export const metadata: Metadata = {
  title: 'Projects & Work',
  description: workDescription,
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Projects & Work - Elizabeth Stein Portfolio',
    description: workDescription,
    url: '/work',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function WorkPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects & Work',
    description: metadata.description,
    url: `${SITE.url}/work`,
    author: {
      '@type': 'Person',
      name: SITE.name,
      url: SITE.url,
    },
    numberOfItems: allProjects.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="editorial">
        {/* Skip Link for Accessibility */}
        <a
          href="#work-content"
          suppressHydrationWarning
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
        >
          Skip to projects
        </a>
        <SiteHeader />
        <main id="work-content" className="eWrap">
          <WorkPageClient galaxies={galaxies} />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
