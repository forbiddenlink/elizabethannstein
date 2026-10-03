'use client'

import { useState } from 'react'
import {
  TRACE_CAPTURES,
  TRACE_SOURCE,
  type TraceCapture,
  type TraceGrounding,
} from '@/lib/traceCapture'
import { formatDay, frameStyles, InspectFrame } from './InspectFrame'
import styles from './TraceInspect.module.css'

// The seven-component whitelist the model maps detections onto (api/generate.ts:80 in Trace).
const CATALOG = ['Button', 'Input', 'Card', 'Dialog', 'Select', 'Checkbox', 'Badge']

const GROUNDINGS: TraceGrounding[] = ['grounded', 'inferred', 'guessed']

function countBy(c: TraceCapture): Record<TraceGrounding, number> {
  const out: Record<TraceGrounding, number> = { grounded: 0, inferred: 0, guessed: 0 }
  for (const d of c.detections) out[d.grounding] += 1
  return out
}

function summary(c: TraceCapture): string {
  const n = countBy(c)
  return `${c.title}: ${c.detections.length} elements found, ${n.grounded} grounded, ${n.inferred} inferred, ${n.guessed} guessed. ${c.repairs === 0 ? 'Compiled first time.' : `Needed ${c.repairs} repair pass to compile.`}`
}

function Screenshot({ capture }: Readonly<{ capture: TraceCapture }>) {
  const n = countBy(capture)
  return (
    <div className={styles.shotWrap}>
      <figure
        className={styles.shot}
        style={
          {
            aspectRatio: `${capture.width} / ${capture.height}`,
            '--ar': capture.width / capture.height,
          } as React.CSSProperties
        }
      >
        {/* biome-ignore lint/performance/noImgElement: fixed-size demo asset; the boxes are positioned against its exact frame */}
        <img
          src={capture.image}
          width={capture.width}
          height={capture.height}
          alt={`The ${capture.title.toLowerCase()} screenshot Trace was given`}
          loading="lazy"
          decoding="async"
        />
        {capture.detections.map((d) => {
          const [ymin, xmin, ymax, xmax] = d.box
          return (
            <span
              key={`${d.label}-${d.box.join('-')}`}
              className={styles.box}
              data-g={d.grounding}
              aria-hidden="true"
              style={{
                top: `${ymin / 10}%`,
                left: `${xmin / 10}%`,
                width: `${(xmax - xmin) / 10}%`,
                height: `${(ymax - ymin) / 10}%`,
              }}
            />
          )
        })}
      </figure>
      <ul className={styles.key}>
        {GROUNDINGS.map((g) => (
          <li key={g} data-g={g}>
            <span className={styles.swatch} aria-hidden="true" />
            {n[g]} {g}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Detections({ capture }: Readonly<{ capture: TraceCapture }>) {
  return (
    <ol className={styles.dets}>
      {capture.detections.map((d) => (
        <li key={`${d.label}-${d.box.join('-')}`} data-g={d.grounding}>
          <span className={styles.detLabel}>{d.label}</span>
          <span className={styles.detComp}>{d.component}</span>
          <span className={styles.detConf}>
            {d.confidence.toFixed(2)} · {d.grounding}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function TraceInspect({ headingLevel = 2 }: Readonly<{ headingLevel?: 2 | 3 }> = {}) {
  const [selected, setSelected] = useState(TRACE_CAPTURES[0].id)
  const [touched, setTouched] = useState(false)
  const capture = TRACE_CAPTURES.find((c) => c.id === selected) ?? TRACE_CAPTURES[0]
  const n = countBy(capture)

  return (
    <InspectFrame
      headingLevel={headingLevel}
      product="trace"
      title="Trace"
      badge="Screenshot to React, grounded"
      touched={touched}
      controls={
        // biome-ignore lint/a11y/useSemanticElements: div[role=group] is the correct ARIA pattern for a toggle button group
        <div className={frameStyles.presets} role="group" aria-label="Pick an example screenshot">
          {TRACE_CAPTURES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={frameStyles.preset}
              aria-pressed={c.id === selected}
              onClick={() => {
                setTouched(true)
                setSelected(c.id)
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
      }
      interfaceView={<Screenshot key={capture.id} capture={capture} />}
      logicMini={
        <span className={styles.mini}>
          detect &rarr; map to catalog &rarr; generate &rarr; compile
          {capture.repairs > 0 ? ` → repair ×${capture.repairs}` : ''}
        </span>
      }
      dataMini={
        <span className={styles.mini}>
          {capture.detections.length} detections · {n.grounded} grounded · {n.inferred} inferred
          {n.guessed ? ` · ${n.guessed} guessed` : ''}
        </span>
      }
      legend={{
        interface: (
          <>
            <p className={frameStyles.legendText}>
              Each box is one element the model found, drawn where it said the element is. Colour is
              the model&apos;s own rating of how cleanly it maps to a known component.
            </p>
            <Detections capture={capture} />
          </>
        ),
        logic: (
          <ol className={frameStyles.steps}>
            <li>
              <span className={frameStyles.stepKey}>Catalog</span>
              <span className={frameStyles.stepVal}>
                Seven whitelisted components: {CATALOG.join(', ')}
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Detect</span>
              <span className={frameStyles.stepVal}>
                Every element gets a box, the closest catalog component, a confidence, and its own
                rating: grounded, inferred or guessed
                <small>Text is not in the catalog, so every text element came back inferred.</small>
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Generate</span>
              <span className={frameStyles.stepVal}>
                One React file. Imports are limited to react and lucide-react, so it runs in a plain
                React sandbox
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Compile</span>
              <span className={frameStyles.stepVal}>
                esbuild checks it; a failure goes back to the model with the error, up to two times
                <small>
                  {capture.repairs === 0
                    ? 'This one compiled first time.'
                    : `This one needed ${capture.repairs} repair pass.`}
                </small>
              </span>
            </li>
          </ol>
        ),
        data: (
          <ul className={frameStyles.indices}>
            {GROUNDINGS.map((g) => (
              <li key={g} data-empty={n[g] === 0 || undefined}>
                <span className={frameStyles.idxName}>{g[0].toUpperCase() + g.slice(1)}</span>
                <span className={frameStyles.idxHits}>
                  {n[g]} of {capture.detections.length} elements
                </span>
              </li>
            ))}
            <li>
              <span className={frameStyles.idxName}>Components used</span>
              <span className={frameStyles.idxHits}>{capture.componentsUsed.join(', ')}</span>
              <span className={frameStyles.idxNote}>
                {capture.jsxChars.toLocaleString('en-US')} characters of generated code
              </span>
            </li>
          </ul>
        ),
      }}
      source={
        <>
          Real output from Trace&apos;s Gemini pipeline, captured{' '}
          {formatDay(TRACE_SOURCE.capturedAt)}.{' '}
          <a href={TRACE_SOURCE.live} target="_blank" rel="noreferrer">
            Open Trace
          </a>
        </>
      }
      status={touched ? summary(capture) : ''}
    />
  )
}
