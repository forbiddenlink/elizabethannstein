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

import { test, expect } from '../../fixtures/test-fixtures'

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
    await homePage.searchInCommandPalette('React')

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

    // First item should be selected by default
    const firstSelected = page.locator('.command-palette-modal button.bg-blue-500\\/20').first()
    await expect(firstSelected).toBeVisible()

    // Navigate down
    await homePage.navigateResultsDown(1)

    // Selection should have moved
    const buttons = page.locator('.command-palette-modal button[type="button"]')
    const secondButton = buttons.nth(1)
    await expect(secondButton).toHaveClass(/bg-blue-500/)
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

    await expect(page.locator('text=Projects')).toBeVisible()
    await expect(page.locator('text=Galaxies')).toBeVisible()
    await expect(page.locator('text=Actions')).toBeVisible()
  })

  test('shows keyboard hints in footer', async ({ homePage, page }) => {
    await homePage.openCommandPalette()

    await expect(page.locator('kbd:has-text("↵")')).toBeVisible()
    await expect(page.locator('kbd:has-text("ESC")')).toBeVisible()
  })
})
