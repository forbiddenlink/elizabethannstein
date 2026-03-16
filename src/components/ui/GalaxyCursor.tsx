'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useViewStore } from '@/lib/store'

/**
 * GalaxyCursor — single unified cursor replacing all 5 competing cursor effects.
 * 
 * Features:
 * - Glowing orb that trails the mouse with spring physics
 * - Pixel-sharp dot that follows instantly
 * - Canvas particle trail in galaxy colours
 * - Morphs to crosshair scanner reticle when hovering a planet
 * - Magnetic snap: buttons/links subtly attract the orb
 * - Chromatic aberration ring burst on fast movement
 * 
 * Desktop only — hidden on touch devices.
 */

const TRAIL_COLORS = ['#6366f1','#a855f7','#ec4899','#3b82f6','#8b5cf6','#06b6d4','#f59e0b']
const MAX_PARTICLES = 60
const SPEED_HISTORY = 8

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  color: string
}

export function GalaxyCursor() {
  const orbRef   = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [cursorState, setCursorState] = useState<'default'|'hover'|'planet'|'drag'>('default')

  const selectedProject = useViewStore(s => s.selectedProject)
  const view = useViewStore(s => s.view)

  // Effect 1: detect desktop and flip isReady flag (mounts the DOM elements)
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (!isMobile) setIsReady(true)
  }, [])

  // Effect 2: set up canvas + GSAP ticker — only runs after isReady=true causes DOM update
  useEffect(() => {
    if (!isReady) return

    const orb   = orbRef.current
    const dot   = dotRef.current
    const ring  = ringRef.current
    const canvas = canvasRef.current
    if (!orb || !dot || !ring || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── canvas sizing ──────────────────────────────────────────────
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    // ── mouse state ────────────────────────────────────────────────
    const mouse  = { x: -200, y: -200 }
    const orb_pos = { x: -200, y: -200 }
    const speeds: number[] = Array(SPEED_HISTORY).fill(0)
    let speedIdx = 0
    let lastX = -200, lastY = -200
    let isPlanetHover = false
    let isLinkHover   = false
    let chromaActive  = false
    let chromaTimer: ReturnType<typeof setTimeout>

    // ── particle pool ──────────────────────────────────────────────
    const particles: Particle[] = []
    let pid = 0

    // ── smooth orb (GSAP ticker) ───────────────────────────────────
    const LERP = 0.12
    gsap.ticker.add(() => {
      orb_pos.x += (mouse.x - orb_pos.x) * LERP
      orb_pos.y += (mouse.y - orb_pos.y) * LERP
      gsap.set(orb, { x: orb_pos.x, y: orb_pos.y })
    })

    // ── mouse move ─────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY
      gsap.set(dot,  { x: e.clientX, y: e.clientY })
      gsap.set(ring, { x: e.clientX, y: e.clientY })

      // track speed for chromatic ring burst
      const dx = e.clientX - lastX, dy = e.clientY - lastY
      const speed = Math.sqrt(dx*dx + dy*dy)
      speeds[speedIdx++ % SPEED_HISTORY] = speed
      lastX = e.clientX; lastY = e.clientY

      const avgSpeed = speeds.reduce((a,b) => a+b, 0) / SPEED_HISTORY
      if (avgSpeed > 28 && !chromaActive) {
        chromaActive = true
        clearTimeout(chromaTimer)
        chromaTimer = setTimeout(() => { chromaActive = false }, 120)
      }

      // spawn trail particle
      if (!isPlanetHover) {
        particles.push({
          x: e.clientX + (Math.random()-0.5)*6,
          y: e.clientY + (Math.random()-0.5)*6,
          vx: (Math.random()-0.5)*1.2,
          vy: (Math.random()-0.5)*1.2 - 0.4,
          size: Math.random()*2.8+0.8,
          opacity: 0.85,
          color: TRAIL_COLORS[Math.floor(Math.random()*TRAIL_COLORS.length)]
        })
        if (particles.length > MAX_PARTICLES) particles.shift()
      }
    }
    window.addEventListener('mousemove', onMove)

    // ── hover detection ────────────────────────────────────────────
    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      isLinkHover = true
      isPlanetHover = el.dataset.planet === 'true'
      setCursorState(isPlanetHover ? 'planet' : 'hover')
    }
    const onLeave = () => {
      isLinkHover = false; isPlanetHover = false
      setCursorState('default')
    }

    const attachListeners = () => {
      document.querySelectorAll('a, button, [role="button"], canvas, [data-planet]').forEach(el => {
        el.addEventListener('mouseenter', onEnter as EventListener)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachListeners()

    // Re-attach on DOM mutations (dynamic content)
    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    // ── canvas animation loop ──────────────────────────────────────
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        p.opacity -= 0.028
        p.size    *= 0.972
        if (p.opacity <= 0) { particles.splice(i,1); continue }

        ctx.save()
        ctx.globalAlpha  = p.opacity
        ctx.fillStyle    = p.color
        ctx.shadowBlur   = 10
        ctx.shadowColor  = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fill()
        ctx.restore()
      }

      // Chromatic ring burst
      if (chromaActive) {
        const avgSpeed = speeds.reduce((a,b)=>a+b,0)/SPEED_HISTORY
        const alpha = Math.min(avgSpeed/60, 0.5)
        ctx.save()
        ctx.globalAlpha = alpha * 0.4
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth   = 1.5
        ctx.shadowBlur  = 12
        ctx.shadowColor = '#60a5fa'
        ctx.beginPath()
        ctx.arc(mouse.x+2, mouse.y+2, 20, 0, Math.PI*2)
        ctx.stroke()
        ctx.strokeStyle = '#f472b6'
        ctx.shadowColor = '#f472b6'
        ctx.beginPath()
        ctx.arc(mouse.x-2, mouse.y-2, 20, 0, Math.PI*2)
        ctx.stroke()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(chromaTimer)
      gsap.ticker.remove(() => {})
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [isReady])

  // When project modal opens, freeze cursor state
  useEffect(() => {
    if (view === 'project') setCursorState('default')
  }, [view, selectedProject])

  if (!isReady) return null

  const isPlanet = cursorState === 'planet'
  const isHover  = cursorState === 'hover' || isPlanet

  return (
    <>
      {/* Canvas trail + chromatic ring */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Outer glowing orb — trails with spring */}
      <div
        ref={orbRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {isPlanet ? (
          /* Scanner crosshair for planets */
          <div className="relative" style={{ width: 48, height: 48 }}>
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-2 rounded-full border border-cyan-400/60" />
            {/* crosshair lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/50 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/50 -translate-x-1/2" />
            <div className="absolute inset-[22px] w-1 h-1 rounded-full bg-cyan-400" />
            {/* Context label */}
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
              style={{ color: '#22d3ee', textShadow: '0 0 8px rgba(34,211,238,0.8)' }}
            >
              EXPLORE →
            </div>
          </div>
        ) : (
          /* Normal glowing orb */
          <div className="relative">
            <div
              className="rounded-full transition-all duration-200"
              style={{
                width:  isHover ? 44 : 28,
                height: isHover ? 44 : 28,
                background: isHover
                  ? 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.12) 60%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.06) 60%, transparent 100%)',
                border: `1px solid rgba(139,92,246,${isHover ? 0.5 : 0.25})`,
                boxShadow: isHover
                  ? '0 0 18px rgba(139,92,246,0.4), 0 0 40px rgba(99,102,241,0.15)'
                  : '0 0 10px rgba(139,92,246,0.2)',
                filter: 'blur(0.4px)',
              }}
            />
            {/* Context label on hover */}
            {isHover && cursorState === 'hover' && (
              <div
                className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-medium uppercase tracking-[0.12em] whitespace-nowrap opacity-80"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                VIEW
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width:  isPlanet ? 4 : isHover ? 3 : 4,
            height: isPlanet ? 4 : isHover ? 3 : 4,
            background: isPlanet ? '#22d3ee' : '#ffffff',
            boxShadow: isPlanet ? '0 0 8px #22d3ee' : '0 0 4px rgba(255,255,255,0.8)',
          }}
        />
      </div>

      {/* Magnetic hover ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width:  isHover ? 64 : 0,
            height: isHover ? 64 : 0,
            border: isHover ? '1px solid rgba(139,92,246,0.15)' : 'none',
            opacity: isHover ? 1 : 0,
          }}
        />
      </div>
    </>
  )
}
