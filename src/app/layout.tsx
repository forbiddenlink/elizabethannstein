import '@/app/globals.css'
import { Analytics } from '@/components/Analytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AchievementToastManager } from '@/components/ui/AchievementToast'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { GalaxyCursor } from '@/components/ui/GalaxyCursor'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { WarpTransition } from '@/components/ui/WarpTransition'
import { CONTACT, SITE } from '@/lib/constants'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: SITE.fullTitle,
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
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.fullTitle,
    description: SITE.shortDescription,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-black text-white antialiased ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NuqsAdapter>
          <SmoothScroll />
          <WarpTransition />
          <GalaxyCursor />
          <AchievementToastManager />
          <CommandPalette />
          <Analytics />
          <ErrorBoundary>{children}</ErrorBoundary>
          <VercelAnalytics />
          <SpeedInsights />
        </NuqsAdapter>
      </body>
    </html>
  )
}
