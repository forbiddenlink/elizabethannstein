/**
 * Contact Form Smoke Tests
 *
 * Priority: P0 - Critical
 * Run: Before every deploy
 *
 * Validates:
 * - Contact form renders with all fields
 * - Submit button is present and clickable
 */

import { test, expect } from '@playwright/test'

test.describe('Contact Form Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('contact form has all required fields', async ({ page }) => {
    // Name field
    const nameInput = page.locator('input#name')
    await expect(nameInput).toBeVisible()
    await expect(nameInput).toHaveAttribute('required', '')

    // Email field
    const emailInput = page.locator('input#email')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('required', '')

    // Message field
    const messageInput = page.locator('textarea#message')
    await expect(messageInput).toBeVisible()
    await expect(messageInput).toHaveAttribute('required', '')

    // Submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  test('form fields have correct placeholders', async ({ page }) => {
    const nameInput = page.locator('input#name')
    await expect(nameInput).toHaveAttribute('placeholder', 'Jane Smith')

    const emailInput = page.locator('input#email')
    await expect(emailInput).toHaveAttribute('placeholder', 'jane@company.com')

    const messageInput = page.locator('textarea#message')
    await expect(messageInput).toHaveAttribute('placeholder', /project|opportunity/i)
  })
})
