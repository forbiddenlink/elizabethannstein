import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="editorial">
      <SiteHeader />
      <main id="main-content" className="eWrap">
        <div className={styles.fold}>
          <div>
            <header className="ePageHead">
              <p className="eLabel">Error 404</p>
              <h1>This page does not exist.</h1>
              <p>The link may be old, or the page may have moved. Here is where things are.</p>
            </header>
            <div className={styles.actions}>
              <Link href="/work" className="eBtn eBtnPrimary">
                Browse the work
              </Link>
              <Link href="/" className="eBtn eBtnGhost">
                Home
              </Link>
            </div>
          </div>

          <figure className="ePlate">
            <div className="eTypeplate">
              <span className="eTypeplateBig">Not found</span>
              <dl className={styles.routes}>
                <dt>/</dt>
                <dd>
                  <Link href="/">Home, live systems</Link>
                </dd>
                <dt>/work</dt>
                <dd>
                  <Link href="/work">Selected work and the archive</Link>
                </dd>
                <dt>/about</dt>
                <dd>
                  <Link href="/about">About Elizabeth</Link>
                </dd>
                <dt>/contact</dt>
                <dd>
                  <Link href="/contact">Get in touch</Link>
                </dd>
              </dl>
            </div>
            <figcaption>
              <span>HTTP 404</span>
              <span>Where to go</span>
            </figcaption>
          </figure>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
