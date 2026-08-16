import { expect, test } from '@playwright/test'

test('/city renders a 3D canvas', async ({ page }) => {
  await page.goto('/city')
  const canvas = page.locator('canvas')
  await expect(canvas.first()).toBeVisible({ timeout: 15000 })
})

test('/city shows info panel after clicking a structure', async ({ page }) => {
  await page.goto('/city')
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15000 })
  const box = await page.locator('canvas').first().boundingBox()
  if (!box) throw new Error('no canvas box')
  // Click the structure cluster (not dead center — camera framing puts it lower-right of canvas center).
  await page.mouse.click(box.x + box.width * 0.63, box.y + box.height * 0.63)
  await expect(page.getByTestId('city-info-panel')).toBeVisible({ timeout: 5000 })
})
