import type { CityModel } from './types'

export function seedFromId(id: string): number {
  // FNV-1a 32-bit, forced non-negative.
  let h = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function structureHeight(sizeScore: number): number {
  return 0.5 + sizeScore * 3
}

export function glowIntensity(activityScore: number): number {
  return 0.15 + activityScore * 1.85
}

export type CrystalShard = {
  offset: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
}

// Deterministic PRNG seeded from a node's stable seed.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A crystalline cluster: one tall main shard + 1-2 shorter secondary shards
// arranged deterministically around its base. Faceted-crystal form language.
export function crystalShards(seed: number, height: number): CrystalShard[] {
  const rand = mulberry32(seed)
  const baseR = 0.28 + rand() * 0.1
  const shards: CrystalShard[] = [
    { offset: [0, 0, 0], scale: [baseR, height, baseR], rotation: [0, rand() * Math.PI, 0] },
  ]
  const secondaryCount = 1 + (seed % 2) // 1 or 2
  for (let i = 0; i < secondaryCount; i++) {
    const angle = rand() * Math.PI * 2
    const dist = baseR * (1.1 + rand() * 0.6)
    const h = height * (0.35 + rand() * 0.25)
    const r = baseR * (0.5 + rand() * 0.3)
    shards.push({
      offset: [Math.cos(angle) * dist, (h - height) / 2, Math.sin(angle) * dist],
      scale: [r, h, r],
      rotation: [(rand() - 0.5) * 0.5, rand() * Math.PI, (rand() - 0.5) * 0.5],
    })
  }
  return shards
}

export function layoutPositions(model: CityModel): Map<string, [number, number, number]> {
  const out = new Map<string, [number, number, number]>()
  const radius = 8
  for (const node of model.nodes) {
    const s = seedFromId(node.id)
    // Deterministic golden-angle spiral packing on the ground plane.
    const idx = s % 997
    const angle = idx * 2.399963 // golden angle (radians)
    const r = radius * Math.sqrt(((s >>> 5) % 100) / 100)
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    out.set(node.id, [x, 0, z])
  }
  return out
}
