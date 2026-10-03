'use client'

import { useEffect, useId, useState } from 'react'
import {
  TIMESLIP_CAPTURES,
  TIMESLIP_INDEX_LABEL,
  TIMESLIP_SOURCE,
  type TimeSlipCapture,
  type TimeSlipIndex,
} from '@/lib/timeslipCapture'
import styles from './TimeSlipInspect.module.css'

type Layer = 'interface' | 'logic' | 'data'

const LAYERS: { id: Layer; name: string; caption: string }[] = [
  { id: 'interface', name: 'Interface', caption: 'What the person sees' },
  { id: 'logic', name: 'Logic', caption: 'What the system decided' },
  { id: 'data', name: 'Data', caption: 'Where it came from' },
]

const INDEX_ORDER: TimeSlipIndex[] = ['songs', 'movies', 'prices', 'events']

const INDEX_NOTE: Record<TimeSlipIndex, string> = {
  songs: 'Weekly charts, about 352,000 rows',
  movies: 'Box office by week',
  prices: 'Monthly gas, wage and ticket prices',
  events: 'Wikimedia events',
}

function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function resultSummary(c: TimeSlipCapture): string {
  const top = c.songs[0]
  const parts = [`${c.display}: number ${top.position} was ${top.title} by ${top.artist}.`]
  parts.push(
    c.price ? `Gas was ${money(c.price.gasPerGallon)} a gallon.` : 'No price row in this window.'
  )
  parts.push(c.event ? `${c.event.title}` : 'No event in this window.')
  return parts.join(' ')
}

function money(n: number): string {
  return `$${n.toFixed(2)}`
}

/** Types the query out once per change; the full text is always in the DOM for readers. */
function useTyped(text: string, enabled: boolean): string {
  const [shown, setShown] = useState(text)
  useEffect(() => {
    if (!enabled) {
      setShown(text)
      return
    }
    setShown('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 38)
    return () => window.clearInterval(id)
  }, [text, enabled])
  return shown
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

function InterfaceView({ capture }: Readonly<{ capture: TimeSlipCapture }>) {
  // One shared chart week goes in the heading; several weeks (a season) go on each song, or
  // "#1, #1, #1" reads like a bug.
  const oneWeek = capture.songs.every((s) => s.week === capture.songs[0].week)
  return (
    <div className={styles.results} key={capture.id}>
      <section className={styles.cell} style={{ '--i': 0 } as React.CSSProperties}>
        <h3>
          Charts
          {oneWeek && (
            <span className={styles.week}> · week of {formatDay(capture.songs[0].week)}</span>
          )}
        </h3>
        <ol className={styles.songs}>
          {capture.songs.map((s) => (
            <li key={`${s.title}-${s.week}`}>
              <span className={styles.pos}>#{s.position}</span>
              <span>
                <span className={styles.songTitle}>{s.title}</span>
                <span className={styles.artist}>
                  {s.artist}
                  {!oneWeek && <> · week of {formatDay(s.week).replace(/, \d{4}$/, '')}</>}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.cell} style={{ '--i': 1 } as React.CSSProperties}>
        <h3>Prices</h3>
        {capture.price ? (
          <dl className={styles.prices}>
            <div>
              <dt>Gas</dt>
              <dd>{money(capture.price.gasPerGallon)}/gal</dd>
            </div>
            <div>
              <dt>Min. wage</dt>
              <dd>{money(capture.price.minimumWage)}/hr</dd>
            </div>
            <div>
              <dt>Movie ticket</dt>
              <dd>{money(capture.price.movieTicket)}</dd>
            </div>
          </dl>
        ) : (
          <p className={styles.none}>No price row in this window.</p>
        )}
      </section>
      <section className={styles.cell} style={{ '--i': 2 } as React.CSSProperties}>
        <h3>Events</h3>
        {capture.event ? (
          <p className={styles.event}>
            <time dateTime={capture.event.date}>{formatDay(capture.event.date)}</time>
            {capture.event.title}
          </p>
        ) : (
          <p className={styles.none}>No event in this window.</p>
        )}
      </section>
      <p className={styles.insight} style={{ '--i': 3 } as React.CSSProperties}>
        {capture.insight}
      </p>
    </div>
  )
}

function LogicSteps({ capture }: Readonly<{ capture: TimeSlipCapture }>) {
  return (
    <ol className={styles.steps}>
      <li>
        <span className={styles.stepKey}>Input</span>
        <span className={styles.stepVal}>&ldquo;{capture.query}&rdquo;</span>
      </li>
      <li>
        <span className={styles.stepKey}>Parsed by</span>
        <span className={styles.stepVal}>{capture.parsedBy}</span>
      </li>
      <li>
        <span className={styles.stepKey}>Window</span>
        <span className={styles.stepVal}>
          {formatDay(capture.window.start)} to {formatDay(capture.window.end)}
          <small>{capture.windowRule}</small>
        </span>
      </li>
      <li>
        <span className={styles.stepKey}>Query</span>
        <span className={styles.stepVal}>
          One batched Algolia request, the same window on all four indices
        </span>
      </li>
    </ol>
  )
}

function DataIndices({ capture }: Readonly<{ capture: TimeSlipCapture }>) {
  return (
    <ul className={styles.indices}>
      {INDEX_ORDER.map((idx) => (
        <li key={idx} data-empty={capture.hits[idx] === 0 || undefined}>
          <span className={styles.idxName}>{TIMESLIP_INDEX_LABEL[idx]}</span>
          <span className={styles.idxHits}>
            {capture.hits[idx]} {capture.hits[idx] === 1 ? 'row' : 'rows'} returned
          </span>
          <span className={styles.idxNote}>{INDEX_NOTE[idx]}</span>
        </li>
      ))}
    </ul>
  )
}

export function TimeSlipInspect() {
  const [selected, setSelected] = useState(TIMESLIP_CAPTURES[0].id)
  const [inspecting, setInspecting] = useState(false)
  const [focusLayer, setFocusLayer] = useState<Layer>('logic')
  // First paint is the finished panel: no typing, no fade-in. Motion starts only once the
  // visitor picks a date, so nothing on load waits on an animation (and LCP is not delayed).
  const [touched, setTouched] = useState(false)
  const reduced = useReducedMotion()
  const capture = TIMESLIP_CAPTURES.find((c) => c.id === selected) ?? TIMESLIP_CAPTURES[0]
  const typed = useTyped(capture.query, touched && !reduced)
  const headingId = useId()
  const legendId = useId()

  return (
    <section
      className={styles.device}
      aria-labelledby={headingId}
      data-inspecting={inspecting || undefined}
      data-reduced={reduced || undefined}
      data-touched={touched || undefined}
    >
      <header className={styles.top}>
        <h2 id={headingId} className={styles.brand}>
          <span className={styles.brandTime}>TimeSlip</span>
          <span className={styles.brandSlip}>Search</span>
        </h2>
        <p className={styles.badge}>Algolia Agent Studio winner</p>
      </header>

      {/* biome-ignore lint/a11y/useSemanticElements: div[role=group] is the correct ARIA pattern for a toggle button group */}
      <div className={styles.presets} role="group" aria-label="Pick a date to search">
        {TIMESLIP_CAPTURES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.preset}
            aria-pressed={c.id === selected}
            onClick={() => {
              setTouched(true)
              setSelected(c.id)
            }}
          >
            {c.query}
          </button>
        ))}
      </div>

      <p className={styles.query}>
        <span className="sr-only">Search: {capture.query}</span>
        <span aria-hidden="true">
          Show me <b>{typed}</b>
          <span className={styles.caret} />
        </span>
      </p>

      <div className={styles.stage}>
        <div className={styles.stack} data-focus={focusLayer}>
          <div className={`${styles.layer} ${styles.layerData}`} aria-hidden="true">
            <span className={styles.layerTag}>Data</span>
            <div className={styles.miniIdx}>
              {INDEX_ORDER.map((idx) => (
                <span key={idx} data-empty={capture.hits[idx] === 0 || undefined}>
                  {TIMESLIP_INDEX_LABEL[idx]} {capture.hits[idx]}
                </span>
              ))}
            </div>
          </div>
          <div className={`${styles.layer} ${styles.layerLogic}`} aria-hidden="true">
            <span className={styles.layerTag}>Logic</span>
            <span className={styles.miniLogic}>
              &ldquo;{capture.query}&rdquo; &rarr; {capture.window.start} &hellip;{' '}
              {capture.window.end}
            </span>
          </div>
          <div className={`${styles.layer} ${styles.layerUi}`}>
            <span className={styles.layerTag} aria-hidden="true">
              Interface
            </span>
            <InterfaceView capture={capture} />
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <button
          type="button"
          className={styles.inspectBtn}
          aria-expanded={inspecting}
          aria-controls={legendId}
          onClick={() => setInspecting((v) => !v)}
        >
          {inspecting ? 'Close inspect' : 'Inspect how it works'}
        </button>
        <p className={styles.source}>
          Real output from the live product, captured {formatDay(TIMESLIP_SOURCE.capturedAt)}.{' '}
          <a href="https://timeslipsearch.vercel.app" target="_blank" rel="noreferrer">
            Try any date
          </a>
        </p>
      </div>

      {/* Announces each new result in a sentence, including the empty ones, since focus stays on the date button. */}
      <p className="sr-only" role="status">
        {touched ? resultSummary(capture) : ''}
      </p>

      {inspecting && (
        <div id={legendId} className={styles.legend}>
          {/* biome-ignore lint/a11y/useSemanticElements: div[role=group] is the correct ARIA pattern for a toggle button group */}
          <div className={styles.legendTabs} role="group" aria-label="Choose a layer">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={focusLayer === l.id}
                onClick={() => setFocusLayer(l.id)}
                className={styles.legendTab}
              >
                <span>{l.name}</span>
                <small>{l.caption}</small>
              </button>
            ))}
          </div>
          <div className={styles.legendBody} aria-live="polite">
            {focusLayer === 'interface' && (
              <p className={styles.legendText}>
                The product answers with the top songs, a price check, what happened, and one
                generated insight line. This panel lays out those same fields from the captured
                response.
              </p>
            )}
            {focusLayer === 'logic' && <LogicSteps capture={capture} />}
            {focusLayer === 'data' && <DataIndices capture={capture} />}
          </div>
        </div>
      )}
    </section>
  )
}
