/**
 * Single source of truth for hiring proof, 3D scene curation, and catalog tiers.
 * Import from here — not duplicate ID lists in Entrance, highlight reel, or fast track.
 */

import { galaxies, getProjectById } from '@/lib/galaxyData'
import type { Galaxy, Project, ProjectTier } from '@/lib/types'

export type { ProjectTier }

/** Top of funnel: three receipts recruiters should click first */
export const PRIMARY_PROOF_IDS = ['crc-ready5-assessment', 'timeslip-search', 'specter'] as const

/** Entrance pills + hiring fast track (same order, same story) */
export const FAST_TRACK_IDS = [
  'crc-ready5-assessment',
  'timeslip-search',
  'specter',
  'chronicle',
  'autodocs-ai',
  'coulson-one',
] as const

/** Planets rendered in the WebGL scene (~15 max for performance + clarity) */
export const SCENE_PROJECT_IDS = [
  'crc-ready5-assessment',
  'crc-leadgen',
  'coulson-one',
  'flo-labs',
  'timeslip-search',
  'specter',
  'chronicle',
  'autodocs-ai',
  'hire-ready',
  'finance-quest',
  'stancestream',
  'mcp-server-studio',
  'site-sheriff',
  'ucp-guard',
  'portfolio-pro',
] as const

/** Lab / joke / low-signal — hidden from default catalog */
export const ARCHIVE_PROJECT_IDS = [
  'cereal-tasting',
  'zoom-grid-mayhem',
  'plant-therapy',
  'ocean-simulator',
  'competitor-stalker',
  'app-idea-miner',
  'guts-and-glory',
] as const

export type PrimaryProofId = (typeof PRIMARY_PROOF_IDS)[number]
export type FastTrackId = (typeof FAST_TRACK_IDS)[number]
export type SceneProjectId = (typeof SCENE_PROJECT_IDS)[number]

const FAST_TRACK_SET = new Set<string>(FAST_TRACK_IDS)
const SCENE_SET = new Set<string>(SCENE_PROJECT_IDS)
const ARCHIVE_SET = new Set<string>(ARCHIVE_PROJECT_IDS)

const PROOF_HOOKS: Record<PrimaryProofId, string> = {
  'crc-ready5-assessment': 'Dynamics 365 · in production',
  'timeslip-search': 'Algolia $750 win · 420k records',
  specter: 'npm · 65 CLI cmds · 14 MCP tools',
}

export type HighlightReelItem = {
  id: string
  title: string
  hook: string
}

export type CatalogView = 'proof' | 'all'

export function getHighlightReel(): HighlightReelItem[] {
  return PRIMARY_PROOF_IDS.map((id) => {
    const project = getProjectById(id)
    if (!project) {
      throw new Error(`Highlight reel project missing: ${id}`)
    }
    return {
      id,
      title: project.title,
      hook: PROOF_HOOKS[id],
    }
  })
}

export function getFastTrackProjects(): Project[] {
  return FAST_TRACK_IDS.map((id) => {
    const project = getProjectById(id)
    if (!project) {
      throw new Error(`Fast track project missing: ${id}`)
    }
    return project
  })
}

export function isSceneProject(projectId: string): boolean {
  return SCENE_SET.has(projectId)
}

export function getSceneProjectIds(): ReadonlySet<string> {
  return SCENE_SET
}

/** Galaxies with only scene-visible planets. */
export function getSceneGalaxies(): Galaxy[] {
  return galaxies
    .map((galaxy) => ({
      ...galaxy,
      projects: galaxy.projects.filter((p) => SCENE_SET.has(p.id)),
    }))
    .filter((g) => g.projects.length > 0)
}

export function getProjectTier(project: Project): ProjectTier {
  if (project.tier) return project.tier
  if (SCENE_SET.has(project.id)) return 'flagship'
  if (ARCHIVE_SET.has(project.id)) return 'archive'
  if (project.featured) return 'production'
  if (project.galaxy === 'experimental') return 'experiment'
  if (project.status === 'in-progress') return 'experiment'
  return 'production'
}

export function isProofCatalogProject(project: Project): boolean {
  const tier = getProjectTier(project)
  return tier === 'flagship' || tier === 'production'
}

export function filterGalaxiesByCatalog(galaxiesInput: Galaxy[], view: CatalogView): Galaxy[] {
  if (view === 'all') return galaxiesInput

  return galaxiesInput
    .map((galaxy) => ({
      ...galaxy,
      projects: galaxy.projects.filter(isProofCatalogProject),
    }))
    .filter((g) => g.projects.length > 0)
}

export function countProofCatalogProjects(projects: Project[]): number {
  return projects.filter(isProofCatalogProject).length
}

/** Validate config at module load in dev */
function assertProofConfig() {
  const allIds = [...PRIMARY_PROOF_IDS, ...FAST_TRACK_IDS, ...SCENE_PROJECT_IDS]
  const missing = allIds.filter((id) => !getProjectById(id))
  if (missing.length > 0) {
    throw new Error(`proofLayer: unknown project ids: ${missing.join(', ')}`)
  }
  for (const id of PRIMARY_PROOF_IDS) {
    if (!FAST_TRACK_SET.has(id)) {
      throw new Error(`proofLayer: primary proof ${id} must be in FAST_TRACK_IDS`)
    }
  }
}

assertProofConfig()

export const PROOF_STATS = {
  sceneCount: SCENE_PROJECT_IDS.length,
  primaryCount: PRIMARY_PROOF_IDS.length,
  fastTrackCount: FAST_TRACK_IDS.length,
} as const
