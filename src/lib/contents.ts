import { getGalaxyById } from '@/lib/galaxyData'
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
  /** `Project.galaxy`, the galaxy id. */
  galaxy: string
  /** Display name from the galaxy data (falls back to the id if the galaxy is unknown). */
  galaxyName: string
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
    .flatMap((p) => {
      const url = p.links?.live
      if (p.status === 'archived' || !isProofCatalogProject(p) || !url || !isWebUrl(url)) return []
      return [
        {
          id: p.id,
          title: p.title,
          url,
          host: displayHost(url),
          galaxy: p.galaxy,
          galaxyName: getGalaxyById(p.galaxy)?.name ?? p.galaxy,
        },
      ]
    })
    .map((row, i) => ({ ...row, number: i + 1 }))
}
