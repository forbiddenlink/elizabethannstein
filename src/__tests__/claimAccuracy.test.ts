import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildContents } from '@/lib/contents'
import { staticStatus } from '@/lib/flagshipDisplay'
import { FLAGSHIPS } from '@/lib/flagships'
import { allProjects } from '@/lib/galaxyData'

const TRACE_WINNERS =
  'https://dev.to/devteam/congrats-to-the-github-finish-up-a-thon-challenge-winners-1k0h'

describe('public claims match what is verifiably true', () => {
  it('shows Craft CMS client sites as past work, not in production', () => {
    const craft = FLAGSHIPS.find((f) => f.id === 'rocketpark-craft-ecosystem')
    expect(craft).toBeDefined()
    if (!craft) return
    expect(staticStatus(craft).label).toBe('Worked on')
    expect(staticStatus(craft).detail).toBe('2025-26')
  })

  it('does not say the security platform has a single developer for the whole build', () => {
    const crc = FLAGSHIPS.find((f) => f.id === 'security-readiness-platform')
    expect(crc?.summary).not.toMatch(/only developer/i)
    const built = crc?.cases.find((c) => c.heading === 'What I built')?.body ?? ''
    expect(built).toMatch(/second developer/i)
    expect(built).toMatch(/June 2026/)
  })

  it('links the DEV winners post for the Trace win', () => {
    const trace = FLAGSHIPS.find((f) => f.id === 'trace')
    expect(trace?.links.map((l) => l.href)).toContain(TRACE_WINNERS)
    expect(allProjects.find((p) => p.id === 'trace')?.links?.contestWin).toBe(TRACE_WINNERS)
  })

  it('labels Rocket Vitals as a Rocket Park product in the contents list', () => {
    const rows = buildContents(allProjects)
    expect(rows.find((r) => r.id === 'rocket-vitals')?.company).toBe('Rocket Park')
  })

  it('never says she leads Rocket Vitals', () => {
    const llms = readFileSync(join(process.cwd(), 'public/llms.txt'), 'utf8')
    for (const line of llms.split('\n').filter((l) => /rocket vitals/i.test(l))) {
      expect(line).not.toMatch(/\blead(s|ing)?\b|\bled\b/i)
    }
  })
})
