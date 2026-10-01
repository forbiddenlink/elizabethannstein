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

/**
 * Descriptive alt text, written from the committed screenshot in public/screenshots/.
 * Describes what the image shows, nothing beyond it. Keys must match PROJECT_SCREENSHOTS.
 */
export const PROJECT_SCREENSHOT_ALT: Record<string, string> = {
  'caipo-ai':
    'CAIPO landing page on a dark background: the heading "Meet CAIPO", a "Coming Soon" notice, a rendered 3D capsule-shaped device, Join Waitlist and Learn More buttons, and a cookie banner.',
  'robocollective-ai':
    'RoboCollective.ai home page: a hero reading "Exclusive Brands & Models" over a blurred photo of a four-legged robot, with View our products and Contact Us buttons and a cookie banner.',
  'timeslip-search':
    'TimeSlip Search home page: a glowing teal and amber title, a tagline about seeing the number one song, movies, prices and headlines from any date, four category cards (Songs, Movies, Prices, Events) and a Staff Picks row.',
  'finance-quest':
    'Finance Quest dashboard with a welcome tour dialog open: step 1 of 4, "Ready to Transform Your Financial Future?", and a Next button, over a dimmed navigation bar and hero.',
  stancestream:
    'StanceStream onboarding dialog on a dark dashboard: step 1 of 5, "Enterprise AI Debate Platform", two stat tiles reading 66.7% Cache Hit Rate and Sub-3s Response, and a Next button.',
  explainthiscode:
    'ExplainThis home page: the heading "Understand Any Code with Personalized Explanations" above a demo panel with a QuickSort code sample beside an AI explanation, with Standard, Beginner and Performance mode tabs.',
  contradictme:
    'ContradictMe home page: the heading "An AI that disagrees with you", a stats bar, a Try a Demo panel with three example topics, a text field with a Challenge Me button, and topic chips.',
  'autodocs-ai':
    'AutomaDocs home page on a dark background: the heading "Code documentation your team can actually trust." beside a product preview showing a documentation map, an Ask the repo answer with cited file paths, and freshness and coverage gauges.',
  'mcp-server-studio':
    'MCP Studio empty builder: a dark canvas with a "Start Building" prompt on the left and an empty Server Manifest panel with Structure, Test and Code tabs on the right.',
  'ucp-guard':
    'UCP Guard home page: the heading "Keep UCP stores reliable for every AI shopping request" beside a live monitor card with store counts, a P95 latency figure and a row of uptime check bars, plus a cookie banner.',
  'portfolio-pro':
    'Portfolio Pro home page: the heading "Portfolio-grade AI. Ship work hiring managers can actually open." beside a sample code artifact for app/api/chat/route.ts, with a cookie banner along the bottom.',
  kindred:
    'Kindred home page on a dark background: the heading "Your notes, docs, and AI in one workspace." beside a node graph linking pages such as Strategy, Research and Launch plan, with Start for free and Browse templates buttons.',
  reprise:
    'RepRise home page: a hero reading "Find Your Perfect Trainer" over a beach photo of two people in plank position, with Start Matching and Explore Trainers buttons.',
  mythos:
    'Mythos Atlas home page: the title "Mythos Atlas" in gold serif capitals over a photo of Greek temple columns, with Explore Mythologies and Meet the Gods buttons and a quotation box.',
  'plant-therapy':
    'Plant Therapy home page: the heading "The science of plant-based wellness." over a faded photo of a garden trowel and a ceramic planter, with Read the Research and Browse Articles buttons.',
}

export function getProjectScreenshot(projectId: string): string | undefined {
  return PROJECT_SCREENSHOTS[projectId]
}

/** Alt text for a project screenshot, or `fallback` when none is written. */
export function getProjectScreenshotAlt(projectId: string, fallback: string): string {
  return PROJECT_SCREENSHOT_ALT[projectId] ?? fallback
}
