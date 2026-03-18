import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class WorkPage extends BasePage {
  readonly projectCards: Locator
  readonly pageTitle: Locator
  readonly projectLinks: Locator

  constructor(page: Page) {
    super(page)
    this.projectCards = page.locator('[data-testid="project-card"]')
    this.pageTitle = page.locator('h1')
    this.projectLinks = page.locator('a[href^="/work/"]')
  }

  async goto(): Promise<void> {
    await this.page.goto('/work')
  }

  async getProjectCount(): Promise<number> {
    return this.projectLinks.count()
  }

  async clickProject(slug: string): Promise<void> {
    await this.page.locator(`a[href="/work/${slug}"]`).first().click()
  }

  async isOnProjectPage(slug: string): Promise<boolean> {
    return this.page.url().includes(`/work/${slug}`)
  }
}
