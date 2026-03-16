'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useViewStore } from '@/lib/store'

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

  useEffect(() => {
    if (!hasEntered) return
    if (sessionStorage.getItem('galaxy-hint-seen') === 'true') return
    // Short delay after entering so the galaxy loads first
    const show = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(show)
  }, [hasEntered])

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
  if (isJourneyMode || view === 'exploration' || view === 'project') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl whitespace-nowrap">
            {/* Hint items */}
            <span className="flex items-center gap-2 text-white/60 text-xs">
              <span className="text-white/40">✦</span>
              Each <span className="text-white/80 font-medium">star</span> is a project
            </span>
            <span className="w-px h-3 bg-white/15" aria-hidden="true" />
            <span className="flex items-center gap-2 text-white/60 text-xs">
              <span className="text-white/40">◎</span>
              Each <span className="text-white/80 font-medium">cluster</span> is a category
            </span>
            <span className="w-px h-3 bg-white/15 hidden sm:block" aria-hidden="true" />
            <span className="hidden sm:flex items-center gap-2 text-white/60 text-xs">
              <kbd className="text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/50">1–6</kbd>
              jump to galaxy
            </span>
            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="ml-1 p-1 rounded-full hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
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
