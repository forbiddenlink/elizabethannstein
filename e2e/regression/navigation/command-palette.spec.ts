/**
 * Command Palette Regression Tests
 *
 * Priority: P1 - High
 * Category: Navigation
 *
 * Validates:
 * - Opens/closes with keyboard shortcuts
 * - Search filters results
 * - Arrow key navigation
 * - Enter selects item
 */

import { expect, test } from '../../fixtures/test-fixtures'

test.describe('Command Palette', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto()
    await homePage.page.waitForLoadState('domcontentloaded')
  })

  test('opens with CMD+K on macOS', async ({ homePage }) => {
    await homePage.openCommandPalette()

    expect(await homePage.isCommandPaletteVisible()).toBe(true)
  })

  test('opens with CTRL+K on Windows/Linux', async ({ homePage, page }) => {
    await page.keyboard.press('Control+k')

    await expect(homePage.commandPaletteModal).toBeVisible()
  })

  test('closes with ESC key', async ({ homePage }) => {
    await homePage.openCommandPalette()
    await homePage.closeCommandPalette()

    expect(await homePage.isCommandPaletteVisible()).toBe(false)
  })

  test('closes when clicking backdrop', async ({ homePage }) => {
    await homePage.openCommandPalette()

    await homePage.commandPaletteBackdrop.click({ position: { x: 10, y: 10 } })

    await expect(homePage.commandPaletteModal).not.toBeVisible()
  })

  test('closes with X button', async ({ homePage }) => {
    await homePage.openCommandPalette()

    await homePage.commandPaletteCloseButton.click()

    await expect(homePage.commandPaletteModal).not.toBeVisible()
  })

  test('search input is auto-focused when opened', async ({ homePage }) => {
    await homePage.openCommandPalette()

    await expect(homePage.commandPaletteInput).toBeFocused()
  })

  test('search filters projects by title', async ({ homePage }) => {
    await homePage.openCommandPalette()
    await homePage.searchInCommandPalette('Chronicle')

    // Should have fewer results than all projects
    const resultCount = await homePage.getResultCount()
    expect(resultCount).toBeGreaterThan(0)
    expect(resultCount).toBeLessThan(200) // Less than all commands
  })

  test('shows "no results" for unmatched search', async ({ homePage, page }) => {
    await homePage.openCommandPalette()
    await homePage.searchInCommandPalette('xyznonexistent123')

    await expect(page.locator('text=No results found')).toBeVisible()
  })

  test('arrow down navigates to next result', async ({ homePage, page }) => {
    await homePage.openCommandPalette()

    const options = page.locator('.command-palette-modal [role="option"]')
    // Assert the selection MOVED, rather than that some fixed index is
    // highlighted. The previous version checked `nth(1)` for the highlight
    // class, which was already true at rest, so it passed for months while
    // the arrow keys did nothing at all.
    await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true')

    await homePage.navigateResultsDown(1)

    await expect(options.nth(0)).toHaveAttribute('aria-selected', 'false')
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  })

  test('the highlighted option is exposed to assistive tech', async ({ homePage, page }) => {
    await homePage.openCommandPalette()

    const input = page.locator('.command-palette-modal input[type="text"]')
    const firstId = await page
      .locator('.command-palette-modal [role="option"]')
      .first()
      .getAttribute('id')

    // Focus never leaves the input, so aria-activedescendant is the only thing
    // announcing the highlight.
    await expect(input).toHaveAttribute('aria-activedescendant', String(firstId))

    await homePage.navigateResultsDown(1)
    await expect(input).not.toHaveAttribute('aria-activedescendant', String(firstId))
  })

  test('enter key selects highlighted item', async ({ homePage, page }) => {
    await homePage.openCommandPalette()
    await homePage.searchInCommandPalette('List View')

    await homePage.selectFirstResult()

    // Should navigate to /work
    await page.waitForURL('**/work')
    expect(page.url()).toContain('/work')
  })

  test('search clears when palette closes', async ({ homePage }) => {
    await homePage.openCommandPalette()
    await homePage.searchInCommandPalette('test query')
    await homePage.closeCommandPalette()

    // Reopen
    await homePage.openCommandPalette()

    // Search should be empty
    await expect(homePage.commandPaletteInput).toHaveValue('')
  })

  test('shows category labels (Projects, Galaxies, Actions)', async ({ homePage, page }) => {
    await homePage.openCommandPalette()

    const modal = page.locator('.command-palette-modal')
    await expect(modal.getByText('Projects', { exact: true })).toBeVisible()
    await expect(modal.getByText('Galaxies', { exact: true })).toBeVisible()
    await expect(modal.getByText('Actions', { exact: true })).toBeVisible()
  })

  test('shows keyboard hints in footer', async ({ homePage, page }) => {
    await homePage.openCommandPalette()

    const modal = page.locator('.command-palette-modal')
    await expect(modal.locator('span', { hasText: 'Select' }).locator('kbd')).toHaveText('↵')
    await expect(modal.locator('span', { hasText: 'Close' }).locator('kbd')).toHaveText('ESC')
  })
})
