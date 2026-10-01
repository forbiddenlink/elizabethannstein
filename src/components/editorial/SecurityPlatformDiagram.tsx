import styles from './SecurityPlatformDiagram.module.css'

/**
 * The plate for the confidential client platform: no screenshot can be shown, so the plate
 * draws the system shape instead. Only components already named in the public copy appear
 * here (no internal names, versions, or admin detail; see the CRC privacy rule).
 */
export function SecurityPlatformDiagram() {
  return (
    <div
      className={styles.diagram}
      role="img"
      aria-label="System diagram: assessors use a Next.js web app that reads and writes Dataverse; Power Automate scores assessments; the same records are managed in Dynamics 365."
    >
      <div className={`${styles.node} ${styles.app}`}>
        <span className={styles.kind}>assessor app</span>
        <span className={styles.name}>Next.js 16 + React 19</span>
        <span className={styles.note}>hosted on Vercel</span>
      </div>
      <div className={`${styles.link} ${styles.linkA}`} aria-hidden="true">
        <span>reads + writes</span>
      </div>
      <div className={`${styles.node} ${styles.core}`}>
        <span className={styles.kind}>system of record</span>
        <span className={styles.name}>Dataverse</span>
        <span className={styles.note}>governed data model</span>
      </div>
      <div className={`${styles.link} ${styles.linkB}`} aria-hidden="true">
        <span>triggers</span>
      </div>
      <div className={`${styles.node} ${styles.flow}`}>
        <span className={styles.kind}>scoring</span>
        <span className={styles.name}>Power Automate</span>
        <span className={styles.note}>auditable results</span>
      </div>
      <div className={`${styles.link} ${styles.linkC}`} aria-hidden="true">
        <span>same records</span>
      </div>
      <div className={`${styles.node} ${styles.crm}`}>
        <span className={styles.kind}>back office</span>
        <span className={styles.name}>Dynamics 365</span>
        <span className={styles.note}>12 phases shipped</span>
      </div>
    </div>
  )
}
