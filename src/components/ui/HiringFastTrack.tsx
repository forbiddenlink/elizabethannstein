'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { getFastTrackProjects } from '@/lib/proofLayer'
import { useViewStore } from '@/lib/store'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
}

export function HiringFastTrack() {
  const showFastTrack = useViewStore((s) => s.showFastTrack)
  const dismissFastTrack = useViewStore((s) => s.dismissFastTrack)
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)
  const view = useViewStore((s) => s.view)
  const closeRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const isVisible = showFastTrack && !isJourneyMode && view !== 'exploration'
  const projects = getFastTrackProjects()

  // Auto-focus close button on open
  useEffect(() => {
    if (isVisible) {
      closeRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  // ESC to close
  useEffect(() => {
    if (!isVisible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        dismissFastTrack()
      }
    }
    globalThis.addEventListener('keydown', handler, true)
    return () => globalThis.removeEventListener('keydown', handler, true)
  }, [isVisible, dismissFastTrack])

  // Focus trap
  const handleTab = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !overlayRef.current) return
    const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return
    globalThis.addEventListener('keydown', handleTab)
    return () => globalThis.removeEventListener('keydown', handleTab)
  }, [isVisible, handleTab])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={overlayRef}
          key="fast-track-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[65] bg-black/90 backdrop-blur-xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Featured work fast track"
        >
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.4 }}
                  className="text-3xl font-light text-white"
                >
                  Proof of work
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mt-2 text-white/50 text-sm"
                >
                  Six flagship systems: production D365, contest win, SaaS, enterprise scale
                </motion.p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={dismissFastTrack}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close featured work overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href={`/work/${project.id}`}
                    onClick={dismissFastTrack}
                    className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors min-h-[44px] group"
                  >
                    <h3 className="text-lg font-medium text-white">{project.title}</h3>
                    <p className="text-sm text-white/50 mt-0.5">{project.role}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-white/40 mt-3 line-clamp-2">{project.description}</p>
                    <span className="inline-block mt-3 text-sm text-white/60 group-hover:text-white transition-colors">
                      View case study &rarr;
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Shortcut hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-xs text-white/30"
            >
              Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded font-mono">F</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded font-mono">ESC</kbd> to close
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
