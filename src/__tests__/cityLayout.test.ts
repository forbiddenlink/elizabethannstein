import { describe, expect, it } from 'vitest'
import { demoCity } from '@/lib/city/demoCity'
import {
  crystalShards,
  districtCenter,
  fleetActivity,
  glowIntensity,
  layoutPositions,
  seedFromId,
  structureHeight,
} from '@/lib/city/layout'

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

describe('district biomes', () => {
  it('districtCenter collapses to origin for a single district', () => {
    expect(districtCenter(0, 1)).toEqual([0, 0])
  })
  it('districtCenter is deterministic and distinct per index', () => {
    expect(districtCenter(0, 3)).toEqual(districtCenter(0, 3))
    expect(districtCenter(0, 3)).not.toEqual(districtCenter(1, 3))
  })
  it('clusters every node within its district biome region', () => {
    const centers = new Map(
      demoCity.districts.map((d, i) => [d.id, districtCenter(i, demoCity.districts.length)])
    )
    const pos = layoutPositions(demoCity)
    for (const n of demoCity.nodes) {
      const [x, , z] = pos.get(n.id)!
      const [cx, cz] = centers.get(n.districtId)!
      const dist = Math.hypot(x - cx, z - cz)
      expect(dist).toBeLessThanOrEqual(4)
    }
  })
  it('demoCity has multiple biomes', () => {
    expect(demoCity.districts.length).toBeGreaterThanOrEqual(3)
  })
})

describe('fleet activity (day-night driver)', () => {
  it('is 0 for an empty fleet', () => {
    expect(fleetActivity({ generatedAt: '', districts: [], nodes: [], edges: [] })).toBe(0)
  })
  it('averages node activity into 0..1', () => {
    const a = fleetActivity(demoCity)
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThanOrEqual(1)
  })
  it('computes the mean', () => {
    const model = {
      generatedAt: '',
      districts: [{ id: 'x', label: 'X', palette: { base: '#000', glow: '#fff' } }],
      nodes: [
        { id: 'a', districtId: 'x', metrics: { ageDays: 1, activityScore: 0.2, sizeScore: 0.5 } },
        { id: 'b', districtId: 'x', metrics: { ageDays: 1, activityScore: 0.8, sizeScore: 0.5 } },
      ],
      edges: [],
    }
    expect(fleetActivity(model)).toBeCloseTo(0.5)
  })
})

describe('crystal shards', () => {
  it('is deterministic for a given seed', () => {
    expect(crystalShards(12345, 2.5)).toEqual(crystalShards(12345, 2.5))
  })
  it('returns a main shard plus 1-2 secondaries (2 or 3 total)', () => {
    for (const seed of [1, 2, 3, 4, 999]) {
      const shards = crystalShards(seed, 2)
      expect(shards.length).toBeGreaterThanOrEqual(2)
      expect(shards.length).toBeLessThanOrEqual(3)
    }
  })
  it('main shard is first, centered at origin, and tallest', () => {
    const shards = crystalShards(777, 3)
    const main = shards[0]
    expect(main.offset).toEqual([0, 0, 0])
    for (const s of shards.slice(1)) {
      expect(main.scale[1]).toBeGreaterThan(s.scale[1])
    }
  })
  it('varies across seeds', () => {
    expect(crystalShards(1, 2)).not.toEqual(crystalShards(2, 2))
  })
})
