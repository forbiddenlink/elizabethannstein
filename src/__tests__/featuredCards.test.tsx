import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'
import { buildContents } from '@/lib/contents'
import { FLAGSHIPS } from '@/lib/flagships'
import { allProjects, getProjectById } from '@/lib/galaxyData'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.reject(new Error('offline in test')))
)

function renderHome() {
  const featuredProjects = Object.fromEntries(
    FLAGSHIPS.flatMap((f) => {
      const project = getProjectById(f.id)
      return project ? [[f.id, { tags: project.tags, role: project.role }]] : []
    })
  )
  return render(
    <LiveSystemsIndex
      projectIds={allProjects.map((p) => p.id)}
      featuredProjects={featuredProjects}
      contents={buildContents(allProjects)}
    />
  )
}

describe('Selected work cards', () => {
  // Lighthouse label-content-name-mismatch (WCAG 2.5.3): the card link's visible
  // text is the who-line, title, summary, metrics and status, but
  // aria-labelledby pointed at the title alone, so the name did not contain the
  // visible text and voice-control users could not say what they saw.
  it('names each card link from its visible text, not a hand-picked subset', () => {
    renderHome()
    const featured = screen.getByRole('heading', { name: 'Selected work' }).closest('section')
    expect(featured).not.toBeNull()
    const cards = within(featured as HTMLElement)
      .getAllByRole('link')
      .filter((a) => a.querySelector('h3'))
    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(card.getAttribute('aria-labelledby')).toBeNull()
      expect(card.getAttribute('aria-label')).toBeNull()
      const title = card.querySelector('h3')?.textContent ?? ''
      const summary = card.querySelector('h3 + p')?.textContent ?? ''
      expect(title).not.toBe('')
      expect(summary).not.toBe('')
      // getByRole computes the accessible name; it must carry the visible title and summary.
      expect(
        within(featured as HTMLElement).getByRole('link', {
          name: (name, el) => el === card && name.includes(title) && name.includes(summary),
        })
      ).toBe(card)
    }
  })
})
