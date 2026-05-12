import { getProjectById } from '@/lib/galaxyData'

/** Curated for recruiters: paid production work + recognized win */
export const HIGHLIGHT_REEL_IDS = ['crc-ready5-assessment', 'timeslip-search', 'specter'] as const

export type HighlightReelItem = {
  id: string
  title: string
  hook: string
}

const HOOKS: Record<(typeof HIGHLIGHT_REEL_IDS)[number], string> = {
  'crc-ready5-assessment': 'Dynamics 365 · v1.1.0.18 PROD',
  'timeslip-search': 'Algolia $750 win · 420k records',
  specter: 'npm · 65 CLI cmds · 14 MCP tools',
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
