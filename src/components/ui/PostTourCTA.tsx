'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useViewStore } from '@/lib/store'

export function PostTourCTA() {
  const show = useViewStore((state) => state.showPostTourCTA)
  const dismiss = useViewStore((state) => state.dismissPostTourCTA)
  const router = useRouter()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-dismiss after 15s
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(dismiss, 15_000)
    return () => clearTimeout(timer)
  }, [show, dismiss])

  // ESC to close + auto-focus first button
  useEffect(() => {
    if (!show) return
    firstButtonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show, dismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/80 p-8 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="mb-2 text-2xl font-light text-white">Tour complete</h2>
            <p className="mb-6 text-sm text-white/60">
              You&apos;ve seen the highlights. What&apos;s next?
            </p>
            <div className="flex flex-col gap-3">
              <button
                ref={firstButtonRef}
                type="button"
                onClick={dismiss}
                className="min-h-[44px] w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Explore the universe
              </button>
              <button
                type="button"
                onClick={() => {
                  dismiss()
                  router.push('/work')
                }}
                className="min-h-[44px] w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Browse all projects
              </button>
              <button
                type="button"
                onClick={() => {
                  dismiss()
                  router.push('/contact')
                }}
                className="min-h-[44px] w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Get in touch
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
