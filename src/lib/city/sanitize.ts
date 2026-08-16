import { seedFromId } from './layout'
import type { CityModel } from './types'

// Opaque, deterministic token — hides the source id (repo/client name) while
// staying stable for layout seeding. Not cryptographic; enough to strip identity.
export function hashId(id: string): string {
  return `x${seedFromId(id).toString(36)}`
}

// Secret / PII shapes that must never reach the committed public snapshot.
const SECRET_PATTERNS: RegExp[] = [
  /sk_[a-z0-9]/i,
  /gh[posru]_/i,
  /github_pat_/i,
  /npm_/i,
  /xox[baprs]-/i,
  /napi_/i,
  /[pr]k_live/i,
  /AKIA[0-9A-Z]{16}/,
  /https?:\/\//i,
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
]

// Client / CRC identifiers that must never leak. Liz owns this list (sign-off).
// Word-boundary matched so short tokens (e.g. "crc") don't false-positive inside hashes.
export const DEFAULT_FORBIDDEN_NAMES: string[] = [
  'cyberready',
  'cyberreadyclinic',
  'crc',
  'rocketpark',
  'bandlsound',
  'jensenhughes',
  'victory-church',
  'daily-apologist',
  'experience-real-estate',
  'hrs-build',
  'levelup',
  'scriptmore',
  'seanmcdowell',
  'texasphoto',
  'c2-art-advisors',
]

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Returns a list of every forbidden pattern/name found in the serialized model.
// Empty = clean.
export function findLeaks(model: CityModel, forbiddenNames = DEFAULT_FORBIDDEN_NAMES): string[] {
  const json = JSON.stringify(model)
  const hits: string[] = []
  for (const re of SECRET_PATTERNS) {
    if (re.test(json)) hits.push(`pattern:${re.source}`)
  }
  for (const name of forbiddenNames) {
    if (new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i').test(json)) hits.push(`name:${name}`)
  }
  return hits
}

// Fail-closed gate: throws if the model contains anything forbidden.
export function assertClean(model: CityModel, forbiddenNames?: string[]): void {
  const leaks = findLeaks(model, forbiddenNames)
  if (leaks.length > 0) {
    throw new Error(`City snapshot failed the confidentiality gate: ${leaks.join(', ')}`)
  }
}

const GENERIC_LABELS = ['Biome A', 'Biome B', 'Biome C', 'Biome D', 'Biome E', 'Biome F']

// Allowlist transform → public-safe CityModel. ONLY explicitly-safe fields survive:
// ids hashed, district labels genericized, palette + normalized metrics kept.
// Everything else is dropped by construction (allowlist, not denylist).
export function sanitizeCity(raw: CityModel): CityModel {
  const districts = raw.districts.map((d, i) => ({
    id: hashId(d.id),
    label: GENERIC_LABELS[i] ?? `Biome ${i + 1}`,
    palette: { base: d.palette.base, glow: d.palette.glow },
  }))
  const keptNodeIds = new Set(raw.nodes.map((n) => n.id))
  const nodes = raw.nodes.map((n) => ({
    id: hashId(n.id),
    districtId: hashId(n.districtId),
    metrics: {
      ageDays: n.metrics.ageDays,
      activityScore: n.metrics.activityScore,
      sizeScore: n.metrics.sizeScore,
    },
  }))
  const edges = raw.edges
    .filter((e) => keptNodeIds.has(e.from) && keptNodeIds.has(e.to))
    .map((e) => ({ from: hashId(e.from), to: hashId(e.to) }))
  return { generatedAt: raw.generatedAt, districts, nodes, edges }
}
