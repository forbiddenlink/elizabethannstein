import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for static pages
 * Note: 3D/WebGL pages are excluded as they can have rendering variations
 */

test.describe('Visual Regression', () => {
  test.describe('Static Pages', () => {
    test('work page matches snapshot', async ({ page }) => {
      await page.goto('/work')
      // Wait for page to fully load
      await page.waitForLoadState('networkidle')
      // Take screenshot with some tolerance for font rendering
      await expect(page).toHaveScreenshot('work-page.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })

    test('about page matches snapshot', async ({ page }) => {
      await page.goto('/about')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('about-page.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })

    test('contact page matches snapshot', async ({ page }) => {
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('contact-page.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })

    test('privacy page matches snapshot', async ({ page }) => {
      await page.goto('/privacy')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('privacy-page.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })
  })

  test.describe('Project Pages', () => {
    test('project detail page matches snapshot', async ({ page }) => {
      // Use a stable project page for visual testing
      await page.goto('/work/chronicle')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('project-chronicle.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      })
    })
  })

  test.describe('Component States', () => {
    test('command palette visual', async ({ page }) => {
      await page.goto('/work')
      await page.waitForLoadState('networkidle')
      // Open command palette
      await page.keyboard.press('Meta+k')
      await page.waitForSelector('[role="dialog"]')
      await expect(page.locator('[role="dialog"]')).toHaveScreenshot(
        'command-palette.png',
        {
          maxDiffPixelRatio: 0.02,
          animations: 'disabled',
        }
      )
    })
  })
})
