import { FLAGSHIPS } from './flagships'

/**
 * Pinned rather than derived from `galaxyData`. Importing the catalogue here
 * dragged all 124 KB of it — every project's challenge/solution/impact prose —
 * into the client bundle of every page that reads SITE or CONTACT, which is all
 * of them: /privacy shipped a chunk containing "Coulson One" while rendering
 * nothing but legal text. Bundlers cannot tree-shake it, because the reduce
 * below touched the whole array.
 *
 * `src/__tests__/copyCounts.test.ts` fails if either number drifts from the
 * real catalogue, so this cannot go stale silently.
 */
const totalProjects = 87
const totalGalaxies = 6

// Contact and social links - single source of truth
export const CONTACT = {
  /** Primary inbox on your domain (configure forwarding in DNS / host as needed) */
  email: 'hello@elizabethannstein.com',
  linkedin: 'https://linkedin.com/in/imkindageeky',
  github: 'https://github.com/forbiddenlink',
} as const

// Site metadata - single source of truth
export const SITE = {
  name: 'Elizabeth Stein',
  title: 'Full-stack engineer and designer',
  fullTitle: 'Elizabeth Stein, full-stack engineer and designer',
  description: `Full-stack engineer and designer. Sole developer on a Dynamics 365 platform in production, Algolia Agent Studio Challenge winner, npm publisher. ${totalProjects} projects, from production systems to experiments.`,
  shortDescription:
    'Full-stack engineer and designer. Sole developer on a Dynamics 365 platform in production for a cybersecurity nonprofit, lead developer on Rocket Vitals at Rocket Park, Algolia Agent Studio Challenge winner, and npm publisher.',
  /** One-line POV for hero / storytelling surfaces (the /explore galaxy + entrance). */
  narrativeThesis: 'I design and build software that ships, from the data model to the last pixel.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com',
  // These feed JSON-LD and page metadata, so a version number here rots in
  // public. Name the platform ('OpenAI API'), not the model of the month.
  keywords: [
    'Full-Stack Engineer',
    'Capella',
    'Power Platform',
    'Dynamics 365',
    'Dataverse',
    'Power Apps',
    'Power Automate',
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Three.js',
    'AI Integration',
    'MCP Protocol',
    'Claude',
    'OpenAI API',
    'RAG',
    'Algolia Agent Studio',
    'Design Systems',
    'Craft CMS',
    'Better Auth',
    'Drizzle',
    'Supabase',
    'Rust',
    'Cybersecurity',
  ],
  knowsAbout: [
    'Full-Stack Development',
    'Microsoft Power Platform',
    'Dynamics 365',
    'Dataverse',
    'Power Apps Canvas',
    'Power Automate',
    'AI Integration',
    'MCP Protocol',
    'Claude AI',
    'OpenAI API',
    'RAG Pipelines',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Design Systems',
    'Craft CMS',
    'Better Auth',
    'Drizzle ORM',
    'PostgreSQL',
    'Supabase',
    'Rust',
    'Cybersecurity Education',
  ],
} as const

// Portfolio stats — derived from galaxyData so counts never drift
export const STATS = {
  projectCount: String(totalProjects),
  galaxyCount: String(totalGalaxies),
  /** Everything not surfaced as a flagship. Derived so the copy cannot drift. */
  moreCount: String(totalProjects - FLAGSHIPS.length),
} as const
