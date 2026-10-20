import { describe, expect, it } from 'vitest'
import { projectDateFields } from '@/lib/structuredDates'

describe('projectDateFields', () => {
  it('keeps a single year as dateCreated', () => {
    expect(projectDateFields('2025')).toEqual({ dateCreated: '2025' })
  })

  it('turns a year range into schema.org temporalCoverage', () => {
    expect(projectDateFields('2024-2026')).toEqual({ temporalCoverage: '2024/2026' })
  })

  it('emits nothing without a range', () => {
    expect(projectDateFields(undefined)).toEqual({})
  })
})
