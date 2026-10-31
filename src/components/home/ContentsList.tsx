import Link from 'next/link'
import type { ContentsRow } from '@/lib/contents'
import styles from './ContentsList.module.css'

/**
 * Contents list: one numbered row per shipped project, name left, live URL right. A real
 * ordered list of real links, in reading order. Rows come from galaxyData via buildContents.
 */
export function ContentsList({ rows }: Readonly<{ rows: readonly ContentsRow[] }>) {
  if (rows.length === 0) return null
  return (
    <section className="eSect" aria-labelledby="contents-heading">
      <div className={styles.wrap}>
        <div className="eSectHead">
          <h2 id="contents-heading">
            <span className={styles.numeral} aria-hidden="true">
              I
            </span>
            Contents
          </h2>
          <p>{rows.length} shipped projects with a live site</p>
        </div>
        <ol className={styles.list}>
          {rows.map((row) => (
            <li key={row.id} className={styles.row}>
              <span className={styles.num} aria-hidden="true">
                {String(row.number).padStart(2, '0')}
              </span>
              <Link href={`/work/${row.id}`} className={styles.name}>
                {row.title}
              </Link>
              <span className={styles.leader} aria-hidden="true" />
              <a
                href={row.url}
                className={styles.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${row.title} live site, ${row.host}`}
              >
                {row.host}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
