import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { CASE_STUDIES } from '@/lib/caseStudies'
import { getProjectById } from '@/lib/galaxyData'

describe('case study long-form story', () => {
  it('renders the written story in place of the brief/build/shipped blurbs', () => {
    const project = getProjectById('security-readiness-platform')
    if (!project) throw new Error('security-readiness-platform missing')
    render(<ProjectCaseStudy project={project} />)

    expect(screen.getByRole('heading', { name: /moved the front end out/i })).toBeDefined()
    expect(screen.getByRole('heading', { name: /do differently/i })).toBeDefined()
    expect(screen.queryByRole('heading', { name: 'The brief' })).toBeNull()
  })

  it('keeps the brief/build/shipped blurbs for projects without a written story', () => {
    const project = getProjectById('trace')
    if (!project) throw new Error('trace missing')
    render(<ProjectCaseStudy project={project} />)

    expect(screen.getByRole('heading', { name: 'The brief' })).toBeDefined()
  })

  it('only lists case studies for projects that exist', () => {
    for (const id of CASE_STUDIES.keys()) {
      expect(getProjectById(id), id).toBeDefined()
    }
  })
})
