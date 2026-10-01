import Image from 'next/image'
import { hostOf, plainLabel, staticStatus } from '@/lib/flagshipDisplay'
import type { Flagship } from '@/lib/flagships'
import { getProjectScreenshot } from '@/lib/projectScreenshots'
import type { Project } from '@/lib/types'
import { SecurityPlatformDiagram } from './SecurityPlatformDiagram'

// Projects that cannot show a screenshot but can show how the system fits together.
const DIAGRAMS = {
  'security-readiness-platform': SecurityPlatformDiagram,
} satisfies Record<string, () => React.JSX.Element>

/** Where the work can be seen, for the plate caption. */
export function whereLine(flagship: Flagship): string {
  if (flagship.status === 'live') return hostOf(flagship.statusUrl)
  if (flagship.status === 'npm') return flagship.statusSub
  if (flagship.status === 'cli') return 'Private CLI, source on request'
  if (flagship.id === 'security-readiness-platform') return 'Private: client confidential'
  return 'Client sites, not shown here'
}

/**
 * Screenshot plate, or the typographic plate when there is no screenshot (DESIGN.md
 * "Imagery"). Shared by the home features and the /work selected grid.
 */
export function ProjectPlate({
  flagship,
  project,
  sizes,
  priority = false,
}: Readonly<{ flagship: Flagship; project?: Project; sizes: string; priority?: boolean }>) {
  const shot = getProjectScreenshot(flagship.id)
  const Diagram = Object.entries(DIAGRAMS).find(([id]) => id === flagship.id)?.[1]
  const stack = project?.tags.slice(0, 4).join(', ')

  return (
    <figure className="ePlate">
      {Diagram ? (
        <Diagram />
      ) : shot ? (
        <div className="ePlateImg">
          <Image
            src={shot}
            alt={`${flagship.title} screenshot`}
            fill
            sizes={sizes}
            priority={priority}
          />
        </div>
      ) : (
        <div className="eTypeplate">
          <span className="eTypeplateBig">{plainLabel(flagship.proof).replace(' · ', ', ')}</span>
          <dl>
            {stack && (
              <>
                <dt>stack</dt>
                <dd>{stack}</dd>
              </>
            )}
            <dt>status</dt>
            <dd>{staticStatus(flagship).label}</dd>
          </dl>
        </div>
      )}
      <figcaption>
        <span>{whereLine(flagship)}</span>
        <span>{flagship.years}</span>
      </figcaption>
    </figure>
  )
}
