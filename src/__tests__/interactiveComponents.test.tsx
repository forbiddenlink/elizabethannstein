import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AutomaDocsInspect } from '@/components/home/AutomaDocsInspect'
import { SpecterInspect } from '@/components/home/SpecterInspect'
import { TimeSlipInspect } from '@/components/home/TimeSlipInspect'
import { TraceInspect } from '@/components/home/TraceInspect'

const panels = [
  { name: 'TimeSlipSearch', Panel: TimeSlipInspect },
  { name: 'Trace', Panel: TraceInspect },
  { name: 'AutomaDocs', Panel: AutomaDocsInspect },
  { name: 'Specter', Panel: SpecterInspect },
]

describe('Inspect demo panels', () => {
  for (const { name, Panel } of panels) {
    describe(name, () => {
      it('renders as a labelled region with a dated source line', () => {
        render(<Panel />)
        expect(screen.getByRole('region', { name })).toBeDefined()
        expect(screen.getByText(/Real output from/i).textContent).toMatch(/\d{4}/)
      })

      it('opens and closes the inspect legend as a disclosure', () => {
        render(<Panel />)
        const toggle = screen.getByRole('button', { name: /Inspect how it works/i })
        expect(toggle.getAttribute('aria-expanded')).toBe('false')
        fireEvent.click(toggle)
        expect(toggle.getAttribute('aria-expanded')).toBe('true')
        expect(screen.getByRole('group', { name: 'Choose a layer' })).toBeDefined()
        fireEvent.click(screen.getByRole('button', { name: /^Data/ }))
        expect(screen.getByRole('button', { name: /^Data/ }).getAttribute('aria-pressed')).toBe(
          'true'
        )
      })

      it('uses an h3 under a section heading when asked', () => {
        render(<Panel headingLevel={3} />)
        expect(screen.getByRole('heading', { level: 3, name })).toBeDefined()
      })
    })
  }

  it('Trace announces the newly picked example', () => {
    render(<TraceInspect />)
    fireEvent.click(screen.getByRole('button', { name: 'Dashboard stat cards' }))
    expect(screen.getByRole('status').textContent).toMatch(
      /^Dashboard stat cards: 20 elements found/
    )
  })
})
