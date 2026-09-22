import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

export class ContactPage extends BasePage {
  // Form field selectors based on ContactForm.tsx
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly messageInput: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly sendAnotherButton: Locator
  readonly errorAlert: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.locator('input#name')
    this.emailInput = page.locator('input#email')
    this.messageInput = page.locator('textarea#message')
    this.submitButton = page.locator('button[type="submit"]')
    // The form POSTs to /api/contact and swaps itself for a success panel.
    // The old "draft-ready / open email app / copy message" locators pointed at
    // a mailto-draft flow that no longer exists anywhere in src/.
    this.successMessage = page.getByRole('status').filter({ hasText: 'Message received.' })
    this.sendAnotherButton = page.getByRole('button', { name: /Send another/i })
    // Scoped to the form: Next.js renders its own always-present
    // `#__next-route-announcer__` with role="alert", which makes an unscoped
    // getByRole('alert') ambiguous under strict mode.
    this.errorAlert = page.locator('form [role="alert"]')
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact')
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(200)
  }

  async fillForm(data: { name: string; email: string; message: string }): Promise<void> {
    const fillAndVerify = async (locator: Locator, value: string) => {
      await locator.fill(value)
      if ((await locator.inputValue()) !== value) {
        await locator.fill(value)
      }
    }

    await fillAndVerify(this.emailInput, data.email)
    await fillAndVerify(this.messageInput, data.message)
    await fillAndVerify(this.nameInput, data.name)
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click()
  }

  async isFormVisible(): Promise<boolean> {
    return this.nameInput.isVisible()
  }

  async isSuccessVisible(): Promise<boolean> {
    return this.successMessage.isVisible()
  }

  /**
   * Stub the send endpoint. Without this the suite's outcome depends on whether
   * a RESEND_API_KEY happens to be loaded, and a run with one fires real mail
   * to the live inbox — which is exactly what happened on 2026-09-22.
   */
  async stubContactApi(body: object = { ok: true }, status = 200): Promise<void> {
    await this.page.route('**/api/contact', (route) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    )
  }

  async getValidationMessage(field: 'name' | 'email' | 'message'): Promise<string> {
    const locator =
      field === 'name' ? this.nameInput : field === 'email' ? this.emailInput : this.messageInput
    return locator.evaluate((el: HTMLInputElement | HTMLTextAreaElement) => el.validationMessage)
  }
}
