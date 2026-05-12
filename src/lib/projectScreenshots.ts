/**
 * Canonical project → screenshot map. Single source of truth.
 * Both WorkPageClient and ProjectCaseStudy import from here.
 *
 * Add new entries when a screenshot lands in public/screenshots/.
 * Run `pnpm screenshots` to refresh from live URLs.
 */
export const PROJECT_SCREENSHOTS: Record<string, string> = {
  // Enterprise
  'flo-labs': '/screenshots/flo-labs.png',
  'caipo-ai': '/screenshots/caipo-ai.webp',
  'moodchanger-ai': '/screenshots/moodchanger-ai.png',
  hephaestus: '/screenshots/hephaestus.png',
  'robocollective-ai': '/screenshots/robocollective-ai.webp',
  // AI Frontier
  'finance-quest': '/screenshots/finance-quest.webp',
  stancestream: '/screenshots/stance-stream.png',
  explainthiscode: '/screenshots/explain-this-code.webp',
  tubedigest: '/screenshots/tubedigest.png',
  contradictme: '/screenshots/contradictme.webp',
  'dev-interviewer': '/screenshots/dev-interviewer.png',
  'codebase-onboarding-tool': '/screenshots/codebase-onboarding-tool.png',
  'autodocs-ai': '/screenshots/autodocs-ai.png',
  'mcp-server-studio': '/screenshots/mcp-server-studio.png',
  'interview-ace': '/screenshots/interview-ace.png',
  storyvision: '/screenshots/storyvision.png',
  // Full-Stack
  'hire-ready': '/screenshots/hire-ready.png',
  'ucp-guard': '/screenshots/ucp-guard.png',
  'site-sheriff': '/screenshots/site-sheriff.png',
  'portfolio-pro': '/screenshots/portfolio-pro.png',
  'create-surveys': '/screenshots/create-surveys.png',
  'quantum-forge': '/screenshots/quantum-forge.webp',
  'skill-mapper': '/screenshots/skill-mapper.png',
  reprise: '/screenshots/reprise.webp',
  willwise: '/screenshots/willwise.png',
  dareuradio: '/screenshots/dareuradio.png',
  testimoniq: '/screenshots/testimoniq.png',
  dwello: '/screenshots/dwello.png',
  // DevTools
  componentcompass: '/screenshots/componentcompass.png',
  'security-trainer': '/screenshots/security-trainer.png',
  'encryption-visualizer': '/screenshots/encryption-visualizer.png',
  'accessibility-checker': '/screenshots/accessibility-checker.png',
  'consent-compass': '/screenshots/consent-compass.png',
  'rocket-vitals': '/screenshots/rocket-vitals.png',
  // Creative
  'goodstuff-foodtruck': '/screenshots/goodstuff-foodtruck.png',
  'studio-furniture': '/screenshots/studio-furniture.png',
  rivet: '/screenshots/rivet.png',
  'codecraft-dev': '/screenshots/codecraft-dev.png',
  'color-studio': '/screenshots/color-studio.png',
  'space-travel': '/screenshots/space-travel.png',
  // Experimental
  pollyglot: '/screenshots/pollyglot.png',
  'guts-and-glory': '/screenshots/guts-and-glory.png',
  'plant-therapy': '/screenshots/plant-therapy.webp',
  'timeslip-search': '/screenshots/timeslip-search.webp',
  mythos: '/screenshots/mythos.webp',
  'apoc-bnb': '/screenshots/apoc-bnb.png',
  'canvas-flow': '/screenshots/canvas-flow.png',
  'ocean-simulator': '/screenshots/ocean-simulator.png',
  'competitor-stalker': '/screenshots/competitor-stalker.png',
  'cereal-tasting': '/screenshots/cereal-tasting.png',
  'constellation-events': '/screenshots/constellation-events.png',
  'app-idea-miner': '/screenshots/app-idea-miner.png',
  'ai-spend-tracker': '/screenshots/ai-spend-tracker.png',
}

export function getProjectScreenshot(projectId: string): string | undefined {
  return PROJECT_SCREENSHOTS[projectId]
}
