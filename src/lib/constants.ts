import { galaxies } from './galaxyData'

const totalProjects = galaxies.reduce((sum, g) => sum + g.projects.length, 0)

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
  title: 'Full-Stack Engineer | Power Platform · Next.js · AI',
  fullTitle: 'Elizabeth Stein | Full-Stack Engineer (Power Platform · Next.js · AI)',
  description: `Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Sole developer on a cybersecurity nonprofit's Dynamics 365 platform, live in production. Algolia Agent Studio Challenge winner. ${totalProjects} projects across six galaxies.`,
  shortDescription:
    'Full-stack engineer shipping production code at three orgs. B.S. Summa Cum Laude, conferred March 2026. Sole developer on a Dynamics 365 / Power Platform assessment live in production, $750 Algolia Agent Studio winner, npm publisher, MCP server author.',
  /** One-line POV for hero / storytelling surfaces */
  narrativeThesis:
    'Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Sole developer on CyberReady Clinic Dynamics 365, live in production. Won Algolia Agent Studio. Publish to npm. Ship MCP servers, not just consume them.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com',
  keywords: [
    'Full-Stack Engineer',
    'Recent Grad 2026',
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
    'OpenAI GPT-4',
    'RAG',
    'Algolia Agent Studio',
    'Design Systems',
    'Craft CMS',
    'Better Auth',
    'Drizzle',
    'Supabase',
    'Rust',
    'Cybersecurity',
    'Healthcare',
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
    'OpenAI GPT-4',
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
  galaxyCount: String(galaxies.length),
  yearsExperience: '3',
  yearRange: '2023-2026',
} as const
