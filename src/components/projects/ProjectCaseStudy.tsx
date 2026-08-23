import Image from 'next/image'
import { HireReadySimulator } from '@/components/projects/HireReadySimulator'
import { InteractiveTerminal } from '@/components/projects/InteractiveTerminal'
import { TheReceiptsDrawer } from '@/components/projects/TheReceiptsDrawer'
import { TimeSlipScrubber } from '@/components/projects/TimeSlipScrubber'
import { TraceComparison } from '@/components/projects/TraceComparison'
import { ProjectPlaceholder } from '@/components/ui/ProjectPlaceholder'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import { galaxies } from '@/lib/galaxyData'
import { PROJECT_SCREENSHOTS } from '@/lib/projectScreenshots'
import type { Project } from '@/lib/types'
import styles from './ProjectCaseStudy.module.css'

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

function getProjectGalaxy(project: Project) {
  return galaxies.find((g) => g.id === project.galaxy) ?? null
}

function getStatusLabel(project: Project): string {
  if (project.links?.live) return 'Live'
  if (project.tags.includes('npm')) return 'On npm'
  if (project.status === 'in-progress') return 'In progress'
  if (project.status === 'archived') return 'Archived'
  return 'In production'
}

// ── Helper text generators ──────────────────────────────────────────────────
function getChallengeText(project: Project): string {
  if (project.challenge) return project.challenge
  if (project.metrics?.files) {
    const teamPart = project.metrics.team
      ? ` across a team of ${project.metrics.team} developers`
      : ''
    return `Building and maintaining a large-scale application with ${project.metrics.files.toLocaleString()} files${teamPart}.`
  }
  return 'Building a production-ready application that delivers real value while maintaining code quality and user experience.'
}

function getSolutionText(project: Project): string {
  if (project.solution) return project.solution
  if (project.tags.includes('AI')) {
    const techStack =
      project.tags
        .filter((t) =>
          ['Next.js', 'React', 'TypeScript', 'Supabase', 'OpenAI', 'Claude'].includes(t)
        )
        .join(', ') || 'modern web technologies'
    return `Built with ${techStack}, integrating AI capabilities for enhanced functionality.`
  }
  return `Architected with ${project.tags.slice(0, 3).join(', ')}, focusing on performance, accessibility, and maintainability.`
}

function getImpactText(project: Project): string {
  if (project.impact) return project.impact
  if (project.metrics?.tests) {
    const userPart = project.metrics.users
      ? `Serving ${project.metrics.users}.`
      : 'Production-ready and deployed.'
    return `${project.metrics.tests} automated tests ensuring reliability. ${userPart}`
  }
  if (project.links?.live) {
    return 'Successfully deployed to production and actively maintained. Built with modern best practices for performance and accessibility.'
  }
  return `Completed as a learning project, demonstrating proficiency in ${project.tags.slice(0, 2).join(' and ')}.`
}

// ── Ledger tile ─────────────────────────────────────────────────────────────
function MetricTile({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="eTile">
      <div className="eTileNum">{value}</div>
      <div className="eLabel">{label}</div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
interface ProjectCaseStudyProps {
  readonly project: Project
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const screenshotPath = PROJECT_SCREENSHOTS[project.id]
  const projectGalaxy = getProjectGalaxy(project)
  const statusLabel = getStatusLabel(project)

  const isCliOrTool =
    project.id === 'specter' ||
    project.id === 'hq' ||
    project.id === 'chronicle' ||
    project.tags.includes('CLI')

  const isTimeSlip = project.id === 'timeslip-search'
  const isTrace = project.id === 'trace'
  const isHireReady = project.id === 'hire-ready'

  const engineMetrics: Array<{ label: string; value: string }> = []
  if (project.metrics?.files) {
    engineMetrics.push({ label: 'Files', value: project.metrics.files.toLocaleString() })
  }
  if (project.metrics?.tests) {
    engineMetrics.push({ label: 'Tests', value: project.metrics.tests.toString() })
  }
  if (project.metrics?.team) {
    engineMetrics.push({ label: 'Team size', value: project.metrics.team.toString() })
  }
  if (project.metrics?.users) {
    engineMetrics.push({ label: 'Users', value: project.metrics.users })
  }

  return (
    <div className={styles.caseStudy}>
      {/* ── Masthead ── */}
      <header className={`eHeader ${styles.masthead}`}>
        <div className={styles.mastheadTop}>
          <p className="eEyebrow" style={{ margin: 0 }}>
            Case study
          </p>
          {projectGalaxy && (
            <span className={styles.category}>
              <span
                className={styles.categoryDot}
                aria-hidden="true"
                style={{ background: `var(${CATEGORY_DOT[projectGalaxy.id] ?? '--le-muted'})` }}
              />
              {projectGalaxy.name}
            </span>
          )}
        </div>

        <h1 className="eTitle">{project.title}</h1>
        <p className="eLede" style={{ marginTop: '1.2rem' }}>
          {project.description}
        </p>
        {projectGalaxy?.narrative && <p className={styles.narrative}>{projectGalaxy.narrative}</p>}

        <dl className={styles.specSheet}>
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Role</dt>
            <dd className={styles.specValue}>{project.role}</dd>
          </div>
          {project.company && (
            <div className={styles.specRow}>
              <dt className={styles.specLabel}>Client / org</dt>
              <dd className={styles.specValue}>{project.company}</dd>
            </div>
          )}
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Year</dt>
            <dd className={`${styles.specValue} eMono`}>{project.dateRange}</dd>
          </div>
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Status</dt>
            <dd className={styles.specValue}>{statusLabel}</dd>
          </div>
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Stack</dt>
            <dd className={`${styles.specValue} eMono`}>{project.tags.join(', ')}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="eBtn eBtnPrimary"
            >
              View live site{' '}
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="eBtn eBtnGhost"
            >
              <GitHubIcon className={styles.btnIcon} aria-hidden="true" />
              Source code
            </a>
          )}
          {project.links?.contestWin && (
            <a
              href={project.links.contestWin}
              target="_blank"
              rel="noopener noreferrer"
              className="eLink"
            >
              Read the writeup &#8599;
            </a>
          )}
        </div>
      </header>

      {/* ── Interactive Sandbox / Evidence ── */}
      {isTimeSlip ? (
        <section id="case-timeslip" aria-label="Interactive Demo" className={styles.section}>
          <p className="eEyebrow">Interactive Demo · Algolia Winner</p>
          <h2 className={styles.h2}>Live Multi-Index Time Machine</h2>
          <TimeSlipScrubber />
        </section>
      ) : isTrace ? (
        <section id="case-trace" aria-label="Interactive Grounding Demo" className={styles.section}>
          <p className="eEyebrow">Interactive Demo · DEV.to Winner</p>
          <h2 className={styles.h2}>Screenshot-to-Code Grounding Inspector</h2>
          <TraceComparison />
        </section>
      ) : isHireReady ? (
        <section id="case-hireready" aria-label="Voice AI Simulator" className={styles.section}>
          <p className="eEyebrow">Interactive Voice AI Sandbox</p>
          <h2 className={styles.h2}>Realtime Interview &amp; Spaced Repetition</h2>
          <HireReadySimulator />
        </section>
      ) : isCliOrTool ? (
        <section id="case-terminal" aria-label="Interactive Terminal" className={styles.section}>
          <p className="eEyebrow">Live Terminal Simulation</p>
          <h2 className={styles.h2}>Interactive Engine Sandbox</h2>
          <InteractiveTerminal
            projectName={project.title}
            initialCommand={project.id === 'specter' ? 'specter explain' : 'help'}
          />
        </section>
      ) : (
        <section id="case-visual" aria-labelledby="case-visual-heading" className={styles.section}>
          <p className="eEyebrow">Evidence</p>
          <h2 id="case-visual-heading" className={styles.h2}>
            {screenshotPath ? 'Interface' : 'System surface'}
          </h2>
          <figure className={styles.frame}>
            <div className={styles.frameInner}>
              {screenshotPath ? (
                <Image
                  src={screenshotPath}
                  alt={`${project.title} application interface`}
                  width={1280}
                  height={800}
                  priority
                  className={styles.frameImage}
                  sizes="(max-width: 900px) 100vw, 1180px"
                />
              ) : (
                <ProjectPlaceholder title={project.title} color={project.color} />
              )}
            </div>
            <figcaption className={styles.caption}>
              <span>Signature view</span>
              <span className="eMono">
                {project.links?.live
                  ? project.links.live.replace(/^https?:\/\//, '')
                  : 'spec drawing // verified implementation'}
              </span>
            </figcaption>
          </figure>
        </section>
      )}

      {/* ── The Receipts Verification Drawer ── */}
      <TheReceiptsDrawer project={project} />

      {/* ── Story: brief / build / outcome ── */}
      <section id="case-arc" aria-label="Story" className={styles.section}>
        <p className="eEyebrow">Story · how this shipped</p>
        <div className={`eProse ${styles.prose}`}>
          <section>
            <h2>The brief</h2>
            <p className={styles.dropcap}>{getChallengeText(project)}</p>
          </section>
          <section>
            <h2>The build</h2>
            <p>{getSolutionText(project)}</p>
          </section>
          <section>
            <h2>What shipped</h2>
            <p>{getImpactText(project)}</p>
          </section>
        </div>
      </section>

      {/* ── Signals: quantified impact ── */}
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <section
          id="case-signals"
          aria-labelledby="case-signals-heading"
          className={styles.section}
        >
          <p className="eEyebrow">Signals</p>
          <h2 id="case-signals-heading" className={styles.h2}>
            Scale &amp; impact
          </h2>
          <div className="eLedger">
            {project.impactMetrics.map((m) => (
              <MetricTile key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
        </section>
      )}

      {/* ── Engine room: files / tests / team / users ── */}
      {engineMetrics.length > 0 && (
        <section id="case-engine" aria-labelledby="case-engine-heading" className={styles.section}>
          <p className="eEyebrow">Engine room</p>
          <h2 id="case-engine-heading" className={styles.h2}>
            At a glance
          </h2>
          <div className="eLedger">
            {engineMetrics.map((m) => (
              <MetricTile key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
        </section>
      )}

      {/* ── Voice: testimonial pull-quote ── */}
      {project.testimonial && (
        <section id="case-voice" aria-labelledby="case-voice-heading" className={styles.section}>
          <p className="eEyebrow">Endorsement</p>
          <h2 id="case-voice-heading" className={styles.h2}>
            Voice from the field
          </h2>
          <blockquote className={styles.quoteBlock}>
            <span className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </span>
            <p className={styles.quoteText}>{project.testimonial.quote}</p>
            <footer className={styles.quoteFooter}>
              <div>
                <cite className={styles.quoteCite}>{project.testimonial.author}</cite>
                <span className={styles.quoteRole}>{project.testimonial.role}</span>
                {project.testimonial.date && (
                  <span className={styles.quoteDate}>{project.testimonial.date}</span>
                )}
              </div>
              {project.links?.testimonial && (
                <a
                  href={project.links.testimonial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eBtn eBtnGhost"
                >
                  View full letter
                </a>
              )}
            </footer>
          </blockquote>
        </section>
      )}

      {/* ── Stack & signals ── */}
      <section id="case-stack" aria-labelledby="case-stack-heading" className={styles.section}>
        <p className="eEyebrow">Inventory</p>
        <h2 id="case-stack-heading" className={styles.h2}>
          Stack &amp; signals
        </h2>
        <div className={styles.tagRow}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
