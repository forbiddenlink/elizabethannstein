import { expect, test } from '@playwright/test'

test('/city renders a 3D canvas', async ({ page }) => {
  await page.goto('/city')
  const canvas = page.locator('canvas')
  await expect(canvas.first()).toBeVisible({ timeout: 15000 })
})
