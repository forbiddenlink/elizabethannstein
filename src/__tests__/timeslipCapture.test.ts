import { describe, expect, it } from 'vitest'
import { TIMESLIP_CAPTURES, TIMESLIP_SOURCE } from '@/lib/timeslipCapture'

/**
 * The home demo presents these rows as real TimeSlipSearch output. These tests guard the
 * properties that keep that claim true when someone recaptures or edits the file: every row
 * sits inside its own date window, nothing shown exceeds what the API returned, and the source
 * and capture date stay attached.
 */
const iso = /^\d{4}-\d{2}-\d{2}$/

describe('TIMESLIP_SOURCE', () => {
  it('names the live endpoint and an ISO capture date', () => {
    expect(TIMESLIP_SOURCE.endpoint).toMatch(/^https:\/\/timeslipsearch\.vercel\.app\//)
    expect(TIMESLIP_SOURCE.capturedAt).toMatch(iso)
  })
})

describe('TIMESLIP_CAPTURES', () => {
  it('has unique ids and queries', () => {
    expect(new Set(TIMESLIP_CAPTURES.map((c) => c.id)).size).toBe(TIMESLIP_CAPTURES.length)
    expect(new Set(TIMESLIP_CAPTURES.map((c) => c.query)).size).toBe(TIMESLIP_CAPTURES.length)
  })

  for (const c of TIMESLIP_CAPTURES) {
    describe(c.query, () => {
      it('has an ordered ISO window', () => {
        expect(c.window.start).toMatch(iso)
        expect(c.window.end).toMatch(iso)
        expect(c.window.start <= c.window.end).toBe(true)
      })

      it('shows no more songs than the API returned', () => {
        expect(c.songs.length).toBeGreaterThan(0)
        expect(c.songs.length).toBeLessThanOrEqual(c.hits.songs)
      })

      it('only shows a price or event when that index returned one', () => {
        expect(Boolean(c.price)).toBe(c.hits.prices > 0)
        expect(Boolean(c.event)).toBe(c.hits.events > 0)
      })

      it('keeps every chart week inside the window', () => {
        for (const s of c.songs) {
          expect(s.week >= c.window.start && s.week <= c.window.end).toBe(true)
        }
      })

      it('keeps the event date inside the window', () => {
        if (!c.event) return
        expect(c.event.date >= c.window.start && c.event.date <= c.window.end).toBe(true)
      })
    })
  }
})
