/**
 * Canonical project → screenshot map. Single source of truth.
 * Both WorkPageClient and ProjectCaseStudy import from here.
 *
 * ONLY list entries whose file actually exists in public/screenshots/.
 * Projects without an entry get a typographic plate (`.eTypeplate`), which
 * reads as intentional; a broken <Image> 404 does not. Run
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
  trace: '/screenshots/trace.webp',
  storyvision: '/screenshots/storyvision.webp',
  tubedigest: '/screenshots/tubedigest.webp',
  'skill-mapper': '/screenshots/skill-mapper.webp',
  pollyglot: '/screenshots/pollyglot.webp',
  kindred: '/screenshots/kindred.webp',
  // Full-Stack
  'hire-ready': '/screenshots/hire-ready.webp',
  'ucp-guard': '/screenshots/ucp-guard.webp',
  'portfolio-pro': '/screenshots/portfolio-pro.webp',
  reprise: '/screenshots/reprise.webp',
  aqualog: '/screenshots/aqualog.webp',
  testimoniq: '/screenshots/testimoniq.webp',
  dwello: '/screenshots/dwello.webp',
  'create-surveys': '/screenshots/create-surveys.webp',
  'accessibility-checker': '/screenshots/accessibility-checker.webp',
  'consent-compass': '/screenshots/consent-compass.webp',
  'security-trainer': '/screenshots/security-trainer.webp',
  'encryption-visualizer': '/screenshots/encryption-visualizer.webp',
  'rocket-vitals': '/screenshots/rocket-vitals.webp',
  'app-idea-miner': '/screenshots/app-idea-miner.webp',
  'competitor-stalker': '/screenshots/competitor-stalker.webp',
  // Experimental / Creative
  mythos: '/screenshots/mythos.webp',
  'plant-therapy': '/screenshots/plant-therapy.webp',
  'color-studio': '/screenshots/color-studio.webp',
  'space-travel': '/screenshots/space-travel.webp',
  'coding-jokes': '/screenshots/coding-jokes.webp',
  'goodstuff-foodtruck': '/screenshots/goodstuff-foodtruck.webp',
  'studio-furniture': '/screenshots/studio-furniture.webp',
  'ocean-simulator': '/screenshots/ocean-simulator.webp',
  'apoc-bnb': '/screenshots/apoc-bnb.webp',
  'cereal-tasting': '/screenshots/cereal-tasting.webp',
  'pass-game': '/screenshots/pass-game.webp',
  'critter-vale': '/screenshots/critter-vale.webp',
  'canvas-flow': '/screenshots/canvas-flow.webp',
  'constellation-events': '/screenshots/constellation-events.webp',
}

export function getProjectScreenshot(projectId: string): string | undefined {
  return PROJECT_SCREENSHOTS[projectId]
}
