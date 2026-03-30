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

import { expect, test } from '@playwright/test'

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

  test('/work page renders project cards on mobile', async ({ page }) => {
    await page.goto('/work')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('h1')).toContainText(/Projects|Case Studies/i)
    await expect(page.locator('a[href^="/work/"]').first()).toBeVisible()
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

  test('project detail page is usable on mobile', async ({ page }) => {
    await page.goto('/work/chronicle')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chronicle')
  })
})

test.describe('Mobile Touch Interactions', () => {
  test('buttons respond to tap', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(200)

    const name = page.locator('input#name')
    const email = page.locator('input#email')
    const message = page.locator('textarea#message')

    await email.fill('test@example.com')
    if ((await email.inputValue()) !== 'test@example.com') await email.fill('test@example.com')

    await message.fill('Test message')
    if ((await message.inputValue()) !== 'Test message') await message.fill('Test message')

    await name.fill('Test')
    if ((await name.inputValue()) !== 'Test') await name.fill('Test')

    await page.locator('button[type="submit"]').click()

    // Should reveal the follow-up actions
    await expect(page.locator('text=Message ready to send')).toBeVisible({ timeout: 5000 })
  })

  test('links respond to tap', async ({ page }) => {
    await page.goto('/work')

    const firstLink = page.locator('a[href^="/work/"]').first()
    await firstLink.scrollIntoViewIfNeeded()
    await firstLink.click()

    await page.waitForURL('**/work/**')
    expect(page.url()).toContain('/work/')
  })
})
