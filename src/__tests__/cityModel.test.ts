import { describe, it, expect } from 'vitest'
import { demoCity } from '@/lib/city/demoCity'

describe('demoCity fixture', () => {
  it('has at least one district and several nodes', () => {
    expect(demoCity.districts.length).toBeGreaterThanOrEqual(1)
    expect(demoCity.nodes.length).toBeGreaterThanOrEqual(6)
  })
  it('has unique node ids', () => {
    const ids = demoCity.nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every node references an existing district', () => {
    const districtIds = new Set(demoCity.districts.map((d) => d.id))
    for (const n of demoCity.nodes) expect(districtIds.has(n.districtId)).toBe(true)
  })
  it('every edge references existing nodes', () => {
    const nodeIds = new Set(demoCity.nodes.map((n) => n.id))
    for (const e of demoCity.edges) {
      expect(nodeIds.has(e.from)).toBe(true)
      expect(nodeIds.has(e.to)).toBe(true)
    }
  })
  it('metrics are in valid ranges', () => {
    for (const n of demoCity.nodes) {
      expect(n.metrics.ageDays).toBeGreaterThanOrEqual(0)
      expect(n.metrics.activityScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.activityScore).toBeLessThanOrEqual(1)
      expect(n.metrics.sizeScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.sizeScore).toBeLessThanOrEqual(1)
    }
  })
})
