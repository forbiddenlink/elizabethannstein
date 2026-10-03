/**
 * PR Gate Smoke Tests
 *
 * Priority: P0
 * Runs on every pull request through e2e-smoke.yml (the `smoke` project, Chromium).
 *
 * Validates, on the recruiter-facing routes:
 * - axe finds zero violations of any impact (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa),
 *   in both themes at 390px
 * - zero console errors and zero uncaught exceptions
 * - a case study does not scroll itself on load (the terminal demo used to)
 * - the command palette hands focus back to where it was opened from
 *
 * The 200% text reflow check lives in text-zoom.smoke.spec.ts.
 */

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['/', '/work', '/about', '/contact', '/work/specter']
const themes = ['light', 'dark'] as const

test.describe('PR gate: axe', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  for (const theme of themes) {
    for (const route of routes) {
      test(`${route} has zero axe violations (${theme})`, async ({ page }) => {
        // Reduced motion skips the entrance animation, so axe never samples a
        // half-faded element and reports a false contrast failure.
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.addInitScript((t) => {
          document.documentElement.setAttribute('data-theme', t)
        }, theme)
        await page.goto(route, { waitUntil: 'load' })
        // Contrast is sampled from computed colors, so let web fonts and theme transitions settle.
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(500)
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
        const summary = violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`
        )
        expect(summary).toEqual([])
      })
    }
  }
})

test.describe('PR gate: console', () => {
  for (const route of routes) {
    test(`${route} logs no console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() !== 'error') return
        // Vercel's analytics scripts only exist on Vercel; a local `next start` 404s them.
        if (msg.text().includes('/_vercel/') || msg.location().url.includes('/_vercel/')) return
        errors.push(msg.text())
      })
      page.on('pageerror', (err) => errors.push(err.message))
      await page.goto(route, { waitUntil: 'load' })
      await page.waitForTimeout(800)
      expect(errors).toEqual([])
    })
  }
})

test.describe('PR gate: behavior', () => {
  test('a case study with a terminal demo stays at the top on load', async ({ page }) => {
    await page.goto('/work/specter', { waitUntil: 'load' })
    await page.waitForTimeout(1000)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('the command palette returns focus to its opener on Escape', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'load' })
    const opener = page.getByRole('link', { name: 'About' }).first()
    await opener.focus()
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(opener).toBeFocused()
  })

  // The page used to promise a 24 hour reply the inbox could not always keep. Main now makes
  // no reply-time promise at all ("Goes to my inbox"), so only the broken promise is asserted.
  test('the contact page makes no 24 hour reply promise', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'load' })
    const text = await page.locator('main').innerText()
    expect(text).not.toMatch(/24\s*(h|hours)\b/i)
  })
})
