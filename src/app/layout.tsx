import '@/app/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Analytics } from '@/components/Analytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AchievementToastManager } from '@/components/ui/AchievementToast'
import { CommandPaletteLoader } from '@/components/ui/CommandPaletteLoader'
import { GalaxyChrome } from '@/components/ui/GalaxyChrome'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { CONTACT, SITE } from '@/lib/constants'
import { THEME_STORAGE_KEY } from '@/lib/theme'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  // Fraunces is the editorial pages' reading-body font (--le-display in editorial.css),
  // so it paints on nearly every line of text. Leaving it unpreloaded meant the swap
  // from the fallback landed late on long pages like /work, producing a large CLS
  // (0.32, "poor") as dozens of case-study rows reflowed at once.
  preload: true,
  adjustFontFallback: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // editorial.css --le-paper, light and dark
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efeadf' },
    { media: '(prefers-color-scheme: dark)', color: '#141109' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: SITE.fullTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: '/',
  },
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: `${SITE.name} Portfolio`,
    title: SITE.fullTitle,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.fullTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.fullTitle,
    description: SITE.shortDescription,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.title,
    description: SITE.shortDescription,
    knowsAbout: [...SITE.knowsAbout],
    sameAs: [CONTACT.github, CONTACT.linkedin, 'https://imkindageeky.com'],
  },
}

// Standalone top-level Person schema (same @id as the ProfilePage's mainEntity above).
// Scanners that check brand-entity structured data look for a top-level Organization/
// LocalBusiness/Person @type and don't all descend into `mainEntity`, so this exists
// alongside — not instead of — the nested one.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/opengraph-image`,
  jobTitle: SITE.title,
  description: SITE.shortDescription,
  knowsAbout: [...SITE.knowsAbout],
  sameAs: [CONTACT.github, CONTACT.linkedin, 'https://imkindageeky.com'],
}

// WebSite schema enables rich results + sitelinks in Google
const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: `${SITE.name} Portfolio`,
  url: SITE.url,
  description: SITE.description,
  author: { '@id': `${SITE.url}/#person` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.url}/work?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Applies a saved theme choice before first paint so a returning dark-theme visitor never
// sees a light flash. Without a saved choice the editorial CSS follows prefers-color-scheme.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user input */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Resource hints for faster external requests */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Identity verification across platforms (rel=me) — AX readiness */}
        <link rel="me" href={CONTACT.github} />
        <link rel="me" href={CONTACT.linkedin} />
        <link rel="me" href={`mailto:${CONTACT.email}`} />
        {/* LLM-optimized content discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-optimized content" />
        {/* AI agent hints */}
        <meta name="ai:summary" content={SITE.shortDescription} />
        <meta name="ai:content_type" content="website" />
        <meta name="ai:author" content={SITE.name} />
      </head>
      <body
        suppressHydrationWarning
        className={`bg-black text-white antialiased font-sans ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
      >
        {/* Galaxy ambient chrome (grain, cursor, warp) — only on the /explore showcase */}
        <GalaxyChrome />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <NuqsAdapter>
          <SmoothScroll />
          <AchievementToastManager />
          <CommandPaletteLoader />
          <Analytics />
          <ErrorBoundary>{children}</ErrorBoundary>
          <VercelAnalytics />
          <SpeedInsights />
        </NuqsAdapter>
      </body>
    </html>
  )
}
