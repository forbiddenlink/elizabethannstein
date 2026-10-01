// Curated flagship set for the editorial home ("live systems index").
// Ordered, verifiable-first. `status` drives the live-check column:
//   - 'live'  → statusUrl is pinged server-side; renders "live · <ms>ms"
//   - 'npm'   → published package, links to npm (no uptime ping)
//   - 'cli'   → local tool, shows a static proof pill instead of uptime
// Case content is authored with verified engineering details and outcomes.

export type FlagshipStatus = 'live' | 'npm' | 'cli' | 'sites'

export interface FlagshipLink {
  label: string
  href: string
  external?: boolean
}

export interface FlagshipMetric {
  value: string
  label: string
}

export interface FlagshipCase {
  heading: string
  body: string
}

export interface Flagship {
  id: string
  title: string
  org: string
  years: string
  /** One-line index description. */
  summary: string
  /** Proof pill shown in the index row. */
  proof: string
  /** Status kind + optional URL to ping. */
  status: FlagshipStatus
  statusUrl?: string
  statusSub: string
  /** Expanded case study. */
  cases: FlagshipCase[]
  metrics: FlagshipMetric[]
  links: FlagshipLink[]
}

export const FLAGSHIPS: Flagship[] = [
  {
    id: 'security-readiness-platform',
    title: 'Security Readiness Platform',
    org: 'Cybersecurity nonprofit · Director of software engineering',
    years: '2025-26',
    summary:
      'A security-readiness assessment that organizations take and assessors score, live in production on Dynamics 365 with a Next.js front end. I am its only developer.',
    proof: 'In production',
    status: 'sites',
    statusSub: 'Dynamics 365',
    cases: [
      {
        heading: 'The job',
        body: 'The nonprofit needed an assessment it could run the same way every time, with scoring it could audit, instead of spreadsheets and one-off calls.',
      },
      {
        heading: 'What I built',
        body: 'Twelve implementation phases on Dynamics 365, Power Platform, and Dataverse: the data model, Power Automate scoring, and packaging that moves releases between environments. Then I moved the assessor screens out of Power Apps into a Next.js app that reads and writes the same Dataverse data.',
      },
      {
        heading: 'Where it stands',
        body: 'Live in production. The client is confidential, so there are no screenshots here.',
      },
    ],
    metrics: [{ value: '12', label: 'Phases shipped' }],
    links: [],
  },
  {
    id: 'rocketpark-craft-ecosystem',
    title: 'Craft CMS at Rocket Park',
    org: 'Rocket Park · Software engineering intern',
    years: '2025-26',
    summary:
      'I lead development on Rocket Vitals, the agency’s website QA scanner, and keep eleven client sites on Craft CMS upgraded and running.',
    proof: '11 client sites',
    status: 'sites',
    statusSub: '11 client sites',
    cases: [
      {
        heading: 'Client sites',
        body: 'Craft CMS upgrades, plugin updates, and Twig templates built from Figma across eleven client sites, with content-model changes tracked through project config.',
      },
      {
        heading: 'Rocket Vitals',
        body: 'A scanner that crawls a site and reports on 200+ accessibility, performance, SEO, and security checks. I lead its development.',
      },
      {
        heading: 'Tooling',
        body: 'An MCP server wrapper so AI assistants can read and work with Craft content directly.',
      },
    ],
    metrics: [
      { value: '11', label: 'Client sites' },
      { value: '200+', label: 'QA checks in Rocket Vitals' },
    ],
    links: [{ label: 'Rocket Vitals', href: 'https://rocketvitals.com', external: true }],
  },
  {
    id: 'timeslip-search',
    title: 'TimeSlipSearch',
    org: 'Personal · Creator',
    years: '2026',
    summary:
      'Type a date and get what was playing, showing, and costing that week, pulled from 420,000 records. It won the Algolia Agent Studio Challenge.',
    proof: '$750 contest win',
    status: 'live',
    statusUrl: 'https://timeslipsearch.vercel.app',
    statusSub: 'Algolia winner',
    cases: [
      {
        heading: 'The idea',
        body: 'Pick any date from 1958 to 2020 and see the Billboard #1, the box office, prices, and the news from that week.',
      },
      {
        heading: 'How it works',
        body: 'An Algolia Agent Studio agent queries four indices (Billboard, TMDB, FRED prices, Wikimedia) in parallel and writes a short summary of the era from the results.',
      },
      {
        heading: 'Result',
        body: 'One of four winners of the Algolia Agent Studio Challenge on DEV, March 2026: $750 and a DEV++ membership.',
      },
    ],
    metrics: [
      { value: '$750', label: 'Algolia challenge prize' },
      { value: '420K', label: 'Records' },
      { value: '4', label: 'Search indices' },
    ],
    links: [
      { label: 'Try it live', href: 'https://timeslipsearch.vercel.app', external: true },
      {
        label: 'Read the winners post',
        href: 'https://dev.to/devteam/congrats-to-the-algolia-agent-studio-challenge-winners-3ocn',
        external: true,
      },
    ],
  },
  {
    id: 'specter',
    title: 'Specter',
    org: 'Personal · Creator',
    years: '2025',
    summary:
      'A CLI that reads an unfamiliar codebase and talks you through it: structure, dead code, risky files. Published on npm, with an MCP server for Claude.',
    proof: 'Published on npm',
    status: 'npm',
    statusSub: '@purplegumdropz/specter',
    cases: [
      {
        heading: 'What it does',
        body: 'Parses a TypeScript codebase and explains its architecture, dependencies, dead code, bus factor, and complexity hotspots in plain language.',
      },
      {
        heading: 'For AI assistants',
        body: 'The same analysis runs as an MCP server with 14 tools, so Claude Desktop can ask about a repo directly.',
      },
      {
        heading: 'Shipped',
        body: 'Version 1.1.1 on npm as @purplegumdropz/specter: 65 commands and 12 narrator modes.',
      },
    ],
    metrics: [
      { value: '65', label: 'CLI commands' },
      { value: '14', label: 'MCP tools' },
      { value: '1.1.1', label: 'Version on npm' },
    ],
    links: [
      {
        label: 'View on npm',
        href: 'https://www.npmjs.com/package/@purplegumdropz/specter',
        external: true,
      },
      {
        label: 'Source on GitHub',
        href: 'https://github.com/forbiddenlink/specter',
        external: true,
      },
    ],
  },
  {
    id: 'trace',
    title: 'Trace',
    org: 'Personal · Creator',
    years: '2026',
    summary:
      'Drop in a screenshot and get React code that only uses real shadcn/ui components, so it compiles. It won the DEV GitHub Finish-Up-A-Thon.',
    proof: 'DEV contest winner',
    status: 'live',
    statusUrl: 'https://trace-seven-ashen.vercel.app',
    statusSub: 'DEV winner',
    cases: [
      {
        heading: 'The problem',
        body: 'My first version made up components that do not exist, so the code it produced would not run.',
      },
      {
        heading: 'The fix',
        body: 'Gemini 2.5 Flash is limited to a list of real shadcn/ui components. The result renders in a Sandpack editor, gets a compile check and repair pass, and runs through axe-core for accessibility.',
      },
      {
        heading: 'Result',
        body: 'Winner of the DEV GitHub Finish-Up-A-Thon, July 2026.',
      },
    ],
    metrics: [],
    links: [
      { label: 'Try it live', href: 'https://trace-seven-ashen.vercel.app', external: true },
      { label: 'Source on GitHub', href: 'https://github.com/forbiddenlink/trace', external: true },
      {
        label: 'Read the write-up',
        href: 'https://dev.to/liztacular/my-ai-tool-generated-garbage-jsx-so-i-grounded-it-in-shadcnui-and-finally-shipped-it-1i1n',
        external: true,
      },
    ],
  },
  {
    id: 'autodocs-ai',
    title: 'AutomaDocs',
    org: 'Personal · Creator',
    years: '2024-26',
    summary:
      'Connect a GitHub repo and AutomaDocs writes its documentation, then rebuilds it on every push. Live, with Stripe checkout.',
    proof: 'Live product',
    status: 'live',
    statusUrl: 'https://automadocs.com',
    statusSub: 'automadocs.com',
    cases: [
      {
        heading: 'Retrieval',
        body: 'Pinecone vector search plus BM25 keyword search over code parsed with Tree-sitter, so the docs point at the right functions.',
      },
      {
        heading: 'Staying current',
        body: 'A GitHub webhook queues a rebuild on every push.',
      },
      {
        heading: 'The product',
        body: 'Supabase auth, Redis job queues, and Stripe subscriptions starting at $49 a month.',
      },
    ],
    metrics: [],
    links: [{ label: 'Visit automadocs.com', href: 'https://automadocs.com', external: true }],
  },
  {
    id: 'hq',
    title: 'hq',
    org: 'Personal · Creator',
    years: '2026',
    summary:
      'The command-line tool I start every day with. One command tells me what is broken, blocked, or waiting across about 90 repos and the services they run on.',
    proof: 'Daily driver',
    status: 'cli',
    statusSub: 'personal CLI',
    cases: [
      {
        heading: 'What it reads',
        body: 'GitHub, Vercel, Sentry, Stripe, Notion, UptimeRobot, Railway, and Jira, queried in parallel. Built with Bun and TypeScript.',
      },
      {
        heading: 'What it shows',
        body: 'Failing builds, new errors, unpushed work, and open reviews, ranked, grouped by work context, with the command to check each one.',
      },
    ],
    metrics: [{ value: '~90', label: 'Repos it watches' }],
    links: [],
  },
  {
    id: 'hire-ready',
    title: 'HireReady',
    org: 'Personal · Creator',
    years: '2026',
    summary:
      'Practice interviews out loud with an AI interviewer, then review the questions you missed on a spaced-repetition schedule.',
    proof: 'Live product',
    status: 'live',
    statusUrl: 'https://imhireready.com',
    statusSub: 'imhireready.com',
    cases: [
      {
        heading: 'The interview',
        body: 'The OpenAI Realtime API runs a spoken mock interview and asks follow-up questions.',
      },
      {
        heading: 'The review',
        body: 'Missed questions come back on an FSRS-5 schedule, so the hard ones show up more often.',
      },
      {
        heading: 'The product',
        body: 'Supabase for data and Stripe checkout, live at imhireready.com.',
      },
    ],
    metrics: [{ value: 'FSRS-5', label: 'Review scheduling' }],
    links: [{ label: 'Visit imhireready.com', href: 'https://imhireready.com', external: true }],
  },
]
