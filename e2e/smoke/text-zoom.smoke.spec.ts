/**
 * Large-text Reflow Smoke Tests
 *
 * Priority: P1
 * Validates (WCAG 1.4.4 / 1.4.10): at 390px with a 200% root font size, no content
 * extends past the viewport. The editorial scope uses overflow-x: clip, so an
 * overflow does not scroll: it silently hides content (masthead links, form fields).
 */

import { expect, test } from '@playwright/test'

// Includes the case studies that carry an interactive demo widget.
const routes = [
  '/',
  '/work',
  '/about',
  '/contact',
  '/work/timeslip-search',
  '/work/specter',
  '/work/hire-ready',
  '/work/trace',
]

const widths = [390, 320]

test.describe('200% text reflow', () => {
  for (const width of widths) {
    for (const route of routes) {
      test(`${route} has no content past the viewport at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(route)
        await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
        const offenders = await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter((el) => {
              const r = el.getBoundingClientRect()
              return (
                r.width > 0 &&
                r.right > window.innerWidth + 1 &&
                getComputedStyle(el).position !== 'fixed' &&
                !el.closest('svg, video, [aria-hidden="true"]')
              )
            })
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`)
        )
        expect(offenders).toEqual([])
        // Text can spill out of a control whose own box still fits the viewport.
        const clipped = await page.evaluate(() =>
          [...document.querySelectorAll('button, a, input, label')]
            .filter((el) => {
              const h = el as HTMLElement
              const r = h.getBoundingClientRect()
              // Skip links are visually hidden (1px clip) until focused.
              if (r.width <= 1 || r.height <= 1) return false
              return h.scrollWidth > h.clientWidth + 1 && !h.closest('svg, [aria-hidden="true"]')
            })
            .slice(0, 5)
            .map(
              (el) =>
                `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)} (${(el as HTMLElement).scrollWidth}>${(el as HTMLElement).clientWidth})`
            )
        )
        expect(clipped).toEqual([])
      })
    }
  }
})
