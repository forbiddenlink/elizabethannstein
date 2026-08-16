import { describe, it, expect } from 'vitest'
import { demoCity } from '@/lib/city/demoCity'
import { seedFromId, structureHeight, glowIntensity, layoutPositions } from '@/lib/city/layout'

describe('city layout', () => {
  it('seedFromId is stable and non-negative', () => {
    expect(seedFromId('n1')).toBe(seedFromId('n1'))
    expect(seedFromId('n1')).toBeGreaterThanOrEqual(0)
    expect(seedFromId('n1')).not.toBe(seedFromId('n2'))
  })
  it('structureHeight is monotonic in sizeScore', () => {
    expect(structureHeight(0.2)).toBeLessThan(structureHeight(0.8))
  })
  it('glowIntensity is monotonic in activityScore', () => {
    expect(glowIntensity(0.1)).toBeLessThan(glowIntensity(0.9))
  })
  it('layoutPositions is deterministic across calls', () => {
    const a = layoutPositions(demoCity)
    const b = layoutPositions(demoCity)
    expect([...a.entries()]).toEqual([...b.entries()])
  })
  it('produces a position for every node, all on the ground plane', () => {
    const pos = layoutPositions(demoCity)
    for (const n of demoCity.nodes) {
      expect(pos.has(n.id)).toBe(true)
      expect(pos.get(n.id)![1]).toBe(0)
    }
  })
})
