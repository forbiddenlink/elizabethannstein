'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '@/lib/achievements'

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ x: 120, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 120, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-6 right-6 z-[9999] flex items-center gap-4 
                     bg-black/85 backdrop-blur-2xl border border-white/15
                     rounded-2xl px-5 py-4 max-w-xs cursor-pointer
                     shadow-[0_0_30px_rgba(255,255,255,0.06)]"
          onClick={onDismiss}
          role="alert"
          aria-live="polite"
        >
          <span className="text-4xl leading-none select-none">{achievement.icon}</span>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] text-white/35 uppercase tracking-[0.15em] font-mono">
              Achievement Unlocked
            </p>
            <p className="text-white font-bold text-sm leading-tight">{achievement.label}</p>
            <p className="text-white/55 text-xs leading-snug">{achievement.desc}</p>
          </div>
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Singleton manager — renders at root, accept queued achievements
interface ToastManagerState {
  queue: Achievement[]
  current: Achievement | null
}

let globalEnqueue: ((a: Achievement) => void) | null = null

export function enqueueAchievement(achievement: Achievement) {
  if (globalEnqueue) globalEnqueue(achievement)
}

export function AchievementToastManager() {
  const [state, setState] = useState<ToastManagerState>({ queue: [], current: null })

  const enqueue = useCallback((a: Achievement) => {
    setState(prev => {
      if (prev.current === null) return { queue: prev.queue, current: a }
      return { queue: [...prev.queue, a], current: prev.current }
    })
  }, [])

  useEffect(() => {
    globalEnqueue = enqueue
    return () => { globalEnqueue = null }
  }, [enqueue])

  const dismiss = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return { queue: [], current: null }
      const [next, ...rest] = prev.queue
      return { queue: rest, current: next }
    })
  }, [])

  return <AchievementToast achievement={state.current} onDismiss={dismiss} />
}
