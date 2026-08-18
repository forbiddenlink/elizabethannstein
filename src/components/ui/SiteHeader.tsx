'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './SiteHeader.module.css'

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

interface SiteHeaderProps {
  /** Retained for call-site compatibility; the editorial system ignores galaxy accents. */
  accentGalaxy?: string
}

function toggleTheme() {
  const root = document.documentElement
  const isDark = matchMedia('(prefers-color-scheme: dark)').matches
  const cur = root.getAttribute('data-theme') || (isDark ? 'dark' : 'light')
  root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark')
}

export function SiteHeader(_props: Readonly<SiteHeaderProps>) {
  const pathname = usePathname()

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Elizabeth Stein — home">
          Elizabeth Stein<span className={styles.dot}>.</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/contact" className={styles.live} title="Open to contract and full-time work">
            <span className="eDot" aria-hidden="true" />
            Open to work
          </Link>
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                {label}
              </Link>
            )
          })}
          <button
            type="button"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
          >
            ◐ Theme
          </button>
        </nav>
      </div>
    </header>
  )
}
