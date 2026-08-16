import { describe, expect, it } from 'vitest'
import { assertClean, findLeaks, hashId, sanitizeCity } from '@/lib/city/sanitize'
import type { CityModel } from '@/lib/city/types'

// Synthetic DIRTY model — planted client name, secret prefix, and a URL.
// No real fleet data. Proves the gate strips + the assert catches a leak.
const dirty: CityModel = {
  generatedAt: '2026-01-01T00:00:00.000Z',
  districts: [
    { id: 'cyberready', label: 'CyberReady Clinic', palette: { base: '#111', glow: '#222' } },
  ],
  nodes: [
    {
      id: 'crc-leadgen',
      districtId: 'cyberready',
      metrics: { ageDays: 10, activityScore: 0.5, sizeScore: 0.5 },
    },
    {
      id: 'token-sk_live_abc123-https://secret.example.com',
      districtId: 'cyberready',
      metrics: { ageDays: 1, activityScore: 1, sizeScore: 1 },
    },
  ],
  edges: [{ from: 'crc-leadgen', to: 'token-sk_live_abc123-https://secret.example.com' }],
}

describe('city sanitizer (confidentiality gate)', () => {
  it('the gate CATCHES leaks in a dirty raw model', () => {
    const leaks = findLeaks(dirty)
    expect(leaks.length).toBeGreaterThan(0)
  })
  it('assertClean THROWS on a dirty raw model', () => {
    expect(() => assertClean(dirty)).toThrow(/confidentiality/i)
  })
  it('sanitized output passes the gate', () => {
    expect(() => assertClean(sanitizeCity(dirty))).not.toThrow()
  })
  it('hashes ids so raw names never survive', () => {
    const clean = sanitizeCity(dirty)
    expect(clean.nodes[0].id).not.toBe('crc-leadgen')
    expect(clean.nodes[0].id).toBe(hashId('crc-leadgen'))
    expect(JSON.stringify(clean).toLowerCase()).not.toContain('cyberready')
    expect(JSON.stringify(clean)).not.toContain('sk_live')
  })
  it('genericizes district labels but keeps palettes', () => {
    const clean = sanitizeCity(dirty)
    expect(clean.districts[0].label).toBe('Biome A')
    expect(clean.districts[0].palette).toEqual({ base: '#111', glow: '#222' })
  })
  it('preserves normalized metrics', () => {
    const clean = sanitizeCity(dirty)
    expect(clean.nodes[0].metrics).toEqual({ ageDays: 10, activityScore: 0.5, sizeScore: 0.5 })
  })
  it('rehashes edges consistently with node ids', () => {
    const clean = sanitizeCity(dirty)
    expect(clean.edges).toHaveLength(1)
    expect(clean.edges[0].from).toBe(hashId('crc-leadgen'))
    expect(clean.nodes.some((n) => n.id === clean.edges[0].from)).toBe(true)
  })
  it('is deterministic', () => {
    expect(sanitizeCity(dirty)).toEqual(sanitizeCity(dirty))
  })
})
