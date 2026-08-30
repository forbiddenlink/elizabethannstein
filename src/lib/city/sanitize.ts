import { seedFromId } from './layout'
import type { CityModel } from './types'

// Opaque, deterministic token that replaces the source id in the emitted model.
// NOTE: this is display-opacity, NOT a cryptographic control — FNV is reversible by
// dictionary attack. The actual confidentiality boundary is (1) source-scoping to
// PERSONAL, PUBLIC repos (whose names are already public, so reversal reveals nothing
// private) and (2) the forbidden-name gate below. Do not rely on hashId to hide a
// secret or a private/client name; scope + gate must guarantee those never arrive.
export function hashId(id: string): string {
  return `x${seedFromId(id).toString(36)}`
}

// Secret / PII shapes that must never reach the committed public snapshot.
const SECRET_PATTERNS: RegExp[] = [
  /sk_[a-z0-9]/i,
  /gh[posru]_/i,
  /github_pat_/i,
  /glpat-/i,
  /npm_/i,
  /xox[baprs]-/i,
  /napi_/i,
  /[pr]k_live/i,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{10,}/, // Google API key
  /eyJ[a-zA-Z0-9_-]{10,}/, // JWT
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/, // PEM
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

// Recursively collect every string primitive in the model. Scanning actual field
// values (not JSON.stringify output) avoids serialization-escaping differentials —
// an escaped `http` or unicode homoglyph in the source string is tested as its
// real value here, not its escaped serialized form.
function collectStrings(v: unknown, out: string[]): void {
  if (typeof v === 'string') out.push(v)
  else if (Array.isArray(v)) for (const x of v) collectStrings(x, out)
  else if (v && typeof v === 'object') for (const x of Object.values(v)) collectStrings(x, out)
}

// Returns a list of every forbidden pattern/name found in the model's string values.
// Empty = clean.
export function findLeaks(model: CityModel, forbiddenNames = DEFAULT_FORBIDDEN_NAMES): string[] {
  const strings: string[] = []
  collectStrings(model, strings)
  const nameRes = forbiddenNames.map(
    (name) => [name, new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i')] as const
  )
  const hits = new Set<string>()
  for (const s of strings) {
    for (const re of SECRET_PATTERNS) {
      if (re.test(s)) hits.add(`pattern:${re.source}`)
    }
    for (const [name, re] of nameRes) {
      if (re.test(s)) hits.add(`name:${name}`)
    }
  }
  return [...hits]
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
