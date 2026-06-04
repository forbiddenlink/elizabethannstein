import { describe, expect, it } from 'vitest'
import { allProjects } from '@/lib/galaxyData'
import {
  ARCHIVE_PROJECT_IDS,
  FAST_TRACK_IDS,
  getFastTrackProjects,
  getHighlightReel,
  getProjectTier,
  isProofCatalogProject,
  isSceneProject,
  PRIMARY_PROOF_IDS,
  SCENE_PROJECT_IDS,
} from '@/lib/proofLayer'

describe('proofLayer', () => {
  it('defines non-empty proof sets', () => {
    expect(PRIMARY_PROOF_IDS.length).toBe(3)
    expect(FAST_TRACK_IDS.length).toBe(6)
    expect(SCENE_PROJECT_IDS.length).toBe(15)
  })

  it('primary proof ids are subset of fast track and scene', () => {
    for (const id of PRIMARY_PROOF_IDS) {
      expect(FAST_TRACK_IDS).toContain(id)
      expect(SCENE_PROJECT_IDS).toContain(id)
    }
  })

  it('getHighlightReel returns three items with hooks', () => {
    const reel = getHighlightReel()
    expect(reel).toHaveLength(3)
    for (const item of reel) {
      expect(item.title.length).toBeGreaterThan(0)
      expect(item.hook.length).toBeGreaterThan(0)
    }
  })

  it('getFastTrackProjects resolves all ids', () => {
    const projects = getFastTrackProjects()
    expect(projects).toHaveLength(FAST_TRACK_IDS.length)
    expect(new Set(projects.map((p) => p.id)).size).toBe(FAST_TRACK_IDS.length)
  })

  it('scene projects are a strict subset of all projects', () => {
    const allIds = new Set(allProjects.map((p) => p.id))
    for (const id of SCENE_PROJECT_IDS) {
      expect(allIds.has(id)).toBe(true)
      expect(isSceneProject(id)).toBe(true)
    }
  })

  it('archive tier excludes proof catalog', () => {
    for (const id of ARCHIVE_PROJECT_IDS) {
      const project = allProjects.find((p) => p.id === id)
      if (!project) continue
      expect(getProjectTier(project)).toBe('archive')
      expect(isProofCatalogProject(project)).toBe(false)
    }
  })

  it('flagship scene projects are proof catalog', () => {
    for (const id of SCENE_PROJECT_IDS) {
      const project = allProjects.find((p) => p.id === id)
      expect(project).toBeDefined()
      expect(getProjectTier(project!)).toBe('flagship')
      expect(isProofCatalogProject(project!)).toBe(true)
    }
  })
})
