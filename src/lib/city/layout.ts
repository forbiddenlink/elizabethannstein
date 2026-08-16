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

// Mean activity across the fleet (0..1) — drives the reef's day-night ambient:
// a livelier fleet glows brighter. Commit rhythm, aggregated.
export function fleetActivity(model: CityModel): number {
  if (model.nodes.length === 0) return 0
  return model.nodes.reduce((sum, n) => sum + n.metrics.activityScore, 0) / model.nodes.length
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
  const baseR = 0.4 + rand() * 0.14
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

// Biome cluster centre for district `index` of `count`, placed on a ring so
// each district reads as its own region rather than one merged spiral.
export function districtCenter(index: number, count: number, spread = 12): [number, number] {
  if (count <= 1) return [0, 0]
  const angle = (index / count) * Math.PI * 2
  return [Math.cos(angle) * spread, Math.sin(angle) * spread]
}

// Cluster radius grows with node count so a biome's packing density stays roughly
// constant instead of overcrowding (a 30-repo biome must not stack into one blob).
export function districtRadius(nodeCount: number): number {
  return Math.min(6.5, Math.max(3, 1.24 * Math.sqrt(Math.max(1, nodeCount))))
}

export function layoutPositions(model: CityModel): Map<string, [number, number, number]> {
  const out = new Map<string, [number, number, number]>()
  const districtIndex = new Map(model.districts.map((d, i) => [d.id, i]))
  const counts = new Map<string, number>()
  for (const n of model.nodes) counts.set(n.districtId, (counts.get(n.districtId) ?? 0) + 1)
  const count = model.districts.length
  for (const node of model.nodes) {
    const di = districtIndex.get(node.districtId) ?? 0
    const [cx, cz] = districtCenter(di, count)
    const localRadius = districtRadius(counts.get(node.districtId) ?? 1)
    const s = seedFromId(node.id)
    // Deterministic golden-angle spiral packing within the district biome.
    const idx = s % 997
    const angle = idx * 2.399963 // golden angle (radians)
    const r = localRadius * Math.sqrt(((s >>> 5) % 100) / 100)
    out.set(node.id, [cx + Math.cos(angle) * r, 0, cz + Math.sin(angle) * r])
  }
  return out
}
