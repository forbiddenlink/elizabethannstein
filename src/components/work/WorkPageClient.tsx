'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectPlate } from '@/components/editorial/ProjectPlate'
import { RandomProjectButton } from '@/components/ui/RandomProjectButton'
import { CONTACT } from '@/lib/constants'
import { staticStatus, whoLine, withoutEmoji } from '@/lib/flagshipDisplay'
import { FLAGSHIPS, type Flagship } from '@/lib/flagships'
import { isProofCatalogProject } from '@/lib/proofLayer'
import type { Galaxy, Project } from '@/lib/types'
import styles from './WorkPageClient.module.css'

interface WorkPageClientProps {
  galaxies: Galaxy[]
  /** Raw query-string values read server-side (Page's `searchParams` prop), so the
   *  initial render — including the crawler-visible static/SSR HTML — reflects the
   *  requested filter/search/sort instead of bailing out to client-only rendering.
   *  `useSearchParams()` forces that bailout, so it's used here only for the
   *  client-only "did the URL already match?" check in the sync effect below. */
  initialFilterParam: string | null
  initialQueryParam: string | null
  /** `?view=all` (old shared links) opens the archive with experiments included. */
  initialViewParam: string | null
  initialTagParam: string | null
  initialSortParam: string | null
}

function projectMatchesQuery(project: Project, query: string): boolean {
  return (
    project.title.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query) ||
    (project.company?.toLowerCase().includes(query) ?? false) ||
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

// Plain category names for the content site. The themed galaxy names ("Full-Stack Nebula")
// belong to the /explore showcase.
const CATEGORY_LABEL: Record<string, string> = {
  enterprise: 'Enterprise',
  ai: 'AI',
  fullstack: 'Full-stack',
  devtools: 'Dev tools',
  design: 'Design',
  experimental: 'Experiments',
}

function categoryLabel(galaxy: Galaxy): string {
  return CATEGORY_LABEL[galaxy.id] ?? galaxy.name
}

function parseYear(dateRange: string | undefined, position: 'first' | 'last'): number {
  if (!dateRange) return 0
  const years = dateRange.match(/\d{4}/g)
  if (!years?.length) return 0
  return position === 'last'
    ? Number.parseInt(years[years.length - 1], 10)
    : Number.parseInt(years[0], 10)
}

/** "2025-2026" reads as "2025-26" in the table's year column. */
function shortYears(dateRange: string | undefined): string {
  if (!dateRange) return ''
  const first = parseYear(dateRange, 'first')
  const last = parseYear(dateRange, 'last')
  if (!first) return dateRange
  if (first === last) return String(first)
  return `${first}-${String(last).slice(2)}`
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

function SelectedCard({ flagship, project }: Readonly<{ flagship: Flagship; project?: Project }>) {
  const status = staticStatus(flagship)

  return (
    <Link
      href={`/work/${flagship.id}`}
      className={styles.card}
      aria-labelledby={`sel-${flagship.id}-title`}
      aria-describedby={`sel-${flagship.id}-desc`}
    >
      <ProjectPlate flagship={flagship} project={project} sizes="(max-width: 640px) 100vw, 560px" />
      <h3 id={`sel-${flagship.id}-title`} className={styles.cardTitle}>
        {flagship.title}
      </h3>
      <p id={`sel-${flagship.id}-desc`} className={styles.cardDesc}>
        {flagship.summary}
      </p>
      <p className={styles.cardMeta}>
        {whoLine(flagship)}. {status.label}, {status.detail}
      </p>
    </Link>
  )
}

export function WorkPageClient({
  galaxies,
  initialFilterParam,
  initialQueryParam,
  initialViewParam,
  initialTagParam,
  initialSortParam,
}: Readonly<WorkPageClientProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const initialGalaxyFilter = useMemo(
    () => normalizeGalaxyFilter(initialFilterParam, galaxies),
    [galaxies, initialFilterParam]
  )
  const initialSearchQuery = useMemo(() => initialQueryParam?.trim() ?? '', [initialQueryParam])
  const initialTag = useMemo(() => initialTagParam?.trim() || null, [initialTagParam])
  const initialSortOrder = useMemo((): SortOrder => {
    if (initialSortParam === 'newest' || initialSortParam === 'oldest') return initialSortParam
    return 'featured'
  }, [initialSortParam])

  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(initialGalaxyFilter)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag)
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder)
  // The archive opens on shipped work; experiments, games and retired projects are one
  // click away instead of padding the first screen.
  const [showExperiments, setShowExperiments] = useState(initialViewParam === 'all')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // '/' keyboard shortcut focuses the search input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
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
    setSelectedTag(initialTag)
    setSortOrder(initialSortOrder)
  }, [initialGalaxyFilter, initialSearchQuery, initialTag, initialSortOrder])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (selectedGalaxy) nextParams.set('filter', selectedGalaxy)
    if (searchQuery.trim()) nextParams.set('q', searchQuery.trim())
    if (selectedTag) nextParams.set('tag', selectedTag)
    if (sortOrder !== 'featured') nextParams.set('sort', sortOrder)

    // Client-only read (this effect never runs during SSR/SSG) — avoids
    // useSearchParams(), which would force this whole tree back to
    // client-only rendering and reintroduce the empty-initial-HTML problem
    // this component was refactored to avoid.
    const currentQuery = window.location.search.replace(/^\?/, '')
    const nextQuery = nextParams.toString()

    if (currentQuery === nextQuery) return

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [pathname, router, searchQuery, selectedGalaxy, selectedTag, sortOrder])

  const allProjects = useMemo(() => galaxies.flatMap((g) => g.projects), [galaxies])
  const galaxyById = useMemo(() => new Map(galaxies.map((g) => [g.id, g])), [galaxies])
  const projectById = useMemo(() => new Map(allProjects.map((p) => [p.id, p])), [allProjects])

  const filteredProjects = useMemo(() => {
    let list = allProjects

    // A search or a category pick is a deliberate request, so it searches everything.
    if (!showExperiments && !searchQuery.trim() && !selectedGalaxy && !selectedTag) {
      list = list.filter(isProofCatalogProject)
    }

    if (selectedGalaxy) {
      list = list.filter((p) => p.galaxy === selectedGalaxy)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      list = list.filter((project) => projectMatchesQuery(project, query))
    }

    if (selectedTag) {
      list = list.filter((p) => p.tags.includes(selectedTag))
    }

    return sortProjects(list, sortOrder)
  }, [allProjects, selectedGalaxy, searchQuery, selectedTag, sortOrder, showExperiments])

  const experimentCount = useMemo(
    () => allProjects.filter((p) => !isProofCatalogProject(p)).length,
    [allProjects]
  )
  const filtersActive = Boolean(searchQuery.trim() || selectedGalaxy || selectedTag)

  function resetFilters() {
    setSearchQuery('')
    setSelectedGalaxy(null)
    setSelectedTag(null)
    searchInputRef.current?.focus()
  }

  return (
    <>
      <header className="ePageHead">
        <h1>Work</h1>
        <p>
          {allProjects.length} projects since 2023. The {FLAGSHIPS.length} selected below are the
          ones I&apos;d show you first. The archive under them has the rest, each with its own page.
        </p>
        <p className={styles.hire}>
          Hiring? <a href={`mailto:${CONTACT.email}`}>Email me</a> or{' '}
          <a href="/resume/elizabeth-stein-resume.pdf" download="Elizabeth_Stein_Resume.pdf">
            download the résumé
          </a>
          .
        </p>
      </header>

      <section className="eSect" aria-labelledby="selected-heading">
        <div className="eSectHead">
          <h2 id="selected-heading">Selected</h2>
          <p>{FLAGSHIPS.length} projects</p>
        </div>
        <div className={styles.grid}>
          {FLAGSHIPS.map((f) => (
            <SelectedCard key={f.id} flagship={f} project={projectById.get(f.id)} />
          ))}
        </div>
      </section>

      <section className="eSect" id="archive" aria-labelledby="archive-heading">
        <div className="eSectHead">
          <h2 id="archive-heading">Archive</h2>
          <RandomProjectButton
            projects={allProjects}
            className={`eBtn eBtnGhost ${styles.surprise}`}
          />
        </div>

        <search className={styles.controls} aria-label="Filter and sort projects">
          <div className={styles.field}>
            <label htmlFor="work-search">Search</label>
            <input
              ref={searchInputRef}
              id="work-search"
              type="search"
              placeholder="Project, stack, or company"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
              aria-keyshortcuts="/"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="sort-select">Sort</label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className={styles.count} aria-live="polite">
            {filteredProjects.length} of {allProjects.length} shown
          </p>
          {!filtersActive && (
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={showExperiments}
                onChange={(e) => setShowExperiments(e.target.checked)}
              />
              Include {experimentCount} experiments and retired projects
            </label>
          )}
          <fieldset className={styles.chips}>
            <legend className="sr-only">Filter by category</legend>
            <button
              type="button"
              aria-pressed={selectedGalaxy === null}
              className={styles.chip}
              onClick={() => setSelectedGalaxy(null)}
            >
              All
            </button>
            {galaxies.map((galaxy) => (
              <button
                type="button"
                key={galaxy.id}
                aria-pressed={selectedGalaxy === galaxy.id}
                className={styles.chip}
                onClick={() => setSelectedGalaxy(galaxy.id)}
              >
                <span
                  className={styles.dot}
                  aria-hidden="true"
                  style={{ background: `var(${CATEGORY_DOT[galaxy.id] ?? '--le-muted'})` }}
                />
                {categoryLabel(galaxy)}
              </button>
            ))}
            {selectedTag && (
              <button
                type="button"
                className={`${styles.chip} ${styles.tagChip}`}
                onClick={() => setSelectedTag(null)}
              >
                Tag: {selectedTag}
                <X className={styles.tagIcon} aria-hidden="true" />
                <span className="sr-only">(remove tag filter)</span>
              </button>
            )}
          </fieldset>
        </search>

        {filteredProjects.length === 0 ? (
          <div className={styles.empty}>
            <p>
              No projects match{searchQuery.trim() ? ` “${searchQuery.trim()}”` : ' these filters'}.
              Try a technology name, such as “Next.js”, or clear the filters.
            </p>
            <button type="button" className="eBtn eBtnGhost" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <table className={styles.archive}>
            <caption className="sr-only">
              Project archive: name, years, one-sentence description, and category
            </caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Year</th>
                <th scope="col">What it is</th>
                <th scope="col">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const galaxy = galaxyById.get(project.galaxy)
                return (
                  <tr key={project.id}>
                    <td className={styles.name}>
                      <Link href={`/work/${project.id}`}>{project.title}</Link>
                      {project.company && <span className={styles.company}>{project.company}</span>}
                    </td>
                    <td className={styles.year}>{shortYears(project.dateRange)}</td>
                    <td className={styles.desc}>
                      <span className={styles.clamp}>{withoutEmoji(project.description)}</span>
                    </td>
                    <td className={styles.cat}>
                      {galaxy && (
                        <>
                          <span
                            className={styles.dot}
                            aria-hidden="true"
                            style={{
                              background: `var(${CATEGORY_DOT[galaxy.id] ?? '--le-muted'})`,
                            }}
                          />
                          {categoryLabel(galaxy)}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.close} aria-labelledby="work-close">
        <h2 id="work-close">Have something that needs to ship?</h2>
        <div className={styles.closeActions}>
          <a className="eBtn eBtnPrimary" href={`mailto:${CONTACT.email}`}>
            Email me
          </a>
          <Link className="eBtn eBtnGhost" href="/contact">
            Use the contact form
          </Link>
        </div>
      </section>
    </>
  )
}
