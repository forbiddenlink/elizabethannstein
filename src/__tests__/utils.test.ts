import {
  cn,
  formatDateRange,
  generateProjectPosition,
  getGalaxyCenterPosition,
  getSizeMultiplier,
  hashCode,
  lerp,
  seededRandom,
} from '@/lib/utils'
import { describe, expect, it } from 'vitest'

describe('cn (class merge)', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('bg-red-500', false && 'hidden')).toBe('bg-red-500')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})

describe('hashCode', () => {
  it('produces consistent results', () => {
    expect(hashCode('test')).toBe(hashCode('test'))
  })

  it('produces different hashes for different strings', () => {
    expect(hashCode('abc')).not.toBe(hashCode('xyz'))
  })

  it('returns unsigned 32-bit integers', () => {
    const result = hashCode('anything')
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(0xffffffff)
  })
})

describe('seededRandom', () => {
  it('produces deterministic sequences', () => {
    const rng1 = seededRandom(42)
    const rng2 = seededRandom(42)
    expect(rng1()).toBe(rng2())
    expect(rng1()).toBe(rng2())
  })

  it('produces values in [0, 1)', () => {
    const rng = seededRandom(123)
    for (let i = 0; i < 100; i++) {
      const val = rng()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  it('different seeds produce different sequences', () => {
    const rng1 = seededRandom(1)
    const rng2 = seededRandom(2)
    expect(rng1()).not.toBe(rng2())
  })
})

describe('generateProjectPosition', () => {
  it('returns a 3-tuple', () => {
    const pos = generateProjectPosition('test-project', 'ai', 0, 0, 10)
    expect(pos).toHaveLength(3)
  })

  it('is deterministic for same inputs', () => {
    const pos1 = generateProjectPosition('my-project', 'fullstack', 2, 5, 12)
    const pos2 = generateProjectPosition('my-project', 'fullstack', 2, 5, 12)
    expect(pos1).toEqual(pos2)
  })

  it('different projects get different positions', () => {
    const pos1 = generateProjectPosition('project-a', 'ai', 0, 0, 10)
    const pos2 = generateProjectPosition('project-b', 'ai', 0, 1, 10)
    expect(pos1).not.toEqual(pos2)
  })
})

describe('formatDateRange', () => {
  it('formats a range with en-dash', () => {
    expect(formatDateRange('2023-2024')).toBe('2023–2024')
  })

  it('returns single year as-is', () => {
    expect(formatDateRange('2024')).toBe('2024')
  })
})

describe('getSizeMultiplier', () => {
  it('returns correct multiplier for each size', () => {
    expect(getSizeMultiplier('supermassive')).toBe(3.0)
    expect(getSizeMultiplier('large')).toBe(2.0)
    expect(getSizeMultiplier('medium')).toBe(1.2)
    expect(getSizeMultiplier('small')).toBe(0.8)
  })

  it('defaults to small for unknown sizes', () => {
    expect(getSizeMultiplier('unknown')).toBe(0.8)
  })
})

describe('getGalaxyCenterPosition', () => {
  it('returns 3-tuple at y=0', () => {
    const pos = getGalaxyCenterPosition(0)
    expect(pos).toHaveLength(3)
    expect(pos[1]).toBe(0)
  })

  it('places galaxy 0 at positive x', () => {
    const [x, , z] = getGalaxyCenterPosition(0)
    expect(x).toBe(25) // cos(0) * 25
    expect(z).toBeCloseTo(0) // sin(0) * 25
  })

  it('distributes galaxies in a circle', () => {
    const positions = Array.from({ length: 6 }, (_, i) => getGalaxyCenterPosition(i))
    // Each should be at radius 25 from origin
    for (const [x, , z] of positions) {
      const radius = Math.sqrt(x * x + z * z)
      expect(radius).toBeCloseTo(25)
    }
  })
})

describe('lerp', () => {
  it('returns start when t=0', () => {
    expect(lerp(10, 20, 0)).toBe(10)
  })

  it('returns end when t=1', () => {
    expect(lerp(10, 20, 1)).toBe(20)
  })

  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })

  it('extrapolates beyond [0,1]', () => {
    expect(lerp(0, 10, 2)).toBe(20)
  })
})
