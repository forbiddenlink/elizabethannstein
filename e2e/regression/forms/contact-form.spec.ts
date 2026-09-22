/**
 * Contact Form Regression Tests
 *
 * Priority: P1 - High
 * Category: Form Validation
 *
 * Validates:
 * - Required field validation
 * - Email format validation
 * - The success panel shown after a successful send
 * - The error alert shown when the send fails
 *
 * The send endpoint is stubbed in every test that submits. Rewritten
 * 2026-09-22: the previous versions asserted a "Message ready to send" mailto
 * draft flow that no longer exists in src/, and ran against the real
 * /api/contact, so a run with RESEND_API_KEY in the environment sent live mail.
 */

import { expect, test } from '../../fixtures/test-fixtures'

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.goto()
  })

  test('shows validation error for empty name', async ({ contactPage }) => {
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

  test('shows the success panel after a successful send', async ({ contactPage }) => {
    await contactPage.stubContactApi()
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })
  })

  test('the success panel names the address that will be replied to', async ({
    contactPage,
    page,
  }) => {
    await contactPage.stubContactApi()
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('offers a way back to an empty form', async ({ contactPage }) => {
    await contactPage.stubContactApi()
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
    await contactPage.submitForm()
    await expect(contactPage.successMessage).toBeVisible({ timeout: 5000 })

    await contactPage.sendAnotherButton.click()

    await expect(contactPage.nameInput).toBeVisible()
    await expect(contactPage.nameInput).toHaveValue('')
  })

  test('surfaces a server error instead of a false success', async ({ contactPage }) => {
    await contactPage.stubContactApi({ error: 'Failed to send email' }, 500)
    await contactPage.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    await contactPage.submitForm()

    await expect(contactPage.errorAlert).toBeVisible({ timeout: 5000 })
    await expect(contactPage.successMessage).toBeHidden()
  })
})
