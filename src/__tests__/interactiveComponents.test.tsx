import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HireReadySimulator } from '@/components/projects/HireReadySimulator'
import { TimeSlipScrubber } from '@/components/projects/TimeSlipScrubber'
import { TraceComparison } from '@/components/projects/TraceComparison'
import { AskAIAboutMe } from '@/components/ui/AskAIAboutMe'

describe('Interactive Project Components & Utilities', () => {
  describe('TimeSlipScrubber', () => {
    it('renders cultural years and updates snapshot on year click', () => {
      render(<TimeSlipScrubber />)

      expect(screen.getByText(/TimeSlipSearch: a sample year/i)).toBeDefined()
      expect(screen.getAllByText(/1985/i).length).toBeGreaterThan(0)

      // Click on 1969
      const year1969Btn = screen.getByRole('button', { name: '1969' })
      fireEvent.click(year1969Btn)

      expect(screen.getByText(/Apollo 11 Lands on the Moon/i)).toBeDefined()
      expect(screen.getByText(/In the Year 2525/i)).toBeDefined()
    })
  })

  describe('TraceComparison', () => {
    it('renders tabs and allows switching between preview, inspector, and code', () => {
      render(<TraceComparison />)

      expect(screen.getByText(/Trace: grounded and ungrounded output/i)).toBeDefined()

      // Switch to inspector tab
      const inspectorTab = screen.getByRole('button', { name: /What AI Sees/i })
      fireEvent.click(inspectorTab)
      expect(screen.getByText(/Per-Element Confidence & Catalog Matching/i)).toBeDefined()

      // Switch to code tab
      const codeTab = screen.getByRole('button', { name: /Generated TSX/i })
      fireEvent.click(codeTab)
      expect(screen.getByText(/Copy TSX/i)).toBeDefined()
    })
  })

  describe('HireReadySimulator', () => {
    it('renders question tracks and voice simulation trigger', () => {
      render(<HireReadySimulator />)

      expect(screen.getByText(/HireReady: a sample interview round/i)).toBeDefined()
      expect(screen.getByText(/Stripe/i)).toBeDefined()
      expect(screen.getByText(/Google/i)).toBeDefined()

      // Click Google track
      const googleBtn = screen.getByRole('button', { name: /Google/i })
      fireEvent.click(googleBtn)
      expect(screen.getByText(/virtualized rendering pipeline/i)).toBeDefined()
    })
  })

  describe('AskAIAboutMe', () => {
    it('renders AI assistant links and opens candidate brief modal', () => {
      render(<AskAIAboutMe />)

      expect(screen.getByText(/Vetting Liz\? Ask an AI/i)).toBeDefined()
      expect(screen.getByText(/Claude ↗/i)).toBeDefined()
      expect(screen.getByText(/ChatGPT ↗/i)).toBeDefined()
      expect(screen.getByText(/Perplexity ↗/i)).toBeDefined()

      // Open quick brief modal
      const briefBtn = screen.getByRole('button', { name: /Quick AI Brief/i })
      fireEvent.click(briefBtn)

      expect(screen.getByText(/Candidate Brief · Elizabeth Stein/i)).toBeDefined()
      expect(
        screen.getByText(/Capella University, B\.S\. in Information Technology/i)
      ).toBeDefined()
    })
  })
})
