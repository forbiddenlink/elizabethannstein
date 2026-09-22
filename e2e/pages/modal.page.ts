import type { Locator, Page } from '@playwright/test'
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

  /**
   * The galaxy moved from `/` to `/explore` in the 2026-08 redesign. `/?p=slug`
   * now hard-redirects to /work/[slug], so this must target /explore. The 3D
   * scene needs a generous window to mount before the modal exists.
   */
  async openViaUrl(projectSlug: string): Promise<void> {
    await super.goto(`/explore?p=${projectSlug}`)
    await this.modalBackdrop.waitFor({ state: 'visible', timeout: 30000 })
    // The entrance overlay sits at z-100, above the modal's z-50, and lingers
    // while it fades out. Clicking before it detaches hits the overlay instead
    // of the modal, which is what made the backdrop test flaky.
    await this.page
      .locator('div.z-\\[100\\]')
      .waitFor({ state: 'detached', timeout: 15000 })
      .catch(() => undefined)
  }

  async close(): Promise<void> {
    await this.closeButton.click()
    await this.modalBackdrop.waitFor({ state: 'hidden' })
  }

  /**
   * No fallback to the X button here on purpose. The old version fell back
   * after 2s, which meant a completely broken Escape key would still make this
   * pass — and then the fallback itself blew up once Escape started working,
   * because the button was already gone. Escape either closes the modal or the
   * test fails.
   */
  async closeViaEscape(): Promise<void> {
    await this.page.keyboard.press('Escape')
    await this.modalBackdrop.waitFor({ state: 'hidden', timeout: 15000 })
  }

  async closeViaBackdrop(): Promise<void> {
    // `modalBackdrop` is the dialog itself, which is centred and ~1024px wide,
    // so clicking at its (10, 10) landed INSIDE the dialog and closed nothing.
    // Click beside the dialog, which is what a visitor actually hits. The
    // backdrop element sits UNDER the full-size scroll container, so a forced
    // click on the backdrop never reaches the close handler; a real click in
    // the gutter bubbles through the scroll container to the same handler.
    // The point is computed from the dialog box rather than hardcoded, so it
    // cannot drift onto the dialog or onto the page chrome.
    const box = await this.modalBackdrop.boundingBox()
    if (!box) throw new Error('Project modal is not on screen')
    const viewport = this.page.viewportSize()
    const y = viewport ? Math.round(viewport.height / 2) : 300
    await this.page.mouse.click(Math.max(4, Math.round(box.x / 2)), y)
    await this.modalBackdrop.waitFor({ state: 'hidden', timeout: 15000 })
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
