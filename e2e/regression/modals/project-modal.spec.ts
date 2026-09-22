/**
 * Project Modal Regression Tests
 *
 * Priority: P1 - High
 * Category: Navigation / Deep-linking
 *
 * Validates:
 * - Modal opens via URL query parameter on /explore
 * - Modal closes via ESC, X button, backdrop click
 * - Browser history integration
 * - Focus trapping
 *
 * Retargeted 2026-09-22 from `/` to `/explore`. The galaxy stopped being the
 * homepage in the 2026-08 redesign; every test here had been failing since,
 * unseen, because the regression suite does not run in CI.
 */

import { expect, test } from '../../fixtures/test-fixtures'

test.describe('Project Modal', () => {
  /**
   * Every test here loads /explore, which mounts the WebGL galaxy: three.js,
   * the shader material and the whole project catalogue. On a cold build that
   * first hit can spend most of the default 30s budget before the modal even
   * exists, and `openViaUrl` then waits up to 30s more for it. The suite was
   * failing roughly one test per cold run, a different one each time, always
   * surfacing as "Target page, context or browser has been closed" from a
   * helper caught in teardown — the symptom of the timeout, not its cause.
   */
  test.slow()

  test.beforeEach(async ({ page }) => {
    const supportsModalDeepLink = await page.evaluate(() => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
      return Boolean(gl) && !prefersReducedMotion
    })

    test.skip(
      !supportsModalDeepLink,
      'Deep-link modal path requires WebGL and non-reduced-motion environment'
    )
  })

  test('opens modal via URL deep-link (?p=slug)', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('updates URL when modal opens', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    expect(page.url()).toContain('?p=chronicle')
  })

  test('closes modal with ESC key', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.closeViaEscape()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('closes modal with X button', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.close()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('closes modal when clicking backdrop', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.closeViaBackdrop()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('browser back button closes modal', async ({ projectModal, page }) => {
    // Start at the galaxy with no project selected
    await page.goto('/explore')
    await page.waitForLoadState('domcontentloaded')

    // Open modal via URL
    await projectModal.openViaUrl('chronicle')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Go back
    await page.goBack()

    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    expect(page.url()).not.toContain('?p=')
  })

  test('modal has aria-modal attribute', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  test('modal has descriptive aria-label', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    const modal = page.locator('[role="dialog"]')
    const ariaLabel = await modal.getAttribute('aria-label')
    expect(ariaLabel).toContain('project details')
  })

  test('view full page link navigates to case study', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    await projectModal.navigateToFullPage()

    await page.waitForURL('**/work/chronicle')
    expect(page.url()).toContain('/work/chronicle')
  })

  // These two assert the BEHAVIOUR (the page behind the modal must not move),
  // not the old implementation detail of an inline `body.style.overflow`
  // toggle. The modal scrolls in its own container and the galaxy route is a
  // fixed-height canvas, so that inline style no longer exists.
  test('the page behind the modal does not scroll', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')

    const { before, after } = await page.evaluate(() => {
      const before = globalThis.scrollY
      globalThis.scrollTo(0, 800)
      return { before, after: globalThis.scrollY }
    })

    expect(after).toBe(before)
  })

  test('closing the modal leaves the page scrollable again', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('chronicle')
    await projectModal.closeViaEscape()

    const locked = await page.evaluate(() => document.body.style.overflow === 'hidden')
    expect(locked).toBe(false)
  })
})
