import { describe, it, expect } from 'vitest'
import {
  galaxies,
  allProjects,
  featuredProjects,
  getProjectById,
  getGalaxyById,
  narrativeTours,
  getNarrativeTourById,
} from '@/lib/galaxyData'

describe('galaxyData', () => {
  describe('galaxies', () => {
    it('has 6 galaxies', () => {
      expect(galaxies).toHaveLength(6)
    })

    it('each galaxy has a unique id', () => {
      const ids = galaxies.map((g) => g.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('each galaxy has required fields', () => {
      for (const galaxy of galaxies) {
        expect(galaxy.id).toBeTruthy()
        expect(galaxy.name).toBeTruthy()
        expect(galaxy.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
        expect(galaxy.projects.length).toBeGreaterThan(0)
      }
    })
  })

  describe('allProjects', () => {
    it('flattens all galaxy projects', () => {
      const totalFromGalaxies = galaxies.reduce((sum, g) => sum + g.projects.length, 0)
      expect(allProjects).toHaveLength(totalFromGalaxies)
    })

    it('every project has a unique id', () => {
      const ids = allProjects.map((p) => p.id)
      const uniqueIds = new Set(ids)
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
      expect(duplicates).toEqual([])
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('every project references a valid galaxy', () => {
      const galaxyIds = new Set(galaxies.map((g) => g.id))
      for (const project of allProjects) {
        expect(galaxyIds.has(project.galaxy)).toBe(true)
      }
    })

    it('every project has required fields', () => {
      for (const project of allProjects) {
        expect(project.id).toBeTruthy()
        expect(project.title).toBeTruthy()
        expect(project.description).toBeTruthy()
        expect(project.role).toBeTruthy()
        expect(project.tags.length).toBeGreaterThan(0)
        expect(project.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
        expect(['small', 'medium', 'large', 'supermassive']).toContain(project.size)
      }
    })
  })

  describe('featuredProjects', () => {
    it('only contains projects with featured=true', () => {
      for (const project of featuredProjects) {
        expect(project.featured).toBe(true)
      }
    })

    it('has at least some featured projects', () => {
      expect(featuredProjects.length).toBeGreaterThan(0)
    })
  })

  describe('getProjectById', () => {
    it('returns a project for a valid id', () => {
      const first = allProjects[0]
      const found = getProjectById(first.id)
      expect(found).toBeDefined()
      expect(found?.title).toBe(first.title)
    })

    it('returns undefined for an invalid id', () => {
      expect(getProjectById('nonexistent-project-xyz')).toBeUndefined()
    })
  })

  describe('getGalaxyById', () => {
    it('returns a galaxy for a valid id', () => {
      const first = galaxies[0]
      const found = getGalaxyById(first.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe(first.name)
    })

    it('returns undefined for an invalid id', () => {
      expect(getGalaxyById('nonexistent-galaxy-xyz')).toBeUndefined()
    })
  })

  describe('narrativeTours', () => {
    it('each tour references valid project ids', () => {
      const projectIds = new Set(allProjects.map((p) => p.id))
      for (const tour of narrativeTours) {
        for (const id of tour.projectIds) {
          expect(projectIds.has(id), `Tour "${tour.name}" references missing project "${id}"`).toBe(true)
        }
      }
    })

    it('each tour has narrative intros for all its projects', () => {
      for (const tour of narrativeTours) {
        for (const id of tour.projectIds) {
          expect(
            tour.narrativeIntros[id],
            `Tour "${tour.name}" missing narrative intro for "${id}"`,
          ).toBeTruthy()
        }
      }
    })

    it('getNarrativeTourById returns correct tour', () => {
      const tour = getNarrativeTourById('ai-journey')
      expect(tour).toBeDefined()
      expect(tour?.name).toBe('My AI Journey')
    })
  })
})
