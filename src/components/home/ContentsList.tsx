'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { ContentsRow } from '@/lib/contents'
import { buildFilters } from '@/lib/contentsFilter'
import styles from './ContentsList.module.css'

/**
 * Contents list: one numbered row per shipped project, name left, live URL right. A real
 * ordered list of real links, in reading order. Rows come from galaxyData via buildContents.
 *
 * The server HTML always holds every row. The galaxy filter is progressive enhancement: its
 * buttons mount after hydration and only toggle `hidden` on rows, so with JS off nothing is
 * lost. Row numbers are hidden while a filter is on, because the surviving rows would
 * otherwise read 03, 07, 12 as if numbers were missing.
 */
export function ContentsList({ rows }: Readonly<{ rows: readonly ContentsRow[] }>) {
  const [enhanced, setEnhanced] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => setEnhanced(true), [])
  const filters = useMemo(() => buildFilters(rows), [rows])
  if (rows.length === 0) return null
  const activeFilter = filters.find((f) => f.id === active)
  const status = activeFilter
    ? `Showing ${activeFilter.count} of ${rows.length} projects: ${activeFilter.name}`
    : `Showing all ${rows.length} projects`
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
        {enhanced && filters.length > 1 ? (
          <fieldset className={styles.filters}>
            <legend className={styles.legend}>Filter projects by type</legend>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={active === null}
              onClick={() => setActive(null)}
            >
              All <span className={styles.count}>{rows.length}</span>
            </button>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={styles.chip}
                aria-pressed={active === f.id}
                onClick={() => setActive(f.id)}
              >
                {f.name} <span className={styles.count}>{f.count}</span>
              </button>
            ))}
          </fieldset>
        ) : null}
        {enhanced ? (
          <p className={styles.status} role="status">
            {status}
          </p>
        ) : null}
        <ol className={styles.list} data-filtered={activeFilter ? '' : undefined}>
          {rows.map((row) => (
            <li
              key={row.id}
              className={styles.row}
              hidden={activeFilter !== undefined && row.galaxy !== activeFilter.id}
            >
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
