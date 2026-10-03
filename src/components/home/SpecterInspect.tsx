'use client'

import { SPECTER_CAPTURE as C, SPECTER_SOURCE } from '@/lib/specterCapture'
import { formatDay, frameStyles, InspectFrame } from './InspectFrame'
import styles from './SpecterInspect.module.css'

const n = (v: number) => v.toLocaleString('en-US')

export function SpecterInspect({ headingLevel = 2 }: Readonly<{ headingLevel?: 2 | 3 }> = {}) {
  return (
    <InspectFrame
      headingLevel={headingLevel}
      product="specter"
      title="Specter"
      badge="Code health CLI"
      interfaceView={
        <div className={styles.term}>
          <p className={styles.cmd}>
            <span aria-hidden="true">$ </span>specter scan
          </p>
          <p className={styles.out}>
            {C.fileCount} files · {n(C.totalLines)} lines · {C.nodeCount} nodes · {C.edgeCount}{' '}
            edges · {(C.scanDurationMs / 1000).toFixed(1)}s
          </p>
          <p className={styles.cmd}>
            <span aria-hidden="true">$ </span>specter hotspots
          </p>
          <table className={styles.table}>
            <caption className="sr-only">
              Top {C.top.length} of {C.hotspotCount} hotspots in {C.target}
            </caption>
            <thead>
              <tr>
                <th scope="col">File</th>
                <th scope="col">Complexity</th>
                <th scope="col">Churn</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {C.top.map((h) => (
                <tr key={h.file}>
                  <th scope="row">
                    {/* break only after a slash, so narrow screens wrap by folder, not mid-name */}
                    {h.file.split('/').map((part, i, all) => (
                      <span key={part}>
                        {part}
                        {i < all.length - 1 && (
                          <>
                            /<wbr />
                          </>
                        )}
                      </span>
                    ))}
                  </th>
                  <td data-label="Complexity">{h.complexity}</td>
                  <td data-label="Churn">{h.churn}</td>
                  <td data-label="Score">
                    <span className={styles.score}>{h.hotspotScore}</span>{' '}
                    <span className={styles.prio}>{h.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.out}>
            Top {C.top.length} of {C.hotspotCount} · {C.criticalCount} critical, {C.highCount} high
          </p>
        </div>
      }
      logicMini={
        <span className={styles.mini}>score = √(complexity × churn), both as repo percentiles</span>
      }
      dataMini={
        <span className={styles.mini}>
          {C.target} @ {C.targetCommit} · git log {C.window.weeks} weeks
        </span>
      }
      legend={{
        interface: (
          <p className={frameStyles.legendText}>
            Two real commands run on a fresh clone of Trace, another project on this site. The
            hotspots are the files that are both hard to follow and changed often, which is where a
            bug is most likely to land next.
          </p>
        ),
        logic: (
          <ol className={frameStyles.steps}>
            <li>
              <span className={frameStyles.stepKey}>Parse</span>
              <span className={frameStyles.stepVal}>
                Builds a graph of every file, function and import ({C.functions} functions here)
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Complexity</span>
              <span className={frameStyles.stepVal}>
                Cyclomatic: one plus each branch, loop, case, catch and logical operator. A file
                counts as its most complex function
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Churn</span>
              <span className={frameStyles.stepVal}>
                Commits touching each file in the last {C.window.weeks} weeks of git history
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Score</span>
              <span className={frameStyles.stepVal}>
                Both become percentiles within the repo, then √(complexity × churn), so a file must
                be high on both to rank
                <small>75 or more is critical, 50 or more is high.</small>
              </span>
            </li>
          </ol>
        ),
        data: (
          <ul className={frameStyles.indices}>
            <li>
              <span className={frameStyles.idxName}>Target</span>
              <span className={frameStyles.idxHits}>
                {C.target} at {C.targetCommit}
              </span>
              <span className={frameStyles.idxNote}>
                {C.fileCount} files, {n(C.totalLines)} lines
              </span>
            </li>
            <li>
              <span className={frameStyles.idxName}>Specter</span>
              <span className={frameStyles.idxHits}>v{C.specterVersion}, local run</span>
              <span className={frameStyles.idxNote}>
                No AI model and no credentials: parsing and git history only
              </span>
            </li>
          </ul>
        ),
      }}
      source={
        <>
          Real output from Specter {C.specterVersion}, run {formatDay(SPECTER_SOURCE.capturedAt)}.{' '}
          <a href={SPECTER_SOURCE.repo} target="_blank" rel="noreferrer">
            Specter on GitHub
          </a>
        </>
      }
    />
  )
}
