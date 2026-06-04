/**
 * Canonical project → screenshot map. Single source of truth.
 * Both WorkPageClient and ProjectCaseStudy import from here.
 *
 * ONLY list entries whose file actually exists in public/screenshots/.
 * Projects without an entry fall through to the branded ProjectPlaceholder,
 * which looks intentional — a broken <Image> 404 does not. Run
 * `pnpm screenshots` to capture more, then add the entry here.
 */
export const PROJECT_SCREENSHOTS: Record<string, string> = {
  // Enterprise
  'caipo-ai': '/screenshots/caipo-ai.webp',
  'robocollective-ai': '/screenshots/robocollective-ai.webp',
  // AI Frontier
  'timeslip-search': '/screenshots/timeslip-search.webp',
  'finance-quest': '/screenshots/finance-quest.webp',
  stancestream: '/screenshots/stancestream.webp',
  explainthiscode: '/screenshots/explain-this-code.webp',
  contradictme: '/screenshots/contradictme.webp',
  'autodocs-ai': '/screenshots/autodocs-ai.webp',
  'mcp-server-studio': '/screenshots/mcp-server-studio.webp',
  // Full-Stack
  'ucp-guard': '/screenshots/ucp-guard.webp',
  'portfolio-pro': '/screenshots/portfolio-pro.webp',
  kindred: '/screenshots/kindred.webp',
  'quantum-forge': '/screenshots/quantum-forge.webp',
  reprise: '/screenshots/reprise.webp',
  // Experimental / Creative
  mythos: '/screenshots/mythos.webp',
  'plant-therapy': '/screenshots/plant-therapy.webp',
}

export function getProjectScreenshot(projectId: string): string | undefined {
  return PROJECT_SCREENSHOTS[projectId]
}
