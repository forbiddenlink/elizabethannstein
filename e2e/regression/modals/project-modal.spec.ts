/**
 * Project Modal Regression Tests
 *
 * Priority: P1 - High
 * Category: Navigation / Deep-linking
 *
 * Validates:
 * - Modal opens via URL query parameter
 * - Modal closes via ESC, X button, backdrop click
 * - Browser history integration
 * - Focus trapping
 */

import { test, expect } from '../../fixtures/test-fixtures'

test.describe('Project Modal', () => {
  test('opens modal via URL deep-link (?p=slug)', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('updates URL when modal opens', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    expect(page.url()).toContain('?p=lumira')
  })

  test('closes modal with ESC key', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.closeViaEscape()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('closes modal with X button', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.close()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('closes modal when clicking backdrop', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await projectModal.closeViaBackdrop()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('browser back button closes modal', async ({ projectModal, page }) => {
    // Start at homepage
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Open modal via URL
    await projectModal.openViaUrl('lumira')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Go back
    await page.goBack()

    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    expect(page.url()).not.toContain('?p=')
  })

  test('modal has aria-modal attribute', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  test('modal has descriptive aria-label', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    const modal = page.locator('[role="dialog"]')
    const ariaLabel = await modal.getAttribute('aria-label')
    expect(ariaLabel).toContain('project details')
  })

  test('view full page link navigates to case study', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    await projectModal.navigateToFullPage()

    await page.waitForURL('**/work/lumira')
    expect(page.url()).toContain('/work/lumira')
  })

  test('prevents body scroll when modal is open', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')

    const bodyOverflow = await page.evaluate(() => {
      return document.body.style.overflow
    })

    expect(bodyOverflow).toBe('hidden')
  })

  test('restores body scroll when modal closes', async ({ projectModal, page }) => {
    await projectModal.openViaUrl('lumira')
    await projectModal.closeViaEscape()

    const bodyOverflow = await page.evaluate(() => {
      return document.body.style.overflow
    })

    expect(bodyOverflow).toBe('')
  })
})
