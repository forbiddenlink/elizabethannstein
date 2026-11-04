import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * Shared social card for the home page, the content pages, and every project page. It
 * uses the editorial system (fog ground, ink, teal accent, Young Serif + Onest)
 * so a shared link looks like the site it opens.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

const PAPER = '#DCDEE1'
const PAPER_2 = '#D1D4D8'
const INK = '#101114'
const INK_2 = '#32363d'
const ACCENT = '#0C5C5C'

async function loadFonts() {
  const dir = join(process.cwd(), 'src/app/og-fonts')
  const [display, sans] = await Promise.all([
    readFile(join(dir, 'YoungSerif-400.ttf')),
    readFile(join(dir, 'Onest-400.ttf')),
  ])
  return [
    { name: 'Young Serif', data: display, style: 'normal' as const, weight: 400 as const },
    { name: 'Onest', data: sans, style: 'normal' as const, weight: 400 as const },
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
        fontFamily: 'Onest',
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
        <span style={{ fontFamily: 'Young Serif', fontSize: 30 }}>Elizabeth Stein</span>
        <span style={{ color: INK_2 }}>elizabethannstein.com</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow ? (
          <span style={{ fontSize: 28, color: ACCENT, marginBottom: 16 }}>{eyebrow}</span>
        ) : null}
        <span
          style={{
            fontFamily: 'Young Serif',
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
              fontFamily: 'Onest',
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
