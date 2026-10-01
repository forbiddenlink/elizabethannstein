import { describe, expect, it } from 'vitest'
import { ledgerSummary, resolvePhase } from '@/lib/flagshipDisplay'
import { classifyProbe, isAuthWallUrl } from '@/lib/probeClassify'

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

describe('private demos', () => {
  it('flags a redirect to the Vercel SSO or login host as an auth wall', () => {
    expect(isAuthWallUrl('https://vercel.com/sso-api?url=https%3A%2F%2Ftrace-liz.vercel.app')).toBe(
      true
    )
    expect(isAuthWallUrl('https://vercel.com/login?next=/x')).toBe(true)
    expect(isAuthWallUrl('https://sso.example.com/start')).toBe(true)
  })

  it('does not flag an ordinary site', () => {
    expect(isAuthWallUrl('https://automadocs.com/')).toBe(false)
    expect(isAuthWallUrl('https://vercel.com/blog')).toBe(false)
    expect(isAuthWallUrl('not a url')).toBe(false)
  })

  it('classifies a probe that ended on the login wall as private, not live', () => {
    const r = classifyProbe(200, 'https://vercel.com/sso-api?url=x', 2)
    expect(r).toEqual({ up: false, ms: 2, private: true })
    expect(resolvePhase(r)).toBe('private')
  })

  it('still reports a normal 200 as live and a 5xx as down', () => {
    expect(classifyProbe(200, 'https://example.com/', 40).up).toBe(true)
    expect(classifyProbe(503, 'https://example.com/', 40).up).toBe(false)
  })

  it('keeps private demos out of the responding count', () => {
    expect(ledgerSummary(['live', 'live', 'private'])).toBe('2 of 2 responding; 1 private demo')
  })
})
