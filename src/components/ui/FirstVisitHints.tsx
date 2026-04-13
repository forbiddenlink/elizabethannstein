'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion, useViewStore } from '@/lib/store'

type HintLevel = 0 | 1 | 2

function getStoredHintLevel(): HintLevel {
  try {
    const val = Number(localStorage.getItem('ea-hints-level') ?? '0')
    return (val >= 0 && val <= 2 ? val : 0) as HintLevel
  } catch {
    return 0
  }
}

function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function FirstVisitHints() {
  const hasEntered = useViewStore((s) => s.hasEntered)
  const view = useViewStore((s) => s.view)
  const selectedProject = useViewStore((s) => s.selectedProject)
  const reducedMotion = usePrefersReducedMotion()

  const [hintLevel, setHintLevel] = useState<HintLevel>(() => getStoredHintLevel())
  const [activeHint, setActiveHint] = useState<1 | 2 | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const hadProjectOpen = useRef(false)
  const interactionCount = useRef(0)

  const isReturningVisitor =
    typeof window !== 'undefined' && localStorage.getItem('ea-has-visited') === 'true'

  const dismiss = useCallback((level: HintLevel) => {
    setActiveHint(null)
    setHintLevel(level)
    localStorage.setItem('ea-hints-level', String(level))
  }, [])

  // Detect touch device on mount
  useEffect(() => {
    setIsMobile(isTouchDevice())
  }, [])

  // Hint 1: 4s after entrance, if no star clicked yet
  useEffect(() => {
    if (!hasEntered || hintLevel >= 1 || isReturningVisitor) return
    const timer = setTimeout(() => {
      // If user already clicked a star, skip hint 1
      if (useViewStore.getState().view === 'project') {
        dismiss(1)
        return
      }
      setActiveHint(1)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasEntered, hintLevel, isReturningVisitor, dismiss])

  // Auto-dismiss hint 1 when user clicks a star
  useEffect(() => {
    if (view === 'project' && activeHint === 1) {
      dismiss(1)
    }
    if (view === 'project') {
      hadProjectOpen.current = true
      interactionCount.current++
    }
  }, [view, activeHint, dismiss])

  // Hint 2: 3s after first project modal closes
  useEffect(() => {
    if (hintLevel !== 1 || !hadProjectOpen.current) return
    if (view !== 'universe' && view !== 'galaxy') return
    if (selectedProject !== null) return

    const timer = setTimeout(() => {
      setActiveHint(2)
    }, 3000)
    return () => clearTimeout(timer)
  }, [hintLevel, view, selectedProject])

  // Track interactions for permanent dismissal
  useEffect(() => {
    if (activeHint !== 2) return

    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        (e.metaKey && e.key === 'k')
      ) {
        interactionCount.current++
      }
      if (interactionCount.current >= 2) {
        dismiss(2)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeHint, dismiss])

  // Dismiss hint 2 after 8s auto-timeout
  useEffect(() => {
    if (activeHint !== 2) return
    const timer = setTimeout(() => dismiss(2), 8000)
    return () => clearTimeout(timer)
  }, [activeHint, dismiss])

  if (hintLevel >= 2 || isReturningVisitor || !hasEntered) return null

  const hintText =
    activeHint === 1
      ? `${isMobile ? 'Tap' : 'Click'} any star to explore a project`
      : 'Use arrow keys to browse, or \u2318K to search'

  const initial = reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
  const animate = reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
  const exit = reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
  const transition = reducedMotion
    ? undefined
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

  return (
    <AnimatePresence>
      {activeHint !== null && (
        <motion.div
          key={activeHint}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 pointer-events-none"
        >
          <div className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md shadow-lg">
            <p className="text-xs text-white/75 whitespace-nowrap">{hintText}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
