import { Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string = '/'): Promise<void> {
    await this.page.addInitScript(() => {
      globalThis.localStorage.setItem('ea-has-visited', 'true')
    })
    await this.page.goto(path)
    await this.dismissEntranceIfVisible()
  }

  protected async dismissEntranceIfVisible(): Promise<void> {
    const skipIntroButton = this.page.getByRole('button', { name: /Skip intro/i })
    await this.page.waitForTimeout(250)

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const isVisible = await skipIntroButton.isVisible({ timeout: 250 }).catch(() => false)
      if (!isVisible) break

      await skipIntroButton.click({ force: true }).catch(() => undefined)
      await this.page.waitForTimeout(120)
    }
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
    const criticalErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('404'))
    return criticalErrors.length === 0
  }
}
