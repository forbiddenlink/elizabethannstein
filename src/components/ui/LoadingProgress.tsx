'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LoadingProgressProps {
  onComplete?: () => void
}

export function LoadingProgress({ onComplete }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100)
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

      intervalIndex++
      setTimeout(tick, config.duration + Math.random() * 100)
    }

    const timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [onComplete, reduceMotion])

  const rounded = Math.round(progress)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black p-8">
      <div className="w-48 max-w-full">
        <div
          className="mb-3 h-0.5 overflow-hidden rounded-full bg-white/[0.08]"
          role="progressbar"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Scene loading progress"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--color-text-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center font-mono text-[11px] tabular-nums text-[var(--color-text-secondary)]">
          {rounded}%
        </p>
      </div>

      <div className="absolute bottom-8">
        <Link
          href="/work"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
        >
          Skip to projects
        </Link>
      </div>

      {isComplete && (
        <span className="sr-only" aria-live="polite">
          Loading complete
        </span>
      )}
    </div>
  )
}
