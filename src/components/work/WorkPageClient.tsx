'use client'

import { GalaxyFilter } from '@/components/ui/GalaxyFilter'
import { ProjectBadges } from '@/components/ui/ProjectBadges'
import { ProjectPlaceholder } from '@/components/ui/ProjectPlaceholder'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import { SplitWords } from '@/components/ui/SplitText'
import { TiltCard } from '@/components/ui/TiltCard'
import type { Galaxy, Project } from '@/lib/types'
import { cn, formatDateRange } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ExternalLink, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

// Map project IDs to their screenshot paths
const PROJECT_SCREENSHOTS: Record<string, string> = {
  // Enterprise
  'flo-labs': '/screenshots/flo-labs.png',
  'caipo-ai': '/screenshots/caipo-ai.webp',
  'moodchanger-ai': '/screenshots/moodchanger-ai.png',
  hephaestus: '/screenshots/hephaestus.png',
  'robocollective-ai': '/screenshots/robocollective-ai.webp',
  // AI Frontier
  'finance-quest': '/screenshots/finance-quest.webp',
  stancestream: '/screenshots/stance-stream.png',
  explainthiscode: '/screenshots/explain-this-code.webp',
  tubedigest: '/screenshots/tubedigest.png',
  contradictme: '/screenshots/contradictme.webp',
  'dev-interviewer': '/screenshots/dev-interviewer.png',
  // Full-Stack
  'portfolio-pro': '/screenshots/portfolio-pro.png',
  'create-surveys': '/screenshots/create-surveys.png',
  'quantum-forge': '/screenshots/quantum-forge.webp',
  'skill-mapper': '/screenshots/skill-mapper.png',
  reprise: '/screenshots/reprise.webp',
  // DevTools
  componentcompass: '/screenshots/componentcompass.png',
  'security-trainer': '/screenshots/security-trainer.png',
  'encryption-visualizer': '/screenshots/encryption-visualizer.png',
  // Creative
  'goodstuff-foodtruck': '/screenshots/goodstuff-foodtruck.png',
  'studio-furniture': '/screenshots/studio-furniture.png',
  rivet: '/screenshots/rivet.png',
  // Experimental
  pollyglot: '/screenshots/pollyglot.png',
  'guts-and-glory': '/screenshots/guts-and-glory.png',
  'plant-therapy': '/screenshots/plant-therapy.webp',
  'timeslip-search': '/screenshots/timeslip-search.webp',
  mythos: '/screenshots/mythos.webp',
  'apoc-bnb': '/screenshots/apoc-bnb.png',
  'canvas-flow': '/screenshots/canvas-flow.png',
}

// Stagger animation variants for project cards
const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function ProjectLinks({ project }: Readonly<{ project: Project }>) {
  if (!project.links) return null
  const hasLive = !!project.links.live
  const hasGithub = !!project.links.github
  if (!hasLive && !hasGithub) return null

  return (
    <div className="flex items-center gap-2">
      {hasLive && (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] border border-success/20 group-hover:bg-success/20 group-hover:border-success/30 transition-all"
          title="Live demo available"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:inline">Live demo</span>
        </span>
      )}
      {hasGithub && (
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple text-[10px] border border-accent-purple/20 group-hover:bg-accent-purple/20 group-hover:border-accent-purple/30 transition-all"
          title="Source code available"
        >
          <GitHubIcon className="w-3 h-3" />
          <span className="hidden sm:inline">Source code</span>
        </span>
      )}
    </div>
  )
}

interface WorkPageClientProps {
  galaxies: Galaxy[]
}

function projectMatchesQuery(project: Project, query: string): boolean {
  return (
    project.title.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query) ||
    project.tags.some((tag) => tag.toLowerCase().includes(query))
  )
}

function normalizeGalaxyFilter(filter: string | null, galaxies: Galaxy[]): string | null {
  if (!filter) return null

  const aliases: Record<string, string> = {
    'full-stack': 'fullstack',
  }

  const normalized = aliases[filter.toLowerCase()] ?? filter.toLowerCase()
  return galaxies.some((galaxy) => galaxy.id === normalized) ? normalized : null
}

export function WorkPageClient({ galaxies }: Readonly<WorkPageClientProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialGalaxyFilter = useMemo(
    () => normalizeGalaxyFilter(searchParams.get('filter'), galaxies),
    [galaxies, searchParams],
  )
  const initialSearchQuery = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams])
  const initialShowFeaturedOnly = useMemo(() => {
    const viewMode = searchParams.get('view')
    if (viewMode === 'all') return false
    return initialGalaxyFilter === null
  }, [initialGalaxyFilter, searchParams])

  const initialTag = useMemo(() => searchParams.get('tag')?.trim() ?? null, [searchParams])

  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(initialGalaxyFilter)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(initialShowFeaturedOnly)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag)

  useEffect(() => {
    setSelectedGalaxy(initialGalaxyFilter)
    setSearchQuery(initialSearchQuery)
    setShowFeaturedOnly(initialShowFeaturedOnly)
    setSelectedTag(initialTag)
  }, [initialGalaxyFilter, initialSearchQuery, initialShowFeaturedOnly, initialTag])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (selectedGalaxy) nextParams.set('filter', selectedGalaxy)
    if (searchQuery.trim()) nextParams.set('q', searchQuery.trim())
    if (!showFeaturedOnly) nextParams.set('view', 'all')
    if (selectedTag) nextParams.set('tag', selectedTag)

    const currentQuery = searchParams.toString()
    const nextQuery = nextParams.toString()

    if (currentQuery === nextQuery) return

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [pathname, router, searchParams, searchQuery, selectedGalaxy, showFeaturedOnly, selectedTag])

  const allProjects = useMemo(() => galaxies.flatMap((g) => g.projects), [galaxies])
  const featuredCount = useMemo(() => allProjects.filter((p) => p.featured).length, [allProjects])

  const filteredGalaxies = useMemo(() => {
    let filtered = selectedGalaxy ? galaxies.filter((g) => g.id === selectedGalaxy) : galaxies

    // Filter to featured projects only when toggle is on
    if (showFeaturedOnly) {
      filtered = filtered
        .map((galaxy) => ({
          ...galaxy,
          projects: galaxy.projects.filter((p) => p.featured),
        }))
        .filter((g) => g.projects.length > 0)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered
        .map((galaxy) => ({
          ...galaxy,
          projects: galaxy.projects.filter((project) => projectMatchesQuery(project, query)),
        }))
        .filter((g) => g.projects.length > 0)
    }

    if (selectedTag) {
      filtered = filtered
        .map((galaxy) => ({
          ...galaxy,
          projects: galaxy.projects.filter((p) => p.tags.includes(selectedTag)),
        }))
        .filter((g) => g.projects.length > 0)
    }

    return filtered
  }, [galaxies, selectedGalaxy, searchQuery, showFeaturedOnly, selectedTag])

  const projectCount = useMemo(() => {
    return filteredGalaxies.reduce((acc, g) => acc + g.projects.length, 0)
  }, [filteredGalaxies])

  const missionControl = useMemo(() => {
    const liveSystems = allProjects.filter((p) => p.links?.live).length
    const enterpriseSystems = galaxies.find((g) => g.id === 'enterprise')?.projects.length ?? 0
    const aiSystems = galaxies.find((g) => g.id === 'ai')?.projects.length ?? 0
    return {
      liveSystems,
      enterpriseSystems,
      aiSystems,
    }
  }, [allProjects, galaxies])

  const topTags = useMemo(() => {
    const counts = new Map<string, number>()
    allProjects.forEach((p) => {
      p.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1))
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag)
  }, [allProjects])

  return (
    <div id="work-content" className="max-w-7xl w-full mx-auto">
      {/* Header */}
      <header className="mb-16">
        <ScrollReveal direction="up" delay={0.2}>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-4">
            <SplitWords delay={0.3}>Projects & Case Studies</SplitWords>
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.4}>
          <p className="text-base md:text-lg text-white/(--text-opacity-tertiary) max-w-2xl leading-relaxed">
            {showFeaturedOnly ? (
              <>
                <span className="text-white/(--text-opacity-primary) font-medium">
                  {projectCount} featured case studies
                </span>{' '}
                — the strongest starting points if you're skimming.{' '}
                <button
                  onClick={() => setShowFeaturedOnly(false)}
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                >
                  Show all {allProjects.length} projects →
                </button>
              </>
            ) : (
              <>
                <span className="text-white/(--text-opacity-primary) font-medium">
                  {projectCount} projects
                </span>{' '}
                spanning enterprise applications, AI integration, full-stack development, and
                creative experiments.
              </>
            )}
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.6}>
          <div className="mt-8">
            <RandomProjectButton projects={allProjects} />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.7}>
          <section className="mt-8 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 md:p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <h2 className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-white/50 font-semibold">
                Mission Control
              </h2>
              <span className="text-[11px] text-white/40">Recruiter fast lane</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-1">
                  Systems
                </p>
                <p className="text-lg font-semibold text-white">{allProjects.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-1">
                  Live Missions
                </p>
                <p className="text-lg font-semibold text-white">{missionControl.liveSystems}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-1">
                  AI Sector
                </p>
                <p className="text-lg font-semibold text-cyan-200">{missionControl.aiSystems}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-1">
                  Enterprise Sector
                </p>
                <p className="text-lg font-semibold text-orange-200">
                  {missionControl.enterpriseSystems}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-white/40 mr-1">Quick jumps:</span>
              <button
                onClick={() => {
                  setSelectedGalaxy('enterprise')
                  setShowFeaturedOnly(true)
                }}
                className="px-2.5 py-1 rounded-full text-[11px] border border-orange-300/30 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25 transition-colors"
              >
                Enterprise missions
              </button>
              <button
                onClick={() => {
                  setSelectedGalaxy('ai')
                  setShowFeaturedOnly(true)
                }}
                className="px-2.5 py-1 rounded-full text-[11px] border border-cyan-300/30 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25 transition-colors"
              >
                AI frontier
              </button>
              <button
                onClick={() => {
                  setSelectedGalaxy(null)
                  setShowFeaturedOnly(false)
                }}
                className="px-2.5 py-1 rounded-full text-[11px] border border-purple-300/30 bg-purple-500/15 text-purple-200 hover:bg-purple-500/25 transition-colors"
              >
                Full universe
              </button>
            </div>
          </section>
        </ScrollReveal>
      </header>

      {/* Search and Filter */}
      <ScrollReveal direction="up" delay={0.7}>
        <div className="mb-12 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glass w-full pl-11 pr-10"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Featured Toggle + Galaxy Filter */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Featured Only Toggle */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
              <button
                onClick={() => setShowFeaturedOnly(true)}
                className={cn(
                  'min-h-9 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  showFeaturedOnly
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5',
                )}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured ({featuredCount})
                </span>
              </button>
              <button
                onClick={() => setShowFeaturedOnly(false)}
                className={cn(
                  'min-h-9 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  showFeaturedOnly
                    ? 'text-white/60 hover:text-white/80 hover:bg-white/5'
                    : 'bg-white/10 text-white shadow-lg',
                )}
              >
                All ({allProjects.length})
              </button>
            </div>

            <GalaxyFilter
              galaxies={galaxies.map((g) => ({ id: g.id, name: g.name, color: g.color }))}
              selectedGalaxy={selectedGalaxy}
              onFilterChange={setSelectedGalaxy}
            />
          </div>

          {/* Tech Tag Filter */}
          {!searchQuery.trim() && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all"
                >
                  <X className="w-3 h-3" />
                  {selectedTag}
                </button>
              )}
              {topTags
                .filter((tag) => tag !== selectedTag)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 hover:text-white/80 hover:border-white/20 transition-all"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* No Results Message */}
      {filteredGalaxies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/(--text-opacity-tertiary) text-lg mb-2">
            No projects found for "{searchQuery}"
          </p>
          <p className="text-white/(--text-opacity-muted) text-sm mb-6">
            Try one of these popular searches:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['React', 'AI', 'TypeScript', 'Next.js', 'Full-stack', 'Enterprise'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-all text-sm"
              >
                {term}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedGalaxy(null)
              setShowFeaturedOnly(false)
              setSelectedTag(null)
            }}
            className="px-4 py-2 bg-surface-3 border border-white/(--border-opacity-strong) rounded-lg text-white/(--text-opacity-secondary) hover:bg-surface-4 hover:text-white transition-all text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Projects by Galaxy - Bento Grid */}
      {filteredGalaxies.map((galaxy, galaxyIdx) => {
        const featured = galaxy.projects.filter((p) => p.featured)
        const regular = galaxy.projects.filter((p) => !p.featured)

        return (
          <section key={galaxy.id} className="mb-20">
            <ScrollReveal direction="up" delay={galaxyIdx * 0.1}>
              <div className="relative mb-8 pb-3">
                {/* Nebula ambient glow behind the header */}
                <div
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-48 h-12 opacity-15 blur-3xl rounded-full pointer-events-none"
                  style={{ backgroundColor: galaxy.color }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center gap-3">
                  {/* Animated pulsing star indicator */}
                  <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: galaxy.color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-3 w-3"
                      style={{ backgroundColor: galaxy.color }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white leading-tight">{galaxy.name}</h2>
                    <p className="text-xs text-white/40 mt-0.5">{galaxy.description}</p>
                  </div>
                  {/* Systems count badge */}
                  <span
                    className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border"
                    style={{
                      color: galaxy.color,
                      borderColor: `${galaxy.color}30`,
                      backgroundColor: `${galaxy.color}10`,
                    }}
                  >
                    {galaxy.projects.length} {galaxy.projects.length === 1 ? 'system' : 'systems'}
                  </span>
                </div>
                {/* Galaxy-colored gradient separator */}
                <div
                  className="mt-4 h-px opacity-25"
                  style={{
                    background: `linear-gradient(90deg, ${galaxy.color}, ${galaxy.color}40, transparent)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>

            {/* Bento Grid with stagger animation */}
            <motion.div
              className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {/* Featured projects span 2 columns */}
              {featured.map((project, idx) => {
                const screenshotPath = PROJECT_SCREENSHOTS[project.id]
                const isHero = idx === 0 && featured.length > 0

                // MAGAZINE-STYLE HERO CARD
                if (isHero) {
                  return (
                    <motion.div
                      key={project.id}
                      custom={idx}
                      variants={cardVariants}
                      className="md:col-span-2 md:row-span-1 h-full min-h-[320px] md:min-h-[400px]"
                    >
                      <Link
                        href={`/work/${project.id}`}
                        className="group block h-full rounded-2xl overflow-hidden relative border-2 border-white/10 hover:border-white/25 transition-all duration-500"
                      >
                        {/* Background with screenshot or generative placeholder */}
                        <div className="absolute inset-0">
                          {screenshotPath ? (
                            <Image
                              src={screenshotPath}
                              alt=""
                              fill
                              className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                            />
                          ) : (
                            <ProjectPlaceholder
                              title={project.title}
                              color={project.color}
                              className="opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            />
                          )}

                          {/* Overlay gradient (dark at bottom for text readability) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-8">
                          {/* Badges at top */}
                          <div className="flex justify-end">
                            <ProjectBadges project={project} />
                          </div>

                          {/* Title + Description at bottom */}
                          <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 group-hover:text-gradient transition-all">
                              {project.title}
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 line-clamp-3 md:line-clamp-2 leading-relaxed">
                              {project.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 text-[10px] md:text-xs font-medium rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider text-white/60 group-hover:text-white transition-colors px-3 py-2 bg-white/5 rounded-lg group-hover:bg-white/10 group-hover:shadow-lg">
                              <span>See Case Study</span>
                              <svg
                                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                }

                // REGULAR FEATURED CARDS (idx > 0)
                return (
                  <motion.div
                    key={project.id}
                    custom={idx}
                    variants={cardVariants}
                    className="h-full"
                  >
                    <TiltCard className="h-full">
                      <Link
                        href={`/work/${project.id}`}
                        className="group block h-full rounded-xl border transition-all duration-300 relative overflow-hidden p-5 border-white/10 bg-linear-to-br from-white/3 to-transparent hover:border-white/25 hover:from-white/8 hover:to-white/2 hover:shadow-[0_0_40px_var(--glow-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                        style={{ '--glow-color': `${galaxy.color}30` } as React.CSSProperties}
                      >
                        {/* Accent border line at top */}
                        <div
                          className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${galaxy.color}, transparent)`,
                          }}
                        />

                        <div className="mb-3 flex-1">
                          <span
                            className="inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded mb-2 shrink-0"
                            style={{
                              backgroundColor: `${galaxy.color}30`,
                              color: galaxy.color,
                              border: `1px solid ${galaxy.color}50`,
                              boxShadow: `0 0 12px ${galaxy.color}20`,
                            }}
                          >
                            ⭐ Featured
                          </span>
                        </div>
                        <div>
                          <h3
                            className="text-base md:text-lg font-semibold transition-colors mb-2"
                            style={{ color: 'white' }}
                          >
                            <span className="group-hover:bg-linear-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                              {project.title}
                            </span>
                          </h3>
                        </div>

                        <p className="text-xs md:text-sm text-white/(--text-opacity-tertiary) mb-4 line-clamp-3 md:line-clamp-2 leading-relaxed group-hover:text-white/(--text-opacity-secondary) transition-colors">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[10px] rounded transition-all duration-150 hover:scale-105"
                              style={{
                                backgroundColor: `${galaxy.color}10`,
                                color: `${galaxy.color}cc`,
                                border: `1px solid ${galaxy.color}20`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-white/(--text-opacity-muted) font-mono mt-auto pt-3 border-t border-white/(--border-opacity-default)">
                          <span>{formatDateRange(project.dateRange)}</span>
                          <ProjectLinks project={project} />
                        </div>
                      </Link>
                    </TiltCard>
                  </motion.div>
                )
              })}

              {/* Regular projects */}
              {regular.map((project, idx) => (
                <motion.div
                  key={project.id}
                  custom={featured.length + idx}
                  variants={cardVariants}
                  className="h-full"
                >
                  <TiltCard className="h-full">
                    <Link
                      href={`/work/${project.id}`}
                      className={cn(
                        'group block h-full rounded-xl border transition-all duration-300 p-4 md:p-5 relative overflow-hidden',
                        'border-white/10 bg-linear-to-br from-white/2 to-transparent',
                        'hover:border-white/20 hover:from-white/6 hover:to-white/1',
                        'hover:shadow-[0_0_30px_var(--glow-color)]',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30',
                      )}
                      style={{ '--glow-color': `${galaxy.color}25` } as React.CSSProperties}
                    >
                      {/* Subtle accent dot */}
                      <div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity group-hover:scale-125"
                        style={{ backgroundColor: galaxy.color }}
                      />

                      <h3 className="text-sm md:text-lg font-semibold mb-2 text-white group-hover:text-white transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs md:text-sm text-white/(--text-opacity-tertiary) mb-4 line-clamp-3 md:line-clamp-2 leading-relaxed group-hover:text-white/(--text-opacity-secondary) transition-colors">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded transition-all duration-150 hover:scale-105"
                            style={{
                              backgroundColor: `${galaxy.color}08`,
                              color: `${galaxy.color}aa`,
                              border: `1px solid ${galaxy.color}15`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] text-white/(--text-opacity-muted)">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] md:text-[11px] text-white/(--text-opacity-muted) font-mono mt-auto pt-3 border-t border-white/(--border-opacity-subtle)">
                        <span>{formatDateRange(project.dateRange)}</span>
                        <ProjectLinks project={project} />
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
