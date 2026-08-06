'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations/gsap'

interface RevealOptions {
  /** CSS selector for the children to stagger. Omit to reveal the container itself. */
  selector?: string
  /** Travel distance in px. */
  y?: number
  /** Stagger between items (seconds). */
  stagger?: number
  /** Per-item duration (seconds). */
  duration?: number
  /** Reveal on scroll into view (default) vs immediately on mount. */
  scroll?: boolean
}

/**
 * Reusable, reduced-motion-gated GSAP text/element reveal.
 *
 * SSR-safe by design: content is rendered visible by default and this hook only
 * *hides then reveals* when motion is allowed. With reduced-motion (or no JS) the
 * content simply stays put — no FOUC, no hidden-without-JS trap. gsap.context()
 * scopes and reverts all inline styles on cleanup.
 */
export function useGsapReveal<T extends HTMLElement = HTMLElement>(opts: RevealOptions = {}) {
  const { selector, y = 24, stagger = 0.08, duration = 0.9, scroll = true } = opts
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || typeof matchMedia === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = selector ? root.querySelectorAll(selector) : [root]
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'expo.out',
        ...(scroll ? { scrollTrigger: { trigger: root, start: 'top 85%', once: true } } : {}),
      })
    }, root)

    return () => ctx.revert()
  }, [selector, y, stagger, duration, scroll])

  return ref
}
