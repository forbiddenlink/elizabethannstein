import { galaxies } from './galaxyData'

const NAVIGATION_VERBS = [
  'show',
  'take',
  'go',
  'find',
  'navigate',
  'where',
  'fly',
  'visit',
  'see',
  'look',
]

interface NavigationIntent {
  type: 'project' | 'galaxy'
  id: string
  label: string
}

export function detectNavigationIntent(
  userMessage: string,
  aiResponse: string
): NavigationIntent | null {
  const userLower = userMessage.toLowerCase()

  // Only trigger on messages with navigation verbs
  const hasNavVerb = NAVIGATION_VERBS.some((verb) => userLower.includes(verb))
  if (!hasNavVerb) return null

  // Build lookup
  const allProjects = galaxies.flatMap((g) => g.projects)

  // Try project match in AI response first (most specific)
  for (const project of allProjects) {
    if (
      aiResponse.toLowerCase().includes(project.id.toLowerCase()) ||
      aiResponse.toLowerCase().includes(project.title.toLowerCase())
    ) {
      return { type: 'project', id: project.id, label: project.title }
    }
  }

  // Try galaxy match in AI response
  for (const galaxy of galaxies) {
    if (
      aiResponse.toLowerCase().includes(galaxy.name.toLowerCase()) ||
      aiResponse.toLowerCase().includes(galaxy.id.toLowerCase())
    ) {
      return { type: 'galaxy', id: galaxy.id, label: galaxy.name }
    }
  }

  // Check user message for direct project references
  for (const project of allProjects) {
    if (userLower.includes(project.title.toLowerCase())) {
      return { type: 'project', id: project.id, label: project.title }
    }
  }

  // Check user message for direct galaxy references
  for (const galaxy of galaxies) {
    if (
      userLower.includes(galaxy.name.toLowerCase()) ||
      userLower.includes(galaxy.id.toLowerCase())
    ) {
      return { type: 'galaxy', id: galaxy.id, label: galaxy.name }
    }
  }

  return null
}
