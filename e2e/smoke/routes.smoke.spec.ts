/**
 * Routes Smoke Tests
 *
 * Priority: P0 - Critical
 * Run: Before every deploy
 *
 * Validates:
 * - All main routes return 200
 * - No server errors on any page
 */

import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', name: 'Homepage' },
  { path: '/work', name: 'Work (List View)' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy' },
]

test.describe('Routes Smoke Tests', () => {
  for (const route of routes) {
    test(`${route.name} (${route.path}) returns 200`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response?.status()).toBe(200)
    })
  }

  test('404 page renders for invalid route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)

    // Should show 404 content
    await expect(page.locator('body')).toContainText(/404|not found/i)
  })

  test('/work/[slug] returns 200 for valid project', async ({ page }) => {
    // Test with a known project
    const response = await page.goto('/work/lumira')
    expect(response?.status()).toBe(200)
  })

  test('/work/[slug] returns 404 for invalid project', async ({ page }) => {
    const response = await page.goto('/work/invalid-project-slug-12345')
    expect(response?.status()).toBe(404)
  })
})
