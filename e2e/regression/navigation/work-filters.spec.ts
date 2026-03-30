/**
 * Work Filters Regression Tests
 *
 * Validates:
 * - URL deep links apply galaxy filter
 * - Search input updates URL query state
 * - Featured/all toggle is shareable via URL
 */

import { expect, test } from '@playwright/test'

test.describe('Work URL State', () => {
  test('deep link filter shows the targeted galaxy', async ({ page }) => {
    await page.goto('/work?filter=enterprise')

    await expect(page).toHaveURL(/\/work\?filter=enterprise/)
    await expect(page.locator('h2', { hasText: 'Enterprise Missions' })).toBeVisible()
    await expect(page.locator('h2', { hasText: 'The AI Frontier' })).not.toBeVisible()
  })

  test('search query is persisted in URL', async ({ page }) => {
    await page.goto('/work?view=all')

    const searchInput = page.locator('input[aria-label="Search projects"]')
    await searchInput.click()
    await searchInput.fill('chronicle')
    await searchInput.blur()

    await expect(page).toHaveURL(/q=chronicle/)
    await expect(page.locator('a[href="/work/chronicle"]').first()).toBeVisible()
  })

  test('all-projects URL state is persisted on load', async ({ page }) => {
    await page.goto('/work?view=all')

    await expect(page).toHaveURL(/view=all/)
    await expect(page.locator('button', { hasText: /^All \(/ })).toBeVisible()
    await expect(page.locator('button', { hasText: /^Featured \(/ })).toBeVisible()
    await expect(page.locator('text=featured case studies')).not.toBeVisible()
  })
})
