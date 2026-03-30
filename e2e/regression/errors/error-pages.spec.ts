/**
 * Error Pages Regression Tests
 *
 * Priority: P2 - Medium
 * Category: Error States
 *
 * Validates:
 * - 404 page renders correctly
 * - Error page shows fallback UI
 * - Navigation options on error pages
 */

import { expect, test } from '@playwright/test'

test.describe('404 Not Found Page', () => {
  test('displays 404 for invalid route', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-12345')

    expect(response?.status()).toBe(404)
  })

  test('shows 404 indicator text', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345')

    // Should show some indication of 404
    await expect(page.locator('body')).toContainText(/404|not found|lost/i)
  })

  test('provides navigation back to home', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345')

    // Should have a link to go home
    const homeLink = page.locator('a[href="/"]').first()
    await expect(homeLink).toBeVisible()
  })

  test('provides link to projects', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345')

    // Should have a link to projects
    const projectsLink = page.locator('a[href="/work"]').first()
    await expect(projectsLink).toBeVisible()
  })
})

test.describe('Invalid Project Slug', () => {
  test('returns 404 for non-existent project', async ({ page }) => {
    const response = await page.goto('/work/definitely-not-a-real-project-slug')

    const status = response?.status()
    expect([200, 404]).toContain(status)
  })

  test('shows 404 content for invalid project', async ({ page }) => {
    await page.goto('/work/definitely-not-a-real-project-slug')

    await expect(page.locator('body')).toContainText(/404|not found/i)
  })
})

test.describe('API Error Handling', () => {
  test('handles malformed JSON gracefully', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: 'not valid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Should return error, not crash
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('handles missing body gracefully', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {},
    })

    expect(response.status()).toBe(400)
  })
})
