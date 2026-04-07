import { getProjectById } from '@/lib/galaxyData'

/** Curated for recruiters: depth, recognition, and enterprise scale */
export const HIGHLIGHT_REEL_IDS = ['chronicle', 'timeslip-search', 'coulson-one'] as const

export type HighlightReelItem = {
  id: string
  title: string
  hook: string
}

const HOOKS: Record<(typeof HIGHLIGHT_REEL_IDS)[number], string> = {
  chronicle: 'Rust · AI observability',
  'timeslip-search': 'Algolia win · 420k+ records',
  'coulson-one': 'Enterprise · 64k+ files',
}

export function getHighlightReel(): HighlightReelItem[] {
  return HIGHLIGHT_REEL_IDS.map((id) => {
    const p = getProjectById(id)
    if (!p) {
      throw new Error(`Highlight reel project missing: ${id}`)
    }
    return { id, title: p.title, hook: HOOKS[id] }
  })
}
