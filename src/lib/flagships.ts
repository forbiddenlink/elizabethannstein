// Curated flagship set for the editorial home ("live systems index").
// Ordered, verifiable-first. `status` drives the live-check column:
//   - 'live'  → statusUrl is pinged server-side; renders "live · <ms>ms"
//   - 'npm'   → published package, links to npm (no uptime ping)
//   - 'cli'   → local tool, shows a static proof pill instead of uptime
// Case content is authored here (real facts). Phase 4 enriches from Notion specs.

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
    id: 'crc-ready5-assessment',
    title: 'Ready5 Assessment',
    org: 'CyberReady Clinic · Sole Developer',
    years: '2025–26',
    summary:
      'A cybersecurity-readiness platform on Dynamics 365 and Next.js — sole developer, twelve phases, live in production for a nonprofit.',
    proof: 'In production',
    status: 'live',
    statusUrl: 'https://msp.cyberready.clinic',
    statusSub: 'msp.cyberready.clinic',
    cases: [
      {
        heading: 'The problem',
        body: 'Managed-service providers had no fast, credible way to measure a client’s cybersecurity readiness — assessments lived in spreadsheets and consultants’ heads.',
      },
      {
        heading: 'What I built',
        body: 'A guided assessment on Dynamics 365 / Power Platform with a Next.js front end. Twelve phases from data model to scoring to reporting, shipped solo across the full stack.',
      },
      {
        heading: 'Proof',
        body: 'Live in production and in use by a cybersecurity nonprofit. Sole developer — data model, business logic, front end, and deploys.',
      },
    ],
    metrics: [
      { value: '12', label: 'Phases shipped' },
      { value: '1', label: 'Developer (me)' },
      { value: 'Prod', label: 'Status' },
    ],
    links: [{ label: 'Visit live', href: 'https://msp.cyberready.clinic', external: true }],
  },
  {
    id: 'rocketpark-craft-ecosystem',
    title: 'Craft CMS Ecosystem',
    org: 'Rocketpark Agency · Developer',
    years: '2024–26',
    summary:
      'Ten live client websites on Craft CMS — PHP, Twig, and a shared component system across the agency portfolio.',
    proof: '10 live sites',
    status: 'sites',
    statusSub: '10 live sites',
    cases: [
      {
        heading: 'Context',
        body: 'Agency work — a portfolio of client sites that each need to ship fast, stay maintainable, and share a design language without becoming copy-paste.',
      },
      {
        heading: 'What I do',
        body: 'Build and maintain ten Craft CMS sites in PHP and Twig, with reusable components and content models tuned for non-technical editors.',
      },
    ],
    metrics: [
      { value: '10', label: 'Live client sites' },
      { value: 'PHP', label: '/ Twig / Craft' },
    ],
    links: [],
  },
  {
    id: 'timeslip-search',
    title: 'TimeSlipSearch',
    org: 'Personal · Creator',
    years: '2026',
    summary: 'A conversational AI agent searching 420,000 pop-culture records in plain language.',
    proof: '★ $750 contest win',
    status: 'live',
    statusUrl: 'https://timeslipsearch.vercel.app',
    statusSub: '★ Algolia winner',
    // note: write-up link set below to the real DEV.to announcement
    cases: [
      {
        heading: 'The build',
        body: 'An LLM agent over 420k records with Algolia retrieval — ask it anything in natural language and it reasons across the catalogue instead of keyword-matching.',
      },
      {
        heading: 'Why it matters',
        body: 'The one project here with an externally-verified outcome: it won a real, judged competition against a field of entries.',
      },
    ],
    metrics: [
      { value: '$750', label: 'Algolia Agent Studio win' },
      { value: '420K', label: 'Records searched' },
    ],
    links: [
      { label: 'Try it live', href: 'https://timeslipsearch.vercel.app', external: true },
      {
        label: 'Read the write-up',
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
    summary: 'A codebase-narrator CLI that explains an unfamiliar repo through 14 MCP tools.',
    proof: '↗ Published on npm',
    status: 'npm',
    statusSub: '@purplegumdropz/specter',
    cases: [
      {
        heading: 'What it is',
        body: 'Point it at a repository and it narrates how the code fits together, exposing 14 Model-Context-Protocol tools so an AI agent can explore the codebase with structure instead of guesswork.',
      },
    ],
    metrics: [
      { value: '14', label: 'MCP tools' },
      { value: 'npm', label: 'Published, installable' },
    ],
    links: [
      {
        label: 'View on npm',
        href: 'https://www.npmjs.com/package/@purplegumdropz/specter',
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
      'Turns a screenshot into React — grounded against a real component catalogue so the output is usable, not hallucinated.',
    proof: '★ DEV.to winner',
    status: 'live',
    statusUrl: 'https://trace-liz.vercel.app',
    statusSub: '★ DEV.to winner',
    cases: [
      {
        heading: 'The idea',
        body: 'Most screenshot-to-code tools hallucinate components that don’t exist in your system. Trace grounds generation against a real catalogue, so what comes out is code you can actually merge.',
      },
    ],
    metrics: [
      { value: '★', label: 'DEV.to contest win' },
      { value: '38', label: 'Tests' },
    ],
    links: [
      { label: 'Live demo', href: 'https://trace-liz.vercel.app', external: true },
      { label: 'GitHub', href: 'https://github.com/forbiddenlink/trace', external: true },
    ],
  },
  {
    id: 'autodocs-ai',
    title: 'AutomaDocs',
    org: 'Personal · Creator',
    years: '2024–26',
    summary:
      'A documentation SaaS built on retrieval-augmented generation, with tiered Stripe billing.',
    proof: 'Live SaaS',
    status: 'live',
    statusUrl: 'https://automadocs.com',
    statusSub: 'automadocs.com',
    cases: [
      {
        heading: 'What it is',
        body: 'Feed it your sources and it answers documentation questions with RAG — a full product with subscription tiers, auth, and Stripe billing wired in, not a demo.',
      },
    ],
    metrics: [
      { value: 'Live', label: 'SaaS with billing' },
      { value: 'RAG', label: '+ Stripe / Next.js' },
    ],
    links: [{ label: 'Visit live', href: 'https://automadocs.com', external: true }],
  },
  {
    id: 'hq',
    title: 'hq',
    org: 'Personal · Creator',
    years: '2026',
    summary: 'The dev-ops CLI I actually run every day — one command across ~90 repos and 10 APIs.',
    proof: '216 tests · daily driver',
    status: 'cli',
    statusSub: 'daily driver',
    cases: [
      {
        heading: 'Why it exists',
        body: 'The most lived-in thing here: the command-line tool I built to run my own operation — one interface over ~90 repositories and 10 services. I use it every day, which is the real test.',
      },
    ],
    metrics: [
      { value: '216', label: 'Tests passing' },
      { value: '~90', label: 'Repos managed' },
      { value: '10', label: 'APIs wired' },
    ],
    links: [],
  },
  {
    id: 'hire-ready',
    title: 'HireReady',
    org: 'Personal · Creator',
    years: '2026',
    summary:
      'Voice-AI interview practice using the OpenAI Realtime API and FSRS-5 spaced repetition.',
    proof: 'Live SaaS · 150 tests',
    status: 'live',
    statusUrl: 'https://imhireready.com',
    statusSub: 'imhireready.com',
    cases: [
      {
        heading: 'What it is',
        body: 'Practise interviews out loud with a voice agent on the OpenAI Realtime API, with FSRS-5 spaced repetition scheduling what you review next. A live SaaS.',
      },
    ],
    metrics: [
      { value: 'Live', label: 'SaaS' },
      { value: '150', label: 'Tests' },
      { value: 'Realtime', label: 'OpenAI voice' },
    ],
    links: [{ label: 'Visit live', href: 'https://imhireready.com', external: true }],
  },
]
