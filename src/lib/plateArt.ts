/**
 * Authored art for flagship plates that have no public screenshot. Each entry restates facts
 * that already live in `flagships.ts`, the Specter README, or `hq --help`; nothing here is a
 * new claim. Confidential and client work (Security Readiness Platform, Craft CMS Ecosystem)
 * shows its architecture as a flow, never client UI.
 */
export type PlateArtKind = 'terminal' | 'flow'

export interface PlateArtRow {
  /** Left cell: a command (terminal) or a stage name (flow). */
  key: string
  /** Right cell: what it does. */
  value: string
}

export interface PlateArtData {
  kind: PlateArtKind
  /** Small mono label above the rows. */
  title: string
  /** Terminal only: prefix each key with a shell prompt (true when keys are commands). */
  prompt?: boolean
  rows: PlateArtRow[]
  /** Closing line, set under a hairline. */
  footer: string
}

export const PLATE_ART: Record<string, PlateArtData> = {
  'security-readiness-platform': {
    kind: 'flow',
    title: 'Architecture, 12 phases',
    rows: [
      { key: 'Dataverse', value: 'Governed relational schema' },
      { key: 'Power Automate', value: 'Automated scoring orchestration' },
      { key: 'Next.js 16, React 19', value: 'Externalized assessor web app' },
    ],
    footer: 'Sole developer, in production',
  },
  'rocketpark-craft-ecosystem': {
    kind: 'flow',
    title: 'Delivery pipeline',
    rows: [
      { key: 'Herd, Composer', value: 'Local parity, plugin pipelines' },
      { key: 'Project config CLI', value: 'Deterministic schema migrations' },
      { key: 'rocket-vitals, MCP', value: 'Regression scans and content-model checks' },
    ],
    footer: '11 live sites on PHP, Twig, Craft',
  },
  specter: {
    kind: 'terminal',
    prompt: true,
    title: 'specter',
    rows: [
      { key: 'specter scan && specter next', value: 'Index the repo, pick what to look at' },
      { key: 'specter hotspots', value: 'Complexity x churn = refactoring priority' },
      { key: 'specter bus-factor', value: 'Who leaves = what breaks' },
      { key: 'specter why src/utils/api.ts', value: 'Git history, patterns, context' },
    ],
    footer: '72 commands, 14 MCP tools, 19 personalities',
  },
  hq: {
    kind: 'terminal',
    title: 'hq --help',
    rows: [
      { key: 'Daily', value: 'now start brief next week eod' },
      { key: 'Money', value: 'revenue costs ai-spend' },
      { key: 'Repos', value: 'git review deploy security deps' },
      { key: 'Sync', value: 'sync wires notion' },
    ],
    footer: '~90 repos, 10 APIs, 216 tests',
  },
  trace: {
    kind: 'flow',
    title: 'Screenshot to React',
    rows: [
      { key: 'Gemini vision', value: 'Prompt whitelisted to shadcn primitives' },
      { key: 'Sandpack', value: 'Live render, compile-check repair loop' },
      { key: 'axe-core', value: 'Accessibility audit, one-click fixes' },
    ],
    footer: '38 automated tests',
  },
}
