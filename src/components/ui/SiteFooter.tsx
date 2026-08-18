import Link from 'next/link'
import { AskAIAboutMe } from '@/components/ui/AskAIAboutMe'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { CONTACT } from '@/lib/constants'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <AskAIAboutMe />
        <div className={styles.hair} aria-hidden="true" />
        <div className={styles.row}>
          <div className={styles.left}>
            <span>
              &copy; {year} <b>Elizabeth Stein</b>
            </span>
            <span className={styles.sep}>·</span>
            <Link href="/work" className={styles.navlink}>
              Work
            </Link>
            <Link href="/about" className={styles.navlink}>
              About
            </Link>
            <Link href="/contact" className={styles.navlink}>
              Contact
            </Link>
            <Link href="/privacy" className={styles.navlink}>
              Privacy
            </Link>
          </div>
          <div className={styles.right}>
            <a href={`mailto:${CONTACT.email}`} className={styles.workLink}>
              Let&apos;s work together &rarr;
            </a>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
        <div className={styles.colophon}>
          <span>Set in Fraunces, Space Grotesk &amp; JetBrains Mono.</span>
          <span>
            Built with Next.js &amp; React. Shipping production code across three organisations.
          </span>
        </div>
      </div>
    </footer>
  )
}
