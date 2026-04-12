import { defineConfig, devices } from '@playwright/test'

const e2ePort = process.env.PLAYWRIGHT_PORT || '3100'
const baseURL = process.env.BASE_URL || `http://127.0.0.1:${e2ePort}`
const isCI = !!process.env.CI

/** Exclude visual regression specs from multi-browser runs — snapshots are Chrome-only in `visual` project */
const ignoreVisualDir = /\/e2e\/visual\//

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Configure visual regression snapshot settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },

  projects: [
    // Visual regression tests on Chrome (stable baseline)
    {
      name: 'visual',
      testDir: './e2e/visual',
      use: {
        ...devices['Desktop Chrome'],
        // Consistent viewport for snapshots
        viewport: { width: 1280, height: 720 },
      },
    },
    // Smoke tests run first on Chrome only
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Regression tests on multiple browsers
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewport tests
    {
      name: 'mobile-chrome',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Local: dev server with reuse. CI: production server (run `pnpm build` first).
  webServer: isCI
    ? {
        command: `pnpm exec next start -H 127.0.0.1 -p ${e2ePort}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180 * 1000,
      }
    : {
        command: `pnpm dev --hostname 127.0.0.1 --port ${e2ePort}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
})
