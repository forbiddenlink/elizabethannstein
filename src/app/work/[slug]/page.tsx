import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { TiltCard } from '@/components/ui/TiltCard'
import { SITE } from '@/lib/constants'
import { allProjects, getProjectById } from '@/lib/galaxyData'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const GALAXY_ACCENTS = {
  enterprise: {
    line: 'from-orange-400/70',
    badge: 'text-orange-200 border-orange-300/30 bg-orange-500/15',
    tag: 'bg-orange-500/10 border-orange-400/20 text-orange-200',
  },
  ai: {
    line: 'from-cyan-400/70',
    badge: 'text-cyan-200 border-cyan-300/30 bg-cyan-500/15',
    tag: 'bg-cyan-500/10 border-cyan-400/20 text-cyan-200',
  },
  fullstack: {
    line: 'from-purple-400/70',
    badge: 'text-purple-200 border-purple-300/30 bg-purple-500/15',
    tag: 'bg-purple-500/10 border-purple-400/20 text-purple-200',
  },
  devtools: {
    line: 'from-emerald-400/70',
    badge: 'text-emerald-200 border-emerald-300/30 bg-emerald-500/15',
    tag: 'bg-emerald-500/10 border-emerald-400/20 text-emerald-200',
  },
  design: {
    line: 'from-pink-400/70',
    badge: 'text-pink-200 border-pink-300/30 bg-pink-500/15',
    tag: 'bg-pink-500/10 border-pink-400/20 text-pink-200',
  },
  experimental: {
    line: 'from-amber-400/70',
    badge: 'text-amber-200 border-amber-300/30 bg-amber-500/15',
    tag: 'bg-amber-500/10 border-amber-400/20 text-amber-200',
  },
} as const

type GalaxyAccentKey = keyof typeof GALAXY_ACCENTS

function toGalaxyAccentKey(value: string): GalaxyAccentKey {
  return value in GALAXY_ACCENTS ? (value as GalaxyAccentKey) : 'fullstack'
}

function getSignalStrengthLabel(score: number): string {
  if (score >= 5) return 'High'
  if (score >= 3) return 'Medium'
  return 'Low'
}

function getSignalStrengthWidth(score: number): string {
  if (score >= 5) return 'w-full'
  if (score >= 3) return 'w-2/3'
  return 'w-1/3'
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.id,
  }))
}

function normalizeDescription(desc: string, tags?: string[]): string {
  const MIN = 120
  const MAX = 160

  if (desc.length > MAX) return desc.slice(0, MAX - 3).trimEnd() + '...'
  if (desc.length >= MIN) return desc

  const techSuffix = tags?.length ? ` Built with ${tags.slice(0, 3).join(', ')}.` : ''
  const result = desc + techSuffix
  if (result.length > MAX) return desc
  if (result.length >= MIN) return result

  const full = result + ' View project details and implementation.'
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
    return {}
  }

  const metaDescription = normalizeDescription(project.description, project.tags)

  return {
    title: `${project.title} - Project by Elizabeth Stein`,
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

  const currentAccent = GALAXY_ACCENTS[toGalaxyAccentKey(project.galaxy)]
  const prevAccent = GALAXY_ACCENTS[toGalaxyAccentKey(prevProject.galaxy)]
  const nextAccent = GALAXY_ACCENTS[toGalaxyAccentKey(nextProject.galaxy)]

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
    <div className="min-h-screen bg-black text-white relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Skip Link for Accessibility */}
      <a
        href="#project-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <ScrollProgress color={project.color} />
      <SiteHeader accentGalaxy={project.galaxy} />

      {/* Main Content with top padding for fixed header */}
      <main
        id="project-content"
        className="pt-32 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700"
      >
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="project-story-shell relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 md:px-8 md:py-10">
            <div
              className={`project-story-beam absolute inset-x-0 top-0 h-px bg-linear-to-r ${currentAccent.line} to-transparent opacity-80`}
              aria-hidden="true"
            />
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${currentAccent.badge}`}
                  >
                    {project.galaxy}
                  </span>
                  {project.dateRange && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                      {project.dateRange}
                    </span>
                  )}
                </div>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  {project.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
                  {project.description}
                </p>
              </div>

              <div className="project-story-metadata rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                  Project Frame
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Role</p>
                    <p className="mt-1 text-sm text-white/75">{project.role}</p>
                  </div>
                  {project.company && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                        Context
                      </p>
                      <p className="mt-1 text-sm text-white/75">{project.company}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                      Navigator
                    </p>
                    <p className="mt-1 text-sm text-white/75">
                      Scroll for full case study, then use the constellation rail to jump laterally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProjectCaseStudy project={project} />

        {/* Jump Constellation Rail */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-4 md:p-5 overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r ${currentAccent.line} to-transparent opacity-70`}
              aria-hidden="true"
            />

            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <h2 className="text-xs md:text-sm tracking-[0.22em] uppercase text-white/50 font-semibold">
                Jump Constellation
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] border ${currentAccent.badge}`}
              >
                Current system: {project.title}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Link
                href={`/work/${prevProject.id}`}
                className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs text-white/45 mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  Previous System
                </div>
                <p className={`text-sm font-semibold ${prevAccent.badge.split(' ')[0]}`}>
                  {prevProject.title}
                </p>
              </Link>

              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="text-xs text-white/45 mb-1">Current System</div>
                <p className="text-sm font-semibold text-white">{project.title}</p>
              </div>

              <Link
                href={`/work/${nextProject.id}`}
                className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3"
              >
                <div className="flex items-center justify-end gap-2 text-xs text-white/45 mb-1">
                  Next System
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className={`text-sm font-semibold text-right ${nextAccent.badge.split(' ')[0]}`}>
                  {nextProject.title}
                </p>
              </Link>
            </div>

            {relatedProjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-white/40 mr-1">Nearby jumps:</span>
                {relatedProjects.map(({ project: related }) => {
                  const accent = GALAXY_ACCENTS[toGalaxyAccentKey(related.galaxy)]
                  return (
                    <Link
                      key={related.id}
                      href={`/work/${related.id}`}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors hover:bg-white/10 ${accent.tag}`}
                    >
                      {related.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Related Projects by Tag Overlap */}
        {relatedProjects.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-20">
            <h2 className="text-xl font-bold mb-6 text-white/60 tracking-wide">
              Constellation Neighbors
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProjects.map(({ project: related, sharedTags, sameGalaxy, score }) => {
                const sourceAccent = GALAXY_ACCENTS[toGalaxyAccentKey(project.galaxy)]
                const relatedAccent = GALAXY_ACCENTS[toGalaxyAccentKey(related.galaxy)]
                return (
                  <TiltCard key={related.id}>
                    <Link
                      href={`/work/${related.id}`}
                      className="block p-6 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors relative overflow-hidden"
                    >
                      {/* Constellation connector accent */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-px opacity-70 bg-linear-to-r ${sourceAccent.line} ${relatedAccent.line.replace('from-', 'via-')} to-transparent`}
                        aria-hidden="true"
                      />

                      <div className="flex items-center justify-between mb-3">
                        {sameGalaxy ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] border ${relatedAccent.badge}`}
                          >
                            Same cluster
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] border border-white/15 text-white/40 bg-white/5">
                            Nearby system
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-white/40">signal {score}</span>
                      </div>

                      <div className="mb-3">
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-linear-to-r ${relatedAccent.line} to-white/20 ${getSignalStrengthWidth(score)}`}
                          />
                        </div>
                        <div className="mt-1 text-[10px] text-white/35">
                          Signal: {getSignalStrengthLabel(score)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {sharedTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-full border text-[10px] ${relatedAccent.tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-white/50 text-sm line-clamp-2">{related.description}</p>
                    </Link>
                  </TiltCard>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-2xl font-bold mb-8 text-white/70">Explore More</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TiltCard className="h-full">
              <Link
                href={`/work/${prevProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-white/40 mb-4 text-sm font-mono">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Previous Project
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{prevProject.title}</h3>
                <p className="text-white/60 line-clamp-2">{prevProject.description}</p>
              </Link>
            </TiltCard>

            <TiltCard className="h-full">
              <Link
                href={`/work/${nextProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-end gap-2 text-white/40 mb-4 text-sm font-mono">
                  Next Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-right">
                  {nextProject.title}
                </h3>
                <p className="text-white/60 line-clamp-2 text-right">{nextProject.description}</p>
              </Link>
            </TiltCard>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
