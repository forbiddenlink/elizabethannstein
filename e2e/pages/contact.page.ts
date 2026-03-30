import { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

export class ContactPage extends BasePage {
  // Form field selectors based on ContactForm.tsx
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly messageInput: Locator
  readonly submitButton: Locator
  readonly draftReadyMessage: Locator
  readonly openEmailAppLink: Locator
  readonly copyButton: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.locator('input#name')
    this.emailInput = page.locator('input#email')
    this.messageInput = page.locator('textarea#message')
    this.submitButton = page.locator('button[type="submit"]')
    this.draftReadyMessage = page.locator('text=Message ready to send')
    this.openEmailAppLink = page.locator('a:has-text("Open email app")')
    this.copyButton = page.locator('button:has-text("Copy message")')
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

  async isDraftReadyVisible(): Promise<boolean> {
    return this.draftReadyMessage.isVisible()
  }

  async getValidationMessage(field: 'name' | 'email' | 'message'): Promise<string> {
    const locator =
      field === 'name' ? this.nameInput : field === 'email' ? this.emailInput : this.messageInput
    return locator.evaluate((el: HTMLInputElement | HTMLTextAreaElement) => el.validationMessage)
  }
}
