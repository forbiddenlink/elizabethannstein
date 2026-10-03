'use client'

import { type CSSProperties, type ReactNode, useEffect, useId, useState } from 'react'
import styles from './InspectFrame.module.css'

export type InspectLayer = 'interface' | 'logic' | 'data'

export type DemoProduct = 'timeslip' | 'trace' | 'automadocs' | 'specter'

const LAYERS: { id: InspectLayer; name: string; caption: string }[] = [
  { id: 'interface', name: 'Interface', caption: 'What the person sees' },
  { id: 'logic', name: 'Logic', caption: 'What the system decided' },
  { id: 'data', name: 'Data', caption: 'Where it came from' },
]

export function useReducedMotion(): boolean {
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

/** Inline custom properties (`--i`, `--ar`) for a style prop. */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  // SAFETY: CSSProperties has no index for custom properties, and every key here is a
  // `--` custom property, which React passes through to the element's style unchanged.
  return vars as CSSProperties
}

export function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

interface InspectFrameProps {
  product: DemoProduct
  /** Content of the panel's h2: the product name, styled by the caller. */
  title: ReactNode
  badge?: string
  /** Inputs that change what the interface shows (presets, example pickers). */
  controls?: ReactNode
  interfaceView: ReactNode
  /** One-line summary drawn on the tilted logic layer; decorative, the legend carries it in full. */
  logicMini: ReactNode
  /** One-line summary drawn on the tilted data layer; decorative, the legend carries it in full. */
  dataMini: ReactNode
  legend: Record<InspectLayer, ReactNode>
  source: ReactNode
  /** Read to screen readers when the visitor changes the example, since focus stays put. */
  status?: string
  /** Set once the visitor has interacted, so entrance motion never delays first paint. */
  touched?: boolean
  /** 3 when the panel sits under a section heading (case studies); 2 when it stands alone. */
  headingLevel?: 2 | 3
}

export function InspectFrame({
  product,
  title,
  badge,
  controls,
  interfaceView,
  logicMini,
  dataMini,
  legend,
  source,
  status = '',
  touched = false,
  headingLevel = 2,
}: Readonly<InspectFrameProps>) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const [inspecting, setInspecting] = useState(false)
  const [focusLayer, setFocusLayer] = useState<InspectLayer>('logic')
  const reduced = useReducedMotion()
  const headingId = useId()
  const legendId = useId()

  return (
    <section
      className={styles.device}
      aria-labelledby={headingId}
      data-product={product}
      data-inspecting={inspecting || undefined}
      data-reduced={reduced || undefined}
      data-touched={touched || undefined}
    >
      <header className={styles.top}>
        <Heading id={headingId} className={styles.brand}>
          {title}
        </Heading>
        {badge && <p className={styles.badge}>{badge}</p>}
      </header>

      {controls}

      <div className={styles.stage}>
        <div className={styles.stack} data-focus={focusLayer}>
          <div className={`${styles.layer} ${styles.layerData}`} aria-hidden="true">
            <span className={styles.layerTag}>Data</span>
            {dataMini}
          </div>
          <div className={`${styles.layer} ${styles.layerLogic}`} aria-hidden="true">
            <span className={styles.layerTag}>Logic</span>
            {logicMini}
          </div>
          <div className={`${styles.layer} ${styles.layerUi}`}>
            <span className={styles.layerTag} aria-hidden="true">
              Interface
            </span>
            {interfaceView}
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
        <p className={styles.source}>{source}</p>
      </div>

      <p className="sr-only" role="status">
        {status}
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
            {legend[focusLayer]}
          </div>
        </div>
      )}
    </section>
  )
}

export { styles as frameStyles }
