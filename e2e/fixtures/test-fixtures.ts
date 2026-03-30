import { test as base, expect, Page } from '@playwright/test'

// Page object imports
import { ContactPage } from '../pages/contact.page'
import { HomePage } from '../pages/home.page'
import { ProjectModal } from '../pages/modal.page'
import { WorkPage } from '../pages/work.page'

// Extend base test with page objects
export const test = base.extend<{
  homePage: HomePage
  contactPage: ContactPage
  workPage: WorkPage
  projectModal: ProjectModal
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page))
  },
  workPage: async ({ page }, use) => {
    await use(new WorkPage(page))
  },
  projectModal: async ({ page }, use) => {
    await use(new ProjectModal(page))
  },
})

// Custom assertions
export { expect }

// Test data
export const testData = {
  projects: {
    featured: 'chronicle',
    sample: 'stancestream',
  },
  galaxies: ['enterprise', 'ai', 'fullstack', 'devtools', 'creative', 'experimental'],
  contact: {
    valid: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from Playwright automation.',
    },
    invalid: {
      emptyName: { name: '', email: 'test@example.com', message: 'Test' },
      emptyEmail: { name: 'Test', email: '', message: 'Test' },
      emptyMessage: { name: 'Test', email: 'test@example.com', message: '' },
      invalidEmail: { name: 'Test', email: 'not-an-email', message: 'Test' },
    },
  },
  chat: {
    validRequest: {
      messages: [{ role: 'user', content: 'Tell me about React projects' }],
    },
    invalidRequests: {
      emptyArray: { messages: [] },
      missingContent: { messages: [{ role: 'user' }] },
      missingRole: { messages: [{ content: 'test' }] },
      tooManyMessages: { messages: Array(51).fill({ role: 'user', content: 'x' }) },
      messageTooLong: { messages: [{ role: 'user', content: 'x'.repeat(2001) }] },
    },
  },
}

// Helper to check for console errors
export async function expectNoConsoleErrors(page: Page): Promise<void> {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  // Wait a moment for any async errors
  await page.waitForTimeout(500)

  // Filter out known acceptable errors (e.g., favicon 404)
  const criticalErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('404'))

  expect(criticalErrors).toHaveLength(0)
}

// Helper to wait for page to be fully loaded
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
}
