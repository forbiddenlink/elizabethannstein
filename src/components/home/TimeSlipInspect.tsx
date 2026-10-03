'use client'

import { useEffect, useState } from 'react'
import {
  TIMESLIP_CAPTURES,
  TIMESLIP_INDEX_LABEL,
  TIMESLIP_SOURCE,
  type TimeSlipCapture,
  type TimeSlipIndex,
} from '@/lib/timeslipCapture'
import {
  cssVars,
  formatDay,
  InspectFrame,
  frameStyles as styles,
  useReducedMotion,
} from './InspectFrame'

const INDEX_ORDER: TimeSlipIndex[] = ['songs', 'movies', 'prices', 'events']

const INDEX_NOTE: Record<TimeSlipIndex, string> = {
  songs: 'Weekly charts, about 352,000 rows',
  movies: 'Box office by week',
  prices: 'Monthly gas, wage and ticket prices',
  events: 'Wikimedia events',
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

function InterfaceView({ capture }: Readonly<{ capture: TimeSlipCapture }>) {
  // One shared chart week goes in the heading; several weeks (a season) go on each song, or
  // "#1, #1, #1" reads like a bug.
  const oneWeek = capture.songs.every((s) => s.week === capture.songs[0].week)
  return (
    <div className={styles.results} key={capture.id}>
      <section className={styles.cell} style={cssVars({ '--i': 0 })}>
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
      <section className={styles.cell} style={cssVars({ '--i': 1 })}>
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
      <section className={styles.cell} style={cssVars({ '--i': 2 })}>
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
      <p className={styles.insight} style={cssVars({ '--i': 3 })}>
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

export function TimeSlipInspect({ headingLevel = 2 }: Readonly<{ headingLevel?: 2 | 3 }> = {}) {
  const [selected, setSelected] = useState(TIMESLIP_CAPTURES[0].id)
  // First paint is the finished panel: no typing, no fade-in. Motion starts only once the
  // visitor picks a date, so nothing on load waits on an animation (and LCP is not delayed).
  const [touched, setTouched] = useState(false)
  const reduced = useReducedMotion()
  const capture = TIMESLIP_CAPTURES.find((c) => c.id === selected) ?? TIMESLIP_CAPTURES[0]
  const typed = useTyped(capture.query, touched && !reduced)

  return (
    <InspectFrame
      headingLevel={headingLevel}
      product="timeslip"
      title={
        <>
          <span className={styles.brandTime}>TimeSlip</span>
          <span className={styles.brandSlip}>Search</span>
        </>
      }
      badge="Algolia Agent Studio winner"
      touched={touched}
      controls={
        <>
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
        </>
      }
      interfaceView={<InterfaceView capture={capture} />}
      logicMini={
        <span className={styles.miniLogic}>
          &ldquo;{capture.query}&rdquo; &rarr; {capture.window.start} &hellip; {capture.window.end}
        </span>
      }
      dataMini={
        <div className={styles.miniIdx}>
          {INDEX_ORDER.map((idx) => (
            <span key={idx} data-empty={capture.hits[idx] === 0 || undefined}>
              {TIMESLIP_INDEX_LABEL[idx]} {capture.hits[idx]}
            </span>
          ))}
        </div>
      }
      legend={{
        interface: (
          <p className={styles.legendText}>
            The product answers with the top songs, a price check, what happened, and one generated
            insight line. This panel lays out those same fields from the captured response.
          </p>
        ),
        logic: <LogicSteps capture={capture} />,
        data: <DataIndices capture={capture} />,
      }}
      source={
        <>
          Real output from the live product, captured {formatDay(TIMESLIP_SOURCE.capturedAt)}.{' '}
          <a href="https://timeslipsearch.vercel.app" target="_blank" rel="noreferrer">
            Try any date
          </a>
        </>
      }
      // Announces each new result in a sentence, including the empty ones, since focus stays on the date button.
      status={touched ? resultSummary(capture) : ''}
    />
  )
}
