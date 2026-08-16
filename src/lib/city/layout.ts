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
