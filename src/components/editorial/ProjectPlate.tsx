import Image from 'next/image'
import { PlateArt } from '@/components/work/PlateArt'
import { plainLabel, staticStatus } from '@/lib/flagshipDisplay'
import type { Flagship } from '@/lib/flagships'
import { getPlateArt } from '@/lib/plateArt'
import { getPlateDiagram, whereLine } from '@/lib/projectPlateContent'
import { getProjectScreenshot, getProjectScreenshotAlt } from '@/lib/projectScreenshots'
import type { Project } from '@/lib/types'

export type PlateProject = Pick<Project, 'tags' | 'role'>

export function ProjectPlate({
  flagship,
  project,
  sizes,
  priority = false,
}: Readonly<{ flagship: Flagship; project?: PlateProject; sizes: string; priority?: boolean }>) {
  const shot = getProjectScreenshot(flagship.id)
  const Diagram = getPlateDiagram(flagship.id)
  const art = getPlateArt(flagship.id)
  const stack = project?.tags.slice(0, 4).join(', ')

  return (
    <figure className="ePlate">
      {Diagram ? (
        <Diagram />
      ) : shot ? (
        <div className="ePlateImg">
          <Image
            src={shot}
            alt={getProjectScreenshotAlt(flagship.id, `${flagship.title} screenshot`)}
            fill
            sizes={sizes}
            priority={priority}
          />
        </div>
      ) : art ? (
        <PlateArt art={art} />
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
            {project?.role && (
              <>
                <dt>role</dt>
                <dd>{project.role}</dd>
              </>
            )}
            <dt>status</dt>
            <dd>{staticStatus(flagship).label}</dd>
            <dt>years</dt>
            <dd>{flagship.years}</dd>
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
