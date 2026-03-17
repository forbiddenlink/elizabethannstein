'use client'

import { useMemo } from 'react'

interface ProjectPlaceholderProps {
  title: string
  color: string
  className?: string
}

// Generate a seeded random number for consistent patterns
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Hash a string to a number for seeding
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function ProjectPlaceholder({ title, color, className = '' }: ProjectPlaceholderProps) {
  const seed = hashString(title)

  // Generate consistent "noise" dots based on project title
  const dots = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: seededRandom(seed + i * 1) * 100,
      y: seededRandom(seed + i * 2) * 100,
      size: seededRandom(seed + i * 3) * 4 + 1,
      opacity: seededRandom(seed + i * 4) * 0.3 + 0.1,
    }))
  }, [seed])

  // Generate grid lines
  const lines = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      offset: seededRandom(seed + i * 10) * 100,
      isHorizontal: seededRandom(seed + i * 11) > 0.5,
    }))
  }, [seed])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${color}40 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${color}30 0%, transparent 50%),
                       linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,10,30,0.95) 100%)`
        }}
      />

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        {lines.map((line) => (
          line.isHorizontal ? (
            <line
              key={line.id}
              x1="0%"
              y1={`${line.offset}%`}
              x2="100%"
              y2={`${line.offset}%`}
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          ) : (
            <line
              key={line.id}
              x1={`${line.offset}%`}
              y1="0%"
              x2={`${line.offset}%`}
              y2="100%"
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          )
        ))}
      </svg>

      {/* Scatter dots */}
      <div className="absolute inset-0">
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              backgroundColor: color,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${color}20 0%, transparent 70%)`
        }}
      />
    </div>
  )
}
