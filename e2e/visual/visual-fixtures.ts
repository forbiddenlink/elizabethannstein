import { test as base } from '@playwright/test'

/**
 * Playwright's bundled Chromium crashes its renderer while decoding the AVIF
 * that `next/image` serves, which took out every `/about` visual run and is why
 * `update-snapshots.yml` has never completed. Isolated with a three-arm probe
 * against the same build: loading /about normally crashed, blocking all images
 * passed, blocking only `/_next/image**` passed, and rebuilding with
 * `formats: ['image/webp']` passed.
 *
 * Production keeps AVIF. elizabethannstein.com serves it today
 * (`content-type: image/avif`, 10KB for the profile photo) and real browsers
 * decode it, so the workaround belongs in the browser under test rather than in
 * next.config.mjs, where it would cost every visitor the smaller format.
 */
export const test = base.extend<{ avifWorkaround: void }>({
  avifWorkaround: [
    async ({ page }, use) => {
      await page.route('**/_next/image**', async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), accept: 'image/webp,image/*,*/*;q=0.8' },
        })
      })
      await use()
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
