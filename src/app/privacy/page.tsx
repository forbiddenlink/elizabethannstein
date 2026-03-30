import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT } from '@/lib/constants'
import { Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Elizabeth Stein',
  description:
    'Privacy policy for elizabethannstein.com. Learn how this portfolio site handles your data, including analytics and cookies.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Elizabeth Stein',
    description:
      'Privacy policy for elizabethannstein.com. Learn how this portfolio site handles your data.',
    url: '/privacy',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Skip Link for Accessibility */}
      <a
        href="#privacy-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <SiteHeader />

      {/* Main Content */}
      <div id="privacy-content" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="privacy-hero-panel relative mb-12 overflow-hidden rounded-4xl border border-white/12 px-6 py-8 md:px-10 md:py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="privacy-hero-glow absolute inset-x-0 top-0 h-40" aria-hidden="true" />
            <div className="relative flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/12 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                <Shield className="w-7 h-7 text-cyan-200" />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                  Trust Layer
                </p>
                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
              </div>
            </div>
            <div className="relative grid gap-4 md:grid-cols-[1.6fr_0.9fr] md:items-end">
              <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
                This page is written to be direct: the site uses lightweight analytics and standard
                hosting infrastructure, and it does not collect personal information unless you
                choose to contact me.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Last updated
                </p>
                <p className="mt-2 text-sm font-medium text-white/80">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <section className="privacy-section-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-white/80 leading-relaxed">
                This is a personal portfolio website showcasing my work as a software developer. I
                respect your privacy and am committed to being transparent about any data collected
                when you visit this site.
              </p>
            </section>

            <section className="privacy-section-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Information Collected</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  <strong className="text-white">Analytics:</strong> This site uses Google Analytics
                  to understand how visitors interact with the content. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pages visited and time spent on each page</li>
                  <li>Referring websites</li>
                  <li>General geographic location (country/city level)</li>
                  <li>Device type and browser information</li>
                </ul>
                <p>
                  <strong className="text-white">No Personal Data:</strong> This site does not
                  collect personal information such as names, email addresses, or phone numbers
                  unless you voluntarily contact me via the provided email link.
                </p>
              </div>
            </section>

            <section className="privacy-section-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-white/80 leading-relaxed">
                Google Analytics uses cookies to distinguish unique users and track sessions. These
                cookies do not contain personal information. You can opt out of Google Analytics by
                installing the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-200 hover:text-cyan-100 transition-colors underline decoration-cyan-300/40 underline-offset-4"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{' '}
                .
              </p>
            </section>

            <section className="privacy-section-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>This site uses the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Vercel:</strong> Hosting and deployment
                  </li>
                  <li>
                    <strong>Google Analytics:</strong> Website analytics
                  </li>
                  <li>
                    <strong>Google Fonts:</strong> Typography
                  </li>
                </ul>
                <p>
                  Each of these services has their own privacy policies governing how they handle
                  data.
                </p>
              </div>
            </section>

            <section className="privacy-section-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-white/80 leading-relaxed">
                If you have questions about this privacy policy or how your data is handled, please
                contact me at{' '}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-cyan-200 hover:text-cyan-100 transition-colors underline decoration-cyan-300/40 underline-offset-4"
                >
                  {CONTACT.email}
                </a>{' '}
                .
              </p>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
