import type { Metadata } from 'next'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import nowData from '@/data/now.json'
import { groupByMonth, type NowEntry } from '@/lib/nowFeed'
import styles from './now.module.css'

const description =
  'What I shipped recently: merged pull requests across my public GitHub repositories, each linked to its source.'

export const metadata: Metadata = {
  title: 'Now',
  description,
  alternates: { canonical: '/now' },
  openGraph: {
    title: 'Now | Elizabeth Stein',
    description,
    url: '/now',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

const entries = nowData.entries as NowEntry[]

export default function NowPage() {
  const groups = groupByMonth(entries)

  return (
    <div className="editorial">
      <a
        href="#now-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <SiteHeader />

      <main id="now-content" className="eWrapNarrow">
        <header className="ePageHead">
          <h1>Now</h1>
          <p>
            What I shipped recently. Every line is a merged pull request in one of my public
            repositories, and it links to the pull request itself.
          </p>
          <p className={styles.meta}>
            Updated {nowData.generatedAt} from merged pull requests on{' '}
            <a href="https://github.com/forbiddenlink">github.com/forbiddenlink</a>. At most two
            entries per repository.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.label} className={styles.group} aria-labelledby={`m-${group.label}`}>
            <h2 id={`m-${group.label}`} className={styles.month}>
              {group.label}
            </h2>
            <ul className={styles.list}>
              {group.entries.map((e) => (
                <li key={e.url} className={styles.item}>
                  <time dateTime={e.mergedAt} className={styles.date}>
                    {e.mergedAt.slice(5)}
                  </time>
                  <span className={styles.repo}>{e.repo}</span>
                  <a href={e.url} className={styles.title}>
                    {e.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  )
}
