'use client'

import { useEffect, useRef } from 'react'

/**
 * Magnetic hover: the element eases toward the pointer while it hovers, then
 * springs back on leave. Gated on a fine pointer + no reduced-motion, so it is
 * a no-op on touch devices and for motion-sensitive users. rAF-driven and
 * self-cleaning (inline transform is cleared on unmount).
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof matchMedia === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else {
        el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`
        raf = 0
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * strength
      ty = (e.clientY - (r.top + r.height / 2)) * strength
      schedule()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      schedule()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [strength])

  return ref
}
