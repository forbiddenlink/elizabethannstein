'use client'

import { useViewStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * First-visit hint toast explaining the galaxy navigation.
 * Shows once per session for 8s, centered at bottom to avoid
 * all right-side UI stack conflicts.
 */
export function GalaxyHint() {
  const [visible, setVisible] = useState(false)
  const hasEntered = useViewStore((state) => state.hasEntered)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  const shouldShowHint = view === 'universe' && !selectedGalaxy

  useEffect(() => {
    if (!hasEntered || !shouldShowHint) return
    if (sessionStorage.getItem('galaxy-hint-seen') === 'true') return
    // Short delay after entering so the galaxy loads first
    const show = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(show)
  }, [hasEntered, shouldShowHint])

  useEffect(() => {
    if (shouldShowHint) return
    setVisible(false)
  }, [shouldShowHint])

  useEffect(() => {
    if (!visible) return
    const hide = setTimeout(() => dismiss(), 8000)
    return () => clearTimeout(hide)
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('galaxy-hint-seen', 'true')
  }

  // Hide during journey, exploration, or modal
  if (isJourneyMode || view === 'exploration' || view === 'project' || !shouldShowHint) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-104 z-20 w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 pointer-events-auto lg:top-auto lg:bottom-32 lg:w-auto"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-start gap-2.5 rounded-2xl border border-white/15 bg-black/72 px-4 py-3 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:px-5">
            {/* Main hint */}
            <span className="flex items-center gap-2 text-xs text-white/72">
              <span className="text-purple-400">Click any star</span> to view that project
            </span>
            <span className="w-px h-3 bg-white/15 hidden sm:block" aria-hidden="true" />
            {/* Keyboard hints */}
            <span className="flex flex-wrap items-center gap-2.5 text-xs text-white/58 sm:gap-3">
              <span className="flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/50">
                  ←→↑↓
                </kbd>
                <span className="hidden md:inline">navigate</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/50">
                  ⌘K
                </kbd>
                <span className="hidden md:inline">search</span>
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/50">
                  ?
                </kbd>
                <span className="hidden md:inline">help</span>
              </span>
            </span>
            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="absolute right-3 top-3 rounded-full p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60 sm:static sm:ml-1"
              aria-label="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
