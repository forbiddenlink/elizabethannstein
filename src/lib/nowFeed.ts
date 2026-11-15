export interface NowEntry {
  repo: string
  title: string
  type: string
  url: string
  /** YYYY-MM-DD, the day the pull request merged. */
  mergedAt: string
}

export interface NowGroup {
  label: string
  entries: NowEntry[]
}

const SOURCE_URL = /^https:\/\/github\.com\/forbiddenlink\/([\w.-]+)\/pull\/\d+$/

/** Returns one message per entry that is not a dated, linkable pull request in the entry's own repo. */
export function validateNowEntries(entries: readonly NowEntry[]): string[] {
  const problems: string[] = []
  for (const e of entries) {
    const match = SOURCE_URL.exec(e.url)
    if (!match) problems.push(`${e.repo}: url is not a forbiddenlink pull request (${e.url})`)
    else if (match[1] !== e.repo) problems.push(`${e.repo}: url points at ${match[1]}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.mergedAt)) problems.push(`${e.repo}: bad date ${e.mergedAt}`)
  }
  return problems
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** Groups already-sorted entries by calendar month, preserving their order. */
export function groupByMonth(entries: readonly NowEntry[]): NowGroup[] {
  const groups: NowGroup[] = []
  for (const e of entries) {
    const [year, month] = e.mergedAt.split('-')
    const label = `${MONTHS[Number(month) - 1]} ${year}`
    const last = groups.at(-1)
    if (last && last.label === label) last.entries.push(e)
    else groups.push({ label, entries: [e] })
  }
  return groups
}
