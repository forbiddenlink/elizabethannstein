import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { CaseStudyChapterRail } from '@/components/ui/CaseStudyChapterRail'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { SITE } from '@/lib/constants'
import { allProjects, getProjectById } from '@/lib/galaxyData'
import styles from './page.module.css'

// ISR: Revalidate project pages every hour for fresh content
export const revalidate = 3600

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
    title: `${project.title} · Case study`,
    description: metaDescription,
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
      <CaseStudyChapterRail />
      <SiteHeader />

      <main id="project-content" className="eWrap">
        <ProjectCaseStudy project={project} />

        {/* Hiring CTA */}
        <section className={styles.hiring} aria-labelledby="hiring-heading">
          <p className="eLabel">Let&apos;s talk</p>
          <h2 id="hiring-heading" className={styles.hiringTitle}>
            Tell me what you&apos;re building
          </h2>
          <p className={`eLede ${styles.hiringLede}`}>
            If you need someone who can own UI, systems, and AI integration without losing the plot,
            I&apos;m listening. Contract, advisory, or full-time: we&apos;ll find the right shape.
          </p>
          <div className={styles.hiringActions}>
            <Link href="/contact" className="eBtn eBtnPrimary">
              Start a conversation{' '}
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/work" className="eBtn eBtnGhost">
              See more projects
            </Link>
          </div>
        </section>

        {/* Related Projects by Tag Overlap */}
        {relatedProjects.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <p className="eLabel" id="related-heading" style={{ marginBottom: '0.4rem' }}>
              Related work
            </p>
            <p className={styles.relatedNote}>
              Signal = how many tags a project shares with this one.
            </p>
            <div className="eLedger">
              {relatedProjects.map(({ project: related, sharedTags, sameGalaxy, score }) => (
                <Link
                  key={related.id}
                  href={`/work/${related.id}`}
                  className={`eTile ${styles.relatedTile}`}
                >
                  <span className={styles.relatedMeta}>
                    <span>{sameGalaxy ? 'Same cluster' : 'Nearby system'}</span>
                    <span className="eMono">signal {score}</span>
                  </span>
                  <span className={styles.relatedTitle}>{related.title}</span>
                  <span className={styles.relatedDesc}>{related.description}</span>
                  <span className={styles.relatedTags}>
                    {sharedTags.slice(0, 3).map((tag) => (
                      <span key={tag} className={styles.relatedTag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / next navigation */}
        <nav className={styles.keepExploring} aria-label="More case studies">
          <p className="eLabel" style={{ marginBottom: '0.9rem' }}>
            Keep exploring
          </p>
          <div className={styles.navGrid}>
            <Link href={`/work/${prevProject.id}`} className={styles.navLink}>
              <span className={styles.navDirection}>
                <span aria-hidden="true">&larr;</span> Previous project
              </span>
              <span className={styles.navTitle}>{prevProject.title}</span>
              <span className={styles.navDesc}>{prevProject.description}</span>
            </Link>
            <Link
              href={`/work/${nextProject.id}`}
              className={`${styles.navLink} ${styles.navLinkRight}`}
            >
              <span className={styles.navDirection}>
                Next project <span aria-hidden="true">&rarr;</span>
              </span>
              <span className={styles.navTitle}>{nextProject.title}</span>
              <span className={styles.navDesc}>{nextProject.description}</span>
            </Link>
          </div>
        </nav>
      </main>

      <SiteFooter />
    </div>
  )
}
