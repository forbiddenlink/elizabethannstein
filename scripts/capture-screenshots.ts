/**
 * Capture screenshots for portfolio projects that have live URLs but no existing screenshot.
 *
 * Usage:
 *   pnpm exec playwright test scripts/capture-screenshots.ts
 *   OR: npx tsx scripts/capture-screenshots.ts
 *
 * Prerequisites: pnpm exec playwright install chromium
 */

import { chromium } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Projects with live URLs — manually extracted from galaxyData.ts
// Only includes projects that DON'T already have screenshots
const PROJECTS_TO_CAPTURE: { id: string; url: string }[] = [
  // AI
  { id: 'codebase-onboarding-tool', url: 'https://codebase-onboarding-tool.vercel.app' },
  { id: 'explainthiscode', url: 'https://explainthiscode.ai' },
  { id: 'autodocs-ai', url: 'https://automadocs.com' },
  { id: 'mcp-server-studio', url: 'https://mcp-server-studio.vercel.app' },
  { id: 'interview-ace', url: 'https://interview-ace-self.vercel.app' },
  { id: 'storyvision', url: 'https://storyvision-tawny.vercel.app' },
  // Full-Stack
  { id: 'hire-ready', url: 'https://imhireready.com' },
  { id: 'ucp-guard', url: 'https://ucpguard.com' },
  { id: 'site-sheriff', url: 'https://site-sheriff.vercel.app' },
  { id: 'willwise', url: 'https://willwise-app.vercel.app' },
  { id: 'aqualog', url: 'https://myaqualog.com' },
  { id: 'dareuradio', url: 'https://dareuradio.com' },
  { id: 'testimoniq', url: 'https://testimoniq.com' },
  { id: 'dwello', url: 'https://dwello.vercel.app' },
  { id: 'carefulship', url: 'https://carefulship.com' },
  // DevTools
  { id: 'accessibility-checker', url: 'https://accessibiliy-checker.vercel.app' },
  { id: 'consent-compass', url: 'https://consent-compass.vercel.app' },
  { id: 'rocket-vitals', url: 'https://rocket-vitals.vercel.app' },
  // Design
  { id: 'codecraft-dev', url: 'https://codecraft-dev-one.vercel.app' },
  { id: 'color-studio', url: 'https://color-studio-mu.vercel.app' },
  { id: 'space-travel', url: 'https://space-travel-website-theta.vercel.app' },
  // Experimental
  { id: 'ocean-simulator', url: 'https://ocean-simulator-silk.vercel.app' },
  { id: 'competitor-stalker', url: 'https://competitor-stalker.vercel.app' },
  { id: 'cereal-tasting', url: 'https://cereal-tasting.vercel.app' },
  { id: 'constellation-events', url: 'https://constellation-events.vercel.app' },
  { id: 'app-idea-miner', url: 'https://app-idea-miner.vercel.app' },
  { id: 'ai-spend-tracker', url: 'https://ai-spend-tracker.vercel.app' },
]

const SCREENSHOT_DIR = resolve(process.cwd(), 'public/screenshots')

async function main() {
  if (!existsSync(SCREENSHOT_DIR)) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  })

  let captured = 0
  let skipped = 0
  let failed = 0

  for (const project of PROJECTS_TO_CAPTURE) {
    const outPath = resolve(SCREENSHOT_DIR, `${project.id}.png`)

    // Skip if already exists (check both png and webp)
    if (existsSync(outPath) || existsSync(outPath.replace('.png', '.webp'))) {
      console.log(`  SKIP ${project.id} (already exists)`)
      skipped++
      continue
    }

    try {
      const page = await context.newPage()
      console.log(`  CAPTURE ${project.id} → ${project.url}`)
      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 30000 })
      // Wait for any animations/transitions to settle
      await page.waitForTimeout(2000)
      await page.screenshot({ path: outPath, type: 'png' })
      await page.close()
      captured++
    } catch (err) {
      console.error(`  FAIL ${project.id}: ${(err as Error).message}`)
      failed++
    }
  }

  await browser.close()

  console.log(`\nDone: ${captured} captured, ${skipped} skipped, ${failed} failed`)
  console.log(`\nNext step: Add new screenshots to PROJECT_SCREENSHOTS map in WorkPageClient.tsx`)
}

main()
