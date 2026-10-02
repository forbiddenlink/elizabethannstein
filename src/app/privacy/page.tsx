import type { Metadata } from 'next'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What elizabethannstein.com collects: analytics, what you send through the contact form or the 3D galaxy chat, and which services handle it.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    // Open Graph titles do not get the root layout's `%s | Elizabeth Stein`
    // template, so this one carries the name itself.
    title: 'Privacy Policy | Elizabeth Stein',
    description: 'What elizabethannstein.com collects, and which services handle it.',
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
        <header className="ePageHead">
          <h1>Privacy</h1>
          <p>
            The short version: the site counts visits, and it only gets your name or email address
            if you send me a message.
          </p>
          <figure className="ePlate" style={{ marginTop: '1.75rem' }}>
            <dl className="eSpec" style={{ margin: 0, padding: '0 1rem' }}>
              <div>
                <dt>Analytics</dt>
                <dd>Google Analytics, Vercel Analytics, Vercel Speed Insights</dd>
              </div>
              <div>
                <dt>Cookies</dt>
                <dd>Google Analytics only</dd>
              </div>
              <div>
                <dt>Stored here</dt>
                <dd>Contact messages are not stored here. They go to my inbox through Resend.</dd>
              </div>
              <div>
                <dt>Questions</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </dd>
              </div>
            </dl>
            <figcaption>
              <span>Summary</span>
              <span>Updated October 1, 2026</span>
            </figcaption>
          </figure>
        </header>

        <div className="eProse">
          <section>
            <h2>Overview</h2>
            <p>
              This is my personal portfolio. Here is everything it collects and where that goes.
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
              <strong>The contact form.</strong> Your name, email address, and message are sent to
              my inbox as an email through Resend. The site itself does not store them.
            </p>
            <p>
              <strong>The galaxy chat.</strong> Questions you type into the chat on the 3D galaxy
              page are sent to the MiniMax AI API to generate an answer. Do not type anything
              personal there.
            </p>
            <p>
              <strong>Bot protection.</strong> Requests to the site&apos;s API routes pass through
              Arcjet, which looks at your IP address and request to block bots and abuse.
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
                <strong>Resend:</strong> delivers contact form messages to my inbox
              </li>
              <li>
                <strong>MiniMax:</strong> answers questions in the 3D galaxy chat
              </li>
              <li>
                <strong>Arcjet:</strong> bot and abuse protection on API routes
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
