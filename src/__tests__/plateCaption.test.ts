import { describe, expect, it } from 'vitest'
import { plateCaption } from '@/components/projects/ProjectCaseStudy'
import type { Project } from '@/lib/types'

const base = { id: 'x', company: 'Some Agency' } as unknown as Project

describe('plateCaption', () => {
  it('does not call a project with a live site private', () => {
    const live = { ...base, links: { live: 'https://example.com' } } as Project
    expect(plateCaption(live, undefined, '')).toBe('No screenshot published')
  })

  it('keeps the confidential caption for the security platform', () => {
    const sec = { ...base, id: 'security-readiness-platform' } as Project
    expect(plateCaption(sec, undefined, '')).toBe('Private: client confidential')
  })

  it('marks company work without a live link as not public', () => {
    expect(plateCaption(base, undefined, '')).toBe('Not shown publicly')
  })
})
