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

import { test, expect } from '@playwright/test'

test.describe('Homepage Smoke Tests', () => {
  test('homepage loads with 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('homepage has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Elizabeth Stein/)
  })

  test('no unhandled JavaScript errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Allow WebGL context errors on systems without GPU
    const criticalErrors = errors.filter(
      (e) => !e.includes('WebGL') && !e.includes('GPU')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('command palette opens with CMD+K', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Open command palette
    await page.keyboard.press('Meta+k')

    // Should see the search input
    const searchInput = page.locator('.command-palette-modal input[type="text"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })
  })

  test('project modal opens via URL deep-link', async ({ page }) => {
    // Use a known project slug
    await page.goto('/?p=lumira')
    await page.waitForLoadState('domcontentloaded')

    // Modal should be visible
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 10000 })
  })
})
