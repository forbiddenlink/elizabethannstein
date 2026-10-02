import type { Metadata } from 'next'
import { ContactForm } from '@/components/ui/ContactForm'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT } from '@/lib/constants'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Email or message Elizabeth Stein about a full-stack or product engineering role, a contract, or a project.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Elizabeth Stein',
    description:
      'Email or message Elizabeth Stein about a full-time role, a contract, or a project.',
    url: '/contact',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return (
    <div className="editorial">
      <a
        href="#contact-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <SiteHeader />

      <main id="contact-content" className="eWrap">
        <header className="ePageHead">
          <h1>Get in touch</h1>
          <p>
            Hiring, or have something you need built? Tell me what it is and when you need it. The
            form and the email address both come straight to me.
          </p>
        </header>

        <div className={styles.grid}>
          <section className={styles.formPanel} aria-labelledby="send-heading">
            <div className={styles.panelHead}>
              <h2 id="send-heading" className={styles.panelTitle}>
                Send a message
              </h2>
              <span className={styles.panelMeta}>Goes to my inbox</span>
            </div>
            <ContactForm />
          </section>

          <aside className={styles.side}>
            <div>
              <h2 className={styles.sideTitle}>Or reach out directly</h2>
              <dl className="eSpec">
                <div>
                  <dt>Email</dt>
                  <dd className={styles.specValue}>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>LinkedIn</dt>
                  <dd className={styles.specValue}>
                    <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                      imkindageeky <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>GitHub</dt>
                  <dd className={styles.specValue}>
                    <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
                      forbiddenlink <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>
                    <span className="eStateDot" aria-hidden="true" /> Open to work
                  </dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>Washington, PA, remote (US Eastern)</dd>
                </div>
                <div>
                  <dt>Looking for</dt>
                  <dd>
                    Full-stack and product engineering roles. Contracts welcome, including Power
                    Platform and Dynamics 365.
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
