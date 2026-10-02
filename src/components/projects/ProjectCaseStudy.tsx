import Image from 'next/image'
import Link from 'next/link'
import { HireReadySimulator } from '@/components/projects/HireReadySimulator'
import { InteractiveTerminal } from '@/components/projects/InteractiveTerminal'
import { TimeSlipScrubber } from '@/components/projects/TimeSlipScrubber'
import { TraceComparison } from '@/components/projects/TraceComparison'
import { CASE_STUDIES } from '@/lib/caseStudies'
import { hostOf, withoutEmoji } from '@/lib/flagshipDisplay'
import { galaxies } from '@/lib/galaxyData'
import { PROJECT_SCREENSHOTS } from '@/lib/projectScreenshots'
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

function Demo({ project }: Readonly<{ project: Project }>) {
  // Section ids are kept from the earlier layout so existing deep links still land.
  if (project.id === 'timeslip-search') {
    return (
      <section id="case-timeslip" aria-labelledby="demo-heading" className="eSect">
        <div className="eSectHead">
          <h2 id="demo-heading">Try it: pick a year</h2>
          <p>A sample of the records, running on this page</p>
        </div>
        <TimeSlipScrubber />
      </section>
    )
  }
  if (project.id === 'trace') {
    return (
      <section id="case-trace" aria-labelledby="demo-heading" className="eSect">
        <div className="eSectHead">
          <h2 id="demo-heading">Try it: grounded versus ungrounded output</h2>
          <p>Worked example, running on this page</p>
        </div>
        <TraceComparison />
      </section>
    )
  }
  if (project.id === 'hire-ready') {
    return (
      <section id="case-hireready" aria-labelledby="demo-heading" className="eSect">
        <div className="eSectHead">
          <h2 id="demo-heading">Try it: an interview round</h2>
          <p>Simulated on this page; the real app uses your microphone</p>
        </div>
        <HireReadySimulator />
      </section>
    )
  }
  // Only Specter gets a terminal. It is a command reference built from the published README,
  // so it must not be reused for other CLI projects.
  if (project.id === 'specter') {
    return (
      <section id="case-terminal" aria-labelledby="demo-heading" className="eSect">
        <div className="eSectHead">
          <h2 id="demo-heading">Specter commands</h2>
          <p>A reference on this page. It does not run Specter.</p>
        </div>
        <InteractiveTerminal projectName={project.title} />
      </section>
    )
  }
  return null
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

  const longform = CASE_STUDIES.get(project.id)
  const story = [
    { id: 'brief', heading: 'The brief', body: project.challenge },
    { id: 'build', heading: 'The build', body: project.solution },
    { id: 'shipped', heading: 'What shipped', body: project.impact },
  ].filter((s): s is { id: string; heading: string; body: string } => Boolean(s.body))

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

          {(project.links?.live || project.links?.github || project.links?.contestWin) && (
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
          )}
        </div>

        <figure className={`ePlate ePlateColor ${styles.plate}`}>
          {screenshotPath ? (
            <div className="ePlateImg">
              <Image
                src={screenshotPath}
                alt={`${project.title} interface`}
                fill
                priority
                sizes="(max-width: 960px) 100vw, 560px"
              />
            </div>
          ) : (
            <div className="eTypeplate">
              <span className="eTypeplateBig">{statusLabel}</span>
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
            </div>
          )}
          <figcaption>
            <span>{screenshotPath ? liveHost || 'Screenshot' : 'No screenshot published'}</span>
            {project.dateRange && <span>{project.dateRange}</span>}
          </figcaption>
        </figure>
      </header>

      {numbers.length > 0 && (
        <section id="case-signals" className={styles.story} aria-labelledby="story-numbers">
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
