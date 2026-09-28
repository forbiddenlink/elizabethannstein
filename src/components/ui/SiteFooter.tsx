import Link from 'next/link'
import { AskAIAboutMe } from '@/components/ui/AskAIAboutMe'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CONTACT } from '@/lib/constants'
import styles from './SiteFooter.module.css'

const RESUME_HREF = '/resume/elizabeth-stein-resume.pdf'

/**
 * Colophon footer shared by every content page and the 404. It holds the secondary
 * destinations the masthead dropped (3D galaxy, privacy, résumé) and the theme switch.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.about}>
            <h2 className={styles.heading}>Elizabeth Stein</h2>
            <p>
              B.S. Information Technology, Software Development, Capella University. Summa Cum
              Laude, conferred March 2026.
            </p>
            <p>
              Set in Fraunces, Space Grotesk and JetBrains Mono.{' '}
              <ThemeToggle className={styles.theme} />
            </p>
          </div>
          <nav aria-labelledby="footer-site">
            <h2 id="footer-site" className={styles.heading}>
              Site
            </h2>
            <ul className={styles.list}>
              <li>
                <Link href="/work">Work</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/explore">3D galaxy</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className={styles.heading}>Elsewhere</h2>
            <ul className={styles.list}>
              <li>
                <a href={RESUME_HREF} download="Elizabeth_Stein_Resume.pdf">
                  Résumé (PDF)
                </a>
              </li>
              <li>
                <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.ask}>
          <AskAIAboutMe />
        </div>
        <p className={styles.copy}>&copy; {year} Elizabeth Stein</p>
      </div>
    </footer>
  )
}
