'use client'

import { useEffect, useMemo, useState } from 'react'

type Chapter = { id: string; label: string }

const CHAPTER_DEF: readonly Chapter[] = [
  { id: 'case-visual', label: 'Proof' },
  { id: 'case-arc', label: 'Story' },
  { id: 'case-signals', label: 'Scale' },
  { id: 'case-engine', label: 'Engine' },
  { id: 'case-voice', label: 'Voice' },
  { id: 'case-stack', label: 'Stack' },
] as const

interface CaseStudyChapterRailProps {
  /** Project accent hex for active dot */
  accentColor: string
}

/**
 * Chapter rail + mobile strip — spatial “where am I” for long case studies.
 */
export function CaseStudyChapterRail({ accentColor }: Readonly<CaseStudyChapterRailProps>) {
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
      present.map((ch) => (
        <li key={ch.id}>
          <a
            href={`#${ch.id}`}
            className="group flex items-center gap-2.5 rounded-full py-1.5 pr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={activeId === ch.id ? { color: 'rgba(255,255,255,0.92)' } : undefined}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full border border-white/25 transition-all duration-300 group-hover:border-white/50"
              style={{
                backgroundColor: activeId === ch.id ? accentColor : 'transparent',
                boxShadow: activeId === ch.id ? `0 0 12px ${accentColor}99` : undefined,
                borderColor: activeId === ch.id ? `${accentColor}88` : undefined,
              }}
              aria-hidden="true"
            />
            {ch.label}
          </a>
        </li>
      )),
    [present, activeId, accentColor],
  )

  if (present.length < 2) return null

  return (
    <>
      <nav
        aria-label="Case study chapters"
        className="pointer-events-auto fixed left-4 top-1/2 z-[45] hidden -translate-y-1/2 md:block lg:left-6"
      >
        <ul className="flex flex-col gap-1.5 rounded-lg border border-white/[0.09] bg-black/50 px-3 py-3">
          {desktopNav}
        </ul>
      </nav>
      <nav
        aria-label="Case study chapters"
        className="pointer-events-auto fixed bottom-4 left-1/2 z-[45] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 md:hidden"
      >
        <ul className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/[0.1] bg-black/60 px-2 py-2">
          {present.map((ch) => (
            <li key={ch.id} className="shrink-0">
              <a
                href={`#${ch.id}`}
                className={`block rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider transition-colors ${
                  activeId === ch.id ? 'text-white' : 'text-white/40'
                }`}
                style={
                  activeId === ch.id
                    ? {
                        backgroundColor: `${accentColor}22`,
                        boxShadow: `0 0 16px ${accentColor}44`,
                      }
                    : undefined
                }
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
