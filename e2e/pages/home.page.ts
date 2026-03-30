import { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  // Selectors based on actual component structure
  readonly commandPaletteBackdrop: Locator
  readonly commandPaletteModal: Locator
  readonly commandPaletteInput: Locator
  readonly commandPaletteCloseButton: Locator
  readonly commandPaletteResults: Locator

  constructor(page: Page) {
    super(page)
    this.commandPaletteBackdrop = page.locator('.command-palette-backdrop')
    this.commandPaletteModal = page.locator('.command-palette-modal')
    this.commandPaletteInput = page.locator('.command-palette-modal input[type="text"]')
    this.commandPaletteCloseButton = page.locator(
      '.command-palette-modal button[aria-label="Close command palette"]',
    )
    this.commandPaletteResults = page.locator('.command-palette-modal button[type="button"]')
  }

  async goto(): Promise<void> {
    await super.goto('/')
  }

  async openCommandPalette(): Promise<void> {
    await this.page.keyboard.press('Meta+k')
    await this.commandPaletteModal.waitFor({ state: 'visible' })
  }

  async closeCommandPalette(): Promise<void> {
    await this.page.keyboard.press('Escape')
    await this.commandPaletteModal.waitFor({ state: 'hidden' })
  }

  async searchInCommandPalette(query: string): Promise<void> {
    await this.commandPaletteInput.fill(query)
  }

  async selectFirstResult(): Promise<void> {
    await this.page.keyboard.press('Enter')
  }

  async navigateResultsDown(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press('ArrowDown')
    }
  }

  async isCommandPaletteVisible(): Promise<boolean> {
    return this.commandPaletteModal.isVisible()
  }

  async getResultCount(): Promise<number> {
    return this.commandPaletteResults.count()
  }
}
