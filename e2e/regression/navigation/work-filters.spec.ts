/**
 * Work Filters Regression Tests
 *
 * Validates:
 * - URL deep links apply the galaxy filter
 * - Search input updates URL query state and survives a reload
 * - The catalogue/proof toggle is shareable via URL
 *
 * These assertions were rewritten on 2026-09-22. The originals targeted the
 * pre-2026-08 `/work` page, which grouped projects under `<h2>` galaxy headings
 * and offered "All (n)" / "Featured (n)" buttons. That page is gone: galaxies
 * are now filter chips and the toggle reads "Proof" / "Full catalog". The old
 * assertions had been failing since the redesign without anyone seeing it,
 * because the regression suite does not run in CI.
 */

import { expect, test } from '@playwright/test'

test.describe('Work URL State', () => {
  test('deep link filter narrows the catalogue to that galaxy', async ({ page }) => {
    await page.goto('/work?filter=enterprise')

    await expect(page).toHaveURL(/filter=enterprise/)
    await expect(page.getByRole('button', { name: 'Enterprise Missions' })).toBeVisible()

    const cards = page.locator('a[href^="/work/"]')
    await expect(cards.first()).toBeVisible()

    // Narrower than the full catalogue, and non-empty.
    const filtered = await cards.count()
    expect(filtered).toBeGreaterThan(0)

    await page.goto('/work?view=all')
    await expect(page.locator('a[href^="/work/"]').first()).toBeVisible()
    expect(await page.locator('a[href^="/work/"]').count()).toBeGreaterThan(filtered)
  })

  test('search query is persisted in URL and restored on reload', async ({ page }) => {
    await page.goto('/work?view=all')

    const searchInput = page.locator('input[aria-label="Search projects"]')
    await searchInput.click()
    await searchInput.fill('chronicle')

    await expect(page).toHaveURL(/q=chronicle/)
    await expect(page.locator('a[href="/work/chronicle"]').first()).toBeVisible()

    // A shared search URL must come back the same way.
    await page.reload()
    await expect(searchInput).toHaveValue('chronicle')
    await expect(page.locator('a[href="/work/chronicle"]').first()).toBeVisible()
  })

  test('all-projects URL state is persisted on load', async ({ page }) => {
    await page.goto('/work?view=all')

    await expect(page).toHaveURL(/view=all/)
    await expect(page.getByRole('button', { name: /^Full catalog \(\d+\)$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Proof \(\d+\)$/ })).toBeVisible()
  })
})
