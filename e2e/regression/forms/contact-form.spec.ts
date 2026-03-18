/**
 * Contact Form Regression Tests
 *
 * Priority: P1 - High
 * Category: Form Validation
 *
 * Validates:
 * - Required field validation
 * - Email format validation
 * - Form submission flow
 * - Success/error states
 */

import { test, expect } from '../../fixtures/test-fixtures'

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.goto()
  })

  test('shows validation error for empty name', async ({ contactPage, page }) => {
    // Fill email and message, leave name empty
    await contactPage.fillForm({
      name: '',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    // Browser should show validation message
    const validationMessage = await contactPage.getValidationMessage('name')
    expect(validationMessage).toBeTruthy()
  })

  test('shows validation error for empty email', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: '',
      message: 'Test message',
    })

    await contactPage.submitForm()

    const validationMessage = await contactPage.getValidationMessage('email')
    expect(validationMessage).toBeTruthy()
  })

  test('shows validation error for invalid email format', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'not-an-email',
      message: 'Test message',
    })

    await contactPage.submitForm()

    const validationMessage = await contactPage.getValidationMessage('email')
    expect(validationMessage).toContain('email')
  })

  test('shows validation error for empty message', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: '',
    })

    await contactPage.submitForm()

    const validationMessage = await contactPage.getValidationMessage('message')
    expect(validationMessage).toBeTruthy()
  })

  test('submit button shows loading state during submission', async ({ contactPage, page }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    // Click submit (don't await completion)
    await contactPage.submitButton.click()

    // Should show loading text
    await expect(page.locator('text=Opening email')).toBeVisible({ timeout: 2000 })
  })

  test('shows success state after submission', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    // Wait for success state
    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })
  })

  test('can send another message after success', async ({ contactPage }) => {
    // First submission
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
    await contactPage.submitForm()

    // Wait for success
    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })

    // Click "Send another message"
    await contactPage.clickSendAnother()

    // Form should be visible again
    await expect(contactPage.nameInput).toBeVisible()
    await expect(contactPage.nameInput).toHaveValue('')
  })

  test('copy button appears in success state', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
    await contactPage.submitForm()

    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })
    await expect(contactPage.copyButton).toBeVisible()
  })
})
