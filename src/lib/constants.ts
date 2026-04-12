import { galaxies } from './galaxyData'

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
  title: 'Full-Stack Developer & AI Integration Specialist',
  fullTitle: 'Elizabeth Stein | Full-Stack & AI Developer',
  description:
    'Full-stack product work, design systems, and AI integrations—explore 84 projects across six galaxies. Built to wander through, not scroll past.',
  shortDescription:
    'I build production web apps, design systems, and AI-powered features—with clear product judgment and careful engineering.',
  /** One-line POV for hero / storytelling surfaces */
  narrativeThesis:
    'Ship work that survives contact with real users—systems you can evolve, interfaces people actually finish.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com',
  keywords: [
    'Full-Stack Developer',
    'AI Integration',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Claude AI',
    'OpenAI GPT-4',
    'Design Systems',
    'Enterprise Applications',
    'Web Development',
    'Supabase',
    'Portfolio',
  ],
  knowsAbout: [
    'Full-Stack Development',
    'AI Integration',
    'Claude AI',
    'OpenAI GPT-4',
    'Stable Diffusion',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Design Systems',
    'Enterprise Applications',
    'Supabase',
    'PostgreSQL',
  ],
} as const

const totalProjects = galaxies.reduce((sum, g) => sum + g.projects.length, 0)

// Portfolio stats — derived from galaxyData so counts never drift
export const STATS = {
  projectCount: String(totalProjects),
  galaxyCount: String(galaxies.length),
  yearsExperience: '3',
  yearRange: '2023–2026',
} as const
