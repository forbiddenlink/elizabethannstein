import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { ReactElement } from 'react'

/**
 * Shared social-card system for opengraph-image, /api/og/default and /api/og/[slug].
 * Flat paper / ink / cobalt from src/styles/editorial.css (light theme), Fraunces +
 * Space Grotesk + JetBrains Mono, no gradients, no glow, no radius. A social card has no
 * theme toggle, so it always uses the light tokens.
 *
 * Satori reads TTF only (not the woff2 that next/font ships), so the three faces are
 * committed under ./fonts (SIL OFL, from Google Fonts).
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

export const OG = {
  paper: '#efeadf',
  paper2: '#e6e0d2',
  ink: '#191510',
  ink2: '#4d473b',
  muted: '#5d574c',
  rule: '#cfc7b4',
  accent: '#1b34c9',
} as const

const DISPLAY = 'Fraunces'
const SANS = 'Space Grotesk'
const MONO = 'JetBrains Mono'

// Read from disk rather than fetch(new URL(..., import.meta.url)): Node's fetch cannot load
// file: URLs during the static-generation build. next.config.mjs adds these files to the
// output trace for the routes that render cards, so they ship to the serverless bundle.
const FONT_DIR = join(process.cwd(), 'src/lib/og/fonts')

async function loadFonts() {
  const [fraunces, grotesk, mono] = await Promise.all([
    readFile(join(FONT_DIR, 'Fraunces-600.ttf')),
    readFile(join(FONT_DIR, 'SpaceGrotesk-500.ttf')),
    readFile(join(FONT_DIR, 'JetBrainsMono-500.ttf')),
  ])
  return [
    { name: DISPLAY, data: fraunces, weight: 600 as const, style: 'normal' as const },
    { name: SANS, data: grotesk, weight: 500 as const, style: 'normal' as const },
    { name: MONO, data: mono, weight: 500 as const, style: 'normal' as const },
  ]
}

/** Renders a card element to an ImageResponse with the editorial fonts attached. */
export async function renderCard(card: ReactElement): Promise<ImageResponse> {
  return new ImageResponse(card, { ...OG_SIZE, fonts: await loadFonts() })
}

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
        backgroundColor: OG.paper,
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
        backgroundColor: OG.accent,
      }}
    >
      {bar(9, 7, 4, 18)}
      {bar(9, 7, 14, 4)}
      {bar(9, 14, 12, 4)}
      {bar(9, 21, 14, 4)}
    </div>
  )
}

interface FrameProps {
  /** Mono dateline at the top right (host, years). */
  dateline: string
  /** Left label beside the mark. */
  label: string
  children: React.ReactNode
  /** Mono footer line, left. */
  footerLeft: string
  /** Mono footer line, right. */
  footerRight: string
}

/** Paper page with a masthead rule, a body slot and a colophon rule. */
export function Frame({ dateline, label, children, footerLeft, footerRight }: FrameProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: OG.paper,
        color: OG.ink,
        padding: '48px 64px',
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 24,
          borderBottom: `3px solid ${OG.ink}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Mark size={44} />
          <div style={{ display: 'flex', marginLeft: 16, fontSize: 30, fontWeight: 500 }}>
            {label}
          </div>
        </div>
        <div style={{ display: 'flex', fontFamily: MONO, fontSize: 22, color: OG.muted }}>
          {dateline}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {children}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 20,
          borderTop: `1px solid ${OG.rule}`,
          fontFamily: MONO,
          fontSize: 22,
          color: OG.muted,
        }}
      >
        <div style={{ display: 'flex' }}>{footerLeft}</div>
        <div style={{ display: 'flex' }}>{footerRight}</div>
      </div>
    </div>
  )
}

export function Display({ children, size }: { children: React.ReactNode; size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: '-0.02em',
        color: OG.ink,
      }}
    >
      {children}
    </div>
  )
}

export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: 20,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 34,
        lineHeight: 1.25,
        color: OG.ink2,
      }}
    >
      {children}
    </div>
  )
}

/** Flat label chip: 2px ink border, no radius. */
export function Chip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '6px 16px',
        marginRight: 12,
        border: `2px solid ${accent ? OG.accent : OG.ink}`,
        color: accent ? OG.accent : OG.ink,
        fontFamily: MONO,
        fontSize: 22,
      }}
    >
      {children}
    </div>
  )
}

/** Home / default card. Copy is lifted from the home standfirst and SITE constants. */
export function HomeCard({ host }: { host: string }) {
  return (
    <Frame
      label="Elizabeth Stein"
      dateline={host}
      footerLeft="Full-Stack Engineer"
      footerRight="Power Platform · Next.js · AI"
    >
      <Display size={96}>Software that is running in production.</Display>
      <Sub>
        Sole developer on a Dynamics 365 platform for a cybersecurity nonprofit. Algolia Agent
        Studio winner. Eleven client sites on Craft CMS.
      </Sub>
    </Frame>
  )
}
