'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface LoadingProgressProps {
  onComplete?: () => void
}

const LOADING_STAGES = [
  { threshold: 0, label: 'Initializing universe...' },
  { threshold: 15, label: 'Mapping star systems...' },
  { threshold: 35, label: 'Generating nebulae...' },
  { threshold: 55, label: 'Placing project stars...' },
  { threshold: 75, label: 'Calibrating cameras...' },
  { threshold: 90, label: 'Preparing for launch...' },
  { threshold: 100, label: 'Ready!' },
] as const

/** Deterministic 0–1 hash for stable star positions (no layout shift / hydration noise). */
function starHash(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function LoadingProgress({ onComplete }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('Initializing universe...')
  const [isComplete, setIsComplete] = useState(false)
  const reduceMotion = useReducedMotion()

  const starfield = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: starHash(i * 1.17) * 100,
        top: starHash(i * 2.41) * 100,
        duration: reduceMotion ? 0.01 : 1.6 + starHash(i * 3.2) * 2.2,
        delay: reduceMotion ? 0 : starHash(i * 4.1) * 1.8,
        scale: 0.75 + starHash(i * 5.3) * 0.5,
      })),
    [reduceMotion]
  )

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100)
      setStage('Ready!')
      setIsComplete(true)
      const t = setTimeout(() => onComplete?.(), 200)
      return () => clearTimeout(t)
    }

    const intervals = [
      { duration: 200, increment: 8 },
      { duration: 150, increment: 5 },
      { duration: 180, increment: 4 },
      { duration: 200, increment: 3 },
      { duration: 100, increment: 6 },
    ]

    let currentProgress = 0
    let intervalIndex = 0

    const tick = () => {
      if (currentProgress >= 100) {
        setIsComplete(true)
        setTimeout(() => {
          onComplete?.()
        }, 500)
        return
      }

      const config = intervals[Math.min(intervalIndex, intervals.length - 1)]
      const increment = config.increment + Math.random() * 3

      currentProgress = Math.min(100, currentProgress + increment)
      setProgress(currentProgress)

      const currentStage = [...LOADING_STAGES].reverse().find((s) => currentProgress >= s.threshold)
      if (currentStage) {
        setStage(currentStage.label)
      }

      intervalIndex++
      setTimeout(tick, config.duration + Math.random() * 100)
    }

    const timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [onComplete, reduceMotion])

  const rounded = Math.round(progress)

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020108] flex flex-col items-center justify-center p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(99,102,241,0.14), transparent 55%), radial-gradient(ellipse 100% 90% at 50% 100%, rgba(168,85,247,0.08), transparent 45%)',
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {starfield.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.scale * 4,
              height: star.scale * 4,
            }}
            animate={
              reduceMotion
                ? { opacity: 0.5 }
                : {
                    opacity: [0.15, 0.95, 0.2],
                    scale: [0.85, 1.15, 0.85],
                  }
            }
            transition={{
              duration: star.duration,
              repeat: reduceMotion ? 0 : Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative mb-10">
        <motion.div
          className="h-20 w-20 rounded-full border-2 border-indigo-500/25"
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-pink-500/90 border-b-transparent border-l-transparent"
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.25, 1],
                    opacity: [0.85, 1, 0.85],
                  }
            }
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="relative w-72 max-w-full">
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
          Loading experience
        </p>
        <div
          className="mb-4 h-1 overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-white/[0.06] relative"
          role="progressbar"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Scene loading progress"
        >
          {/* Shimmer effect on track */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-fuchsia-500 shadow-[0_0_24px_rgba(168,85,247,0.35)] relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {/* Shimmer on progress bar */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="min-h-[1.25rem] text-center text-sm text-white/65"
            aria-live="polite"
          >
            {stage}
          </motion.p>
        </AnimatePresence>

        <p className="mt-2 text-center font-mono text-[11px] tabular-nums text-white/35">
          {rounded}%
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-3 px-4"
      >
        <Link
          href="/work"
          className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white/55 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white/85"
        >
          Skip to projects →
        </Link>
        <p className="text-center text-[11px] text-white/25">Tip: ⌘K search · arrows navigate</p>
      </motion.div>

      {isComplete && (
        <span className="sr-only" aria-live="polite">
          Loading complete
        </span>
      )}
    </div>
  )
}
