import { describe, expect, it } from 'vitest'
import nowData from '@/data/now.json'
import { groupByMonth, type NowEntry, validateNowEntries } from '@/lib/nowFeed'

const entry = (over: Partial<NowEntry> = {}): NowEntry => ({
  repo: 'trace',
  title: 'add timeline export',
  type: 'feat',
  url: 'https://github.com/forbiddenlink/trace/pull/12',
  mergedAt: '2026-11-10',
  ...over,
})

describe('validateNowEntries', () => {
  it('accepts a pull request link in a forbiddenlink repo that matches the entry repo', () => {
    expect(validateNowEntries([entry()])).toEqual([])
  })

  it('rejects entries that do not link a real source', () => {
    const problems = validateNowEntries([
      entry({ url: 'https://example.com/pull/1' }),
      entry({ url: 'https://github.com/someone-else/trace/pull/12' }),
      entry({ url: 'https://github.com/forbiddenlink/other/pull/12' }),
      entry({ url: '' }),
    ])
    expect(problems).toHaveLength(4)
  })

  it('rejects a malformed date', () => {
    expect(validateNowEntries([entry({ mergedAt: 'yesterday' })])).toHaveLength(1)
  })

  it('the committed data file is valid and every line links its source', () => {
    expect(nowData.entries.length).toBeGreaterThan(0)
    expect(validateNowEntries(nowData.entries as NowEntry[])).toEqual([])
  })

  it('makes no role, title or employer claims in the committed titles', () => {
    for (const e of nowData.entries) {
      expect(e.title).not.toMatch(
        /\b(director|cto|ceo|employer|hired)\b|\b(i|she) (lead|led|leads)\b/i
      )
    }
  })
})

describe('groupByMonth', () => {
  it('groups newest month first and keeps entry order inside a month', () => {
    const groups = groupByMonth([
      entry({ mergedAt: '2026-11-10', title: 'b' }),
      entry({ mergedAt: '2026-11-02', title: 'c' }),
      entry({ mergedAt: '2026-10-30', title: 'a' }),
    ])
    expect(groups.map((g) => g.label)).toEqual(['November 2026', 'October 2026'])
    expect(groups[0].entries.map((e) => e.title)).toEqual(['b', 'c'])
  })
})
