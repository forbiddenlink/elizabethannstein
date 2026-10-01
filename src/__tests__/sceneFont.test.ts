import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SCENE_FONT, toSceneText } from '@/components/3d/sceneFont'
import { galaxies } from '@/lib/galaxyData'

describe('3D scene font', () => {
  it('points at a font file that ships in /public', () => {
    // A 404 here sends troika to its CDN fallback, which the CSP blocks, and the whole scene hangs.
    expect(existsSync(join(process.cwd(), 'public', SCENE_FONT))).toBe(true)
  })

  it('reduces text to printable ASCII', () => {
    expect(toSceneText('Café · “quoted” – done…')).toBe('Cafe - "quoted" - done...')
    expect(toSceneText('plain text 123')).toBe('plain text 123')
  })

  it('leaves every galaxy name and project title renderable from the ASCII subset', () => {
    for (const galaxy of galaxies) {
      expect(toSceneText(galaxy.name)).toMatch(/^[\x20-\x7E]+$/)
      for (const project of galaxy.projects) {
        expect(toSceneText(project.title)).toMatch(/^[\x20-\x7E]+$/)
      }
    }
  })
})
