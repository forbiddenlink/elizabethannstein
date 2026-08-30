/**
 * Generate the committed public City snapshot.
 *
 *   pnpm city:snapshot   (or: npx tsx scripts/city-snapshot.mts)
 *
 * Pulls Liz's PERSONAL, PUBLIC, non-fork repos only (bronze), normalizes to a
 * CityModel (silver), runs the confidentiality sanitizer, and — only if the
 * fail-closed gate passes — writes src/lib/city/snapshot.json. If assertClean
 * throws, nothing is written. Runtime never calls the fleet; it loads this JSON.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { reposToCityModel } from '../src/lib/city/adapter'
import { assertClean, findLeaks, sanitizeCity } from '../src/lib/city/sanitize'

const OWNER = 'forbiddenlink'
const OUT = resolve('src/lib/city/snapshot.json')

const raw = execFileSync(
  'gh',
  [
    'repo',
    'list',
    OWNER,
    '--no-archived',
    '--source',
    '--visibility',
    'public',
    '--limit',
    '300',
    '--json',
    'name,pushedAt,diskUsage,stargazerCount,isArchived,primaryLanguage',
  ],
  { encoding: 'utf8' },
)

const repos = JSON.parse(raw)
const silver = reposToCityModel(repos, Date.now())
const clean = sanitizeCity(silver)

// Fail-closed: throws on any forbidden pattern/name → non-zero exit, no write.
assertClean(clean)
if (findLeaks(clean).length > 0) throw new Error('gate inconsistency')

writeFileSync(OUT, `${JSON.stringify(clean, null, 2)}\n`)
console.log(
  `OK — ${clean.nodes.length} nodes across ${clean.districts.length} biomes → ${OUT} (gate: clean)`,
)
