import { describe, expect, it } from 'vitest'
import { ledgerSummary, resolvePhase } from '@/lib/flagshipDisplay'

/**
 * The home page ledger claims, in public, whether four production sites are up. These tests
 * guard the one distinction that matters for honesty: a site that was pinged and did not
 * answer is "down"; a site the status route never reported on is "unknown".
 */
describe('resolvePhase', () => {
  it('reports a pinged site that answered as live', () => {
    expect(resolvePhase({ up: true, ms: 42 })).toBe('live')
  })

  it('reports a pinged site that did not answer as down', () => {
    expect(resolvePhase({ up: false, ms: null })).toBe('down')
  })

  it('reports a site missing from the status response as unknown, not down', () => {
    expect(resolvePhase(undefined)).toBe('unknown')
  })
})

describe('ledgerSummary', () => {
  it('counts responders when every site was checked', () => {
    expect(ledgerSummary(['live', 'live', 'down', 'live'])).toBe('3 of 4 responding')
  })

  it('says the check failed instead of claiming every site is down', () => {
    expect(ledgerSummary(['unknown', 'unknown', 'unknown', 'unknown'])).toBe(
      'The status check failed. Refresh to try again.'
    )
  })

  it('keeps unchecked sites out of the responding count', () => {
    expect(ledgerSummary(['live', 'unknown', 'live', 'down'])).toBe(
      '2 of 3 checked responding; 1 not checked'
    )
  })
})
