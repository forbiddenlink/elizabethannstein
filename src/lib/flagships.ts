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
    org: 'Cybersecurity nonprofit · Sole Developer',
    years: '2025-26',
    summary:
      'A cybersecurity-readiness assessment platform on Dynamics 365, Dataverse, and Next.js: sole developer, twelve phases, live in production for a nonprofit (client confidential).',
    proof: 'In production',
    status: 'sites',
    statusSub: 'Dynamics 365',
    cases: [
      {
        heading: 'The Problem',
        body: 'Managed-service providers (MSPs) and healthcare entities lacked an automated, auditable methodology to quantify organizational cybersecurity readiness. Critical assessments previously relied on manual spreadsheets and disconnected consultations.',
      },
      {
        heading: 'System Architecture',
        body: 'Architected a unified 12-phase assessment platform spanning a governed Dataverse relational schema, Power Automate automated scoring orchestration, and an externalized Next.js 16 + React 19 assessor web app with Microsoft Entra ID (MSAL) role-based access control.',
      },
      {
        heading: 'Production Outcome',
        body: 'Live in production for a national cybersecurity nonprofit. Sole developer owning data models, business logic, front-end architecture, and deployment pipelines.',
      },
    ],
    metrics: [
      { value: '12', label: 'Phases shipped' },
      { value: '1', label: 'Sole developer' },
      { value: 'Prod', label: 'Live status' },
    ],
    links: [],
  },
  {
    id: 'rocketpark-craft-ecosystem',
    title: 'Craft CMS Ecosystem',
    org: 'Rocketpark Agency · Developer',
    years: '2024-26',
    summary:
      'Eleven live client websites on Craft CMS: PHP, Twig, custom MCP server tooling, and a shared component system across the agency portfolio.',
    proof: '11 live sites',
    status: 'sites',
    statusSub: '11 live sites',
    cases: [
      {
        heading: 'Context & Scale',
        body: 'Managing rapid client delivery across a diverse portfolio of agency sites spanning service, e-commerce, and high-traffic editorial content.',
      },
      {
        heading: 'Technical Execution',
        body: 'Built and maintained 11 production Craft CMS sites utilizing PHP, Twig templates, Composer plugin pipelines, Herd local parity, and Craft Project-Config CLI for deterministic schema migrations.',
      },
      {
        heading: 'Engineering Tooling',
        body: 'Developed internal MCP server wrappers and QA diagnostics (rocket-vitals) that automated regression scans and content-model validations across client deployments.',
      },
    ],
    metrics: [
      { value: '11', label: 'Live client sites' },
      { value: 'PHP', label: '/ Twig / Craft' },
      { value: 'MCP', label: 'Dev tooling' },
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
    cases: [
      {
        heading: 'The Concept',
        body: 'Input any date from 1958 to 2020 and receive an authentic, era-aware cultural snapshot (Billboard #1, box office hits, economic FRED baselines, and historical events) synthesized into a cohesive time-travel narrative.',
      },
      {
        heading: 'Algolia Multi-Index Pipeline',
        body: 'Dispatches parallel queries across four Algolia indices (Billboard, TMDB, FRED prices, Wikimedia). An LLM synthesizes the structured payloads into an era-specific narrative rendered inside a custom CRT/VHS scanline interface with Upstash rate-limiting and Langfuse observability.',
      },
      {
        heading: 'Contest Victory',
        body: 'Won the Algolia Agent Studio Challenge ($750 USD + DEV++ award) against a global field of developer submissions, praised for making deep data archives intuitive and engaging.',
      },
    ],
    metrics: [
      { value: '$750', label: 'Algolia Studio Win' },
      { value: '420K', label: 'Records searched' },
      { value: '4', label: 'Indices fused' },
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
        heading: 'Core Capability',
        body: 'Analyzes codebases via TypeScript AST parsing to narrate architecture, dependencies, dead code, and complexity hotspots in first person across 12 distinct persona modes.',
      },
      {
        heading: 'Model Context Protocol',
        body: 'Exposes 14 Model Context Protocol (MCP) server tools over stdio and SSE, allowing Claude Desktop and cursor agents to explore codebase graphs with structured AST precision rather than raw grep queries.',
      },
      {
        heading: 'Distribution & Tests',
        body: 'Published on the public npm registry as @purplegumdropz/specter with 65 CLI commands, 216 automated tests, and cross-platform Node.js/Bun support.',
      },
    ],
    metrics: [
      { value: '14', label: 'MCP tools' },
      { value: '65', label: 'CLI commands' },
      { value: 'npm', label: 'Published on npm' },
    ],
    links: [
      {
        label: 'View on npm',
        href: 'https://www.npmjs.com/package/@purplegumdropz/specter',
        external: true,
      },
      {
        label: 'GitHub Repository',
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
      'Turns a screenshot into React, grounded against a real component catalogue so the output is usable, not hallucinated.',
    proof: '★ DEV.to winner',
    status: 'live',
    statusUrl: 'https://trace-liz.vercel.app',
    statusSub: '★ DEV.to winner',
    cases: [
      {
        heading: 'Grounded Vision AI',
        body: 'Unlike generic screenshot-to-code generators that hallucinate non-existent markup, Trace enforces an in-prompt whitelist of shadcn design system primitives using Google Gemini 1.5 Pro.',
      },
      {
        heading: 'Live Sandpack & Self-Repair',
        body: 'Renders the generated TypeScript JSX live in an editable in-browser Sandpack sandbox, with an automated compile-check repair loop and real-time axe-core accessibility auditing with one-click fixes.',
      },
      {
        heading: 'Contest Winner',
        body: 'Winner of the DEV.to GitHub Finish-Up-A-Thon competition. Features 38 automated tests and live confidence inspection.',
      },
    ],
    metrics: [
      { value: '★', label: 'DEV.to Contest Win' },
      { value: '38', label: 'Automated tests' },
      { value: '100%', label: 'Catalogue grounded' },
    ],
    links: [
      { label: 'Live demo', href: 'https://trace-liz.vercel.app', external: true },
      { label: 'GitHub', href: 'https://github.com/forbiddenlink/trace', external: true },
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
      'A documentation SaaS built on retrieval-augmented generation, with tiered Stripe billing.',
    proof: 'Live SaaS',
    status: 'live',
    statusUrl: 'https://automadocs.com',
    statusSub: 'automadocs.com',
    cases: [
      {
        heading: 'Hybrid RAG Pipeline',
        body: 'Combines Pinecone vector embeddings with BM25 keyword retrieval and Tree-sitter AST parsing to generate and maintain accurate technical code documentation.',
      },
      {
        heading: 'Automated Git Sync',
        body: 'Listens to GitHub webhook events to trigger background documentation rebuilds on git push, eliminating stale developer docs.',
      },
      {
        heading: 'SaaS Monetization',
        body: 'Full subscription billing with Stripe ($35-$239/mo across Pro, Team, and Business tiers), Supabase authentication, and Redis job queues.',
      },
    ],
    metrics: [
      { value: 'Live', label: 'SaaS with billing' },
      { value: 'RAG', label: 'Pinecone + BM25' },
      { value: '$35-239', label: 'Stripe tiers' },
    ],
    links: [{ label: 'Visit live', href: 'https://automadocs.com', external: true }],
  },
  {
    id: 'hq',
    title: 'hq',
    org: 'Personal · Creator',
    years: '2026',
    summary: 'The dev-ops CLI I actually run every day: one command across ~90 repos and 10 APIs.',
    proof: '216 tests · daily driver',
    status: 'cli',
    statusSub: 'personal CLI',
    cases: [
      {
        heading: 'DevOps Aggregator',
        body: 'A high-performance command-line operations tool built on Bun and TypeScript that queries 10 service APIs in parallel (GitHub, Vercel, Sentry, Stripe, Notion, ClickUp, UptimeRobot, Railway, Jira).',
      },
      {
        heading: 'Actionable Signal Filtering',
        body: 'Aggregates state across 90+ repositories into prioritized work contexts (CRC / Rocketpark / Personal), filtering out routine noise to surface only broken builds, failing webhooks, and blocking reviews.',
      },
      {
        heading: 'Reliability',
        body: '216 unit and integration tests ensuring reliable daily operation as the primary terminal dashboard for all production projects.',
      },
    ],
    metrics: [
      { value: '216', label: 'Tests passing' },
      { value: '~90', label: 'Repos managed' },
      { value: '10', label: 'APIs unified' },
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
        heading: 'Realtime Voice AI',
        body: 'Integrates the OpenAI Realtime voice API for low-latency conversational mock interviews with real-time speech evaluation and dynamic follow-up questioning.',
      },
      {
        heading: 'FSRS-5 Scheduling',
        body: 'Utilizes the state-of-the-art Free Spaced Repetition Scheduler (FSRS-5) algorithm to schedule review intervals across 1,300+ interview questions categorized by company tracks (FAANG + Stripe + Uber).',
      },
      {
        heading: 'Production SaaS',
        body: 'Live commercial web application with Stripe subscriptions, Supabase persistence, and 150 automated tests.',
      },
    ],
    metrics: [
      { value: 'Live', label: 'SaaS on web' },
      { value: '150', label: 'Automated tests' },
      { value: 'FSRS-5', label: 'Spaced repetition' },
    ],
    links: [{ label: 'Visit live', href: 'https://imhireready.com', external: true }],
  },
]
