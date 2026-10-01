'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useViewStore } from '@/lib/store'

const linkClass =
  'inline-flex min-h-11 items-center rounded-md px-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80'

/**
 * The only persistent chrome on /explore: name, one plain line, three links.
 * Collapses to a pill so the galaxy owns the screen. Starts collapsed on phones.
 */
export function ExplorePanel() {
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (globalThis.matchMedia('(max-width: 767px)').matches) setOpen(false)
  }, [])

  if (isJourneyMode) return null

  return (
    <header className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
      <h1 className="sr-only">Elizabeth Stein, 3D portfolio</h1>
      {open ? (
        <div className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-white/10 bg-black/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xl font-semibold tracking-tight text-white" aria-hidden="true">
              Elizabeth Stein
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-expanded={true}
              aria-label="Collapse intro"
              className="-mt-2 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            Full-stack engineer and designer. Each planet is a project; click one to open it.
          </p>
          <nav aria-label="Site links" className="-mx-3 mt-3 flex flex-wrap gap-1">
            <Link href="/work" className={linkClass}>
              Work
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <a
              href="/resume/elizabeth-stein-resume.pdf"
              download="Elizabeth_Stein_Resume.pdf"
              className={linkClass}
            >
              Résumé
            </a>
          </nav>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 text-sm font-medium text-white hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          Elizabeth Stein
          <ChevronDown className="h-4 w-4 text-white/60" aria-hidden="true" />
        </button>
      )}
    </header>
  )
}
