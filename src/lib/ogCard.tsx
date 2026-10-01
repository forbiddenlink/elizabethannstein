import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * Shared social card for the home page, the content pages, and every project page. It
 * uses the editorial system (cream paper, ink, cobalt accent, Fraunces + Space Grotesk)
 * so a shared link looks like the site it opens.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

const PAPER = '#efeadf'
const PAPER_2 = '#e6e0d2'
const INK = '#191510'
const INK_2 = '#4d473b'
const ACCENT = '#1b34c9'

async function loadFonts() {
  const dir = join(process.cwd(), 'src/app/og-fonts')
  const [display, sans] = await Promise.all([
    readFile(join(dir, 'Fraunces-400.woff')),
    readFile(join(dir, 'SpaceGrotesk-400.woff')),
  ])
  return [
    { name: 'Fraunces', data: display, style: 'normal' as const, weight: 400 as const },
    { name: 'Space Grotesk', data: sans, style: 'normal' as const, weight: 400 as const },
  ]
}

export interface OgCardProps {
  /** Small label above the title, e.g. the project's category. */
  eyebrow?: string
  title: string
  /** One plain sentence under the title. */
  subtitle?: string
  /** Up to four short facts shown as a row (stack, status, year). */
  facts?: readonly string[]
}

export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  facts = [],
}: OgCardProps): Promise<ImageResponse> {
  const fonts = await loadFonts()
  const titleSize = title.length > 28 ? 76 : 96

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: PAPER,
        color: INK,
        fontFamily: 'Space Grotesk',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
          borderBottom: `2px solid ${INK}`,
          fontSize: 26,
        }}
      >
        <span style={{ fontFamily: 'Fraunces', fontSize: 30 }}>Elizabeth Stein</span>
        <span style={{ color: INK_2 }}>elizabethannstein.com</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow ? (
          <span style={{ fontSize: 28, color: ACCENT, marginBottom: 16 }}>{eyebrow}</span>
        ) : null}
        <span
          style={{
            fontFamily: 'Fraunces',
            fontSize: titleSize,
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
        {subtitle ? (
          <span
            style={{
              fontFamily: 'Fraunces',
              fontSize: 34,
              lineHeight: 1.35,
              color: INK_2,
              marginTop: 24,
              maxWidth: 980,
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 14, minHeight: 52 }}>
        {facts.slice(0, 4).map((fact) => (
          <span
            key={fact}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 18px',
              border: `1px solid ${INK}`,
              backgroundColor: PAPER_2,
              fontSize: 24,
            }}
          >
            {fact}
          </span>
        ))}
      </div>
    </div>,
    { ...OG_SIZE, fonts }
  )
}
