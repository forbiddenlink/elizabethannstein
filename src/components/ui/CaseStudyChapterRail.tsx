'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './CaseStudyChapterRail.module.css'

type Chapter = { id: string; label: string }

const CHAPTER_DEF: readonly Chapter[] = [
  { id: 'case-visual', label: 'Evidence' },
  { id: 'case-arc', label: 'Story' },
  { id: 'case-signals', label: 'Scale' },
  { id: 'case-engine', label: 'Engine' },
  { id: 'case-voice', label: 'Voice' },
  { id: 'case-stack', label: 'Stack' },
] as const

/**
 * Marginalia chapter nav for long case studies: "where am I" in the read.
 * Mono chapter numbers, cobalt active state, driven entirely by --le-* tokens.
 */
export function CaseStudyChapterRail() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [present, setPresent] = useState<Chapter[]>([])

  useEffect(() => {
    const available = CHAPTER_DEF.filter((c) => document.getElementById(c.id))
    setPresent(available)

    const pickActive = () => {
      const mid = window.innerHeight * 0.36
      let best: { id: string; dist: number } | null = null
      for (const ch of available) {
        const el = document.getElementById(ch.id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        const sectionMid = (r.top + r.bottom) / 2
        const dist = Math.abs(sectionMid - mid)
        if (!best || dist < best.dist) best = { id: ch.id, dist }
      }
      if (best) setActiveId(best.id)
    }

    pickActive()
    window.addEventListener('scroll', pickActive, { passive: true })
    window.addEventListener('resize', pickActive, { passive: true })
    return () => {
      window.removeEventListener('scroll', pickActive)
      window.removeEventListener('resize', pickActive)
    }
  }, [])

  const desktopNav = useMemo(
    () =>
      present.map((ch, i) => {
        const isActive = activeId === ch.id
        return (
          <li key={ch.id}>
            <a
              href={`#${ch.id}`}
              className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              {ch.label}
            </a>
          </li>
        )
      }),
    [present, activeId]
  )

  if (present.length < 2) return null

  return (
    <>
      <nav aria-label="Case study chapters" className={styles.desktop}>
        <ul className={styles.list}>{desktopNav}</ul>
      </nav>
      <nav aria-label="Case study chapters" className={styles.mobile}>
        <ul className={styles.mobileList}>
          {present.map((ch) => (
            <li key={ch.id} className={styles.mobileItem}>
              <a
                href={`#${ch.id}`}
                className={`${styles.mobileLink} ${activeId === ch.id ? styles.mobileLinkActive : ''}`}
              >
                {ch.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
