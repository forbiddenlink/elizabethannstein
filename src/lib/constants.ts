import { galaxies } from './galaxyData'

const totalProjects = galaxies.reduce((sum, g) => sum + g.projects.length, 0)

// Contact and social links - single source of truth
export const CONTACT = {
  /** Primary inbox on your domain (configure forwarding in DNS / host as needed) */
  email: 'hello@elizabethannstein.com',
  linkedin: 'https://linkedin.com/in/imkindageeky',
  github: 'https://github.com/forbiddenlink',
} as const

/**
 * "Ask AI about me" — recruiters increasingly vet candidates through an assistant
 * before ever landing here. These deep links open a chat prefilled with a prompt that
 * points the model at this site + its AI-readable profile (public/llms.txt), so the
 * answer is grounded in real, verifiable proof rather than a hallucination.
 */
export const ASK_AI = {
  /** Prefilled prompt; each provider URL appends `encodeURIComponent(prompt)`. */
  prompt:
    'Tell me about Elizabeth Stein, a full-stack engineer (Power Platform, Next.js, AI). Her portfolio is https://elizabethannstein.com and her AI-readable profile is https://elizabethannstein.com/llms.txt. What are her strongest, most verifiable projects and skills?',
  /** `{q}` is replaced with the encoded prompt at render time. */
  providers: [
    { label: 'Claude', href: 'https://claude.ai/new?q={q}' },
    { label: 'ChatGPT', href: 'https://chatgpt.com/?q={q}' },
    { label: 'Perplexity', href: 'https://www.perplexity.ai/search?q={q}' },
  ],
} as const

// Site metadata - single source of truth
export const SITE = {
  name: 'Elizabeth Stein',
  title: 'Full-Stack Engineer | Power Platform · Next.js · AI',
  fullTitle: 'Elizabeth Stein | Full-Stack Engineer (Power Platform · Next.js · AI)',
  description: `Full-stack developer and designer. Sole developer on a Dynamics 365 platform live in production, Algolia Agent Studio winner, npm publisher. B.S. Summa Cum Laude. ${totalProjects} projects shipped; the eight that matter are on the front page.`,
  shortDescription:
    'Full-stack developer and designer shipping production software across three organizations. Dynamics 365 platform in production, $750 Algolia Agent Studio winner, npm publisher, MCP author.',
  /** One-line POV for hero / storytelling surfaces (the /explore galaxy + entrance). */
  narrativeThesis:
    "I design and build software that's actually running in production. Sole developer on a Dynamics 365 platform, Algolia Agent Studio winner, and I ship MCP servers instead of just consuming them.",
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
