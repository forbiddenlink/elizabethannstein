import type { Flagship } from './flagships'
import type { LiveResult } from './liveStatus'

/**
 * Presentation helpers for the flagship index. The data in `flagships.ts` carries the
 * earlier design's glyph grammar ("★ Algolia winner", "Personal · Creator"); these keep the
 * data untouched and render it in the sentence-case grammar DESIGN.md calls for.
 */

/** Strip a leading decorative glyph such as "★ " or "↗ ". */
export function plainLabel(text: string): string {
  return text.replace(/^[★↗▸·]\s*/u, '').trim()
}

/** "Personal, 2026" or "Cybersecurity nonprofit, sole developer, 2025-26". */
export function whoLine(flagship: Pick<Flagship, 'org' | 'years'>): string {
  const [who, role] = flagship.org.split(' · ')
  if (who === 'Personal' || !role) return `${who}, ${flagship.years}`
  return `${who}, ${role.toLowerCase()}, ${flagship.years}`
}

/** Host of a status URL, for mono display ("automadocs.com"). */
export function hostOf(url: string | undefined): string {
  if (!url) return ''
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

/** Static (non-pinged) status as word plus detail. Live systems are resolved by the probe. */
export function staticStatus(flagship: Flagship): { label: string; detail: string } {
  switch (flagship.status) {
    case 'npm':
      return { label: 'Published', detail: 'npm' }
    case 'cli':
      return { label: 'Daily use', detail: plainLabel(flagship.proof.split(' · ')[0] ?? '') }
    case 'sites':
      return { label: 'In production', detail: plainLabel(flagship.statusSub) }
    default:
      return { label: 'Live', detail: plainLabel(flagship.statusSub) }
  }
}

/** Drop emoji used as decoration in catalogue copy ("🏆 Winner of ..."). */
export function withoutEmoji(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}|\uFE0F/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Ledger row state. "unknown" means the status check itself failed, not the site. */
export type LedgerPhase = 'checking' | 'live' | 'private' | 'down' | 'unknown'

/**
 * Map one `/api/status` entry to a ledger state. A missing entry means the check did not run
 * (the status route failed, or the visitor is offline), which is different from a site that
 * was pinged and did not answer. Reporting both as "Not responding" told visitors four live
 * sites were down whenever the status route hiccuped.
 */
export function resolvePhase(result: LiveResult | undefined): LedgerPhase {
  if (!result) return 'unknown'
  if (result.private) return 'private'
  return result.up ? 'live' : 'down'
}

/** Footer line under the ledger, once every row has resolved. */
export function ledgerSummary(phases: readonly LedgerPhase[]): string {
  const total = phases.length
  const unknown = phases.filter((p) => p === 'unknown').length
  if (total > 0 && unknown === total) return 'The status check failed. Refresh to try again.'
  const live = phases.filter((p) => p === 'live').length
  const priv = phases.filter((p) => p === 'private').length
  const checked = total - unknown - priv
  const base =
    unknown > 0
      ? `${live} of ${checked} checked responding; ${unknown} not checked`
      : `${live} of ${checked} responding`
  return priv > 0 ? `${base}; ${priv} private demo` : base
}
