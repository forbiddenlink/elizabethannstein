'use client'

import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'
import { countProofCatalogProjects, isProofCatalogProject } from '@/lib/proofLayer'
import type { Galaxy, Project } from '@/lib/types'
import { cn, formatDateRange } from '@/lib/utils'
import styles from './WorkPageClient.module.css'

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

type SortOrder = 'featured' | 'newest' | 'oldest'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
]

// Maps a galaxy id to the shared editorial category-hue token (see src/styles/editorial.css).
// The "design" galaxy reads as "creative" in the editorial palette.
const CATEGORY_DOT: Record<string, string> = {
  enterprise: '--le-cat-enterprise',
  ai: '--le-cat-ai',
  fullstack: '--le-cat-fullstack',
  devtools: '--le-cat-devtools',
  design: '--le-cat-creative',
  experimental: '--le-cat-experimental',
}

function parseYear(dateRange: string | undefined, position: 'first' | 'last'): number {
  if (!dateRange) return 0
  const years = dateRange.match(/\d{4}/g)
  if (!years?.length) return 0
  return position === 'last'
    ? Number.parseInt(years[years.length - 1], 10)
    : Number.parseInt(years[0], 10)
}

function sortProjects(projects: Project[], order: SortOrder): Project[] {
  const sorted = [...projects]
  switch (order) {
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return parseYear(b.dateRange, 'last') - parseYear(a.dateRange, 'last')
      })
    case 'newest':
      return sorted.sort((a, b) => parseYear(b.dateRange, 'last') - parseYear(a.dateRange, 'last'))
    case 'oldest':
      return sorted.sort(
        (a, b) => parseYear(a.dateRange, 'first') - parseYear(b.dateRange, 'first')
      )
    default:
      return sorted
  }
}

function normalizeGalaxyFilter(filter: string | null, galaxies: Galaxy[]): string | null {
  if (!filter) return null

  const aliases: Record<string, string> = {
    'full-stack': 'fullstack',
  }

  const normalized = aliases[filter.toLowerCase()] ?? filter.toLowerCase()
  return galaxies.some((galaxy) => galaxy.id === normalized) ? normalized : null
}

/** Status label + whether it should read as "shipped" (live dot) vs. neutral. */
function getRowStatus(project: Project): { label: string; tone: 'live' | 'progress' | 'neutral' } {
  if (project.links?.live) return { label: 'live', tone: 'live' }
  if (project.tags.includes('npm')) return { label: 'npm', tone: 'live' }
  if (project.status === 'in-progress') return { label: 'in progress', tone: 'progress' }
  if (project.status === 'archived') return { label: 'archived', tone: 'neutral' }
  return { label: 'in production', tone: 'neutral' }
}

function orgLine(project: Project): string {
  const parts = [project.company, project.role].filter(Boolean)
  const dated = formatDateRange(project.dateRange)
  return dated ? `${parts.join(' · ')} · ${dated}` : parts.join(' · ')
}

export function WorkPageClient({ galaxies }: Readonly<WorkPageClientProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialGalaxyFilter = useMemo(
    () => normalizeGalaxyFilter(searchParams.get('filter'), galaxies),
    [galaxies, searchParams]
  )
  const initialSearchQuery = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams])
  const initialShowProofCatalog = useMemo(() => {
    const viewMode = searchParams.get('view')
    if (viewMode === 'all') return false
    return initialGalaxyFilter === null
  }, [initialGalaxyFilter, searchParams])

  const initialTag = useMemo(() => searchParams.get('tag')?.trim() ?? null, [searchParams])
  const initialSortOrder = useMemo((): SortOrder => {
    const param = searchParams.get('sort')
    if (param === 'newest' || param === 'oldest') return param
    return 'featured'
  }, [searchParams])

  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(initialGalaxyFilter)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [showProofCatalog, setShowProofCatalog] = useState(initialShowProofCatalog)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag)
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // '/' keyboard shortcut focuses the search input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setSelectedGalaxy(initialGalaxyFilter)
    setSearchQuery(initialSearchQuery)
    setShowProofCatalog(initialShowProofCatalog)
    setSelectedTag(initialTag)
    setSortOrder(initialSortOrder)
  }, [
    initialGalaxyFilter,
    initialSearchQuery,
    initialShowProofCatalog,
    initialTag,
    initialSortOrder,
  ])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (selectedGalaxy) nextParams.set('filter', selectedGalaxy)
    if (searchQuery.trim()) nextParams.set('q', searchQuery.trim())
    if (!showProofCatalog) nextParams.set('view', 'all')
    if (selectedTag) nextParams.set('tag', selectedTag)
    if (sortOrder !== 'featured') nextParams.set('sort', sortOrder)

    const currentQuery = searchParams.toString()
    const nextQuery = nextParams.toString()

    if (currentQuery === nextQuery) return

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [
    pathname,
    router,
    searchParams,
    searchQuery,
    selectedGalaxy,
    showProofCatalog,
    selectedTag,
    sortOrder,
  ])

  const allProjects = useMemo(() => galaxies.flatMap((g) => g.projects), [galaxies])
  const galaxyById = useMemo(() => new Map(galaxies.map((g) => [g.id, g])), [galaxies])
  const proofCatalogCount = useMemo(() => countProofCatalogProjects(allProjects), [allProjects])

  const filteredProjects = useMemo(() => {
    let list = allProjects

    if (selectedGalaxy) {
      list = list.filter((p) => p.galaxy === selectedGalaxy)
    }

    // Proof catalog: flagship + production tiers (see proofLayer)
    if (showProofCatalog) {
      list = list.filter(isProofCatalogProject)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      list = list.filter((project) => projectMatchesQuery(project, query))
    }

    if (selectedTag) {
      list = list.filter((p) => p.tags.includes(selectedTag))
    }

    return sortProjects(list, sortOrder)
  }, [allProjects, selectedGalaxy, showProofCatalog, searchQuery, selectedTag, sortOrder])

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
      p.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      })
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag)
  }, [allProjects])

  function resetFilters() {
    setSearchQuery('')
    setSelectedGalaxy(null)
    setShowProofCatalog(false)
    setSelectedTag(null)
  }

  return (
    <>
      <header className="eHeader">
        <p className="eEyebrow">Project index</p>
        <h1 className="eTitle">
          Work &amp; <em>case studies</em>
        </h1>
        <p className="eLede" style={{ marginTop: '1.2rem' }}>
          {showProofCatalog ? (
            <>
              <strong>{filteredProjects.length} proof-tier projects</strong>: flagship work and
              production systems worth a recruiter&apos;s time.{' '}
              <button
                type="button"
                className={styles.inlineLink}
                onClick={() => setShowProofCatalog(false)}
              >
                Full catalog ({allProjects.length}) &rarr;
              </button>
            </>
          ) : (
            <>
              <strong>{filteredProjects.length} projects</strong> spanning enterprise applications,
              AI integration, full-stack development, and creative experiments.
            </>
          )}
        </p>

        <div className={styles.headerActions}>
          <RandomProjectButton projects={allProjects} className="eBtnGhost" />
        </div>

        <div className={styles.glance}>
          <span className="eLabel">At a glance</span>
          <span className={styles.glanceItem}>
            <b className="eMono">{allProjects.length}</b> systems
          </span>
          <span className={styles.glanceDivider} aria-hidden="true" />
          <span className={styles.glanceItem}>
            <b className="eMono">{missionControl.liveSystems}</b> live
          </span>
          <span className={styles.glanceDivider} aria-hidden="true" />
          <span className={styles.glanceItem}>
            <b className="eMono">{missionControl.aiSystems}</b> AI
          </span>
          <span className={styles.glanceDivider} aria-hidden="true" />
          <span className={styles.glanceItem}>
            <b className="eMono">{missionControl.enterpriseSystems}</b> enterprise
          </span>
        </div>
      </header>

      <section className={styles.filters} aria-label="Filter and sort projects">
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search projects, technologies…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search projects"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={styles.clearBtn}
              aria-label="Clear search"
            >
              <X className={styles.clearIcon} />
            </button>
          ) : (
            <kbd className={styles.kbd}>/</kbd>
          )}
        </div>

        <div className={styles.filterRow}>
          <div className={styles.toggle} role="group" aria-label="Catalog view">
            <button
              type="button"
              aria-pressed={showProofCatalog}
              className={cn(styles.toggleBtn, showProofCatalog && styles.toggleBtnActive)}
              onClick={() => setShowProofCatalog(true)}
            >
              Proof <span className="eMono">({proofCatalogCount})</span>
            </button>
            <button
              type="button"
              aria-pressed={!showProofCatalog}
              className={cn(styles.toggleBtn, !showProofCatalog && styles.toggleBtnActive)}
              onClick={() => setShowProofCatalog(false)}
            >
              Full catalog <span className="eMono">({allProjects.length})</span>
            </button>
          </div>

          <div className={styles.chips} role="group" aria-label="Filter by category">
            <button
              type="button"
              aria-pressed={selectedGalaxy === null}
              className={cn(styles.chip, selectedGalaxy === null && styles.chipActive)}
              onClick={() => setSelectedGalaxy(null)}
            >
              All
            </button>
            {galaxies.map((galaxy) => (
              <button
                type="button"
                key={galaxy.id}
                aria-pressed={selectedGalaxy === galaxy.id}
                className={cn(styles.chip, selectedGalaxy === galaxy.id && styles.chipActive)}
                onClick={() => setSelectedGalaxy(galaxy.id)}
              >
                <span
                  className={styles.chipDot}
                  aria-hidden="true"
                  style={{ background: `var(${CATEGORY_DOT[galaxy.id] ?? '--le-muted'})` }}
                />
                {galaxy.name}
              </button>
            ))}
          </div>

          <div className={styles.sortWrap}>
            <label htmlFor="sort-select" className="sr-only">
              Sort projects
            </label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className={styles.sortSelect}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!searchQuery.trim() && topTags.length > 0 && (
          <div className={styles.tagRow}>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={cn(styles.tag, styles.tagActive)}
              >
                <X className={styles.tagIcon} aria-hidden="true" />
                {selectedTag}
              </button>
            )}
            {topTags
              .filter((tag) => tag !== selectedTag)
              .map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={styles.tag}
                >
                  {tag}
                </button>
              ))}
          </div>
        )}
      </section>

      {filteredProjects.length === 0 ? (
        <div className={styles.empty}>
          <p className="eLede">
            No projects match{searchQuery.trim() ? ` “${searchQuery.trim()}”` : ' these filters'}.
          </p>
          <button type="button" className="eBtnGhost" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className={styles.list} role="list" aria-label="Projects">
          {filteredProjects.map((project, idx) => {
            const galaxy = galaxyById.get(project.galaxy)
            const status = getRowStatus(project)
            const revealClass =
              idx < 5 ? `eReveal eR${idx + 1}` : idx < 8 ? 'eReveal eR5' : undefined

            return (
              <div key={project.id} role="listitem" className={styles.row}>
                <Link href={`/work/${project.id}`} className={cn(styles.rowLink, revealClass)}>
                  <span className={styles.num}>{String(idx + 1).padStart(2, '0')}</span>
                  <span>
                    <span className={styles.title}>{project.title}</span>
                    <span className={styles.org}>{orgLine(project)}</span>
                  </span>
                  <span className={styles.desc}>{project.description}</span>
                  <span className={styles.status}>
                    <span className={styles.statusLine}>
                      <span
                        className={cn(
                          styles.statusDot,
                          status.tone === 'live' && styles.statusDotLive,
                          status.tone === 'progress' && styles.statusDotProgress
                        )}
                      />
                      <span className={styles.statusLabel}>{status.label}</span>
                    </span>
                    {galaxy && (
                      <span className={styles.catLine}>
                        <span
                          className={styles.catDot}
                          aria-hidden="true"
                          style={{
                            background: `var(${CATEGORY_DOT[galaxy.id] ?? '--le-muted'})`,
                          }}
                        />
                        {galaxy.name}
                      </span>
                    )}
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
