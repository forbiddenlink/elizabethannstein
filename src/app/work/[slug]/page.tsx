import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, getProjectById } from '@/lib/galaxyData'
import { isProofCatalogProject } from '@/lib/proofLayer'
import styles from './page.module.css'

// ISR: Revalidate project pages every hour for fresh content
export const revalidate = 3600

// Every slug is known at build time. Without this, an unknown slug is rendered
// on demand and cached as a 200 with `s-maxage=3600`, so `/work/<anything>`
// became an unbounded surface of cacheable soft-404s. `false` makes Next return
// a real 404 for any slug outside generateStaticParams.
export const dynamicParams = false

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.id,
  }))
}

function normalizeDescription(desc: string, tags?: string[]): string {
  const MIN = 120
  const MAX = 160

  if (desc.length > MAX) return `${desc.slice(0, MAX - 3).trimEnd()}...`
  if (desc.length >= MIN) return desc

  const techSuffix = tags?.length ? ` Built with ${tags.slice(0, 3).join(', ')}.` : ''
  const result = desc + techSuffix
  if (result.length > MAX) return desc
  if (result.length >= MIN) return result

  const full = `${result} View project details and implementation.`
  return full.length <= MAX ? full : result
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    return {
      title: 'Project not found',
      robots: { index: false, follow: true },
    }
  }

  const metaDescription = normalizeDescription(project.description, project.tags)

  return {
    // No " · Case study" suffix here (the page itself labels it as a case study) —
    // keeps the rendered <title> ("{title} | Elizabeth Stein") inside the 50-60 char
    // range SEO scanners expect, across every project title in galaxyData.ts.
    title: project.title,
    description: metaDescription,
    // Experiments and archived projects keep their pages (the galaxy and archive
    // link to them) but stay out of search, so a recruiter's search lands on real work.
    ...(isProofCatalogProject(project) ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `/work/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: metaDescription,
      url: `/work/${project.id}`,
      images: [
        {
          url: `/api/og/${project.id}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: metaDescription,
      images: [`/api/og/${project.id}`],
    },
  }
}

export default async function ProjectPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    notFound()
  }

  // Find next/prev projects for navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id)
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length]
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]

  // Related projects by tag overlap (exclude current, sort by most shared tags)
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      project: p,
      sharedTags: p.tags.filter((tag) => project.tags.includes(tag)),
      sameGalaxy: p.galaxy === project.galaxy,
    }))
    .map((item) => ({
      ...item,
      score: item.sharedTags.length + (item.sameGalaxy ? 1 : 0),
    }))
    .filter(({ sharedTags }) => sharedTags.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${SITE.url}/work/${project.id}`,
    author: {
      '@type': 'Person',
      name: SITE.name,
      url: SITE.url,
    },
    ...(project.dateRange && { dateCreated: project.dateRange }),
    ...(project.tags && { keywords: project.tags.join(', ') }),
    ...(project.links?.live && { mainEntityOfPage: project.links.live }),
    ...(project.links?.github && { codeRepository: project.links.github }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${SITE.url}/work`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${SITE.url}/work/${project.id}`,
      },
    ],
  }

  return (
    <div className="editorial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <a
        href="#project-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <ScrollProgress editorial />
      <SiteHeader />

      <main id="project-content" className="eWrap">
        <ProjectCaseStudy project={project} />

        {/* Related projects by tag overlap */}
        {relatedProjects.length > 0 && (
          <section className="eSect" aria-labelledby="related-heading">
            <div className="eSectHead">
              <h2 id="related-heading">Related work</h2>
              <p>Shares the most stack with this project</p>
            </div>
            <ul className={styles.related}>
              {relatedProjects.map(({ project: related, sharedTags }) => (
                <li key={related.id}>
                  <Link href={`/work/${related.id}`} className={styles.relatedRow}>
                    <span className={styles.relatedTitle}>{related.title}</span>
                    <span className={styles.relatedDesc}>{related.description}</span>
                    <span className={styles.relatedTags}>{sharedTags.slice(0, 3).join(', ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hiring CTA */}
        <section className={styles.hiring} aria-labelledby="hiring-heading">
          <h2 id="hiring-heading">Hiring for something like this?</h2>
          <div>
            <p>Contract, advisory, or full-time. Tell me what you are building.</p>
            <div className={styles.hiringActions}>
              <Link href="/contact" className="eBtn eBtnPrimary">
                Start a conversation
              </Link>
              <a href={`mailto:${CONTACT.email}`} className="eLink">
                {CONTACT.email}
              </a>
            </div>
          </div>
        </section>

        {/* Prev / next navigation */}
        <nav className={styles.nextcase} aria-label="More case studies">
          <Link href={`/work/${prevProject.id}`}>
            <small>Previous</small>
            <strong>{prevProject.title}</strong>
          </Link>
          <Link href={`/work/${nextProject.id}`}>
            <small>Next</small>
            <strong>{nextProject.title}</strong>
          </Link>
        </nav>
      </main>

      <SiteFooter />
    </div>
  )
}
