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

export function ProjectPlaceholder({ title, className = '' }: Readonly<ProjectPlaceholderProps>) {
  const seed = hashString(title)
  const initial = title.trim().charAt(0).toUpperCase()
  const hexHash = `0x${(seed % 0xffffff).toString(16).padStart(6, '0').toUpperCase()}`
  const modCode = `SYS.SPEC-${(seed % 99).toString().padStart(2, '0')}`

  const dots = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        x: r4(seededRandom(seed + i) * 100),
        y: r4(seededRandom(seed + i * 2) * 100),
        size: r4(seededRandom(seed + i * 3) * 3.5 + 1.2),
        opacity: r4(seededRandom(seed + i * 4) * 0.22 + 0.08),
      })),
    [seed]
  )

  const lines = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        offset: r4(seededRandom(seed + i * 10) * 100),
        isHorizontal: seededRandom(seed + i * 11) > 0.5,
      })),
    [seed]
  )

  // Architectural schematic nodes
  const nodes = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        cx: r4(15 + seededRandom(seed + i * 14) * 70),
        cy: r4(20 + seededRandom(seed + i * 16) * 60),
        r: r4(4 + seededRandom(seed + i * 18) * 6),
      })),
    [seed]
  )

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ background: 'var(--le-paper-2)' }}
    >
      {/* Blueprint grid / schematic lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.isHorizontal ? '0%' : `${line.offset}%`}
            y1={line.isHorizontal ? `${line.offset}%` : '0%'}
            x2={line.isHorizontal ? '100%' : `${line.offset}%`}
            y2={line.isHorizontal ? `${line.offset}%` : '100%'}
            stroke="var(--le-ink)"
            strokeWidth="0.75"
            strokeOpacity="0.12"
            strokeDasharray={line.id % 2 === 0 ? '4 4' : undefined}
          />
        ))}

        {/* Schematic circuit nodes */}
        {nodes.map((node, i) => (
          <g key={node.id}>
            <circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={node.r}
              fill="none"
              stroke="var(--le-accent-ink)"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={node.r * 0.4}
              fill="var(--le-accent-ink)"
              fillOpacity="0.25"
            />
            {i < nodes.length - 1 && (
              <line
                x1={`${node.cx}%`}
                y1={`${node.cy}%`}
                x2={`${nodes[i + 1].cx}%`}
                y2={`${nodes[i + 1].cy}%`}
                stroke="var(--le-accent-ink)"
                strokeWidth="0.5"
                strokeOpacity="0.25"
                strokeDasharray="2 3"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Scatter coordinate points */}
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

      {/* Engineering telemetry metadata stamps */}
      <div
        className="absolute top-4 left-5 font-mono text-[10px] uppercase tracking-widest text-[var(--le-muted)] opacity-60 flex flex-col gap-1 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-semibold text-[var(--le-accent-ink)]">{modCode}</span>
        <span>SIG: {hexHash}</span>
        <span>STATUS: ARCHIVAL SPEC</span>
      </div>

      <div
        className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-widest text-[var(--le-muted)] opacity-40 pointer-events-none"
        aria-hidden="true"
      >
        PROD REF &middot; 42&deg; 36&apos; N &middot; 71&deg; 05&apos; W
      </div>

      {/* Large serif initial watermark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '-10%',
          fontFamily: 'var(--le-display)',
          fontSize: 'clamp(9rem, 28vw, 22rem)',
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--le-accent-ink)',
          opacity: 0.08,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {initial}
      </span>
    </div>
  )
}
