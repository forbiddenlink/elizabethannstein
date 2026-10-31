import type { ContentsRow } from '@/lib/contents'

// Kept apart from contents.ts so the client filter does not pull galaxyData into the bundle.

export interface ContentsFilter {
  id: string
  name: string
  count: number
}

/** One filter per galaxy present in the rows, in order of first appearance, with counts. */
export function buildFilters(rows: readonly ContentsRow[]): ContentsFilter[] {
  const filters = new Map<string, ContentsFilter>()
  for (const row of rows) {
    const existing = filters.get(row.galaxy)
    if (existing) existing.count += 1
    else filters.set(row.galaxy, { id: row.galaxy, name: row.galaxyName, count: 1 })
  }
  return [...filters.values()]
}

/** Rows for one galaxy, original order and numbers kept. `null` means all rows. */
export function filterRows(rows: readonly ContentsRow[], galaxy: string | null): ContentsRow[] {
  return galaxy === null ? [...rows] : rows.filter((r) => r.galaxy === galaxy)
}
