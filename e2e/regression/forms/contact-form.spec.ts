/**
 * Contact Form Regression Tests
 *
 * Priority: P1 - High
 * Category: Form Validation
 *
 * Validates:
 * - Required field validation
 * - Email format validation
 * - Draft preparation flow
 * - Honest follow-up actions
 */

import { expect, test } from '../../fixtures/test-fixtures'

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

  test('submit button prepares the draft actions after submission', async ({
    contactPage,
    page,
  }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    await expect(page.locator('text=Message ready to send')).toBeVisible({ timeout: 5000 })
  })

  test('shows open email action after submission', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    await expect(contactPage.draftReadyMessage).toBeVisible({ timeout: 5000 })
    await expect(contactPage.openEmailAppLink).toBeVisible()
  })

  test('form remains editable after the draft is prepared', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
    await contactPage.submitForm()

    await expect(contactPage.nameInput).toBeVisible()
    await expect(contactPage.nameInput).toHaveValue('Test User')
    await expect(contactPage.draftReadyMessage).toBeVisible()
  })

  test('copy button appears in draft-ready state', async ({ contactPage }) => {
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
    await contactPage.submitForm()

    await expect(contactPage.draftReadyMessage).toBeVisible({ timeout: 5000 })
    await expect(contactPage.copyButton).toBeVisible()
  })
})
