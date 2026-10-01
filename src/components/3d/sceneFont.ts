/**
 * Font for every drei <Text> in the 3D scene.
 *
 * Without an explicit `font`, troika-three-text resolves glyphs through
 * unicode-font-resolver, which fetches its data from cdn.jsdelivr.net. The site CSP
 * (connect-src 'self' ...) blocks that fetch, drei's suspend() never resolves, and the single
 * <Suspense> around the whole galaxy never mounts: no starfield, no galaxies, no planets.
 *
 * A self-hosted font that covers every glyph keeps troika off the CDN entirely. The bundled
 * Roboto subset is printable ASCII only, so route text through `toSceneText` first: one
 * glyph outside the subset sends troika back to the CDN fallback and re-creates the hang.
 */
export const SCENE_FONT = '/fonts/roboto-regular.woff'

const REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[‘’]/g, "'"],
  [/[“”]/g, '"'],
  [/[–—−]/g, '-'],
  [/…/g, '...'],
  [/[·•]/g, '-'],
  [/→/g, '->'],
  [/ /g, ' '],
]

/** Reduce text to printable ASCII so it renders from SCENE_FONT without a CDN fallback. */
export function toSceneText(text: string): string {
  let out = text
  for (const [pattern, replacement] of REPLACEMENTS) out = out.replace(pattern, replacement)
  return out
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\x20-\x7E\n]/g, '')
}
