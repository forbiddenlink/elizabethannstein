/**
 * Homepage Smoke Tests
 *
 * Priority: P0 - Critical
 * Run: Before every deploy
 *
 * Validates:
 * - Homepage loads successfully (200 status)
 * - No unhandled JavaScript errors
 * - Core UI elements are present
 */

import { expect, test } from '@playwright/test'

async function gotoHomeReady(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript(() => {
    globalThis.localStorage.setItem('ea-has-visited', 'true')
  })
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')

  const skipIntroButton = page.getByRole('button', { name: /Skip intro/i })
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const isVisible = await skipIntroButton.isVisible({ timeout: 250 }).catch(() => false)
    if (!isVisible) break
    await skipIntroButton.click({ force: true }).catch(() => undefined)
    await page.waitForTimeout(120)
  }
}

test.describe('Homepage Smoke Tests', () => {
  test('homepage loads with 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('homepage has correct title', async ({ page }) => {
    await gotoHomeReady(page)
    await expect(page).toHaveTitle(/Elizabeth Stein/)
  })

  test('no unhandled JavaScript errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await gotoHomeReady(page)
    await page.waitForLoadState('networkidle')

    // Allow WebGL context errors on systems without GPU
    const criticalErrors = errors.filter((e) => !e.includes('WebGL') && !e.includes('GPU'))
    expect(criticalErrors).toHaveLength(0)
  })

  test('command palette opens with CMD+K', async ({ page }) => {
    await gotoHomeReady(page)

    // Open command palette
    await page.keyboard.press('Meta+k')

    // Should see the search input
    const searchInput = page.locator('.command-palette-modal input[type="text"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })
  })

  test('project modal opens via URL deep-link', async ({ page }) => {
    // Use a known project slug.
    await page.goto('/?p=chronicle')
    await page.waitForLoadState('domcontentloaded')

    const modal = page.locator('[role="dialog"]')

    // On low-capability environments, app may redirect to canonical project page.
    if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(modal).toBeVisible()
      return
    }

    await page.waitForURL('**/work/chronicle', { timeout: 10000 })
    await expect(page).toHaveURL(/\/work\/chronicle/)
  })
})
