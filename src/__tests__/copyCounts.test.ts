import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { STATS } from '@/lib/constants'
import { FLAGSHIPS } from '@/lib/flagships'
import { allProjects, galaxies } from '@/lib/galaxyData'

/**
 * The home page states the project count in prose. `moreCount` is derived, but the
 * spelled-out total cannot be without a number-to-words helper, so it is pinned here.
 * When the catalogue grows, this fails and names the copy that needs editing.
 */
const SPELLED_TOTAL: Record<string, string> = {
  '88': 'Eighty-eight',
}

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

describe('home copy counts', () => {
  const expectedWord = SPELLED_TOTAL[STATS.projectCount]

  it('has a spelled-out form for the current project count', () => {
    expect(
      expectedWord,
      `No spelled-out form for ${STATS.projectCount} projects. Add it to SPELLED_TOTAL, then update the prose in src/app/page.tsx and src/components/home/LiveSystemsIndex.tsx.`
    ).toBeDefined()
  })

  it.each([['src/app/page.tsx'], ['src/components/home/LiveSystemsIndex.tsx']])(
    '%s states the current project total',
    (file) => {
      expect(read(file)).toContain(`${expectedWord} things shipped`)
    }
  )

  /**
   * `public/llms.txt` is the AI-readable profile that the "Ask AI about me"
   * deep links point every model at, so a stale number there is repeated back
   * to anyone vetting Liz through an assistant. It said 86 while the catalogue
   * held 88; nothing caught it because only the two home-page files were
   * guarded.
   */
  it('public/llms.txt states the current project total', () => {
    expect(read('public/llms.txt')).toContain(`${STATS.projectCount} shipped projects`)
  })

  /**
   * `constants.ts` pins these instead of importing `galaxyData`, so that the
   * 124 KB catalogue stays out of every page's client bundle. This is the guard
   * that keeps the pinned numbers honest.
   */
  it('the pinned counts match the real catalogue', () => {
    expect(
      Number(STATS.projectCount),
      'STATS.projectCount in src/lib/constants.ts no longer matches galaxyData. Update `totalProjects` there.'
    ).toBe(allProjects.length)
    expect(
      Number(STATS.galaxyCount),
      'STATS.galaxyCount in src/lib/constants.ts no longer matches galaxyData. Update `totalGalaxies` there.'
    ).toBe(galaxies.length)
  })

  it('derives the non-flagship remainder', () => {
    expect(Number(STATS.moreCount)).toBe(Number(STATS.projectCount) - FLAGSHIPS.length)
    expect(Number(STATS.moreCount)).toBeGreaterThan(0)
  })
})
