import type { CityModel } from './types'

// Raw GitHub repo shape (bronze) — subset of `gh repo list --json` fields.
export type RepoRaw = {
  name: string
  pushedAt: string | null
  diskUsage?: number | null
  stargazerCount?: number | null
  isArchived?: boolean
  primaryLanguage?: { name: string } | null
}

type BiomeDef = {
  key: string
  label: string
  match: string[]
  palette: { base: string; glow: string }
}

// Biomes for a personal-only reef — grouped by primary language so a single-owner
// fleet still reads as distinct districts. Public labels; no client identity.
const BIOME_DEFS: BiomeDef[] = [
  {
    key: 'web',
    label: 'Web',
    match: ['TypeScript', 'JavaScript'],
    palette: { base: '#0a2a4f', glow: '#39ffd0' },
  },
  {
    key: 'data',
    label: 'Data',
    match: ['Python', 'Jupyter Notebook'],
    palette: { base: '#3a2408', glow: '#ffb347' },
  },
  {
    key: 'systems',
    label: 'Systems',
    match: ['Rust', 'Go', 'C', 'C++', 'C#'],
    palette: { base: '#241047', glow: '#b74bff' },
  },
  { key: 'other', label: 'Other', match: [], palette: { base: '#04263a', glow: '#4bb7ff' } },
]

const DAY_MS = 86_400_000

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function biomeFor(lang: string): BiomeDef {
  return BIOME_DEFS.find((b) => b.match.includes(lang)) ?? BIOME_DEFS[BIOME_DEFS.length - 1]
}

// Silver: normalize bronze repos into a CityModel. Pure + deterministic given nowMs
// (no wall-clock read inside, so it is unit-testable). Cleansing only — no sanitizing
// here; the confidentiality gate (sanitizeCity/assertClean) runs after this.
export function reposToCityModel(repos: RepoRaw[], nowMs: number): CityModel {
  const used = new Map<string, BiomeDef>()
  const nodes = repos.map((r) => {
    const biome = biomeFor(r.primaryLanguage?.name ?? '')
    used.set(biome.key, biome)
    const pushed = r.pushedAt ? Date.parse(r.pushedAt) : nowMs - 400 * DAY_MS
    const ageDays = Math.max(0, (nowMs - pushed) / DAY_MS)
    return {
      id: r.name,
      districtId: biome.key,
      metrics: {
        ageDays: Math.round(ageDays),
        activityScore: round2(clamp(1 - ageDays / 365, 0.03, 1)),
        sizeScore: round2(clamp(Math.log10((r.diskUsage ?? 0) + 1) / 5, 0.12, 1)),
      },
    }
  })
  const districts = [...used.values()].map((b) => ({
    id: b.key,
    label: b.label,
    palette: b.palette,
  }))
  return { generatedAt: new Date(nowMs).toISOString(), districts, nodes, edges: [] }
}
