/**
 * Work Filters Regression Tests
 *
 * Validates:
 * - URL deep links apply the galaxy filter
 * - Search input updates URL query state and survives a reload
 * - The catalogue/proof toggle is shareable via URL
 *
 * Rewritten on 2026-09-22 for the chip-based page, then again on 2026-09-27 for the
 * "Live ledger" redesign (DESIGN.md): the page is now Selected plates plus an Archive
 * table. Category chips use plain names ("Enterprise", not "Enterprise Missions"), and
 * the Proof / Full catalog toggle is gone because the archive always lists every
 * project. Old `?view=all` links still load.
 */

import { expect, test } from '@playwright/test'

test.describe('Work URL State', () => {
  test('deep link filter narrows the catalogue to that galaxy', async ({ page }) => {
    await page.goto('/work?filter=enterprise')

    await expect(page).toHaveURL(/filter=enterprise/)
    await expect(page.getByRole('button', { name: 'Enterprise', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

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

  test('legacy view=all links load the full archive', async ({ page }) => {
    await page.goto('/work?view=all')

    await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await expect(page.getByText(/^(\d+) of \1 shown$/)).toBeVisible()
  })

  test('empty search offers a way back', async ({ page }) => {
    await page.goto('/work?q=zzzz-no-such-project')

    await expect(page.getByText(/No projects match/)).toBeVisible()
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.locator('input[aria-label="Search projects"]')).toHaveValue('')
    await expect(page.locator('#archive a[href^="/work/"]').first()).toBeVisible()
  })
})
