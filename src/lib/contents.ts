import { isProofCatalogProject } from '@/lib/proofLayer'
import type { Project } from '@/lib/types'

export interface ContentsRow {
  /** 1-based position in the list. */
  number: number
  id: string
  title: string
  /** Copied from `links.live` in the project data, never composed. */
  url: string
  /** `url` without protocol and `www.`, for display. */
  host: string
}

function displayHost(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

function isWebUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * The homepage contents list: shipped (proof-tier, non-archived) projects that already carry
 * a live URL in galaxyData. Order follows the data, so the list cannot drift from /work.
 */
export function buildContents(projects: readonly Project[]): ContentsRow[] {
  return projects
    .filter(
      (p) =>
        p.status !== 'archived' &&
        isProofCatalogProject(p) &&
        p.links?.live &&
        isWebUrl(p.links.live)
    )
    .map((p, i) => ({
      number: i + 1,
      id: p.id,
      title: p.title,
      url: p.links?.live ?? '',
      host: displayHost(p.links?.live ?? ''),
    }))
}
