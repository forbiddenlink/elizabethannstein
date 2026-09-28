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

/**
 * One-line masthead shared by every content page and the 404. The 3D galaxy link and the
 * theme switch moved to the footer colophon, so the header carries only the three
 * destinations a visitor navigates between.
 */
export function SiteHeader(_props: Readonly<SiteHeaderProps>) {
  const pathname = usePathname()

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          Elizabeth Stein
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={styles.link}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
