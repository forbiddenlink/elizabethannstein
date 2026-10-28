import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { AutomaDocsInspect } from '@/components/home/AutomaDocsInspect'
import { SpecterInspect } from '@/components/home/SpecterInspect'
import { TimeSlipInspect } from '@/components/home/TimeSlipInspect'
import { TraceInspect } from '@/components/home/TraceInspect'
import { PlateArt } from '@/components/work/PlateArt'
import { CASE_STUDIES } from '@/lib/caseStudies'
import { hostOf, withoutEmoji } from '@/lib/flagshipDisplay'
import { galaxies } from '@/lib/galaxyData'
import { getPlateArt } from '@/lib/plateArt'
import { getPlateDiagram, plateCaption } from '@/lib/projectPlateContent'
import { getProjectScreenshotAlt, PROJECT_SCREENSHOTS } from '@/lib/projectScreenshots'
import type { Project } from '@/lib/types'
import styles from './ProjectCaseStudy.module.css'

const CATEGORY_LABEL: Record<string, string> = {
  enterprise: 'Enterprise',
  ai: 'AI',
  fullstack: 'Full-stack',
  devtools: 'Dev tools',
  design: 'Design',
  experimental: 'Experiments',
}
const DEMOS: Record<string, { sectionId: string; panel: ReactNode }> = {
  'timeslip-search': { sectionId: 'case-timeslip', panel: <TimeSlipInspect headingLevel={3} /> },
  trace: { sectionId: 'case-trace', panel: <TraceInspect headingLevel={3} /> },
  'autodocs-ai': { sectionId: 'case-automadocs', panel: <AutomaDocsInspect headingLevel={3} /> },
  specter: { sectionId: 'case-terminal', panel: <SpecterInspect headingLevel={3} /> },
}
type NumberMetric = { label: string; value: string }
type StorySection = { id: string; heading: string; body: string }

function getCategoryLabel(project: Project): string | null {
  const galaxy = galaxies.find((item) => item.id === project.galaxy)
  return galaxy ? (CATEGORY_LABEL[galaxy.id] ?? galaxy.name) : null
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
function getNumbers(project: Project): NumberMetric[] {
  const numbers = (project.impactMetrics ?? [])
    .filter((metric) => /\d/.test(metric.value))
    .map((metric) => ({ label: metric.label, value: metric.value }))
  const has = (label: string) =>
    numbers.some((number) => number.label.toLowerCase().includes(label))
  if (project.metrics?.tests && !has('test'))
    numbers.push({ label: 'Automated tests', value: String(project.metrics.tests) })
  if (project.metrics?.team && !has('team'))
    numbers.push({ label: 'Team size', value: String(project.metrics.team) })
  if (project.metrics?.users && !has('user'))
    numbers.push({ label: 'Users', value: project.metrics.users })
  return numbers
}
function getPlateStatement(
  project: Project,
  hasScreenshot: boolean,
  hasDiagram: boolean,
  hasArt: boolean,
  hasLongform: boolean
): string | null {
  return hasScreenshot ||
    hasDiagram ||
    hasArt ||
    hasLongform ||
    !project.challenge ||
    project.challenge.length > 140
    ? null
    : project.challenge
}
function getStory(project: Project, plateStatement: string | null): StorySection[] {
  return [
    { id: 'brief', heading: 'The brief', body: project.challenge },
    { id: 'build', heading: 'The build', body: project.solution },
    { id: 'shipped', heading: 'What shipped', body: project.impact },
  ].filter(
    (section): section is StorySection =>
      Boolean(section.body) && !(section.id === 'brief' && plateStatement)
  )
}

function Breadcrumbs({
  category,
  project,
}: Readonly<{ category: string | null; project: Project }>) {
  return (
    <nav className={styles.crumbs} aria-label="Breadcrumb">
      <Link href="/work">Work</Link>
      {category && (
        <>
          {' / '}
          <Link href={`/work?filter=${project.galaxy}#archive`}>{category}</Link>
        </>
      )}
    </nav>
  )
}
function ProjectActions({ project, liveHost }: Readonly<{ project: Project; liveHost: string }>) {
  const { contestWin, github, live } = project.links ?? {}
  if (!live && !github && !contestWin)
    return (
      <div className={styles.actions}>
        <Link href="/contact" className="eBtn eBtnGhost">
          Discuss similar work
        </Link>
      </div>
    )
  return (
    <div className={styles.actions}>
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="eBtn eBtnPrimary">
          Visit {liveHost} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className="eBtn eBtnGhost">
          Source on GitHub <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {contestWin && (
        <a href={contestWin} target="_blank" rel="noopener noreferrer" className="eLink">
          Read the contest writeup <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  )
}
function ProjectDetails({
  project,
  statusLabel,
  numbers,
  liveHost,
}: Readonly<{ project: Project; statusLabel: string; numbers: NumberMetric[]; liveHost: string }>) {
  return (
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
      <ProjectActions project={project} liveHost={liveHost} />
    </div>
  )
}
function NumbersBlock({ numbers }: Readonly<{ numbers: NumberMetric[] }>) {
  if (numbers.length <= 1) return null
  return (
    <section id="case-signals" className={styles.numsBlock} aria-labelledby="story-numbers">
      <h2 id="story-numbers">Numbers</h2>
      <dl className={styles.nums}>
        {numbers.map((number) => (
          <div key={number.label}>
            <dt>{number.label}</dt>
            <dd>{number.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
function CaseStudyPlate({
  category,
  project,
  statusLabel,
  screenshotPath,
  plateStatement,
  numbers,
  liveHost,
  Diagram,
  art,
}: Readonly<{
  category: string | null
  project: Project
  statusLabel: string
  screenshotPath: string | undefined
  plateStatement: string | null
  numbers: NumberMetric[]
  liveHost: string
  Diagram: ReturnType<typeof getPlateDiagram>
  art: ReturnType<typeof getPlateArt>
}>) {
  return (
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
      <NumbersBlock numbers={numbers} />
    </div>
  )
}
function Demo({ project }: Readonly<{ project: Project }>) {
  const demo = DEMOS[project.id]
  return demo ? (
    <section id={demo.sectionId} aria-labelledby="demo-heading" className="eSect">
      <div className="eSectHead">
        <h2 id="demo-heading">See it work</h2>
        <p>Real output, captured from the product. Open Inspect to see how it got there.</p>
      </div>
      {demo.panel}
    </section>
  ) : null
}
function Narrative({
  project,
  longform,
  plateStatement,
}: Readonly<{
  project: Project
  longform: ReturnType<typeof CASE_STUDIES.get>
  plateStatement: string | null
}>) {
  if (longform)
    return longform.map((section, index) => (
      <section key={section.heading} className={styles.story} aria-labelledby={`story-${index}`}>
        <h2 id={`story-${index}`}>{section.heading}</h2>
        <div className={styles.prose}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    ))
  return getStory(project, plateStatement).map((section) => (
    <section key={section.id} className={styles.story} aria-labelledby={`story-${section.id}`}>
      <h2 id={`story-${section.id}`}>{section.heading}</h2>
      <p>{section.body}</p>
    </section>
  ))
}
function Testimonial({ project }: Readonly<{ project: Project }>) {
  const testimonial = project.testimonial
  return testimonial ? (
    <section id="case-voice" className={styles.story} aria-labelledby="story-voice">
      <h2 id="story-voice">In their words</h2>
      <figure className={styles.quote}>
        <blockquote>
          <p>{testimonial.quote}</p>
        </blockquote>
        <figcaption>
          <cite>{testimonial.author}</cite>, {testimonial.role}
          {testimonial.date && <>, {testimonial.date}</>}
        </figcaption>
      </figure>
    </section>
  ) : null
}

export function ProjectCaseStudy({ project }: Readonly<{ project: Project }>) {
  const screenshotPath = PROJECT_SCREENSHOTS[project.id]
  const category = getCategoryLabel(project)
  const statusLabel = getStatusLabel(project)
  const numbers = getNumbers(project)
  const liveHost = hostOf(project.links?.live)
  const Diagram = getPlateDiagram(project.id)
  const art = getPlateArt(project.id)
  const longform = CASE_STUDIES.get(project.id)
  const plateStatement = getPlateStatement(
    project,
    Boolean(screenshotPath),
    Boolean(Diagram),
    Boolean(art),
    Boolean(longform)
  )
  return (
    <article className={styles.caseStudy}>
      <Breadcrumbs category={category} project={project} />
      <header className={styles.spread}>
        <ProjectDetails
          project={project}
          statusLabel={statusLabel}
          numbers={numbers}
          liveHost={liveHost}
        />
        <CaseStudyPlate
          category={category}
          project={project}
          statusLabel={statusLabel}
          screenshotPath={screenshotPath}
          plateStatement={plateStatement}
          numbers={numbers}
          liveHost={liveHost}
          Diagram={Diagram}
          art={art}
        />
      </header>
      <Demo project={project} />
      <Narrative project={project} longform={longform} plateStatement={plateStatement} />
      <Testimonial project={project} />
    </article>
  )
}
