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
    'Email or message Elizabeth Stein about a full-time role, a contract, or a project: full-stack, frontend, or Power Platform.',
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
                    <span className={styles.directValue}>
                      imkindageeky <span aria-hidden="true">↗</span>
                    </span>
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
                    <span className={styles.directValue}>
                      forbiddenlink <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.avail}>
              <p className={styles.availHead}>
                <span className="eStateDot" aria-hidden="true" />
                Open to work
              </p>
              <p className={styles.availBody}>
                Full-time roles and contracts: full-stack, frontend, or Power Platform and Dynamics
                365.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
