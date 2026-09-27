/**
 * Accessibility Smoke Tests (axe-core)
 *
 * Priority: P0 - Critical
 * Run: Before every deploy
 *
 * Validates:
 * - No serious/critical axe violations on public routes
 * - Checked at mobile (390px) and desktop (1440px) widths
 * - Checked in both light and dark theme (the editorial system is
 *   hand-tuned for WCAG AA contrast in both, see src/styles/editorial.css)
 *
 * /explore and /city are opt-in WebGL showcases outside the recruiter-facing
 * "hiring surface" (/city isn't linked from anywhere public) and are covered
 * separately, not in this sweep, to keep this test fast and deterministic.
 */

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['/', '/about', '/work', '/work/chronicle', '/contact', '/privacy']

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const themes = ['light', 'dark'] as const

// axe flags color-contrast on elements it can't fully resolve against a
// gradient/backdrop-filter background; the editorial system's own contrast
// guarantees (see editorial.css) are enforced by src/__tests__ instead.
const KNOWN_NOT_APPLICABLE_IMPACT: string[] = []

for (const viewport of viewports) {
  for (const theme of themes) {
    test.describe(`a11y: ${viewport.name} / ${theme}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } })

      for (const route of routes) {
        test(`${route || '/'} has no serious or critical axe violations`, async ({ page }) => {
          // Reduced motion skips the GSAP .reveal entrance animation (see
          // LiveSystemsIndex.module.css's prefers-reduced-motion block), so
          // axe never samples a still-fading-in element and reports a false
          // contrast violation on its mid-transition color.
          await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.addInitScript((t) => {
            document.documentElement.setAttribute('data-theme', t)
          }, theme)

          await page.goto(route, { waitUntil: 'load' })
          // Let any theme-toggle CSS transitions (transition-all duration-300
          // on several cards) settle before sampling computed colors.
          await page.waitForTimeout(500)

          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

          const serious = results.violations.filter(
            (v) =>
              (v.impact === 'serious' || v.impact === 'critical') &&
              !KNOWN_NOT_APPLICABLE_IMPACT.includes(v.id)
          )

          if (serious.length > 0) {
            const summary = serious
              .map(
                (v) =>
                  `${v.id} (${v.impact}): ${v.help} - ${v.nodes.length} node(s): ${v.nodes
                    .slice(0, 3)
                    .map((n) => n.target.join(' '))
                    .join(', ')}`
              )
              .join('\n')
            expect(
              serious,
              `axe violations on ${route} (${viewport.name}/${theme}):\n${summary}`
            ).toEqual([])
          }
        })
      }
    })
  }
}
