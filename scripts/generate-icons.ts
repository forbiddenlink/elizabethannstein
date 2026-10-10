/**
 * Regenerates the brand mark assets from one geometry definition:
 *   public/favicon.svg, public/icons/icon-192.png, icon-512.png, icon-512-maskable.png
 *
 * Run: pnpm exec tsx scripts/generate-icons.ts
 *
 * The mark mirrors `Mark` in src/lib/og/ogKit.tsx (used by icon.tsx / apple-icon.tsx):
 * a flat paper "E" on cobalt, tokens from src/styles/editorial.css. Uses sharp, which is
 * already a dependency. The maskable icon is full-bleed with the glyph inside the 80%
 * safe zone, so any platform mask keeps it intact.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const PAPER = '#efeadf'
const COBALT = '#1b34c9'

// Glyph rects in a 32-unit box: [x, y, width, height]
const GLYPH: ReadonlyArray<readonly [number, number, number, number]> = [
  [9, 7, 4, 18],
  [9, 7, 14, 4],
  [9, 14, 12, 4],
  [9, 21, 14, 4],
]

function svg(px: number, glyphScale = 1): string {
  // Scale the glyph about the centre of the 32 box so maskable can shrink it.
  const inner = GLYPH.map(
    ([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}"/>`
  ).join('')
  const t = glyphScale === 1 ? '' : ` transform="translate(16 16) scale(${glyphScale}) translate(-16 -16)"`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 32 32"><rect width="32" height="32" fill="${COBALT}"/><g${t}>${inner}</g></svg>`
}

async function png(path: string, px: number, glyphScale = 1): Promise<void> {
  const buf = await sharp(Buffer.from(svg(px, glyphScale)), { density: 384 })
    .resize(px, px)
    .png()
    .toBuffer()
  await writeFile(path, buf)
  console.log(`wrote ${path} (${px}x${px})`)
}

async function main(): Promise<void> {
  const pub = join(process.cwd(), 'public')
  await mkdir(join(pub, 'icons'), { recursive: true })
  await writeFile(join(pub, 'favicon.svg'), `${svg(32).replace(' width="32" height="32"', '')}\n`)
  console.log('wrote public/favicon.svg')
  await png(join(pub, 'icons/icon-192.png'), 192)
  await png(join(pub, 'icons/icon-512.png'), 512)
  // 0.8 keeps the glyph (spans ~14 of 32 units, centred) well inside the maskable safe zone.
  await png(join(pub, 'icons/icon-512-maskable.png'), 512, 0.8)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
