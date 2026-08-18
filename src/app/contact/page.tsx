import type { Metadata } from 'next'
import { ContactForm } from '@/components/ui/ContactForm'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { CONTACT } from '@/lib/constants'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Elizabeth Stein. Open to full-time, freelance, and consulting work: frontend, UX engineering, full-stack, or Power Platform roles.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Elizabeth Stein',
    description:
      'Get in touch. Open to full-time, freelance, and consulting work: frontend, UX engineering, full-stack, or Power Platform roles.',
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
        <header className="eHeader">
          <p className="eEyebrow">Collaborate</p>
          <h1 className="eTitle">
            Get in <em>touch.</em>
          </h1>
          <p className="eLede" style={{ marginTop: '1.4rem' }}>
            I&apos;m actively looking for frontend, UX-engineering, and full-stack roles. If
            you&apos;re hiring, or want to talk through a project, reach out. I read every message.
          </p>
        </header>

        <div className={styles.grid}>
          <section className={styles.formPanel} aria-labelledby="send-heading">
            <div className={styles.panelHead}>
              <h2 id="send-heading" className={styles.panelTitle}>
                Send a message
              </h2>
              <span className={styles.panelMeta}>Reply within 24h</span>
            </div>
            <ContactForm />
          </section>

          <aside className={styles.side}>
            <div>
              <p className="eLabel" style={{ marginBottom: '0.9rem' }}>
                Or reach out directly
              </p>
              <ul className={styles.directList}>
                <li>
                  <a href={`mailto:${CONTACT.email}`} className={styles.direct}>
                    <span className={styles.directLabel}>Email</span>
                    <span className={styles.directValue}>{CONTACT.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.direct}
                  >
                    <span className={styles.directLabel}>
                      <LinkedInIcon className="w-3.5 h-3.5" aria-hidden="true" /> LinkedIn
                    </span>
                    <span className={styles.directValue}>Connect professionally &rarr;</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.direct}
                  >
                    <span className={styles.directLabel}>
                      <GitHubIcon className="w-3.5 h-3.5" aria-hidden="true" /> GitHub
                    </span>
                    <span className={styles.directValue}>View my code &rarr;</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.avail}>
              <p className={styles.availHead}>
                <span className="eDot" aria-hidden="true" />
                Currently available
              </p>
              <p className={styles.availBody}>
                Open to full-time roles, freelance, and consulting. Looking for frontend, UX
                engineering, full-stack, or Power Platform / Dynamics 365 positions with a strong
                product focus. Capella B.S., Summa Cum Laude, conferred March 2026.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
