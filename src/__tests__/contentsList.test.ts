import { describe, expect, it } from 'vitest'
import { buildContents } from '@/lib/contents'
import { allProjects } from '@/lib/galaxyData'
import { isProofCatalogProject } from '@/lib/proofLayer'
import type { Project } from '@/lib/types'

const base: Omit<Project, 'id' | 'title' | 'links'> = {
  description: '',
  role: '',
  tags: [],
  color: '#000',
  brightness: 1,
  size: 'small',
  galaxy: 'fullstack',
  featured: false,
  dateRange: '2026',
}

const make = (id: string, live?: string, extra: Partial<Project> = {}): Project => ({
  ...base,
  id,
  title: id.toUpperCase(),
  links: live ? { live } : undefined,
  ...extra,
})

describe('buildContents', () => {
  it('keeps only projects that have a live URL, in source order, numbered from 1', () => {
    const rows = buildContents([
      make('a', 'https://a.example.com'),
      make('b'),
      make('c', 'https://www.c.example.com/path'),
    ])
    expect(rows.map((r) => [r.number, r.id, r.url, r.host])).toEqual([
      [1, 'a', 'https://a.example.com', 'a.example.com'],
      [2, 'c', 'https://www.c.example.com/path', 'c.example.com/path'],
    ])
  })

  it('drops archived projects', () => {
    const rows = buildContents([make('a', 'https://a.example.com', { status: 'archived' })])
    expect(rows).toEqual([])
  })

  it('drops non-http URLs instead of linking them', () => {
    expect(buildContents([make('a', 'javascript:alert(1)')])).toEqual([])
  })

  it('uses the real catalogue: every row URL is copied from project data, never composed', () => {
    const rows = buildContents(allProjects)
    expect(rows.length).toBeGreaterThan(0)
    const byId = new Map(allProjects.map((p) => [p.id, p]))
    for (const row of rows) {
      const project = byId.get(row.id)
      expect(project?.links?.live).toBe(row.url)
      expect(project && isProofCatalogProject(project)).toBe(true)
    }
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length)
  })
})
