/**
 * The "E" mark shared by icon.tsx, apple-icon.tsx, public/favicon.svg and the PNG icon
 * generator (scripts/generate-icons.ts). Flat paper on cobalt, same colors as the editorial
 * system. The social cards use src/lib/ogCard.tsx, not this file.
 */

const PAPER = '#efeadf'
const ACCENT = '#1b34c9'

/** The "E" mark: three arms on a stem, flat paper on cobalt. Same geometry as public/favicon.svg. */
export function Mark({ size }: { size: number }) {
  const u = size / 32
  const bar = (x: number, y: number, w: number, h: number) => (
    <div
      style={{
        position: 'absolute',
        left: x * u,
        top: y * u,
        width: w * u,
        height: h * u,
        backgroundColor: PAPER,
      }}
    />
  )
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: ACCENT,
      }}
    >
      {bar(9, 7, 4, 18)}
      {bar(9, 7, 14, 4)}
      {bar(9, 14, 12, 4)}
      {bar(9, 21, 14, 4)}
    </div>
  )
}
