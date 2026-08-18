import type { Metadata } from 'next'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT } from '@/lib/constants'

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
    <div className="editorial">
      <a
        href="#privacy-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <SiteHeader />

      <main id="privacy-content" className="eWrapNarrow">
        <header className="eHeader">
          <p className="eEyebrow">Colophon &middot; Privacy</p>
          <p className="eDateline">Updated July 13, 2026</p>
          <h1 className="eTitle">Privacy.</h1>
          <p className="eLede" style={{ marginTop: '1.4rem' }}>
            Written to be read: this site uses privacy-friendly analytics and standard hosting. It
            does not collect personal information unless you choose to email me.
          </p>
        </header>

        <div className="eProse">
          <section>
            <h2>Overview</h2>
            <p>
              This is a personal portfolio showcasing my work as a software developer. I respect
              your privacy and am committed to being transparent about any data collected when you
              visit.
            </p>
          </section>

          <section>
            <h2>What is collected</h2>
            <p>
              <strong>Analytics.</strong> The site uses Google Analytics alongside Vercel Analytics
              and Vercel Speed Insights to understand how visitors interact with the content. These
              record aggregate signals only:
            </p>
            <ul>
              <li>Pages visited and time spent on each page</li>
              <li>Referring websites</li>
              <li>General geographic region (country or city level)</li>
              <li>Device type and browser information</li>
            </ul>
            <p>
              <strong>No personal data.</strong> The site does not collect names, email addresses,
              or phone numbers unless you voluntarily contact me via the email link.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Google Analytics uses cookies to distinguish unique visitors and measure sessions.
              These cookies do not contain personal information. You can opt out across all sites by
              installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              . Vercel Analytics and Speed Insights are cookieless and do not track you across
              sites.
            </p>
          </section>

          <section>
            <h2>Third-party services</h2>
            <p>The site relies on a small set of infrastructure providers:</p>
            <ul>
              <li>
                <strong>Vercel:</strong> hosting, deployment, and cookieless analytics
              </li>
              <li>
                <strong>Google Analytics:</strong> website analytics (uses cookies, see above)
              </li>
              <li>
                <strong>Sentry:</strong> error monitoring (technical diagnostics, no personal data)
              </li>
              <li>
                <strong>Self-hosted fonts:</strong> Fraunces, Space Grotesk, and JetBrains Mono are
                served from this domain, so no third-party font CDN sees your requests
              </li>
            </ul>
            <p>Each provider maintains its own privacy policy governing how it handles data.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy or how your data is handled? Email me at{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
