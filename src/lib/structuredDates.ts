// schema.org dateCreated must be an ISO date. galaxyData ranges like '2024-2026' are not,
// so a single year maps to dateCreated and anything else to temporalCoverage.
type ProjectDateFields =
  | { dateCreated: string }
  | { temporalCoverage: string }
  | Record<never, never>

export function projectDateFields(dateRange?: string): ProjectDateFields {
  if (!dateRange) return {}
  if (/^\d{4}$/.test(dateRange)) return { dateCreated: dateRange }
  return { temporalCoverage: dateRange.replace(/\s*[–-]\s*/, '/') }
}
