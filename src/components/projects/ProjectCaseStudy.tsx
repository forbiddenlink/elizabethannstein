import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { getPlateDiagram } from '@/components/editorial/ProjectPlate'
import { AutomaDocsInspect } from '@/components/home/AutomaDocsInspect'
import { SpecterInspect } from '@/components/home/SpecterInspect'
import { TimeSlipInspect } from '@/components/home/TimeSlipInspect'
import { TraceInspect } from '@/components/home/TraceInspect'
import { PlateArt } from '@/components/work/PlateArt'
import { CASE_STUDIES } from '@/lib/caseStudies'
import { hostOf, withoutEmoji } from '@/lib/flagshipDisplay'
import { galaxies } from '@/lib/galaxyData'
import { getPlateArt } from '@/lib/plateArt'
import { getProjectScreenshotAlt, PROJECT_SCREENSHOTS } from '@/lib/projectScreenshots'
import type { Project } from '@/lib/types'
import styles from './ProjectCaseStudy.module.css'

// Plain category names for the content site; the themed galaxy names belong to /explore.
const CATEGORY_LABEL: Record<string, string> = {
  enterprise: 'Enterprise',
  ai: 'AI',
  fullstack: 'Full-stack',
  devtools: 'Dev tools',
  design: 'Design',
  experimental: 'Experiments',
}

function getCategoryLabel(project: Project): string | null {
  const galaxy = galaxies.find((g) => g.id === project.galaxy)
  if (!galaxy) return null
  return CATEGORY_LABEL[galaxy.id] ?? galaxy.name
}

function getStatusLabel(project: Project): string {
  if (project.links?.live) return 'Live'
  if (project.tags.includes('npm')) return 'Published on npm'
  if (project.status === 'in-progress') return 'In progress'
  if (project.status === 'archived') return 'Archived'
  if (project.status === 'live') return 'In production'
  if (project.company) return 'Employer work'
  if (project.links?.github) return 'Source on GitHub'
  return 'Private repository'
}

/**
 * Numbers rendered on the page. Only literal values from the data, and only values that are
 * actually numeric: impact entries such as "Status: In production" already appear in the spec.
 */
function getNumbers(project: Project): Array<{ label: string; value: string }> {
  const numbers = (project.impactMetrics ?? [])
    .filter((m) => /\d/.test(m.value))
    .map((m) => ({ label: m.label, value: m.value }))
  const has = (label: string) => numbers.some((n) => n.label.toLowerCase().includes(label))
  if (project.metrics?.tests && !has('test')) {
    numbers.push({ label: 'Automated tests', value: String(project.metrics.tests) })
  }
  if (project.metrics?.team && !has('team')) {
    numbers.push({ label: 'Team size', value: String(project.metrics.team) })
  }
  if (project.metrics?.users && !has('user')) {
    numbers.push({ label: 'Users', value: project.metrics.users })
  }
  return numbers
}

export function plateCaption(
  project: Project,
  screenshotPath: string | undefined,
  host: string
): string {
  if (screenshotPath) return host || 'Screenshot'
  if (project.id === 'security-readiness-platform') return 'Private: client confidential'
  // A project with a live site is public; it just has no screenshot on file.
  if (project.links?.live) return 'No screenshot published'
  if (project.company) return 'Not shown publicly'
  return 'No public view of this one'
}

// Each panel shows output captured from the real product, dated on the panel itself. A project
// without a capture gets no demo rather than a simulated one.
const DEMOS = {
  'timeslip-search': { sectionId: 'case-timeslip', panel: <TimeSlipInspect headingLevel={3} /> },
  trace: { sectionId: 'case-trace', panel: <TraceInspect headingLevel={3} /> },
  'autodocs-ai': { sectionId: 'case-automadocs', panel: <AutomaDocsInspect headingLevel={3} /> },
  specter: { sectionId: 'case-terminal', panel: <SpecterInspect headingLevel={3} /> },
} satisfies Record<string, { sectionId: string; panel: ReactNode }>

function hasDemo(id: string): id is keyof typeof DEMOS {
  return Object.hasOwn(DEMOS, id)
}

function Demo({ project }: Readonly<{ project: Project }>) {
  const demo = hasDemo(project.id) ? DEMOS[project.id] : undefined
  if (!demo) return null
  // Section ids are kept from the earlier layout so existing deep links still land.
  return (
    <section id={demo.sectionId} aria-labelledby="demo-heading" className="eSect">
      <div className="eSectHead">
        <h2 id="demo-heading">See it work</h2>
        <p>Real output, captured from the product. Open Inspect to see how it got there.</p>
      </div>
      {demo.panel}
    </section>
  )
}

interface ProjectCaseStudyProps {
  readonly project: Project
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const screenshotPath = PROJECT_SCREENSHOTS[project.id]
  const category = getCategoryLabel(project)
  const statusLabel = getStatusLabel(project)
  const numbers = getNumbers(project)
  const liveHost = hostOf(project.links?.live)
  const Diagram = getPlateDiagram(project.id)
  const art = getPlateArt(project.id)

  const longform = CASE_STUDIES.get(project.id)
  // A short brief stands in for a missing screenshot, so it is stated once, on the plate.
  const plateStatement =
    !screenshotPath &&
    !Diagram &&
    !art &&
    !longform &&
    project.challenge &&
    project.challenge.length <= 140
      ? project.challenge
      : null
  const story = [
    { id: 'brief', heading: 'The brief', body: project.challenge },
    { id: 'build', heading: 'The build', body: project.solution },
    { id: 'shipped', heading: 'What shipped', body: project.impact },
  ].filter(
    (s): s is { id: string; heading: string; body: string } =>
      Boolean(s.body) && !(s.id === 'brief' && plateStatement)
  )

  return (
    <article className={styles.caseStudy}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/work">Work</Link>
        {category && (
          <>
            {' / '}
            <Link href={`/work?filter=${project.galaxy}#archive`}>{category}</Link>
          </>
        )}
      </nav>

      <header className={styles.spread}>
        <div>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.lede}>{withoutEmoji(project.description)}</p>

          <dl className="eSpec">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.company && (
              <div>
                <dt>Organisation</dt>
                <dd>{project.company}</dd>
              </div>
            )}
            {project.dateRange && (
              <div>
                <dt>Years</dt>
                <dd className="eMono">{project.dateRange}</dd>
              </div>
            )}
            <div>
              <dt>Status</dt>
              <dd>{statusLabel}</dd>
            </div>
            {numbers.length === 1 && (
              <div id="case-signals">
                <dt>{numbers[0].label}</dt>
                <dd>{numbers[0].value}</dd>
              </div>
            )}
            <div>
              <dt>Stack</dt>
              <dd>
                <ul className={styles.stack}>
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Link href={`/work?tag=${encodeURIComponent(tag)}#archive`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.links?.live || project.links?.github || project.links?.contestWin ? (
            <div className={styles.actions}>
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eBtn eBtnPrimary"
                >
                  Visit {liveHost} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eBtn eBtnGhost"
                >
                  Source on GitHub <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {project.links?.contestWin && (
                <a
                  href={project.links.contestWin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eLink"
                >
                  Read the contest writeup <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          ) : (
            <div className={styles.actions}>
              <Link href="/contact" className="eBtn eBtnGhost">
                Discuss similar work
              </Link>
            </div>
          )}
        </div>

        <div className={styles.aside} data-stretch={Diagram || !screenshotPath ? '' : undefined}>
          <figure className="ePlate ePlateColor">
            {Diagram ? (
              <Diagram />
            ) : screenshotPath ? (
              <div className="ePlateImg">
                <Image
                  src={screenshotPath}
                  alt={getProjectScreenshotAlt(project.id, `${project.title} interface`)}
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 560px"
                />
              </div>
            ) : art ? (
              <PlateArt art={art} />
            ) : (
              <div className="eTypeplate">
                <span
                  className="eTypeplateBig"
                  style={plateStatement ? { fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)' } : undefined}
                >
                  {plateStatement ?? statusLabel}
                </span>
                {!plateStatement && (
                  <dl>
                    {category && (
                      <>
                        <dt>category</dt>
                        <dd>{category}</dd>
                      </>
                    )}
                    <dt>stack</dt>
                    <dd>{project.tags.slice(0, 4).join(', ')}</dd>
                  </dl>
                )}
              </div>
            )}
            <figcaption>
              <span>{plateCaption(project, screenshotPath, liveHost)}</span>
              {project.dateRange && <span>{project.dateRange}</span>}
            </figcaption>
          </figure>
          {numbers.length > 1 && (
            <section id="case-signals" className={styles.numsBlock} aria-labelledby="story-numbers">
              <h2 id="story-numbers">Numbers</h2>
              <dl className={styles.nums}>
                {numbers.map((n) => (
                  <div key={n.label}>
                    <dt>{n.label}</dt>
                    <dd>{n.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </header>

      <Demo project={project} />

      {longform
        ? longform.map((s, i) => (
            <section key={s.heading} className={styles.story} aria-labelledby={`story-${i}`}>
              <h2 id={`story-${i}`}>{s.heading}</h2>
              <div className={styles.prose}>
                {s.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))
        : story.map((s) => (
            <section key={s.id} className={styles.story} aria-labelledby={`story-${s.id}`}>
              <h2 id={`story-${s.id}`}>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}

      {project.testimonial && (
        <section id="case-voice" className={styles.story} aria-labelledby="story-voice">
          <h2 id="story-voice">In their words</h2>
          <figure className={styles.quote}>
            <blockquote>
              <p>{project.testimonial.quote}</p>
            </blockquote>
            <figcaption>
              <cite>{project.testimonial.author}</cite>, {project.testimonial.role}
              {project.testimonial.date && <>, {project.testimonial.date}</>}
            </figcaption>
          </figure>
        </section>
      )}
    </article>
  )
}
