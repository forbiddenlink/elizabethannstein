import { Page, Locator } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path)
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }

  async hasNoConsoleErrors(): Promise<boolean> {
    const errors: string[] = []
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    await this.page.waitForTimeout(500)
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    )
    return criticalErrors.length === 0
  }
}
