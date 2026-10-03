import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { AUTOMADOCS_CAPTURE, AUTOMADOCS_SOURCE } from '@/lib/automadocsCapture'
import { SPECTER_CAPTURE, SPECTER_SOURCE } from '@/lib/specterCapture'
import { TRACE_CAPTURES, TRACE_SOURCE } from '@/lib/traceCapture'

/**
 * The case-study demo panels present these files as real product output. These tests guard the
 * properties that keep that claim true when someone recaptures or edits a file: dates and
 * sources stay attached, counts the panels print agree with the rows they summarize, and every
 * value stays inside the range its product can produce.
 */
const iso = /^\d{4}-\d{2}-\d{2}$/

describe('TRACE_CAPTURES', () => {
  it('keeps its source and capture date', () => {
    expect(TRACE_SOURCE.repo).toBe('https://github.com/forbiddenlink/trace')
    expect(TRACE_SOURCE.capturedAt).toMatch(iso)
  })

  for (const c of TRACE_CAPTURES) {
    describe(c.id, () => {
      it('ships the screenshot it draws boxes on', () => {
        expect(existsSync(join(process.cwd(), 'public', c.image))).toBe(true)
      })

      it('keeps every box inside the 0-1000 frame, min before max', () => {
        for (const d of c.detections) {
          const [ymin, xmin, ymax, xmax] = d.box
          for (const v of d.box) expect(v >= 0 && v <= 1000).toBe(true)
          expect(ymin < ymax && xmin < xmax).toBe(true)
        }
      })

      it('keeps confidences in 0-1 and gradings to the three Trace emits', () => {
        for (const d of c.detections) {
          expect(d.confidence >= 0 && d.confidence <= 1).toBe(true)
          expect(['grounded', 'inferred', 'guessed']).toContain(d.grounding)
        }
      })

      it('never exceeds the pipeline repair cap of two', () => {
        expect(c.repairs >= 0 && c.repairs <= 2).toBe(true)
      })
    })
  }
})

describe('AUTOMADOCS_CAPTURE', () => {
  const c = AUTOMADOCS_CAPTURE

  it('keeps its public endpoint and capture date', () => {
    expect(AUTOMADOCS_SOURCE.endpoint).toBe(`https://api.automadocs.com/api/public/repo/${c.repo}`)
    expect(AUTOMADOCS_SOURCE.capturedAt).toMatch(iso)
  })

  it('counts no more docs by type than in total', () => {
    const typed = Object.values(c.byType).reduce((a, b) => a + b, 0)
    expect(typed).toBeLessThanOrEqual(c.totalDocs)
  })

  it('shows a source excerpt whose line range matches its length', () => {
    expect(c.source.split('\n')).toHaveLength(c.lines[1] - c.lines[0] + 1)
  })

  it('takes the smaller-model path the panel claims', () => {
    // documentationService.js: functions of 30 lines or fewer are classified simple.
    expect(c.functionLines).toBeLessThanOrEqual(30)
    expect(c.docPath.startsWith('functions/')).toBe(true)
  })
})

describe('SPECTER_CAPTURE', () => {
  const c = SPECTER_CAPTURE

  it('keeps its source, version and capture date', () => {
    expect(SPECTER_SOURCE.capturedAt).toMatch(iso)
    expect(c.specterVersion).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('lists hotspots in descending score order', () => {
    const scores = c.top.map((h) => h.hotspotScore)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it('scores each hotspot as the square root of complexity times churn', () => {
    // hotspots.ts: hotspotScore = round(sqrt(complexity * churn)), both percentiles.
    for (const h of c.top) {
      expect(h.hotspotScore).toBe(Math.round(Math.sqrt(h.complexity * h.churn)))
    }
  })

  it('labels priority by the documented thresholds', () => {
    for (const h of c.top) {
      const expected =
        h.hotspotScore >= 75
          ? 'critical'
          : h.hotspotScore >= 50
            ? 'high'
            : h.hotspotScore >= 25
              ? 'medium'
              : 'low'
      expect(h.priority).toBe(expected)
    }
  })

  it('shows no file whose change date is the epoch placeholder', () => {
    for (const h of c.top) expect(h.lastModified.startsWith('1970')).toBe(false)
  })
})
