import type { PlateArtData } from '@/lib/plateArt'

/**
 * Typographic plate for work with no public screenshot: a terminal excerpt or a stage-by-stage
 * flow, set from facts in the repo data. Fills the plate frame like a screenshot would.
 */
export function PlateArt({ art }: Readonly<{ art: PlateArtData }>) {
  const isTerminal = art.kind === 'terminal'
  return (
    <div
      className={`ePlateArt ${isTerminal ? 'ePlateArtTerm' : 'ePlateArtFlow'}${art.prompt ? ' ePlateArtPrompt' : ''}`}
    >
      <p className="ePlateArtTitle">
        {isTerminal && <span aria-hidden="true">$ </span>}
        {art.title}
      </p>
      <ol className="ePlateArtRows">
        {art.rows.map((row) => (
          <li key={row.key}>
            <span className="ePlateArtKey">{row.key}</span>
            <span className="ePlateArtVal">{row.value}</span>
          </li>
        ))}
      </ol>
      <p className="ePlateArtFoot">{art.footer}</p>
    </div>
  )
}
