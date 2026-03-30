import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { WorkPageClient } from '@/components/work/WorkPageClient'
import { SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects & Work - Elizabeth Stein Portfolio',
  description:
    'Full-stack development, AI integration, design systems, and enterprise work across 84 projects. Browse the portfolio.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Projects & Work - Elizabeth Stein Portfolio',
    description:
      'Full-stack development, AI integration, design systems, and enterprise work across 84 projects. Browse the portfolio.',
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
      <SiteHeader />
      <main className="min-h-screen overflow-auto px-6 py-28 relative flex justify-center">
        {/* Skip Link for Accessibility */}
        <a
          href="#work-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
        >
          Skip to projects
        </a>
        <StarryBackground />
        <WorkPageClient galaxies={galaxies} />
      </main>
      <SiteFooter />
    </>
  )
}
