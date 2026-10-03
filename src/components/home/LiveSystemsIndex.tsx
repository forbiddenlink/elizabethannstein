'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ProjectPlate } from '@/components/editorial/ProjectPlate'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { AUTOMADOCS_CAPTURE } from '@/lib/automadocsCapture'
import { CONTACT, STATS } from '@/lib/constants'
import {
  hostOf,
  type LedgerPhase,
  ledgerSummary,
  plainLabel,
  resolvePhase,
  staticStatus,
  whoLine,
} from '@/lib/flagshipDisplay'
import { FLAGSHIPS, type Flagship } from '@/lib/flagships'
import { getProjectById } from '@/lib/galaxyData'
import type { LiveResult } from '@/lib/liveStatus'
import { SPECTER_CAPTURE } from '@/lib/specterCapture'
import { TRACE_CAPTURES } from '@/lib/traceCapture'
import styles from './LiveSystemsIndex.module.css'
import { TimeSlipInspect } from './TimeSlipInspect'

// One line each, computed from the same capture files the case-study panels render, so the
// strip cannot drift from what the visitor finds on the other side of the link.
const MORE_DEMOS = [
  {
    name: 'Trace',
    href: '/work/trace#case-trace',
    result: `${TRACE_CAPTURES[0].detections.length} elements found in a login screenshot`,
  },
  {
    name: 'AutomaDocs',
    href: '/work/autodocs-ai#case-automadocs',
    result: `${AUTOMADOCS_CAPTURE.totalDocs.toLocaleString('en-US')} generated pages for ${AUTOMADOCS_CAPTURE.repo.split('/')[1]}`,
  },
  {
    name: 'Specter',
    href: '/work/specter#case-terminal',
    result: `the ${SPECTER_CAPTURE.top.length} riskiest files in a ${SPECTER_CAPTURE.totalLines.toLocaleString('en-US')}-line repo`,
  },
]

type Phase = LedgerPhase

const LIVE_SYSTEMS = FLAGSHIPS.filter((f) => f.status === 'live' && f.statusUrl)
const RESUME_HREF = '/resume/elizabeth-stein-resume.pdf'
// Three get a full plate (the ones with something to look at); the rest stay index rows.
const FEATURED_IDS = ['security-readiness-platform', 'timeslip-search', 'trace']
const FEATURED = FEATURED_IDS.flatMap((id) => FLAGSHIPS.find((f) => f.id === id) ?? [])
const REST = FLAGSHIPS.filter((f) => !FEATURED_IDS.includes(f.id))

function initialPhases(): Record<string, Phase> {
  // Every pinged system starts as "checking" on the server and on first paint: nothing is
  // shown as live until the probe has actually answered.
  return Object.fromEntries(LIVE_SYSTEMS.map((f) => [f.id, 'checking' as Phase]))
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour12: false })
}

function LedgerState({ phase, result }: Readonly<{ phase: Phase; result?: LiveResult }>) {
  if (phase === 'checking') {
    return (
      <span className="eState">
        <span className="eStateDot" aria-hidden="true" />
        Checking
      </span>
    )
  }
  if (phase === 'down') {
    return (
      <span className="eState">
        <span className="eStateDot" aria-hidden="true" />
        Not responding
        <small>no answer in 4.5 s</small>
      </span>
    )
  }
  if (phase === 'unknown') {
    return (
      <span className="eState">
        <span className="eStateDot" aria-hidden="true" />
        Unknown
        <small>not checked</small>
      </span>
    )
  }
  return (
    <span className="eState">
      <span className="eStateDot" aria-hidden="true" />
      Live
      {result?.ms != null && <small>{result.ms} ms</small>}
    </span>
  )
}

function SelectedState({ flagship, phase }: Readonly<{ flagship: Flagship; phase?: Phase }>) {
  if (flagship.status === 'live' && phase) {
    const label = {
      checking: 'Checking',
      live: 'Live',
      down: 'Not responding',
      unknown: 'Status unknown',
    }[phase]
    return (
      <span className="eState" data-state={phase}>
        <span className="eStateDot" aria-hidden="true" />
        {label}
        <small>{plainLabel(flagship.statusSub)}</small>
      </span>
    )
  }
  const { label, detail } = staticStatus(flagship)
  return (
    <span className="eState">
      {label}
      <small>{detail}</small>
    </span>
  )
}

export function LiveSystemsIndex({ variant = 'live' }: Readonly<{ variant?: 'live' | 'lab' }>) {
  const [phases, setPhases] = useState<Record<string, Phase>>(initialPhases)
  const [results, setResults] = useState<Record<string, LiveResult>>({})
  const [checkedAt, setCheckedAt] = useState<string | null>(null)
  const [isProbing, setIsProbing] = useState(true)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Legacy deep links (/?p=<id>) from the old 3D homepage go straight to the case study.
  useEffect(() => {
    const projectParam = new URLSearchParams(window.location.search).get('p')
    if (!projectParam || !getProjectById(projectParam)) return
    window.location.replace(`/work/${projectParam}`)
  }, [])

  const probe = useCallback(async () => {
    for (const t of timers.current) clearTimeout(t)
    timers.current = []
    setIsProbing(true)
    setPhases(initialPhases())

    let data: Record<string, LiveResult> = {}
    let pingedAt: string | null = null
    try {
      const res = await fetch('/api/status')
      if (res.ok) data = (await res.json()) as Record<string, LiveResult>
      const header = res.headers.get('x-checked-at')
      if (header && !Number.isNaN(Date.parse(header))) pingedAt = formatClock(new Date(header))
    } catch {
      // Network failure: rows resolve to "unknown" below. The sites were never checked, so
      // saying they are down would be false.
    }
    setResults(data)

    // Resolve rows one after another so the check reads as a sequence, not a flash.
    LIVE_SYSTEMS.forEach((f, i) => {
      const result = f.statusUrl ? data[f.statusUrl] : undefined
      timers.current.push(
        setTimeout(
          () => {
            setPhases((p) => ({ ...p, [f.id]: resolvePhase(result) }))
            if (i === LIVE_SYSTEMS.length - 1) {
              setIsProbing(false)
              setCheckedAt(pingedAt)
            }
          },
          150 + i * 180
        )
      )
    })
  }, [])

  useEffect(() => {
    void probe()
    return () => {
      // probe() replaces the array on every run, so read the live one at unmount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const t of timers.current) clearTimeout(t)
    }
  }, [probe])

  const summary = ledgerSummary(LIVE_SYSTEMS.map((f) => phases[f.id] ?? 'unknown'))

  const ledger = (
    <aside className={styles.ledger} aria-labelledby="ledger-heading">
      <div className={styles.ledgerHead}>
        <h2 id="ledger-heading">Running right now</h2>
        <p aria-live="polite">
          {isProbing ? 'checking now' : checkedAt ? `checked ${checkedAt}` : 'check time unknown'}
        </p>
      </div>
      <ol className={styles.ledgerList}>
        {LIVE_SYSTEMS.map((f) => (
          <li key={f.id} className={styles.ledgerRow} data-state={phases[f.id]}>
            <Link className={styles.sys} href={`/work/${f.id}`}>
              {f.title}
            </Link>
            <span className={styles.host}>{hostOf(f.statusUrl)}</span>
            <span className={styles.state}>
              <LedgerState
                phase={phases[f.id] ?? 'checking'}
                result={f.statusUrl ? results[f.statusUrl] : undefined}
              />
            </span>
          </li>
        ))}
      </ol>
      <div className={styles.ledgerFoot}>
        <span>{isProbing ? 'Checking each site now' : summary}</span>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => void probe()}
          disabled={isProbing}
        >
          Refresh
        </button>
      </div>
    </aside>
  )

  return (
    <div className={`editorial ${styles.page}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className={styles.wrap}>
          <section
            className={variant === 'lab' ? `${styles.fold} ${styles.foldLab}` : styles.fold}
            aria-labelledby="home-claim"
          >
            <div>
              <h1 className={styles.name} id="home-claim">
                Elizabeth Stein <span>Full-stack engineer and designer</span>
              </h1>
              <p className={styles.claim}>
                I design and build software that ships, from the data model to the last pixel.
              </p>
              <p className={styles.standfirst}>
                Right now I&apos;m the sole developer on a Dynamics 365 platform in production for a
                cybersecurity nonprofit, and I work on Rocket Vitals, a website QA product at Rocket
                Park. On my own time I won the Algolia Agent Studio challenge and publish developer
                tools to npm.
              </p>
              <div className={styles.actions}>
                <a className="eBtn eBtnPrimary" href={`mailto:${CONTACT.email}`}>
                  Email me
                </a>
                <a
                  className="eBtn eBtnGhost"
                  href={RESUME_HREF}
                  download="Elizabeth_Stein_Resume.pdf"
                >
                  Download résumé (PDF)
                </a>
              </div>
              <p className={styles.avail}>
                <span className="eStateDot" aria-hidden="true" />
                Open to contract and full-time roles
              </p>
            </div>

            {variant === 'lab' ? (
              <div className={styles.foldDemo}>
                <TimeSlipInspect />
                <nav className={styles.moreDemos} aria-label="More working demos">
                  <p>The same panel, with real output, on each of these case studies:</p>
                  <ul>
                    {MORE_DEMOS.map((d) => (
                      <li key={d.href}>
                        <Link href={d.href}>{d.name}</Link>
                        <span>{d.result}</span>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ) : (
              ledger
            )}
          </section>
          {variant === 'lab' && <div className={styles.ledgerBand}>{ledger}</div>}
        </div>

        <section className="eSect" aria-labelledby="featured-heading">
          <div className={styles.wrap}>
            <div className="eSectHead">
              <h2 id="featured-heading">Selected work</h2>
              <p>
                {FLAGSHIPS.length} of {STATS.projectCount} projects
              </p>
            </div>
            <ol className={styles.features}>
              {FEATURED.map((f, i) => (
                <li key={f.id}>
                  <Link
                    href={`/work/${f.id}`}
                    className={styles.feature}
                    aria-labelledby={`feat-${f.id}-title`}
                    aria-describedby={`feat-${f.id}-desc`}
                  >
                    <ProjectPlate
                      flagship={f}
                      project={getProjectById(f.id)}
                      sizes="(max-width: 960px) 100vw, 640px"
                      priority={i === 0}
                    />
                    <div className={styles.featureText}>
                      <p className={styles.who}>{whoLine(f)}</p>
                      <h3 id={`feat-${f.id}-title`} className={styles.featureTitle}>
                        {f.title}
                      </h3>
                      <p id={`feat-${f.id}-desc`} className={styles.featureDesc}>
                        {f.summary}
                      </p>
                      {f.metrics.length > 0 && (
                        <dl className={styles.facts}>
                          {f.metrics.map((m) => (
                            <div key={m.label}>
                              <dt>{m.label}</dt>
                              <dd>{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <span className={styles.status}>
                        <SelectedState flagship={f} phase={phases[f.id]} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>

            <ul className={styles.index} aria-label="More selected work">
              {REST.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/work/${f.id}`}
                    className={styles.row}
                    aria-labelledby={`home-${f.id}-title`}
                    aria-describedby={`home-${f.id}-desc home-${f.id}-status`}
                  >
                    <span>
                      <span id={`home-${f.id}-title`} className={styles.title}>
                        {f.title}
                      </span>
                      <span className={styles.who}>{whoLine(f)}</span>
                    </span>
                    <span id={`home-${f.id}-desc`} className={styles.desc}>
                      {f.summary}
                    </span>
                    <span id={`home-${f.id}-status`} className={styles.status}>
                      <SelectedState flagship={f} phase={phases[f.id]} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.more}>
              <span>
                {STATS.moreCount} more projects, from client sites to experiments and games.
              </span>
              <span>
                <Link href="/work#archive">Browse the archive</Link> or{' '}
                <Link href="/explore">fly through it as a 3D galaxy</Link>
              </span>
            </div>
          </div>
        </section>

        <section className="eSect" aria-labelledby="quote-heading">
          <div className={`${styles.wrap} ${styles.quoteRow}`}>
            <h2 id="quote-heading" className={styles.quoteLabel}>
              From a client
            </h2>
            <figure className={styles.quote}>
              <blockquote>
                <p>
                  Elizabeth was the backbone of this project. While every team member played a role
                  in bringing the DAREU Radio website to life, it was Elizabeth who carried the
                  technical weight and delivered a product that exceeded expectations.
                </p>
              </blockquote>
              <figcaption>
                <cite>Brenna Martin</cite>, Founder and Station Director, DareU Radio
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="eSect" aria-labelledby="close-heading">
          <div className={`${styles.wrap} ${styles.close}`}>
            <h2 id="close-heading" className={styles.closeTitle}>
              Have something that needs to ship?
            </h2>
            <div className={styles.actions}>
              <a className="eBtn eBtnPrimary" href={`mailto:${CONTACT.email}`}>
                Email me
              </a>
              <Link className="eBtn eBtnGhost" href="/contact">
                Use the contact form
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
