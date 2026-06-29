'use client'

import { useEffect, useState } from 'react'

interface ScrollProgressProps {
  color?: string
  target?: HTMLElement | null
}

function getProgressTone(color?: string): string {
  switch (color?.toLowerCase()) {
    case '#ff6b35':
      return 'enterprise'
    case '#00d9ff':
      return 'ai'
    case '#b47eff':
      return 'fullstack'
    case '#06ffa5':
      return 'devtools'
    case '#ff4d94':
      return 'creative'
    case '#ffb800':
      return 'experimental'
    default:
      return 'default'
  }
}

export function ScrollProgress({ color, target }: ScrollProgressProps = {}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const tone = getProgressTone(color)
  const roundedProgress = Math.max(0, Math.min(100, Math.round(scrollProgress)))

  useEffect(() => {
    const updateScrollProgress = () => {
      if (target) {
        const scrollTop = target.scrollTop
        const scrollHeight = target.scrollHeight - target.clientHeight
        setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
        return
      }

      // Window scroll (case study pages)
      const scrollTop = globalThis.scrollY
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }

    const eventTarget: HTMLElement | Window = target ?? window
    eventTarget.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => {
      eventTarget.removeEventListener('scroll', updateScrollProgress)
    }
  }, [target])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5" aria-hidden="true">
      <div
        className="scroll-progress-bar h-full min-w-0 transition-[width] duration-150 ease-out"
        data-tone={tone}
        style={{ width: `${roundedProgress}%` }}
      >
        <div className="scroll-progress-glow absolute inset-0 blur-sm" data-tone={tone} />
      </div>
    </div>
  )
}
