import { describe, expect, it } from 'vitest'
import { type RepoRaw, reposToCityModel } from '@/lib/city/adapter'

const NOW = Date.parse('2026-08-16T00:00:00.000Z')
const repos: RepoRaw[] = [
  {
    name: 'portfolio-pro',
    pushedAt: '2026-08-10T00:00:00.000Z',
    diskUsage: 50000,
    primaryLanguage: { name: 'TypeScript' },
  },
  {
    name: 'myaqualog',
    pushedAt: '2026-06-01T00:00:00.000Z',
    diskUsage: 8000,
    primaryLanguage: { name: 'Python' },
  },
  {
    name: 'old-thing',
    pushedAt: '2024-01-01T00:00:00.000Z',
    diskUsage: 100,
    isArchived: true,
    primaryLanguage: null,
  },
]

describe('repos → CityModel (silver)', () => {
  it('is deterministic for a fixed nowMs', () => {
    expect(reposToCityModel(repos, NOW)).toEqual(reposToCityModel(repos, NOW))
  })
  it('maps every repo to a node, preserving repo name as id (hashed later)', () => {
    const m = reposToCityModel(repos, NOW)
    expect(m.nodes).toHaveLength(3)
    expect(m.nodes[0].id).toBe('portfolio-pro')
  })
  it('buckets by language into biomes', () => {
    const m = reposToCityModel(repos, NOW)
    expect(m.nodes[0].districtId).toBe('web')
    expect(m.nodes[1].districtId).toBe('data')
    expect(m.nodes[2].districtId).toBe('other')
  })
  it('only emits districts that have nodes', () => {
    const m = reposToCityModel(repos, NOW)
    const ids = new Set(m.districts.map((d) => d.id))
    expect(ids).toEqual(new Set(['web', 'data', 'other']))
  })
  it('recent repos are more active than stale ones', () => {
    const m = reposToCityModel(repos, NOW)
    expect(m.nodes[0].metrics.activityScore).toBeGreaterThan(m.nodes[2].metrics.activityScore)
  })
  it('keeps all metrics in valid ranges', () => {
    const m = reposToCityModel(repos, NOW)
    for (const n of m.nodes) {
      expect(n.metrics.activityScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.activityScore).toBeLessThanOrEqual(1)
      expect(n.metrics.sizeScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.sizeScore).toBeLessThanOrEqual(1)
      expect(n.metrics.ageDays).toBeGreaterThanOrEqual(0)
    }
  })
})
