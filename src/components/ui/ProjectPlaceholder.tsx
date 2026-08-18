'use client'

import { useMemo } from 'react'

interface ProjectPlaceholderProps {
  title: string
  /** Retained for API compatibility; the editorial placeholder uses paper tokens, not galaxy hues. */
  color?: string
  className?: string
}

// Seeded random for a stable, per-project pattern (no hydration mismatch).
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

const r4 = (n: number) => Math.round(n * 10000) / 10000

export function ProjectPlaceholder({ title, className = '' }: ProjectPlaceholderProps) {
  const seed = hashString(title)
  const initial = title.trim().charAt(0).toUpperCase()

  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: r4(seededRandom(seed + i) * 100),
        y: r4(seededRandom(seed + i * 2) * 100),
        size: r4(seededRandom(seed + i * 3) * 3 + 1),
        opacity: r4(seededRandom(seed + i * 4) * 0.18 + 0.06),
      })),
    [seed]
  )

  const lines = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        offset: r4(seededRandom(seed + i * 10) * 100),
        isHorizontal: seededRandom(seed + i * 11) > 0.5,
      })),
    [seed]
  )

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: 'var(--le-paper-2)' }}
    >
      {/* technical grid, hairline ink */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.isHorizontal ? '0%' : `${line.offset}%`}
            y1={line.isHorizontal ? `${line.offset}%` : '0%'}
            x2={line.isHorizontal ? '100%' : `${line.offset}%`}
            y2={line.isHorizontal ? `${line.offset}%` : '100%'}
            stroke="var(--le-ink)"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />
        ))}
      </svg>

      {/* scatter dots in ink */}
      <div className="absolute inset-0" aria-hidden="true">
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              backgroundColor: 'var(--le-ink)',
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>

      {/* large serif initial watermark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '-8%',
          fontFamily: 'var(--le-display)',
          fontSize: 'clamp(8rem, 26vw, 20rem)',
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--le-accent)',
          opacity: 0.1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
      >
        {initial}
      </span>
    </div>
  )
}
