import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProjectModal extends BasePage {
  // Selectors based on ProjectModal.tsx
  readonly modalBackdrop: Locator
  readonly modalContent: Locator
  readonly closeButton: Locator
  readonly viewFullPageLink: Locator

  constructor(page: Page) {
    super(page)
    this.modalBackdrop = page.locator('[role="dialog"]')
    this.modalContent = page.locator('[role="dialog"] > div').last()
    this.closeButton = page.locator('button[aria-label="Close modal"]')
    this.viewFullPageLink = page.locator('a:has-text("View full page")')
  }

  async openViaUrl(projectSlug: string): Promise<void> {
    await this.page.goto(`/?p=${projectSlug}`)
    await this.modalBackdrop.waitFor({ state: 'visible', timeout: 10000 })
  }

  async close(): Promise<void> {
    await this.closeButton.click()
    await this.modalBackdrop.waitFor({ state: 'hidden' })
  }

  async closeViaEscape(): Promise<void> {
    await this.page.keyboard.press('Escape')
    await this.modalBackdrop.waitFor({ state: 'hidden' })
  }

  async closeViaBackdrop(): Promise<void> {
    // Click on the backdrop (not the content)
    await this.modalBackdrop.click({ position: { x: 10, y: 10 } })
    await this.modalBackdrop.waitFor({ state: 'hidden' })
  }

  async isOpen(): Promise<boolean> {
    return this.modalBackdrop.isVisible()
  }

  async navigateToFullPage(): Promise<void> {
    await this.viewFullPageLink.click()
  }

  async getProjectTitle(): Promise<string> {
    const heading = this.page.locator('[role="dialog"] h1, [role="dialog"] h2').first()
    const text = await heading.textContent()
    return text ?? ''
  }
}
