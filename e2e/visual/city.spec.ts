import { expect, test } from './visual-fixtures'

test('/city renders a 3D canvas', async ({ page }) => {
  await page.goto('/city')
  const canvas = page.locator('canvas')
  await expect(canvas.first()).toBeVisible({ timeout: 15000 })
})

/**
 * Structure positions come from `src/lib/city/snapshot.json`, which
 * `pnpm city:snapshot` regenerates from real fleet data, so any single
 * hardcoded coordinate goes stale as soon as that data moves. This test used
 * one such coordinate (0.63, 0.63) and had started missing every time.
 *
 * A 144-point sweep of the canvas hit a structure at 27 of them, so the scene
 * and the raycast are healthy and a handful of candidates is enough. Each entry
 * below is a point that sweep confirmed as a hit.
 */
const STRUCTURE_CANDIDATES: ReadonlyArray<readonly [number, number]> = [
  [0.6, 0.6],
  [0.7, 0.5],
  [0.4, 0.65],
  [0.35, 0.35],
  [0.75, 0.55],
  [0.6, 0.35],
]

test('/city shows info panel after clicking a structure', async ({ page }) => {
  await page.goto('/city')
  const canvas = page.locator('canvas').first()
  await expect(canvas).toBeVisible({ timeout: 15000 })
  const box = await canvas.boundingBox()
  if (!box) throw new Error('no canvas box')

  const panel = page.getByTestId('city-info-panel')
  let opened = false
  for (const [fx, fy] of STRUCTURE_CANDIDATES) {
    await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy)
    if (await panel.isVisible().catch(() => false)) {
      opened = true
      break
    }
  }

  expect(
    opened,
    `Clicked ${STRUCTURE_CANDIDATES.length} points that previously hit a structure and none opened the panel. Either the camera framing moved or the scene stopped rendering structures.`
  ).toBe(true)
  await expect(panel).toBeVisible()
})
