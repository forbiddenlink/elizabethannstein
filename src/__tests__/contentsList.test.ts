import { fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContentsList } from '@/components/home/ContentsList'
import { buildContents } from '@/lib/contents'
import { buildFilters, filterRows } from '@/lib/contentsFilter'
import { allProjects, getGalaxyById } from '@/lib/galaxyData'
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

describe('galaxy filter', () => {
  const projects = [
    make('a', 'https://a.example.com', { galaxy: 'ai' }),
    make('b', 'https://b.example.com', { galaxy: 'fullstack' }),
    make('c', 'https://c.example.com', { galaxy: 'ai' }),
  ]

  it('carries the galaxy id and its display name on each row', () => {
    const rows = buildContents(projects)
    expect(rows.map((r) => [r.galaxy, r.galaxyName])).toEqual([
      ['ai', getGalaxyById('ai')?.name],
      ['fullstack', getGalaxyById('fullstack')?.name],
      ['ai', getGalaxyById('ai')?.name],
    ])
    expect(rows[0]?.galaxyName).toBe('AI')
  })

  it('builds one filter per galaxy present, with counts, in order of first appearance', () => {
    const filters = buildFilters(buildContents(projects))
    expect(filters).toEqual([
      { id: 'ai', name: 'AI', count: 2 },
      { id: 'fullstack', name: 'Full-stack', count: 1 },
    ])
  })

  it('filters rows without renumbering or reordering them', () => {
    const rows = buildContents(projects)
    expect(filterRows(rows, 'ai').map((r) => [r.number, r.id])).toEqual([
      [1, 'a'],
      [3, 'c'],
    ])
    expect(filterRows(rows, null)).toEqual(rows)
  })

  it('uses only real galaxies on the real catalogue, and counts add up to the row total', () => {
    const rows = buildContents(allProjects)
    const filters = buildFilters(rows)
    for (const f of filters) expect(getGalaxyById(f.id)?.name).toBe(f.name)
    expect(filters.reduce((n, f) => n + f.count, 0)).toBe(rows.length)
  })

  it('server HTML holds every row and no filter buttons (JS off)', () => {
    const rows = buildContents(projects)
    const html = renderToStaticMarkup(createElement(ContentsList, { rows }))
    expect(html.match(/<li /g)).toHaveLength(3)
    expect(html).not.toContain('<button')
    expect(html).not.toMatch(/<li [^>]*hidden/)
  })

  it('shows buttons with aria-pressed, All default, counts, and announces results', () => {
    render(createElement(ContentsList, { rows: buildContents(projects) }))
    const all = screen.getByRole('button', { name: /^All/ })
    const ai = screen.getByRole('button', { name: /^AI/ })
    expect(all.getAttribute('aria-pressed')).toBe('true')
    expect(all.textContent).toContain('3')
    expect(ai.textContent).toContain('2')

    fireEvent.click(ai)
    expect(ai.getAttribute('aria-pressed')).toBe('true')
    expect(all.getAttribute('aria-pressed')).toBe('false')
    const items = screen.getAllByRole('listitem', { hidden: true })
    expect(items.filter((li) => li.hasAttribute('hidden'))).toHaveLength(1)
    expect(screen.getByRole('status').textContent).toBe('Showing 2 of 3 projects: AI')

    fireEvent.click(all)
    expect(screen.getByRole('status').textContent).toBe('Showing all 3 projects')
    expect(document.querySelectorAll('li[hidden]')).toHaveLength(0)
  })
})
