// Captured by running Specter (main branch, v1.2.0, not yet published to npm) on a fresh clone of
// github.com/forbiddenlink/trace: `specter scan --json` then `specter hotspots --json`. No LLM, no
// credentials. Values copied verbatim from that output; scores are percentiles within the repo.

export const SPECTER_SOURCE = {
  repo: 'https://github.com/forbiddenlink/specter',
  npm: 'https://www.npmjs.com/package/@purplegumdropz/specter',
  capturedAt: '2026-10-03',
} as const

export interface SpecterHotspot {
  file: string
  /** percentile (0-100) of the file's most complex function among the repo's files */
  complexity: number
  /** percentile (0-100) of commits touching the file in the window */
  churn: number
  hotspotScore: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  lastModified: string
}

export interface SpecterCapture {
  target: string
  targetUrl: string
  targetCommit: string
  specterVersion: string
  scannedAt: string
  scanDurationMs: number
  fileCount: number
  totalLines: number
  nodeCount: number
  edgeCount: number
  functions: number
  healthScore: number
  window: { since: string; until: string; weeks: number }
  hotspotCount: number
  criticalCount: number
  highCount: number
  /** the three highest-scoring files, in Specter's order */
  top: SpecterHotspot[]
}

export const SPECTER_CAPTURE: SpecterCapture = {
  target: 'forbiddenlink/trace',
  targetUrl: 'https://github.com/forbiddenlink/trace',
  targetCommit: 'd7b790f',
  specterVersion: '1.2.0',
  scannedAt: '2026-10-03T15:31:58.465Z',
  scanDurationMs: 4695,
  fileCount: 31,
  totalLines: 7235,
  nodeCount: 183,
  edgeCount: 178,
  functions: 71,
  healthScore: 51,
  window: {
    since: '2026-07-03',
    until: '2026-10-03',
    weeks: 14,
  },
  hotspotCount: 20,
  criticalCount: 13,
  highCount: 7,
  top: [
    {
      file: 'src/components/ScreenshotStudio.tsx',
      complexity: 100,
      churn: 100,
      hotspotScore: 100,
      priority: 'critical',
      lastModified: '2026-10-03T12:29:37.000Z',
    },
    {
      file: 'src/components/TraceLines.tsx',
      complexity: 94,
      churn: 97,
      hotspotScore: 95,
      priority: 'critical',
      lastModified: '2026-09-03T15:22:28.000Z',
    },
    {
      file: 'src/components/AmbientTrace.tsx',
      complexity: 81,
      churn: 97,
      hotspotScore: 89,
      priority: 'critical',
      lastModified: '2026-09-03T15:22:28.000Z',
    },
  ],
}
