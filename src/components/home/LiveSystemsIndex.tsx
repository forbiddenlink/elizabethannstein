'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { useMagnetic } from '@/hooks/useMagnetic'
import { CONTACT } from '@/lib/constants'
import { FLAGSHIPS, type Flagship } from '@/lib/flagships'
import { getProjectById } from '@/lib/galaxyData'
import type { LiveResult } from '@/lib/liveStatus'
import styles from './LiveSystemsIndex.module.css'

type StatusPhase = 'checking' | 'live' | 'down' | 'static'

function respondingCount(statuses: Record<string, LiveResult>): number {
  return FLAGSHIPS.reduce((n, f) => {
    if (f.status === 'live') return n + (f.statusUrl && statuses[f.statusUrl]?.up ? 1 : 0)
    return n + 1 // npm / cli / sites always count as "responding"
  }, 0)
}

function StatusCell({
  flagship,
  phase,
  result,
}: {
  flagship: Flagship
  phase: StatusPhase
  result?: LiveResult
}) {
  let cls = styles.status
  let dot = ''
  let label = ''

  if (flagship.status === 'live') {
    if (phase === 'checking') {
      cls = `${styles.status} ${styles.checking}`
      label = 'checking…'
    } else if (phase === 'live') {
      cls = `${styles.status} ${styles.live}`
      label = result?.ms != null ? `live · ${result.ms}ms` : 'live'
    } else {
      cls = `${styles.status} ${styles.down}`
      label = 'offline'
    }
    dot = flagship.statusSub
  } else if (flagship.status === 'npm') {
    cls = `${styles.status} ${styles.live}`
    label = 'on npm'
    dot = flagship.statusSub
  } else if (flagship.status === 'cli') {
    cls = `${styles.status} ${styles.live}`
    label = flagship.proof
    dot = flagship.statusSub
  } else {
    // 'sites'
    cls = `${styles.status} ${styles.live}`
    label = flagship.statusSub
    dot = 'in production'
  }

  return (
    <span className={cls}>
      <span className={styles.statLine}>
        <span className={styles.sdot} />
        <span className={styles.statLabel}>{label}</span>
      </span>
      <span className={styles.statSub}>{dot}</span>
    </span>
  )
}

export function LiveSystemsIndex() {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [statuses, setStatuses] = useState<Record<string, LiveResult>>({})
  const [phases, setPhases] = useState<Record<string, StatusPhase>>(() =>
    Object.fromEntries(FLAGSHIPS.map((f) => [f.id, f.status === 'live' ? 'checking' : 'static']))
  )

  useEffect(() => {
    const projectParam = new URLSearchParams(window.location.search).get('p')
    if (!projectParam || !getProjectById(projectParam)) return

    window.location.replace(`/work/${projectParam}`)
  }, [])

  // Fetch live status off the render path; resolve each dot as the result arrives.
  useEffect(() => {
    let cancelled = false
    const reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: ReturnType<typeof setTimeout>[] = []
    fetch('/api/status')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((data: Record<string, LiveResult>) => {
        if (cancelled) return
        setStatuses(data)
        FLAGSHIPS.forEach((f, i) => {
          if (f.status !== 'live') return
          const result = f.statusUrl ? data[f.statusUrl] : undefined
          const settle = () => setPhases((p) => ({ ...p, [f.id]: result?.up ? 'live' : 'down' }))
          if (reduce) settle()
          else timers.push(setTimeout(settle, 200 + i * 220))
        })
      })
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const up = respondingCount(statuses)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.32)
  const bentoRef = useGsapReveal<HTMLDivElement>({
    selector: `.${styles.bTile}`,
    stagger: 0.07,
    scroll: false,
  })

  return (
    <main id="main-content" tabIndex={-1} className={`${styles.page} outline-none`}>
      <div className={styles.wrap}>
        <div className={`${styles.statusbar} ${styles.reveal}`}>
          <span className={styles.statusName}>Elizabeth Stein</span>
          <span className={styles.sys}>
            <span className={styles.livedot} aria-hidden="true" />
            <span>
              <b>{up}</b>/{FLAGSHIPS.length} systems responding
            </span>
            &nbsp;·&nbsp;
            <button
              className={styles.tt}
              type="button"
              onClick={() => {
                const root = document.documentElement
                const isDark = matchMedia('(prefers-color-scheme: dark)').matches
                const cur = root.getAttribute('data-theme') || (isDark ? 'dark' : 'light')
                root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark')
              }}
            >
              ◐ theme
            </button>
          </span>
        </div>

        <header className={styles.masthead}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>
            Full-stack developer &amp; designer
          </p>
          <h1 className={styles.name} aria-label="Elizabeth Stein">
            <span className={styles.line}>
              <span>Elizabeth</span>
            </span>
            <span className={styles.line}>
              <span>
                Stein<em>.</em>
              </span>
            </span>
          </h1>
          <p className={`${styles.thesis} ${styles.reveal} ${styles.d1}`}>
            I design and build software that&rsquo;s actually running in production.{' '}
            <span className={styles.q}>
              Eighty-six things shipped &mdash; here are the eight that matter, live right now.
            </span>
          </p>
          <div className={`${styles.standfirst} ${styles.reveal} ${styles.d2}`}>
            <span className={styles.avail}>
              <span className={styles.livedot} aria-hidden="true" />
              Open to contract work
            </span>
            <span>Enterprise · AI · Full-stack · Dev tools</span>
          </div>
        </header>

        <div className={`${styles.cta} ${styles.reveal} ${styles.d2}`}>
          <a ref={ctaRef} className={styles.ctaPrimary} href={`mailto:${CONTACT.email}`}>
            Get in touch <span aria-hidden="true">→</span>
          </a>
          <a
            className={styles.ctaSecondary}
            href="/resume/elizabeth-stein-resume.pdf"
            download="Elizabeth_Stein_Resume.pdf"
          >
            Download résumé
          </a>
        </div>

        <section aria-label="At a glance">
          <div className={styles.bento} ref={bentoRef}>
            <div className={styles.bTile}>
              <div className={styles.bNum}>
                {up}
                <span className={styles.bNumSub}>/{FLAGSHIPS.length}</span>
              </div>
              <div className={styles.bLabel}>Live systems responding</div>
              <div className={styles.bSub}>Checked in real time, right now</div>
            </div>
            <div className={styles.bTile}>
              <div className={styles.bNum}>86</div>
              <div className={styles.bLabel}>Projects shipped</div>
              <div className={styles.bSub}>Enterprise · AI · full-stack · dev tools</div>
            </div>
            <div className={styles.bTile}>
              <div className={styles.bNum}>3</div>
              <div className={styles.bLabel}>Organisations</div>
              <div className={styles.bSub}>Production code, three teams</div>
            </div>
            <div className={styles.bTile}>
              <div className={styles.bNum}>3.98</div>
              <div className={styles.bLabel}>GPA, Summa Cum Laude</div>
              <div className={styles.bSub}>B.S. Software Development, Capella</div>
            </div>
          </div>
        </section>

        <section aria-label="Selected work">
          <div className={`${styles.idxHead} ${styles.reveal} ${styles.d3}`}>
            <span>Selected work — 08 / 86</span>
            <span>
              <b>click a row</b> to open the case
            </span>
          </div>

          <div>
            {FLAGSHIPS.map((f, i) => {
              const isOpen = !!open[f.id]
              const result = f.statusUrl ? statuses[f.statusUrl] : undefined
              return (
                <div key={f.id} className={`${styles.row} ${isOpen ? styles.open : ''}`}>
                  <button
                    type="button"
                    className={styles.rowbtn}
                    aria-expanded={isOpen}
                    aria-controls={`cs-${f.id}`}
                    onClick={() => setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))}
                  >
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className={styles.title}>{f.title}</span>
                      <span className={styles.org}>
                        {f.org} · {f.years}
                      </span>
                    </span>
                    <span className={styles.desc}>
                      {f.summary} <span className={styles.hint}>▸ open case</span>
                    </span>
                    <StatusCell flagship={f} phase={phases[f.id]} result={result} />
                  </button>

                  <div className={styles.body}>
                    <div className={styles.bodyInner}>
                      <div className={styles.cs} id={`cs-${f.id}`}>
                        <div className={styles.csGrid}>
                          {f.cases.map((c) => (
                            <div key={c.heading}>
                              <h4>{c.heading}</h4>
                              <p>{c.body}</p>
                            </div>
                          ))}
                        </div>
                        <div className={styles.metrics}>
                          {f.metrics.map((m) => (
                            <div key={m.label}>
                              <div className={styles.metricV}>{m.value}</div>
                              <div className={styles.metricL}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                        {f.links.length > 0 && (
                          <div className={styles.csLinks}>
                            {f.links.map((l) =>
                              l.external ? (
                                <a
                                  key={l.label}
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {l.label} ↗
                                </a>
                              ) : (
                                <Link key={l.label} href={l.href}>
                                  {l.label} →
                                </Link>
                              )
                            )}
                            <Link href={`/work/${f.id}`}>Full case study →</Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className={`${styles.lab} ${styles.reveal}`}>
          <div className={styles.labBig}>
            + <b>78 more</b>, shipped.
          </div>
          <div className={styles.labNote}>
            Experiments, dev tools, and games &mdash; the lab where the eight above got their reps.{' '}
            <Link className={styles.labLink} href="/work">
              Browse the full catalogue
            </Link>
            , or{' '}
            <Link className={styles.labLink} href="/explore">
              explore it as a galaxy
            </Link>
            .
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.fg}>
            <p className={styles.cred}>
              <b>B.S. Information Technology, Software Development</b> &mdash; Capella University,
              Summa Cum Laude (3.98 GPA). Shipping production code across three organisations.
            </p>
            <nav className={styles.links} aria-label="Navigation">
              <Link href="/about">About</Link>
              <Link href="/work">Work</Link>
              <Link href="/contact">Contact</Link>
              <a href="/resume/elizabeth-stein-resume.pdf" download="Elizabeth_Stein_Resume.pdf">
                Résumé
              </a>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${CONTACT.email}`}>Email</a>
            </nav>
          </div>
          <div className={styles.signoff}>
            <span>Elizabeth Stein — 2026</span>
            <Link className={styles.labLink} href="/explore">
              Enter the galaxy →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
