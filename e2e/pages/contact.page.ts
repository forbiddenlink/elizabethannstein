import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ContactPage extends BasePage {
  // Form field selectors based on ContactForm.tsx
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly messageInput: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly errorMessage: Locator
  readonly copyButton: Locator
  readonly sendAnotherButton: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.locator('input#name')
    this.emailInput = page.locator('input#email')
    this.messageInput = page.locator('textarea#message')
    this.submitButton = page.locator('button[type="submit"]')
    this.successMessage = page.locator('text=Email client opened!')
    this.errorMessage = page.locator('text=Something went wrong')
    this.copyButton = page.locator('button:has-text("Copy message")')
    this.sendAnotherButton = page.locator('text=Send another message')
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact')
  }

  async fillForm(data: { name: string; email: string; message: string }): Promise<void> {
    await this.nameInput.fill(data.name)
    await this.emailInput.fill(data.email)
    await this.messageInput.fill(data.message)
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

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible()
  }

  async clickSendAnother(): Promise<void> {
    await this.sendAnotherButton.click()
  }

  async getValidationMessage(field: 'name' | 'email' | 'message'): Promise<string> {
    const locator = field === 'name' ? this.nameInput
      : field === 'email' ? this.emailInput
      : this.messageInput
    return locator.evaluate((el: HTMLInputElement | HTMLTextAreaElement) => el.validationMessage)
  }
}
