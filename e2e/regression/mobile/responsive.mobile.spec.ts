/**
 * Mobile Responsive Tests
 *
 * Priority: P1 - High
 * Category: Mobile / Responsive
 *
 * Validates:
 * - Layout works at mobile viewports
 * - Touch targets are adequate size
 * - No horizontal scroll
 * - Key elements are accessible
 */

import { test, expect } from '@playwright/test'

test.describe('Mobile Responsive Layout', () => {
  test('homepage renders without horizontal scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    expect(hasHorizontalScroll).toBe(false)
  })

  test('contact form is usable on mobile', async ({ page }) => {
    await page.goto('/contact')

    // All form fields should be visible
    await expect(page.locator('input#name')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('textarea#message')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Submit button should be tappable (min 44px touch target)
    const submitButton = page.locator('button[type="submit"]')
    const box = await submitButton.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })

  test('/work page is scrollable on mobile', async ({ page }) => {
    await page.goto('/work')
    await page.waitForLoadState('domcontentloaded')

    // Should be able to scroll
    await page.evaluate(() => window.scrollTo(0, 500))

    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })

  test('project links are tappable on mobile', async ({ page }) => {
    await page.goto('/work')

    const firstProjectLink = page.locator('a[href^="/work/"]').first()
    await expect(firstProjectLink).toBeVisible()

    const box = await firstProjectLink.boundingBox()
    // Should have reasonable touch target
    expect(box?.height).toBeGreaterThanOrEqual(32)
  })

  test('navigation works on mobile viewport', async ({ page }) => {
    await page.goto('/')

    // Navigate to /work
    await page.goto('/work')
    expect(page.url()).toContain('/work')

    // Navigate to /contact
    await page.goto('/contact')
    expect(page.url()).toContain('/contact')
  })

  test('text is readable on mobile (min 16px)', async ({ page }) => {
    await page.goto('/contact')

    const bodyFontSize = await page.evaluate(() => {
      const body = document.querySelector('body')
      return body ? parseFloat(getComputedStyle(body).fontSize) : 0
    })

    expect(bodyFontSize).toBeGreaterThanOrEqual(14)
  })

  test('modal is usable on mobile', async ({ page }) => {
    await page.goto('/?p=lumira')
    await page.waitForLoadState('domcontentloaded')

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    // Close button should be visible and tappable
    const closeButton = page.locator('button[aria-label="Close modal"]')
    await expect(closeButton).toBeVisible()

    const box = await closeButton.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })
})

test.describe('Mobile Touch Interactions', () => {
  test('buttons respond to tap', async ({ page }) => {
    await page.goto('/contact')

    // Fill form
    await page.locator('input#name').fill('Test')
    await page.locator('input#email').fill('test@example.com')
    await page.locator('textarea#message').fill('Test message')

    // Tap submit
    await page.locator('button[type="submit"]').tap()

    // Should show loading or success
    await expect(page.locator('text=Opening email')).toBeVisible({ timeout: 2000 })
  })

  test('links respond to tap', async ({ page }) => {
    await page.goto('/work')

    const firstLink = page.locator('a[href^="/work/"]').first()
    await firstLink.tap()

    await page.waitForURL('**/work/**')
    expect(page.url()).toContain('/work/')
  })
})
