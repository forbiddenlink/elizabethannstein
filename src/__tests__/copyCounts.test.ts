import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { STATS } from '@/lib/constants'
import { FLAGSHIPS } from '@/lib/flagships'
import { allProjects, galaxies } from '@/lib/galaxyData'

/**
 * The home page metadata states the project count in prose. `moreCount` is derived, but the
 * spelled-out total cannot be without a number-to-words helper, so it is pinned here.
 * When the catalogue grows, this fails and names the copy that needs editing.
 */
const SPELLED_TOTAL: Record<string, string> = {
  '87': 'Eighty-seven',
}

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

describe('home copy counts', () => {
  const expectedWord = SPELLED_TOTAL[STATS.projectCount]

  it('has a spelled-out form for the current project count', () => {
    expect(
      expectedWord,
      `No spelled-out form for ${STATS.projectCount} projects. Add it to SPELLED_TOTAL, then update the prose in src/app/page.tsx.`
    ).toBeDefined()
  })

  it('src/app/page.tsx states the current project total', () => {
    expect(read('src/app/page.tsx')).toContain(`${expectedWord} projects`)
  })

  // Since the 2026-09-27 redesign the home page body renders counts from STATS and
  // FLAGSHIPS instead of prose, so it can only drift if someone types a literal back in.
  it('the home page body derives its counts instead of hard-coding them', () => {
    const source = read('src/components/home/LiveSystemsIndex.tsx')
    expect(source).toContain('STATS.projectCount')
    expect(source).toContain('STATS.moreCount')
    expect(source).not.toMatch(/\b(86|87|88|80) (more )?projects\b/)
  })

  /**
   * `public/llms.txt` is the AI-readable profile that the "Ask AI about me"
   * deep links point every model at, so a stale number there is repeated back
   * to anyone vetting Liz through an assistant. It said 86 while the catalogue
   * held 88; nothing caught it because only the two home-page files were
   * guarded.
   */
  it('public/llms.txt states the current project total', () => {
    expect(read('public/llms.txt')).toContain(`lists ${STATS.projectCount} projects`)
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
