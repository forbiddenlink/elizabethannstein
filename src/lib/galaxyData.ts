// Single source of truth for all project data
// Used by both /work routes and 3D scene

import type { Galaxy } from './types'

export const galaxies: Galaxy[] = [
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Client and employer work, plus one practice monorepo',
    narrative: 'Work for clients and employers, plus one practice build.',
    color: '#FF6B35',
    size: 3,
    projects: [
      {
        id: 'coulson-one',
        title: 'Coulson One',
        description:
          'A practice monorepo from 2025 for oil and gas field operations: a NestJS API on Postgres and Redis, a Next.js dashboard, and an Expo mobile app. It tracks projects, wells and loads, scores vendors, and flags quotes priced above the historical average.',
        role: 'Creator',
        tags: ['TypeScript', 'NestJS', 'Next.js', 'Expo'],
        color: '#FF6B35',
        brightness: 2,
        size: 'supermassive',
        galaxy: 'enterprise',
        featured: true,
        dateRange: '2025',
        challenge:
          'I wanted one product across an API, a web dashboard and a mobile app, with four user roles (admin, dispatcher, carrier manager and driver) and live GPS updates.',
        solution:
          'NestJS 11 with TypeORM, Redis, Socket.io for WebSockets, and JWT auth with refresh tokens. The web app is Next.js 16 and the mobile app is Expo. The cost side has vendor scorecards, regional price benchmarks and overpricing alerts.',
      },
      {
        id: 'flo-labs',
        title: 'Flo Labs International',
        description:
          'I led the technical side of six Flo Labs sites for AI and robotics ventures, educational programs and research projects. We redesigned them on React and Next.js with one shared design system, with a team of 3 to 4 developers.',
        role: 'Design Team Lead',
        company: 'Flo Labs',
        tags: ['Next.js', 'Strapi', 'CMS', 'Design Systems'],
        color: '#FF6B35',
        brightness: 1.3,
        size: 'medium',
        galaxy: 'enterprise',
        // Note: Live sites owned by client
        featured: false,
        dateRange: '2024-2026',
        challenge: 'Six production sites, each with its own audience, built by 3 to 4 developers.',
        solution:
          'A full redesign of flolabs.international, flolabsrd.com, CAIPO.ai, FloStudios.ai, MoodChanger.ai and RoboCollective.ai on React and Next.js with one design system. Strapi CMS and Railway went into the production sites.',
        impact: 'I mentored three or more developers and designers through code reviews.',
        impactMetrics: [
          { label: 'Production Sites', value: '6', icon: 'globe' },
          { label: 'Team Size', value: '3-4 devs', icon: 'users' },
        ],
      },
      {
        id: 'caipo-ai',
        title: 'CAIPO.ai',
        description:
          'One of the six Flo Labs sites. I led the front-end work on the AI platform, built with Next.js and Strapi on the shared design system.',
        role: 'Design Team Lead',
        company: 'Flo Labs',
        tags: ['React', 'Next.js', 'AI', 'Strapi'],
        color: '#FF6B35',
        brightness: 1.2,
        size: 'small',
        galaxy: 'enterprise',
        // Note: Live site owned by client
        featured: false,
        dateRange: '2024',
        solution:
          'The pages use the shared component library and design system from the other Flo Labs sites.',
      },
      {
        id: 'moodchanger-ai',
        title: 'MoodChanger.ai',
        description:
          'One of the six Flo Labs sites: a mood tracking and wellness tool that gives AI-generated suggestions. I designed the interface and built it in Next.js with Strapi.',
        role: 'Design Team Lead',
        company: 'Flo Labs',
        tags: ['Next.js', 'Strapi', 'AI'],
        color: '#FF6B35',
        brightness: 1.1,
        size: 'small',
        galaxy: 'enterprise',
        // Note: Live site owned by client
        featured: false,
        dateRange: '2024',
        challenge:
          'A wellness app should feel supportive, and the AI needs the context of how someone says they feel.',
        solution:
          'Soft color transitions and small, gentle interactions, with AI suggestions based on the mood a person logs.',
      },
      {
        id: 'security-readiness-platform',
        title: 'Security Readiness Platform',
        description:
          'A security-readiness assessment in production for a cybersecurity nonprofit (client confidential). It runs on Dynamics 365, Power Platform and Dataverse, with a Next.js front end. I built it in 12 implementation phases and I am the sole developer.',
        role: 'Director of Software Engineering',
        company: 'Cybersecurity nonprofit (confidential)',
        tags: ['Next.js 16', 'React 19', 'Dataverse', 'Power Automate', 'Dynamics 365'],
        color: '#FF6B35',
        brightness: 2,
        size: 'supermassive',
        galaxy: 'enterprise',
        links: {},
        status: 'live',
        featured: true,
        dateRange: '2025-2026',
        solution:
          'Twelve implementation phases on Dynamics 365, Power Platform and Dataverse, with a Next.js front end.',
        impact:
          'In production. I have been Director of Software Engineering since September 2025 and the sole developer since June 2026.',
        impactMetrics: [{ label: 'Phases Shipped', value: '12', icon: 'layers' }],
      },
      {
        id: 'crc-leadgen',
        title: 'Lead-Gen & Ops Platform',
        description:
          'A lead-generation and operations site I built for the same cybersecurity nonprofit (client confidential). Next.js 16, React 19, Drizzle and Neon Postgres, hosted on Vercel.',
        role: 'Developer',
        company: 'Cybersecurity nonprofit (confidential)',
        tags: ['Next.js 16', 'React 19', 'Drizzle', 'Neon', 'Better Auth'],
        color: '#FF6B35',
        brightness: 1.6,
        size: 'large',
        galaxy: 'enterprise',
        status: 'live',
        featured: true,
        dateRange: '2025-2026',
        solution:
          'Next.js 16 App Router on Vercel, with Drizzle and Neon Postgres for data and Better Auth for sign-in.',
        impact: 'In production on Vercel.',
      },
      {
        id: 'rocketpark-craft-ecosystem',
        title: 'Rocketpark Agency: Craft CMS Ecosystem',
        description:
          'At Rocketpark I run Craft CMS version upgrades, plugin updates and infrastructure work across 11 client sites, and turn Figma designs into Twig templates.',
        role: 'Software Engineering Intern',
        company: 'Rocketpark',
        tags: ['Craft CMS', 'PHP', 'Twig', 'Composer', 'Herd'],
        color: '#FF6B35',
        brightness: 1.4,
        size: 'large',
        galaxy: 'enterprise',
        featured: true,
        dateRange: '2025-2026',
        challenge:
          'Keeping 11 client sites on current Craft versions and plugins without breaking them.',
        solution:
          'I standardized the Craft project-config CLI workflow, so content-model changes show up in version control, and I build templates in Twig and Tailwind from Figma designs.',
        impact: 'Content-model changes on the 11 sites are traceable in version control.',
        impactMetrics: [{ label: 'Client Sites', value: '11', icon: 'globe' }],
      },
      {
        id: 'robocollective-ai',
        title: 'RoboCollective.ai',
        description:
          'One of the six Flo Labs sites: an AI and robotics showcase with interactive demos, with content managed in Strapi.',
        role: 'Design Team Lead',
        company: 'Flo Labs',
        tags: ['Next.js', 'Strapi', 'AI'],
        color: '#FF6B35',
        brightness: 1,
        size: 'small',
        galaxy: 'enterprise',
        // Note: Live site owned by client
        featured: false,
        dateRange: '2024',
        challenge: 'Explain robotics and AI to a mixed audience.',
        solution:
          'Interactive demos and visualizations on the shared design system, with a Strapi backend so the team can update the showcase.',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    description: 'Apps built around language models, search and agents',
    narrative: 'Apps that use AI models, including the Algolia contest winner.',
    color: '#00D9FF',
    size: 2,
    projects: [
      {
        id: 'timeslip-search',
        title: 'TimeSlipSearch',
        description:
          'Winner of the Algolia Agent Studio Challenge in March 2026, one of four winners ($750 and a DEV++ membership). A conversational search over 420,000+ pop-culture records from 1958 to 2020: ask for "summer of 69" or a birthday and it returns the number one song, what was in theaters, what gas cost and what made the news.',
        role: 'Creator',
        tags: ['Next.js 16', 'Algolia Agent Studio', 'Chart.js', 'Framer Motion', 'AI'],
        color: '#FFB800',
        brightness: 2,
        size: 'supermassive',
        galaxy: 'ai',
        metrics: { files: 420000 },
        links: {
          live: 'https://timeslipsearch.vercel.app',
          contestWin:
            'https://dev.to/devteam/congrats-to-the-algolia-agent-studio-challenge-winners-3ocn',
        },
        featured: true,
        dateRange: '2026',
        challenge:
          'Search 420,000+ records across 60+ years by exact date, birthday, range or loose phrase.',
        solution:
          'An Algolia Agent Studio agent answers in plain language over four indices (Billboard, TMDB, FRED and Wikimedia data). The app parses dates and eras, and adds voice search, achievements and a year-end "Wrapped" recap.',
        impact:
          'One of four winners of the Algolia Agent Studio Challenge, March 2026, and featured by DEV Community. Live at timeslipsearch.vercel.app.',
        impactMetrics: [
          { label: 'Contest Prize', value: '$750 + DEV++', icon: 'trophy' },
          { label: 'Records Indexed', value: '420K+', icon: 'database' },
          { label: 'Coverage', value: '1958-2020', icon: 'clock' },
        ],
      },
      {
        id: 'chronicle',
        title: 'Chronicle',
        description:
          'A local-first observability tool for AI agents, written in Rust. It records every LLM call and tool use, shows them on a timeline and as a graph, tracks token cost, and includes a caching proxy for OpenAI calls and an MCP server for querying traces.',
        role: 'Creator',
        tags: [
          'Rust',
          'Axum',
          'SQLite',
          'React 19',
          'TypeScript',
          'Vite',
          'Tailwind',
          'Python SDK',
        ],
        color: '#00D9FF',
        brightness: 1.9,
        size: 'large',
        galaxy: 'ai',
        featured: true,
        dateRange: '2025-2026',
        challenge:
          'When an agent run goes wrong, it is hard to see which call or tool use caused it, or what it cost.',
        solution:
          'An Axum and SQLite backend, a React 19 front end, and a Python SDK. Traces stay on your machine.',
        impact: 'The repository is private and now archived.',
      },
      {
        id: 'stancestream',
        title: 'StanceStream',
        description:
          'A real-time AI policy debate built for the Redis AI Challenge 2025. Agents debate over WebSockets, with Redis JSON, Streams, TimeSeries and Vector behind it, a semantic cache, and a fact-checking step.',
        role: 'Creator',
        tags: ['AI', 'Redis', 'WebSocket', 'GPT-4', 'React 19', 'Express.js'],
        color: '#00D9FF',
        brightness: 1.8,
        size: 'large',
        galaxy: 'ai',
        links: {
          live: 'https://stancestream.vercel.app',
          github: 'https://github.com/forbiddenlink/stancestream',
        },
        featured: true,
        dateRange: '2024',
        challenge:
          'Keep several AI agents debating in real time, each with memory, while using all four Redis data models.',
        solution:
          'An Express and WebSocket server, a React 19 and Vite front end, agents with persistent personalities, a Redis Vector semantic cache, and fact-checking against more than one source.',
        impact: 'Entered in the Redis AI Challenge 2025. Live at stancestream.vercel.app.',
        impactMetrics: [{ label: 'Redis Data Models', value: '4', icon: 'database' }],
      },
      {
        id: 'codebase-onboarding-tool',
        title: 'CodeCompass',
        description:
          'An AI tool for learning an unfamiliar codebase: architecture diagrams generated from the code, and RAG-based Q&A over it. Archived.',
        role: 'Creator',
        tags: ['TypeScript', 'AI', 'RAG'],
        color: '#00D9FF',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'ai',
        status: 'archived',
        featured: false,
        dateRange: '2024',
        challenge: 'Knowledge of a large codebase often lives in a few senior developers.',
        solution:
          'Diagrams generated from code analysis, and RAG over the indexed code to answer questions.',
      },
      {
        id: 'finance-quest',
        title: 'Finance Quest',
        description:
          'A financial literacy course with 18 chapters and more than 30 calculators. SM-2 spaced repetition schedules reviews, and an AI coach answers in context, using Claude with GPT-4o-mini as a fallback.',
        role: 'Creator',
        tags: ['Next.js 15', 'React 19', 'AI', 'Zustand', 'Recharts'],
        color: '#00D9FF',
        brightness: 1.8,
        size: 'large',
        galaxy: 'ai',
        links: { live: 'https://financequest.fyi' },
        featured: true,
        dateRange: '2024-2026',
        challenge: 'Make financial concepts stick, on a site built against WCAG 2.1 AA.',
        solution:
          'SM-2 scheduling for review intervals, interactive calculators, and an AI coach with a rule-based fallback when no AI provider is reachable. It is built against WCAG 2.1 AA but has not had an independent audit.',
        impact: 'Live at financequest.fyi.',
        impactMetrics: [
          { label: 'Chapters', value: '18', icon: 'book' },
          { label: 'Calculators', value: '30+', icon: 'calculator' },
        ],
      },
      {
        id: 'explainthiscode',
        title: 'ExplainThisCode.ai',
        description:
          'Paste code and get an explanation matched to your role and skill level. Modes cover standard, learning, performance, security and comparative explanations. Stripe handles subscriptions.',
        role: 'Creator',
        tags: ['Next.js 16', 'Supabase', 'OpenAI', 'Stripe', 'Prisma'],
        color: '#00D9FF',
        brightness: 1.7,
        size: 'large',
        galaxy: 'ai',
        links: { live: 'https://explainthiscode.ai' },
        featured: false,
        dateRange: '2024-2026',
        challenge: 'A student and a senior engineer need different explanations of the same code.',
        solution:
          'Next.js 16 with Supabase, role and skill-level settings that shape each explanation, and Stripe billing.',
        impact: 'Live at explainthiscode.ai.',
      },
      {
        id: 'dev-assistant-pro',
        title: 'Dev Assistant Pro',
        description:
          'A development assistant built around an MCP server, with a desktop IDE shell (Monaco editor, terminal and file tree). Archived.',
        role: 'Creator',
        tags: ['AI', 'CI/CD', 'Testing', 'DevOps'],
        color: '#00D9FF',
        brightness: 1.2,
        size: 'small',
        galaxy: 'ai',
        status: 'archived',
        // GitHub repo archived 2026-06
        featured: false,
        dateRange: '2024',
        challenge: 'Developer tooling is spread across many apps.',
        solution:
          'An MCP server with a tool registry, plus a desktop workspace with an editor, terminal and file tree.',
        impact: 'The GitHub repository was archived in June 2026.',
      },
      {
        id: 'tubedigest',
        title: 'TubeDigest',
        description:
          'Turns long YouTube videos into structured notes: an AI summary, topic tags, a mind map, full-text search, and optional export to GitHub.',
        role: 'Creator',
        tags: ['AI', 'Claude', 'Next.js', 'Supabase', 'YouTube'],
        color: '#00D9FF',
        brightness: 1.9,
        size: 'large',
        galaxy: 'ai',
        links: { live: 'https://tube-digest-ivory.vercel.app' },
        featured: false,
        dateRange: '2024',
        challenge: 'Long videos are hard to search once you have watched them.',
        solution:
          'An AI summary streams in, topics are extracted, a mind map is built from the summary structure, and everything is indexed for full-text search.',
        impact: 'Live at tube-digest-ivory.vercel.app.',
      },
      {
        id: 'autodocs-ai',
        title: 'AutomaDocs',
        description:
          'Connects to your GitHub repos, parses the code with Tree-sitter, and generates docs that refresh on every push. A chat answers questions about the code with citations to files and lines. Free, Pro ($49/mo) and Team ($149/mo) plans through Stripe.',
        role: 'Creator',
        tags: ['AI', 'Claude Sonnet', 'Tree-sitter', 'RAG', 'Stripe', 'PostgreSQL', 'Redis'],
        color: '#00D9FF',
        brightness: 2,
        size: 'supermassive',
        galaxy: 'ai',
        links: { live: 'https://automadocs.com' },
        featured: true,
        dateRange: '2024-2026',
        challenge: 'Docs go stale as soon as the code changes.',
        solution:
          'Claude writes the docs, Tree-sitter parses the code, and Pinecone retrieval backs the chat. A GitHub webhook regenerates docs on push. There is also an MCP server, a CLI and a GitHub Action.',
        impact: 'Live at automadocs.com with Stripe checkout.',
        impactMetrics: [
          { label: 'Pro plan', value: '$49/mo', icon: 'dollar' },
          { label: 'Team plan', value: '$149/mo', icon: 'dollar' },
        ],
      },
      {
        id: 'mcp-server-studio',
        title: 'MCP Server Studio',
        description:
          'A visual builder for MCP servers. Design tools, resources and prompts on a drag-and-drop canvas, test them in a built-in simulator, and export TypeScript server code with Docker and Railway deployment bundles.',
        role: 'Creator',
        tags: ['MCP', 'React Flow', 'Monaco Editor', 'Zustand', 'Next.js 15', 'TypeScript'],
        color: '#00D9FF',
        brightness: 2,
        size: 'large',
        galaxy: 'ai',
        metrics: { tests: 488 },
        links: { live: 'https://mcp-server-studio.vercel.app' },
        featured: false,
        dateRange: '2026',
        challenge:
          'Prototyping an MCP server by hand takes a lot of boilerplate and manual testing.',
        solution:
          'A React Flow canvas for tool design, a Monaco editor for live code preview, a test simulator, and a TypeScript code generator. It can also turn OpenAPI operations into MCP tool definitions.',
        impact: 'Live at mcp-server-studio.vercel.app.',
      },
      {
        id: 'lumira',
        title: 'Lumira (Autonomous AI Artist)',
        description:
          'An autonomous AI artist with ten emotional states, episodic and semantic memory, and a journal where it writes about what it made. The backend is Python and FastAPI.',
        role: 'Creator',
        tags: ['Python', 'FastAPI', 'Stable Diffusion', 'Hugging Face', 'Memory Systems'],
        color: '#00D9FF',
        brightness: 1.8,
        size: 'large',
        galaxy: 'ai',
        links: { github: 'https://github.com/forbiddenlink/lumira' },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'I wanted an AI artist with moods and preferences that change over time.',
        solution:
          'Ten emotional states that shape each piece, episodic and semantic memory, a ReAct-style journal entry after each image, and a multi-armed bandit that adapts to feedback.',
      },
      {
        id: 'contradictme',
        title: 'ContradictMe',
        description:
          'A debate trainer. State a position and it argues the strongest opposing case, with evidence and rebuttals. The chat runs through an Algolia Agent Studio agent.',
        role: 'Creator',
        tags: ['Next.js 15', 'GPT-4', 'OpenAI', 'Framer Motion'],
        color: '#00D9FF',
        brightness: 1.6,
        size: 'large',
        galaxy: 'ai',
        metrics: { tests: 73 },
        links: {
          live: 'https://contradict-me.vercel.app',
          github: 'https://github.com/forbiddenlink/contradict-me',
        },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'Show people the best version of the other side.',
        solution:
          'The chat backend proxies to an Algolia Agent Studio endpoint. Conversations are stored in the browser, and Upstash Redis handles rate limiting.',
        impact: 'Live at contradict-me.vercel.app.',
      },
      {
        id: 'interview-ace',
        title: 'Interview Ace',
        description: 'An AI interview preparation app with mock interviews and feedback. Archived.',
        role: 'Creator',
        tags: ['AI', 'Next.js'],
        color: '#00D9FF',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'ai',
        status: 'archived',
        featured: false,
        dateRange: '2025',
        challenge: 'Practicing interviews usually needs a coach or a friend.',
        solution:
          'AI runs mock interviews with industry-specific questions and scores communication clarity and answer structure.',
      },
      {
        id: 'dev-interviewer',
        title: 'Dev Interviewer',
        description:
          'An earlier technical interview simulator with AI follow-up questions and live code evaluation. Its deployed URL now serves HireReady.',
        role: 'Creator',
        tags: ['AI', 'Code Evaluation'],
        color: '#00D9FF',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'ai',
        links: { live: 'https://dev-interviewer-iota.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Algorithm sites do not practice the live back-and-forth of a coding interview.',
        solution:
          'An AI interviewer that asks follow-up questions about your approach and evaluates your code.',
        impact: 'The old Dev Interviewer URL serves HireReady today.',
      },
      {
        id: 'storyvision',
        title: 'StoryVision',
        description:
          'Turns a book (PDF, EPUB or TXT) into a visual story. Claude Sonnet picks out scenes, and a Character Bible and Style Bible for each book keep characters looking the same across generated images.',
        role: 'Creator',
        tags: [
          'Next.js',
          'TypeScript',
          'Claude 3.5 Sonnet',
          'Hugging Face',
          'Prisma',
          'Supabase',
          'Tailwind CSS',
        ],
        color: '#00D9FF',
        brightness: 1.9,
        size: 'large',
        galaxy: 'ai',
        links: { live: 'https://storyvision-tawny.vercel.app' },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'Keep characters and style consistent across hundreds of generated images.',
        solution:
          'Claude Sonnet extracts the scenes, then generation goes to a pool of image and video providers. Imports run as background jobs on Inngest and Trigger.dev so a long novel does not block the UI.',
        impact: 'Live at storyvision-tawny.vercel.app.',
      },
    ],
  },
  {
    id: 'fullstack',
    name: 'Full-stack',
    description: 'Apps with accounts, a database and, in some cases, billing',
    narrative: 'Apps with sign-in and a database, some with Stripe billing.',
    color: '#9D4EDD',
    size: 2,
    projects: [
      {
        id: 'hire-ready',
        title: 'HireReady',
        description:
          'Technical interview prep with AI voice interviews on the OpenAI Realtime API, FSRS-5 spaced repetition, timed mock interviews with scorecards, and 1,300+ practice questions. Stripe handles Pro Monthly, Pro Annual and Lifetime plans.',
        role: 'Creator',
        tags: ['Next.js 15', 'Supabase', 'OpenAI Realtime', 'Stripe', 'Voice AI', 'FSRS-5'],
        color: '#9D4EDD',
        brightness: 2,
        size: 'large',
        galaxy: 'fullstack',
        metrics: { tests: 1606 },
        links: { live: 'https://imhireready.com' },
        featured: false,
        dateRange: '2026',
        challenge:
          'Interview prep tends to be a list of problems to grind. I wanted a loop of practice, feedback and scheduled review.',
        solution:
          'Voice interviews over the OpenAI Realtime API, reviews scheduled with ts-fsrs, timed mock rounds with scorecards, and XP, streaks and badges.',
        impact: 'Live at imhireready.com with Stripe checkout.',
        impactMetrics: [{ label: 'Practice Questions', value: '1,300+', icon: 'book' }],
      },
      {
        id: 'ucp-guard',
        title: 'UCP Guard',
        description:
          "Monitoring for Universal Commerce Protocol endpoints. It checks a store's /.well-known/ucp endpoint against the spec and sends alerts when something breaks. Next.js 16, Supabase, Stripe and Resend.",
        role: 'Creator',
        tags: ['Next.js 16', 'Supabase', 'Vercel Cron', 'UCP Protocol', 'Monitoring'],
        color: '#9D4EDD',
        brightness: 1.9,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://ucpguard.com' },
        status: 'in-progress',
        featured: false,
        dateRange: '2026',
        challenge: 'UCP endpoints can break without anyone noticing.',
        solution:
          'A validator checks each endpoint against the spec, a Vercel cron runs the checks on a schedule, and Resend sends the alerts. Stripe checkout is wired up.',
        impact: 'In progress. ucpguard.com is live.',
      },
      {
        id: 'carefulship',
        title: 'Carefulship',
        description:
          'Preview-first website audits. Add a site you track, and it crawls it, lists findings and exports reports. Background crawls run on Inngest, with Supabase for data, Playwright for dynamic checks and Langfuse for tracing the AI parts. Slack, email and Vercel integrations are optional.',
        role: 'Creator',
        tags: ['Next.js 16', 'React 19', 'Supabase', 'Inngest', 'Playwright', 'Sentry', 'Langfuse'],
        color: '#9D4EDD',
        brightness: 1.8,
        size: 'large',
        galaxy: 'fullstack',
        links: {},
        status: 'in-progress',
        featured: false,
        dateRange: '2026',
        challenge: 'One-off audit scripts do not watch a site over time.',
        solution:
          'Scheduled crawls, findings with severity scores, and exportable reports, with row-level security on the Supabase tables.',
        impact: 'In progress.',
      },
      {
        id: 'portfolio-pro',
        title: 'Portfolio-Pro',
        description:
          'A learning platform for AI development: 297 lessons in six tracks, a Monaco editor for live coding, custom MCP servers, and Stripe subscriptions.',
        role: 'Creator',
        tags: ['Next.js 15', 'Supabase', 'Stripe', 'OpenAI', 'Radix UI'],
        color: '#9D4EDD',
        brightness: 1.8,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://www.portfoliopro.dev' },
        featured: true,
        dateRange: '2023-2026',
        challenge:
          'Teaching AI development with real code needs an editor, runnable projects and billing.',
        solution:
          'Next.js with Supabase, a Monaco editor for live coding, custom MCP servers, and Stripe subscriptions.',
        impact: 'Live at portfoliopro.dev.',
        impactMetrics: [
          { label: 'Lessons', value: '297', icon: 'book' },
          { label: 'Tracks', value: '6', icon: 'layers' },
        ],
      },
      {
        id: 'create-surveys',
        title: 'Create Surveys',
        description:
          'A survey builder on React, TypeScript, Vite and Firebase, with five templates, several question types, conditional logic and real-time analytics.',
        role: 'Creator',
        tags: ['TypeScript', 'React', 'Vite', 'Firebase'],
        color: '#9D4EDD',
        brightness: 1.6,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://www.create-surveys.com' },
        featured: false,
        dateRange: '2024',
        challenge:
          'Google Forms is limited and enterprise survey tools are heavy. I wanted something in between.',
        solution:
          'A drag-and-drop builder, templates for customer satisfaction, employee engagement and product feedback, and an analytics dashboard that updates as responses arrive.',
        impact: 'Live at create-surveys.com.',
      },
      {
        id: 'skill-mapper',
        title: 'Skill Mapper',
        description:
          'A gamified skill-tree learning platform with progression tracking, achievements and interactive challenges. The tree is drawn with React Flow.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript', 'React Flow'],
        color: '#9D4EDD',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'fullstack',
        links: {
          live: 'https://skill-mapper-six.vercel.app',
          github: 'https://github.com/forbiddenlink/skill-mapper',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Progress in a skill is hard to see.',
        solution:
          'A skill tree you move through, with achievements and challenges that mark progress.',
        impact: 'Live at skill-mapper-six.vercel.app.',
      },
      {
        id: 'reprise',
        title: 'RepRise',
        description:
          'A fitness trainer matching app. A weighted score combines goal overlap (Jaccard similarity), budget, schedule overlap and personality fit.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript'],
        color: '#9D4EDD',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'fullstack',
        links: { live: 'https://reprise-tau.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge:
          'Schedule, budget, personality and goals do not share a unit, so a match needs a rule for weighing them.',
        solution:
          'Weighted scoring with Jaccard similarity for goals, a budget constraint that works as a hard filter, and schedule overlap.',
        impact: 'Live at reprise-tau.vercel.app.',
      },
      {
        id: 'willwise',
        title: 'WillWise',
        description:
          'An estate planning app focused on digital assets such as crypto and cloud accounts. A questionnaire of about 45 minutes produces a will as a PDF, and Stripe takes payment.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript', 'Clerk', 'Supabase', 'Stripe', 'PDF Generation'],
        color: '#9D4EDD',
        brightness: 1.6,
        size: 'large',
        galaxy: 'fullstack',
        featured: false,
        dateRange: '2025',
        challenge:
          'Estate planning usually leaves out digital assets and needs a lawyer even for a simple will.',
        solution:
          'A step-by-step questionnaire covering digital and physical assets, state-specific guides, PDF generation and Stripe payments.',
      },
      {
        id: 'aqualog',
        title: 'AquaLog',
        description:
          'A free PWA for home aquarium hobbyists: multi-tank logs, water parameter charts, maintenance schedules, species compatibility checks, and AI predictions that warn before a parameter reaches a dangerous level. A paid plan lifts the one-tank limit.',
        role: 'Creator',
        tags: ['Next.js', 'React', 'TypeScript', 'PWA', 'Recharts', 'Supabase', 'AI'],
        color: '#9D4EDD',
        brightness: 1.8,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://myaqualog.com' },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'Fishkeepers lose track of water tests and maintenance across tanks.',
        solution:
          'One running log for each tank, charts of pH, ammonia, nitrite and nitrate over time, and a maintenance scheduler.',
        impact: 'Live at myaqualog.com.',
      },
      {
        id: 'dareuradio',
        title: 'DareU Radio',
        description:
          'A site for DareU Radio, a live digital radio station: a built-in streaming player, show programming pages, app download links and social links, with content managed in Sanity. I built it as IT Specialist and Website Architect through the Riipen program with Capella University.',
        role: 'IT Specialist & Website Architect',
        company: 'DareU Radio (Riipen)',
        tags: [
          'Next.js',
          'React',
          'TypeScript',
          'Sanity CMS',
          'Audio Streaming',
          'Mobile Integration',
        ],
        color: '#9D4EDD',
        brightness: 1.8,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://dareuradio.com' },
        featured: false,
        dateRange: '2025-2026',
        challenge:
          'A live station with a growing audience and a mobile app needed a working site, on a remote team with several stakeholders.',
        solution:
          'A streaming player, show programming pages, app download links, social links and a Sanity CMS the station can fill in itself.',
        impact: 'The founder, Brenna Martin, wrote me a recommendation letter in March 2026.',
        testimonial: {
          quote:
            'Elizabeth was the backbone of this project. While every team member played a role in bringing the DAREU Radio website to life, it was Elizabeth who carried the technical weight and delivered a product that exceeded expectations.',
          author: 'Brenna Martin',
          role: 'Founder & Station Director, DAREU Radio',
          date: 'March 2026',
        },
      },
      {
        id: 'kindred',
        title: 'Kindred',
        description:
          'A knowledge workspace with AI built in. Pages are blocks (BlockNote and Tiptap), Yjs CRDTs sync edits between people and work offline, and Supertags add properties to pages.',
        role: 'Creator',
        tags: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'Yjs', 'CRDTs', 'AI'],
        color: '#9D4EDD',
        brightness: 1.8,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://quantum-forge-self.vercel.app' },
        featured: true,
        dateRange: '2025-2026',
        challenge:
          'Obsidian works offline and Notion does real-time collaboration. I wanted both in one tool.',
        solution:
          'Yjs CRDTs for conflict-free sync that also works offline, a BlockNote and Tiptap block editor, Supertags for organizing pages, and built-in AI.',
        impact: 'Live at quantum-forge-self.vercel.app.',
        impactMetrics: [{ label: 'Stack', value: 'Next.js 16 + Postgres', icon: 'layers' }],
      },
      {
        id: 'testimoniq',
        title: 'Testimoniq',
        description:
          'A SaaS for collecting customer testimonials as text, video or images and showing them on your site with 11 widget layouts. AI scores sentiment and quality, and there are NPS surveys and SMS requests. Stripe billing has Free, Pro and Agency plans.',
        role: 'Creator',
        tags: ['Next.js', 'React', 'TypeScript', 'Stripe', 'AI'],
        color: '#9D4EDD',
        brightness: 1.6,
        size: 'large',
        galaxy: 'fullstack',
        links: { live: 'https://testimoniq.com' },
        featured: false,
        dateRange: '2026',
        challenge:
          'Customer quotes end up scattered across email and Slack, and getting them onto a site takes manual work.',
        solution:
          'Branded collection forms with video recording and ratings, AI sentiment scoring, and embeddable widgets. Stripe Checkout handles the paid plans.',
        impact: 'Live at testimoniq.com with Stripe checkout.',
        impactMetrics: [{ label: 'Widget Layouts', value: '11', icon: 'layout' }],
      },
      {
        id: 'dwello',
        title: 'Dwello',
        description:
          'A maintenance tracker for home, vehicles, equipment, pets, subscriptions, health and finances, built as a PWA.',
        role: 'Creator',
        tags: ['Next.js', 'React', 'TypeScript', 'PWA', 'Stripe', 'Trigger.dev'],
        color: '#9D4EDD',
        brightness: 1.3,
        size: 'medium',
        galaxy: 'fullstack',
        links: { live: 'https://dwello.vercel.app' },
        featured: false,
        dateRange: '2026',
        challenge: 'Oil changes, filter swaps and renewals get forgotten until something breaks.',
        solution: 'One app that tracks recurring maintenance across seven areas of life.',
      },
    ],
  },
  {
    id: 'devtools',
    name: 'Developer tools',
    description: 'Command-line tools, scanners and libraries for developers',
    narrative: 'CLIs, scanners and a QA product, including the packages on npm.',
    color: '#06FFA5',
    size: 1.5,
    projects: [
      {
        id: 'accessibility-checker',
        title: 'Precision Contrast Control',
        description:
          'Precision Contrast: an accessibility checker for designers and developers. It tests WCAG 2.1 (AA and AAA) and APCA contrast, suggests colors that meet a target ratio, simulates color blindness, and checks semantic structure, keyboard navigation, forms and image alt text.',
        role: 'Creator',
        tags: ['Accessibility', 'TypeScript'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        links: {
          live: 'https://accessibiliy-checker.vercel.app',
          github: 'https://github.com/forbiddenlink/accessibility-checker',
        },
        featured: false,
        dateRange: '2024',
        challenge: 'Most contrast checkers stop at contrast.',
        solution:
          'Contrast checks for WCAG 2.1 and APCA, color suggestions that keep your target ratio, color blindness simulation, and checks for page structure and keyboard navigation.',
        impact: 'Live at accessibiliy-checker.vercel.app.',
      },
      {
        id: 'mcp-wrapper',
        title: 'MCP Wrapper',
        description:
          "A Craft CMS plugin that exposes a site's content to AI assistants through the Model Context Protocol. I built it at Rocketpark.",
        role: 'Software Engineering Intern',
        company: 'Rocketpark',
        tags: ['MCP', 'AI', 'Tooling'],
        color: '#06FFA5',
        brightness: 1,
        size: 'small',
        galaxy: 'devtools',
        featured: false,
        dateRange: '2025-2026',
        challenge: "An AI assistant has no direct way to read a Craft site's content.",
        solution:
          'An MCP server wrapper, packaged as a Craft plugin, that lets an assistant query and work with the content directly.',
      },
      {
        id: 'codememory',
        title: 'CodeMemory',
        description:
          'Flashcards and coding challenges scheduled with FSRS spaced repetition. It has a guest mode and optional GitHub sign-in, and it treats forgetting like a failing test.',
        role: 'Creator',
        tags: ['React'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        featured: false,
        dateRange: '2024',
        challenge: 'Web development concepts fade unless you review them on time.',
        solution:
          'The FSRS scheduler sets each review, and coding challenges sit next to the flashcards.',
      },
      {
        id: 'trace',
        title: 'Trace',
        description:
          'Paste a screenshot and get a React component you can run and edit. Gemini 2.5 Flash recreates the layout from a shadcn-style component catalog, then shows which part of the screenshot became which component, with a confidence tag on each. Won the DEV GitHub Finish-Up-A-Thon.',
        role: 'Creator',
        tags: ['Next.js', 'React 19', 'TypeScript', 'Google Gemini', 'Sandpack', 'axe-core'],
        color: '#06FFA5',
        brightness: 1.8,
        size: 'large',
        galaxy: 'devtools',
        metrics: { tests: 30 },
        links: {
          live: 'https://trace-seven-ashen.vercel.app',
          github: 'https://github.com/forbiddenlink/trace',
          contestWin:
            'https://dev.to/liztacular/my-ai-tool-generated-garbage-jsx-so-i-grounded-it-in-shadcnui-and-finally-shipped-it-1i1n',
        },
        status: 'live',
        tier: 'flagship',
        featured: true,
        dateRange: '2026',
        challenge:
          'Screenshot-to-code output often ignores the design system it has to fit into, and gives you no way to check it.',
        solution:
          'Generation is limited to a component catalog listed in the prompt, so no vector database is needed. An inspector marks each element as grounded, inferred or guessed. The preview runs in an editable Sandpack sandbox, generated code is compile-checked and re-prompted on failure, and axe-core scores accessibility.',
        impact:
          'Winner of the DEV GitHub Finish-Up-A-Thon, July 2026. Live at trace-seven-ashen.vercel.app.',
      },
      {
        id: 'hq',
        title: 'hq',
        description:
          'A command-line tool I use every day to check my work in one place. It pulls from ten services (GitHub, Vercel, Sentry, Stripe, Notion, ClickUp, UptimeRobot, Miniflux, Railway and Jira) across about 90 repos, groups the results by job, and prints only what is broken or blocking.',
        role: 'Creator',
        tags: ['TypeScript', 'Bun', 'CLI', 'Developer Tools', 'DevOps'],
        color: '#06FFA5',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'devtools',
        metrics: { tests: 966 },
        links: {},
        featured: true,
        dateRange: '2026',
        challenge:
          'My work is spread across about 90 repos and ten services, and checking what was broken meant opening each dashboard.',
        solution:
          'One CLI in TypeScript on Bun. It calls the ten service APIs, sorts the results into the nonprofit, Rocketpark and personal work, and prints what needs attention.',
        impact: 'I use it every day. The repository is private.',
        impactMetrics: [
          { label: 'Services', value: '10', icon: 'globe' },
          { label: 'Repos tracked', value: '~90', icon: 'folder' },
        ],
      },
      {
        id: 'ccscope',
        title: 'ccscope',
        description:
          'Reads Claude Code session data and shows how many tokens each skill, MCP server and plugin costs, so you can trim the ones you rarely use.',
        role: 'Creator',
        tags: ['TypeScript', 'CLI', 'Claude Code', 'Developer Tools'],
        color: '#06FFA5',
        brightness: 1.3,
        size: 'small',
        galaxy: 'devtools',
        metrics: { tests: 26 },
        links: {},
        featured: false,
        dateRange: '2026',
        challenge:
          'Claude Code loads many skills and MCP servers, and each one costs context. I had no view of which ones were worth it.',
        solution:
          'A CLI that parses session data and ranks skills, MCP servers and plugins by token cost.',
        impact: 'I used it to cut unused skills from my own setup.',
      },
      {
        id: 'recall',
        title: 'recall',
        description:
          'A local search engine over your Claude Code transcripts. Find past decisions and dead ends without anything leaving your machine.',
        role: 'Creator',
        tags: ['TypeScript', 'CLI', 'Search', 'Local-first'],
        color: '#06FFA5',
        brightness: 1.3,
        size: 'small',
        galaxy: 'devtools',
        metrics: { tests: 17 },
        links: {},
        featured: false,
        dateRange: '2026',
        challenge:
          'Months of Claude Code sessions hold useful reasoning, locked in plain-text logs.',
        solution:
          'A local index over the transcript files, so past sessions can be searched on your own machine.',
        impact: 'Transcripts are never uploaded.',
      },
      {
        id: 'gif-my-code',
        title: 'gif-my-code',
        description:
          'A Go CLI that renders animated GIFs of code with line highlighting. Chroma handles syntax highlighting and language detection, and it has laser-reveal and typing animations.',
        role: 'Creator',
        tags: ['Go', 'CLI', 'Developer Tools'],
        color: '#06FFA5',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'devtools',
        links: { github: 'https://github.com/forbiddenlink/gif-my-code' },
        featured: false,
        dateRange: '2025',
        challenge:
          'Animated code demos for READMEs and posts usually mean screen recording or a paid tool.',
        solution:
          'Chroma for highlighting, animation speed you can set, and a CLI you can call from CI.',
      },
      {
        id: 'repro-in-a-box',
        title: 'Repro-in-a-Box',
        description:
          'A QA agent that crawls a site with Playwright, finds bugs, and saves evidence you can replay: HAR files and screenshots. Detectors cover JavaScript errors, network failures, broken assets and links, mixed content, accessibility, SEO, security, performance and memory leaks. An MCP server lets Claude Desktop query the findings.',
        role: 'Creator',
        tags: ['Node.js', 'TypeScript', 'Playwright', 'MCP', 'Claude', 'QA Automation'],
        color: '#06FFA5',
        brightness: 1.7,
        size: 'large',
        galaxy: 'devtools',
        metrics: { tests: 385 },
        links: { github: 'https://github.com/forbiddenlink/repro-in-a-box' },
        featured: false,
        dateRange: '2025',
        challenge:
          'Bugs are hard to reproduce, and an AI assistant cannot see what a crawler found.',
        solution:
          'A Playwright crawler runs the detectors, bundles a HAR file and screenshots for each bug, and replays the HAR to check the bug reproduces. The MCP server exposes the findings.',
      },
      {
        id: 'imgzen',
        title: 'ImgZen',
        description:
          'A Rust GitHub Action that optimizes images in CI. It writes AVIF and WebP copies, runs oxipng on PNG and JPEG files, and can generate resized versions and add lazy loading to HTML.',
        role: 'Creator',
        tags: ['Rust', 'GitHub Actions', 'Performance', 'Images'],
        color: '#06FFA5',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'devtools',
        featured: false,
        dateRange: '2025',
        challenge: 'Image optimization is easy to forget and annoying to configure.',
        solution: 'A GitHub Action in Rust that needs no configuration to start.',
      },
      {
        id: 'encryption-visualizer',
        title: 'Encryption Visualizer',
        description:
          'Step-by-step visualizations of AES, RSA and hashing, so you can see what each stage does to the data.',
        role: 'Creator',
        tags: ['Cryptography', 'React'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        links: {
          live: 'https://encryption-visualizer-zeta.vercel.app',
          github: 'https://github.com/forbiddenlink/encryption-visualizer',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Cryptography is hard to learn from formulas alone.',
        solution:
          'Animated walkthroughs of each algorithm, with controls to step through every operation.',
        impact: 'Live at encryption-visualizer-zeta.vercel.app.',
      },
      {
        id: 'security-trainer',
        title: 'Security Trainer',
        description:
          'A hands-on web security course: lessons, in-browser code labs, quizzes and CTF-style challenges across 40+ modules, from SQL injection and XSS to OAuth, JWT and race conditions.',
        role: 'Creator',
        tags: ['Security', 'Next.js'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        links: { live: 'https://security-trainer.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Vulnerability labs are hard to set up, so most people only read about them.',
        solution:
          'Labs that run in the browser with a Monaco editor and a terminal simulator, with XP, badges and streaks.',
        impact: 'Live at security-trainer.vercel.app.',
      },
      {
        id: 'ally-a11y',
        title: 'Ally A11y CLI',
        description:
          'An accessibility CLI that scans pages with axe-core, scores issues by impact, and can apply fixes as you save files (`ally watch --fix-on-save`).',
        role: 'Creator',
        tags: ['CLI', 'Accessibility', 'Node.js', 'TypeScript', 'npm'],
        color: '#06FFA5',
        brightness: 1.7,
        size: 'large',
        galaxy: 'devtools',
        links: {
          github: 'https://github.com/forbiddenlink/ally',
          live: 'https://www.npmjs.com/package/ally-a11y',
        },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'Accessibility reports list problems and leave the fixing to you.',
        solution:
          'Impact scoring ranks the findings, and watch mode applies fixes it is at least 90% confident about when you save.',
        impact: 'Published on npm as ally-a11y under the MIT license.',
      },
      {
        id: 'api-watchdog',
        title: 'API Watchdog',
        description:
          'A monitor for breaking changes in the external APIs your app depends on. It polls schemas on a schedule, diffs them, and sends alerts by email, Slack or webhook.',
        role: 'Creator',
        tags: ['Node.js', 'TypeScript', 'Automation'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        featured: false,
        dateRange: '2026',
        challenge:
          'An API can change under you with no warning, and status pages only report uptime.',
        solution: 'Scheduled schema checks with a diff, and alerts when something changes.',
      },
      {
        id: 'multipersonas',
        title: 'MultiPersonas',
        description:
          'A CLI that crawls a site, including pages behind a login, and runs axe-core at every state it reaches. A second command adds LLM personas, such as a first-time visitor or a mobile user on slow 3G, that try to finish a task and report whether they could.',
        role: 'Creator',
        tags: ['TypeScript', 'CLI', 'AI', 'Automation'],
        color: '#06FFA5',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'devtools',
        links: {},
        featured: false,
        dateRange: '2026',
        challenge: 'The axe CLI does not crawl and does not hold a login session.',
        solution:
          '`scan` crawls with a saved session and runs axe-core on each state. `run` adds the personas.',
        impact:
          "In the repo's own head-to-head test, the personas did not find accessibility defects that the crawler missed, so I use them to measure task success.",
      },
      {
        id: 'mcp-token-tracker',
        title: 'MCP Token Tracker',
        description:
          'Scans MCP configs for Claude Desktop and other AI coding tools and estimates how many tokens each server loads into context, with recommendations for trimming.',
        role: 'Creator',
        tags: ['MCP', 'Monitoring', 'Node.js', 'TypeScript'],
        color: '#06FFA5',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'devtools',
        links: { github: 'https://github.com/forbiddenlink/mcp-token-tracker' },
        featured: false,
        dateRange: '2026',
        challenge: 'MCP servers load tool definitions into context, and the cost is easy to miss.',
        solution:
          'Reads the config files, estimates tokens for each server and a monthly cost, and suggests what to cut.',
      },
      {
        id: 'consent-compass',
        title: 'Consent Compass',
        description:
          'Scans a site for its cookie consent banner. It loads the URL in Playwright, takes a full-page screenshot, uses heuristics to find the banner and its accept and reject buttons, and reports findings with a score. An early version.',
        role: 'Creator',
        tags: ['Privacy', 'GDPR', 'CCPA', 'Next.js', 'TypeScript'],
        color: '#06FFA5',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'devtools',
        links: {
          live: 'https://consent-compass.vercel.app',
          github: 'https://github.com/forbiddenlink/consent-compass',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Consent banners are hard to check at scale without opening each site by hand.',
        solution:
          'A Next.js app with a Playwright scan route that records screenshots and signals as evidence for each finding.',
        impact: 'Live at consent-compass.vercel.app.',
      },
      {
        id: 'craft-audit',
        title: 'Craft Audit',
        description:
          'An audit tool for Craft CMS projects. It checks Twig templates for N+1 queries, missing eager loading and XSS risks, scans for known Craft and plugin CVEs, and checks security headers.',
        role: 'Creator',
        tags: ['Node.js', 'TypeScript'],
        color: '#06FFA5',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'devtools',
        links: { github: 'https://github.com/forbiddenlink/craft-audit' },
        featured: false,
        dateRange: '2026',
        challenge:
          'Craft sites pick up slow queries, outdated plugins and security gaps that code review can miss.',
        solution:
          'Static checks on templates and config, a plugin vulnerability list, an opt-in HTTP security headers check, a CSP generator, and a Craft 4 to 5 migration checker.',
      },
      {
        id: 'specter',
        title: 'Specter',
        description:
          'A published npm CLI that talks about your codebase in first person. It has 65 commands (hotspots, bus factor, dead code, why a file exists), 14 MCP tools so an AI assistant can query the repo, and 12 personality modes such as mentor, critic and noir.',
        role: 'Creator',
        tags: ['CLI', 'npm', 'MCP', 'Node.js', 'TypeScript'],
        color: '#06FFA5',
        brightness: 1.8,
        size: 'large',
        galaxy: 'devtools',
        metrics: { tests: 416 },
        links: {
          github: 'https://github.com/forbiddenlink/specter',
          live: 'https://www.npmjs.com/package/@purplegumdropz/specter',
        },
        featured: true,
        dateRange: '2025',
        challenge:
          'Complexity and churn numbers do not say who owns the risky code or why it exists.',
        solution:
          'Specter builds a knowledge graph of the repo from the source and its git history. The commands read from that graph, and the MCP server gives an AI assistant the same data.',
        impact: 'On npm as @purplegumdropz/specter, version 1.1.1.',
        impactMetrics: [
          { label: 'CLI Commands', value: '65', icon: 'terminal' },
          { label: 'MCP Tools', value: '14', icon: 'plug' },
          { label: 'Personality Modes', value: '12', icon: 'package' },
        ],
      },
      {
        id: 'rocket-vitals',
        title: 'Rocket Vitals',
        description:
          "Rocketpark's website QA product. Enter a URL and it crawls the site and runs more than 200 checks across SEO, accessibility, performance, security, links, content and AI readiness. Reports score findings by severity and include fix guidance and exports.",
        role: 'Lead Developer',
        company: 'Rocketpark',
        tags: ['Next.js', 'TypeScript', 'Playwright', 'QA', 'SEO', 'Accessibility'],
        color: '#06FFA5',
        brightness: 1.8,
        size: 'large',
        galaxy: 'devtools',
        links: { live: 'https://rocketvitals.com' },
        featured: false,
        dateRange: '2025-2026',
        challenge: 'Agencies need QA reports that a client can act on.',
        solution:
          'A crawler with checks for each category, severity scoring, and regression monitoring with thresholds you set, so score drops show up between scans.',
        impact: 'Live at rocketvitals.com. I lead development.',
        impactMetrics: [{ label: 'QA Checks', value: '200+', icon: 'check' }],
      },
      {
        id: 'site-sheriff',
        title: 'Site Sheriff',
        description:
          'A website QA scanner. Enter a URL and it crawls the site and reports SEO, performance, security and accessibility findings (axe-core), ranked by severity, with fix instructions and a summary email for a client. Archived.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'QA', 'SEO', 'Accessibility'],
        color: '#06FFA5',
        brightness: 1.7,
        size: 'large',
        galaxy: 'devtools',
        links: { github: 'https://github.com/forbiddenlink/site-sheriff' },
        status: 'archived',
        featured: false,
        dateRange: '2026',
        challenge: 'QA tools are either single-page checks or suites that take time to configure.',
        solution:
          'A crawler with static checks plus axe-core accessibility rules on desktop and mobile viewports, and severity-weighted findings.',
        impact: 'The GitHub repository is public and archived.',
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Websites and small UI projects',
    narrative: 'Websites and small UI projects where the layout and visuals came first.',
    color: '#FF006E',
    size: 1.5,
    projects: [
      {
        id: 'codecraft-dev',
        title: 'CodeCraft: Galactic Developer',
        description:
          'An educational coding game. You write HTML, CSS and JavaScript in a Monaco editor and watch it build a 3D space colony in React Three Fiber, with hints, mastery tracking and daily streaks.',
        role: 'Creator',
        tags: ['Next.js 16', 'Three.js', 'Monaco Editor', 'Redux', 'GSAP'],
        color: '#FF006E',
        brightness: 1.8,
        size: 'large',
        galaxy: 'design',
        links: { live: 'https://codecraft-dev-one.vercel.app' },
        // Note: GitHub repo is private
        featured: false,
        dateRange: '2024',
        challenge: 'Teach front-end code through play.',
        solution:
          'Challenges with starter templates and validation, and a 3D colony that updates as your code runs.',
        impact: 'Live at codecraft-dev-one.vercel.app. The repository is private.',
      },
      {
        id: 'color-studio',
        title: 'Color Studio',
        description:
          'A color tool for designers: HEX input, brightness, saturation and hue controls, complementary, analogous and triadic palettes, WCAG AA and AAA badges, and keyboard shortcuts.',
        role: 'Designer & Developer',
        tags: ['React'],
        color: '#FF006E',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'design',
        links: {
          live: 'https://color-studio-mu.vercel.app',
          github: 'https://github.com/forbiddenlink/color-studio',
        },
        featured: false,
        dateRange: '2024',
        challenge: 'Basic color pickers do not check contrast.',
        solution: 'Palette generation with contrast badges and live previews.',
        impact: 'Live at color-studio-mu.vercel.app.',
      },
      {
        id: 'space-travel',
        title: 'Space Travel Website',
        description:
          'A space tourism site in vanilla HTML, CSS and JavaScript, with Vite and Three.js. It has pages for destinations (Moon, Mars, Europa and Titan), crew and technology.',
        role: 'Designer & Developer',
        tags: ['HTML/CSS'],
        color: '#FF006E',
        brightness: 1.3,
        size: 'small',
        galaxy: 'design',
        links: {
          live: 'https://space-travel-website-theta.vercel.app',
          github: 'https://github.com/forbiddenlink/space-travel-website',
        },
        featured: false,
        dateRange: '2024',
        challenge: 'Build a full multi-page site without a UI framework.',
        solution: 'Vanilla JavaScript with Vite, and Three.js for the 3D moments.',
        impact: 'Live at space-travel-website-theta.vercel.app.',
      },
      {
        id: 'scenic-forests',
        title: 'Scenic Forests',
        description:
          'A multi-page cabin rental site in semantic HTML, CSS and a little JavaScript. I redid the visual design, added skip links and keyboard-friendly navigation, lazy-loaded images, and added SEO metadata.',
        role: 'Designer & Developer',
        tags: ['E-commerce'],
        color: '#FF006E',
        brightness: 1.2,
        size: 'small',
        galaxy: 'design',
        links: { github: 'https://github.com/forbiddenlink/scenic-forests' },
        featured: false,
        dateRange: '2024',
        challenge: 'A rental site should feel like a forest and still be easy to book.',
        solution:
          'Clearer form labels, a keyboard-friendly mobile nav, lazy-loaded images, and removal of the GSAP dependency.',
      },
      {
        id: 'coding-jokes',
        title: 'Coding Jokes',
        description:
          'More than 400 programming jokes with search, category filters, sorting and emoji reactions, in vanilla HTML, CSS and JavaScript.',
        role: 'Creator',
        tags: ['JavaScript'],
        color: '#FF006E',
        brightness: 1.1,
        size: 'small',
        galaxy: 'design',
        links: {
          live: 'https://coding-jokes.vercel.app',
          github: 'https://github.com/forbiddenlink/coding-jokes',
        },
        featured: false,
        dateRange: '2023',
        challenge: 'A small project that developers might open for fun.',
        solution: 'Debounced search, category filtering and sorting.',
        impact: 'Live at coding-jokes.vercel.app.',
      },
      {
        id: 'goodstuff-foodtruck',
        title: 'Goodstuff Food Truck',
        description:
          'A menu and online-ordering demo for a food truck, built with Next.js 16, React 19 and Tailwind v4.',
        role: 'Creator',
        tags: ['Next.js', 'E-commerce'],
        color: '#FF006E',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'design',
        links: { live: 'https://goodstuff-foodtruck.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Food truck customers order from their phones.',
        solution: 'A mobile-first menu and ordering flow.',
        impact: 'Live at goodstuff-foodtruck.vercel.app.',
      },
      {
        id: 'studio-furniture',
        title: 'Studio Furniture',
        description:
          'A furniture store demo on Next.js 16 with a product catalog, filtering and a cart, plus AI features that start with a shopping assistant.',
        role: 'Creator',
        tags: ['E-commerce', 'React'],
        color: '#FF006E',
        brightness: 1.3,
        size: 'medium',
        galaxy: 'design',
        links: { live: 'https://studio-furniture.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge:
          'Furniture sites get cluttered. I wanted a quiet grid that puts the products first.',
        solution:
          'A grid with generous spacing, filters that update without a page reload, and a cart.',
        impact: 'Live at studio-furniture.vercel.app.',
      },
      {
        id: 'spiralsounds',
        title: 'Spiral Sounds',
        description:
          'A vinyl record store as a PWA: an Express API with JWT auth and role-based access, SQLite with migrations, WebSocket updates, search, a cart and a wishlist. The front end is vanilla JavaScript.',
        role: 'Creator',
        tags: ['Node.js', 'Express.js', 'SQLite', 'PWA', 'JWT', 'WebSocket', 'Jest'],
        color: '#FF006E',
        brightness: 1.6,
        size: 'large',
        galaxy: 'design',
        featured: false,
        dateRange: '2025',
        challenge: 'Build a full-stack store without a front-end framework.',
        solution:
          'A REST API with JWT auth and role-based access control, SQLite migrations, a debounced search, and a PWA with offline support.',
      },
      {
        id: 'rivet',
        title: 'Rivet',
        description:
          'A code quality and security scanner with eight analysis engines: smells, bugs, security, performance, architecture, practices, dependencies and flows. It can add GPT-4 explanations and a tech debt estimate, and reports in JSON, SARIF or HTML. An early version.',
        role: 'Creator',
        tags: ['TypeScript'],
        color: '#FF006E',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'design',
        links: { github: 'https://github.com/forbiddenlink/rivet' },
        featured: false,
        dateRange: '2025',
        challenge: 'Linters report issues without saying why they matter or how to fix them.',
        solution:
          'Eight analysis engines, an AI layer that explains findings, and a CLI (`rivet scan --ai --tech-debt`).',
      },
    ],
  },
  {
    id: 'experimental',
    name: 'Experiments',
    description: 'Games, simulations and side projects',
    narrative: 'Games, simulations and one-off ideas.',
    color: '#FFB800',
    size: 1,
    projects: [
      {
        id: 'snacktrap',
        title: 'Snacktrap',
        description:
          'A Reddit Devvit game. A raccoon crosses a dark kitchen grid toward a snack while 2 to 4 hidden traps wait. Each safe step gives a calm, warm or ember hint about the nearest trap, and when a run ends you place the traps for the next player.',
        role: 'Creator',
        tags: ['TypeScript', 'Devvit', 'Reddit', 'Game', 'UGC'],
        color: '#FFB800',
        brightness: 1.6,
        size: 'medium',
        galaxy: 'experimental',
        metrics: { tests: 157 },
        links: {},
        tier: 'production',
        featured: false,
        dateRange: '2026',
        challenge: 'Make a game where players create the content and no board is unfair.',
        solution:
          'Each safe step gives a hint about the nearest trap. A solver on the server rejects any layout that would force a guess before it can be published.',
        impact: 'Built for a Devvit hackathon submission.',
      },
      {
        id: 'blackjack',
        title: 'Blackjack Game',
        description:
          'Blackjack in vanilla HTML, CSS and JavaScript, with a multi-deck shoe, split, double down, insurance and surrender, a strategy-hint mode, and a daily challenge with a seeded shoe.',
        role: 'Creator',
        tags: ['Game', 'JavaScript'],
        color: '#FFB800',
        brightness: 1.2,
        size: 'small',
        galaxy: 'experimental',
        links: { github: 'https://github.com/forbiddenlink/blackjack-game' },
        featured: false,
        dateRange: '2023',
        challenge: 'Get the rules right, including splits, doubles and insurance.',
        solution:
          'A game engine that resolves hands and tracks the shoe, with a seeded daily challenge so runs can be compared.',
      },
      {
        id: 'ocean-simulator',
        title: 'Ocean Ecosystem Simulator',
        description:
          'A real-time ocean simulation in the browser, built with Three.js and bitECS: hundreds of creatures that school, light shafts through the water, and an 18-second flythrough.',
        role: 'Creator',
        tags: ['WebGL', 'Three.js'],
        color: '#0EA5E9',
        brightness: 1.8,
        size: 'large',
        galaxy: 'experimental',
        links: {
          live: 'https://ocean-simulator-silk.vercel.app',
          github: 'https://github.com/forbiddenlink/ocean-simulator',
        },
        featured: false,
        dateRange: '2024',
        challenge: 'The first version ran well but looked like a swimming pool.',
        solution:
          'bitECS runs the creature simulation and Three.js draws it. I rebuilt the lighting and fog so it reads as deep water.',
        impact: 'Live at ocean-simulator-silk.vercel.app.',
      },
      {
        id: 'plant-therapy',
        title: 'Plant Therapy Blog',
        description:
          'A blog about plant care and mental health, built with Tailwind CSS and vanilla JavaScript. It has dark mode that follows your system setting, responsive layouts and smooth scrolling.',
        role: 'Creator',
        tags: ['Tailwind CSS'],
        color: '#84CC16',
        brightness: 1.1,
        size: 'small',
        galaxy: 'experimental',
        links: { live: 'https://plant-therapy.vercel.app' },
        featured: false,
        dateRange: '2024',
        challenge: 'A calm blog that is easy to read.',
        solution:
          'A soft green palette, a dark mode toggle, and Tailwind for consistent spacing and type.',
        impact: 'Live at plant-therapy.vercel.app.',
      },
      {
        id: 'aegis-audit',
        title: 'AegisAudit',
        description:
          "A security scanner with two modes: `scan` checks a deployed site's headers and other passive signals, and `audit` checks a source tree. It gives one score, a CI exit code, and JSON, SARIF or HTML reports.",
        role: 'Creator',
        tags: ['Security', 'TypeScript'],
        color: '#FFB800',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'experimental',
        links: { github: 'https://github.com/forbiddenlink/aegis-audit' },
        featured: false,
        dateRange: '2025',
        challenge: 'Security checks usually happen after deployment.',
        solution:
          'A scan mode for live URLs and an audit mode for source, with output meant for CI.',
      },
      {
        id: 'mythos',
        title: 'Mythos',
        description:
          'A mythology and folklore explorer on Next.js with 359 deities, 37 heroes, 162 stories, 103 creatures, 76 artifacts and 184 locations, plus family trees and quiz games.',
        role: 'Creator',
        tags: ['React'],
        color: '#FFB800',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'experimental',
        links: {
          live: 'https://mythosatlas.com',
          github: 'https://github.com/forbiddenlink/mythos',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Mythology is often presented in dry reference formats.',
        solution: 'Browse by culture, follow family trees, and take quizzes.',
        impact: 'Live at mythosatlas.com.',
      },
      {
        id: 'apoc-bnb',
        title: 'Apoc BnB',
        description:
          'A post-apocalyptic Airbnb parody on Next.js. Browse bunkers and fallout shelters and filter by shelter type, location rating and zombie proximity.',
        role: 'Creator',
        tags: ['Next.js 16', 'Mapbox', 'Zustand', 'Framer Motion', 'Vitest'],
        color: '#FFB800',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'experimental',
        links: {
          live: 'https://apoc-bnb.vercel.app',
          github: 'https://github.com/forbiddenlink/apoc-bnb',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'A full-stack rental flow for a joke setting.',
        solution:
          'Listings with detail pages and survival ratings, with Mapbox, Zustand and Framer Motion.',
        impact: 'Live at apoc-bnb.vercel.app.',
      },
      {
        id: 'cereal-tasting',
        title: 'Cereal Tasting',
        description:
          "The Sommelier's Spoon: a satirical cereal tasting site that treats breakfast like fine wine. It has 15 vintage cereals, milk pairings, a quiz, printable certificates and a mock tasting flight cart.",
        role: 'Creator',
        tags: ['React', 'Database'],
        color: '#FFB800',
        brightness: 1.1,
        size: 'small',
        galaxy: 'experimental',
        links: { live: 'https://cereal-tasting.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Turn a silly idea into something polished.',
        solution:
          'A React app with a noir-nostalgia look and a lot of commentary from Jacques Flakémont.',
        impact: 'Live at cereal-tasting.vercel.app.',
      },
      {
        id: 'competitor-stalker',
        title: 'Competitor Stalker',
        description:
          'A dashboard for tracking competitors: company dossiers and a draggable positioning map, built with React, TypeScript and Tailwind.',
        role: 'Creator',
        tags: ['Next.js', 'Playwright', 'TypeScript'],
        color: '#FFB800',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'experimental',
        links: { live: 'https://competitor-stalker.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Competitor research ends up scattered across notes.',
        solution:
          'A dashboard with a profile for each competitor and an interactive map of market positioning.',
        impact: 'Live at competitor-stalker.vercel.app.',
      },
      {
        id: 'pollyglot',
        title: 'Pollyglot',
        description:
          'A translation app using GPT-4o-mini: 20 languages, automatic language detection, a formality selector, alternative phrasings and pronunciation guides.',
        role: 'Creator',
        tags: ['Next.js', 'OpenAI', 'GPT-4o-mini', 'Internationalization'],
        color: '#FFB800',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'experimental',
        links: {
          live: 'https://pollyglot-topaz.vercel.app',
          github: 'https://github.com/forbiddenlink/pollyglot',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Most translation tools give one answer with no sense of tone.',
        solution:
          'A vanilla JavaScript front end and an Express server that calls GPT-4o-mini, with a formality setting and alternative phrasings.',
        impact: 'Live at pollyglot-topaz.vercel.app.',
      },
      {
        id: 'guts-and-glory',
        title: 'Guts & Glory',
        description:
          'A meal planner for households with mixed dietary restrictions. It uses AI to build plans that work for everyone, with a shared base plus a split, and makes categorized shopping lists you can save and reuse.',
        role: 'Creator',
        tags: ['Next.js'],
        color: '#DC2626',
        brightness: 1.3,
        size: 'medium',
        galaxy: 'experimental',
        links: { live: 'https://guts-and-glory.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge:
          'One household can have several diets, such as low FODMAP and no bread, pasta or potatoes.',
        solution:
          'AI-generated plans built on a shared base with a split for each person, and shopping lists grouped by category.',
        impact: 'Live at guts-and-glory.vercel.app.',
      },
      {
        id: 'ark-joinsim',
        title: 'Ark JoinSim',
        description:
          'A Python auto-joiner for Ark: Survival Ascended. It watches the screen for the "Server Full" popup, loading screens and kick-backs, retries the join, and can ping a Discord webhook when you get in.',
        role: 'Creator',
        tags: ['Python', 'Computer Vision', 'Automation', 'OpenCV', 'Discord'],
        color: '#FFB800',
        brightness: 1.3,
        size: 'small',
        galaxy: 'experimental',
        links: { github: 'https://github.com/forbiddenlink/ark-joinsim' },
        featured: false,
        dateRange: '2025',
        challenge: 'Full servers reject join attempts, and you can spend hours clicking retry.',
        solution:
          'OpenCV template matching at several scales finds the popups at any resolution, and the script finds the game window on its own.',
      },
      {
        id: 'apeiron-remake',
        title: 'Apeiron Remake',
        description:
          'A remake of the arcade game Apeiron in React and Vite, with no image or audio files: sprites are drawn procedurally and sound is synthesized with WebAudio. Classic mode keeps the original scoring, with an extra life every 20,000 points and up to 8 lives.',
        role: 'Creator',
        tags: ['JavaScript', 'Vite', 'WebAudio', 'Canvas'],
        color: '#FFB800',
        brightness: 1.2,
        size: 'small',
        galaxy: 'experimental',
        links: { github: 'https://github.com/forbiddenlink/apeiron-remake' },
        featured: false,
        dateRange: '2025',
        challenge: 'Remake an arcade game without any asset files.',
        solution:
          'A fixed-timestep game loop, sprites drawn with the Canvas API, and sound effects synthesized in WebAudio.',
      },
      {
        id: 'critter-vale',
        title: 'Critter Vale',
        description:
          'A browser creature-collecting RPG in TypeScript and Three.js. Raise a team, battle rival tamers, and generate new critters in the Summon Lab through an image generation API.',
        role: 'Creator',
        tags: ['Three.js', 'JavaScript', 'WebGL', 'Vite'],
        color: '#FFB800',
        brightness: 1.6,
        size: 'large',
        galaxy: 'experimental',
        links: {
          live: 'https://critter-vale.vercel.app',
          github: 'https://github.com/forbiddenlink/critter-vale',
        },
        featured: true,
        dateRange: '2026',
        challenge:
          'Creature-collecting games are usually native or built on a game engine. I wanted one that runs in a browser tab.',
        solution:
          'Vanilla TypeScript with Three.js and Vite. A serverless function proxies image generation so the API key stays on the server.',
        impact: 'Live at critter-vale.vercel.app.',
      },
      {
        id: 'pass-game',
        title: 'PASS',
        description:
          "A Turing tribute made for the June Solstice Game Jam. A Gemini model writes the interrogator's questions and judges how human your answers sound. Without an API key it falls back to an offline question bank and a heuristic judge.",
        role: 'Creator',
        tags: ['Next.js', 'Google Gemini', 'TypeScript', 'Game Jam'],
        color: '#FFB800',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'experimental',
        links: {
          live: 'https://pass-game-six.vercel.app',
          github: 'https://github.com/forbiddenlink/pass-game',
        },
        featured: true,
        dateRange: '2026',
        challenge: 'A Turing-test game has no fixed answer key, so the judging has to happen live.',
        solution:
          'Gemini writes the questions, judges each reply and presses back on weak answers, and an offline fallback keeps the game playable without a key.',
        impact: 'Built for the June Solstice Game Jam. Live at pass-game-six.vercel.app.',
      },
      {
        id: 'runwayos',
        title: 'RunwayOS',
        description:
          'A cash runway tracker for SaaS founders, started in March 2026: a dashboard with MRR, runway, churn and customer cards and an MRR trend chart. Archived after day one of a planned seven.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript', 'AI'],
        color: '#FFB800',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'experimental',
        status: 'archived',
        featured: false,
        dateRange: '2026',
        challenge: 'Founders track MRR, churn and burn in separate spreadsheets.',
        solution: 'A dashboard UI with metric cards and a trend chart.',
      },
      {
        id: 'canvas-flow',
        title: 'Canvas Flow',
        description:
          'A canvas-based design tool with AI image generation and export to HTML and CSS or React components, built with Next.js and Prisma.',
        role: 'Creator',
        tags: ['Canvas'],
        color: '#FFB800',
        brightness: 1.4,
        size: 'medium',
        galaxy: 'experimental',
        links: { live: 'https://canvas-flow-kappa.vercel.app' },
        featured: false,
        dateRange: '2025',
        challenge: 'Design tools and code export usually live in separate apps.',
        solution:
          'A canvas editor that exports semantic HTML and CSS, or React components with Tailwind or CSS Modules.',
        impact: 'Live at canvas-flow-kappa.vercel.app.',
      },
      {
        id: 'constellation-events',
        title: 'Constellation Events',
        description:
          "A stargazing hub on Next.js: tonight's sky from JPL Horizons, upcoming meteor showers and eclipses with iCal export, and a dark-sky location finder.",
        role: 'Creator',
        tags: ['Real-time', 'Next.js'],
        color: '#FFB800',
        brightness: 1.3,
        size: 'medium',
        galaxy: 'experimental',
        links: {
          live: 'https://constellation-events.vercel.app',
          github: 'https://github.com/forbiddenlink/constellation-events',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Planning a night of stargazing means checking several data sources.',
        solution:
          'One app that pulls from JPL Horizons, astronomy-engine, NOAA SWPC, NASA APOD and Celestrak.',
        impact: 'Live at constellation-events.vercel.app.',
      },
      {
        id: 'nova-particles',
        title: 'Nova Particles',
        description:
          'A GPU particle system built on WebGPU compute shaders and Three.js TSL. Published on npm as @nova-particles/core.',
        role: 'Creator',
        tags: ['WebGPU', 'Three.js', 'TypeScript', 'Performance'],
        color: '#FF6B6B',
        brightness: 1.8,
        size: 'large',
        galaxy: 'experimental',
        links: { live: 'https://particle-system-web.vercel.app' },
        // Note: GitHub repo is private
        featured: false,
        dateRange: '2025',
        challenge: 'Particle systems that run on the CPU slow down at thousands of particles.',
        solution:
          'A WebGPU compute shader pipeline with Structure of Arrays storage buffers, and forces for gravity, drag, wind, vortex and noise.',
        impact:
          'On npm as @nova-particles/core. Live demo at particle-system-web.vercel.app. The GitHub repository is private.',
      },
      {
        id: 'app-idea-miner',
        title: 'App Idea Miner',
        description:
          'Collects "I wish there was an app" posts, clusters them with HDBSCAN, scores sentiment with VADER, and shows the clusters with evidence links in a React dashboard. The backend is FastAPI.',
        role: 'Creator',
        tags: ['Python', 'FastAPI', 'React', 'HDBSCAN', 'NLP', 'Redis', 'PostgreSQL'],
        color: '#FFB800',
        brightness: 1.7,
        size: 'large',
        galaxy: 'experimental',
        links: {
          live: 'https://app-idea-miner.vercel.app',
          github: 'https://github.com/forbiddenlink/app-idea-miner',
        },
        featured: false,
        dateRange: '2025',
        challenge: 'Real user needs are scattered across forums and social media.',
        solution:
          'An ingestion pipeline with deduplication, NLP idea extraction, clustering and a FastAPI backend.',
        impact: 'Live at app-idea-miner.vercel.app.',
      },
      {
        id: 'ai-spend-tracker',
        title: 'AI Spend Tracker',
        description:
          'A dashboard for tracking spend across AI coding tools. It is a personal tool and is not deployed.',
        role: 'Creator',
        tags: ['Next.js', 'TypeScript'],
        color: '#FFB800',
        brightness: 1.5,
        size: 'medium',
        galaxy: 'experimental',
        featured: false,
        dateRange: '2026',
        challenge: 'AI tool costs add up across several providers.',
        solution: 'A Next.js dashboard that brings the spend together in one place.',
      },
    ],
  },
]

// Helper to get all projects flattened
export const allProjects = galaxies.flatMap((g) => g.projects)

// Helper to get featured projects
export const featuredProjects = allProjects.filter((p) => p.featured)

// Pre-computed lookup maps for O(1) access
const projectMap = new Map(allProjects.map((p) => [p.id, p]))
const galaxyMap = new Map(galaxies.map((g) => [g.id, g]))

// Helper to get project by ID (O(1))
export function getProjectById(id: string) {
  return projectMap.get(id)
}

// Helper to get galaxy by ID (O(1))
export function getGalaxyById(id: string) {
  return galaxyMap.get(id)
}

// =============================================================================
// NARRATIVE TOURS - Themed groups of related projects
// =============================================================================

export interface NarrativeTour {
  id: string
  name: string
  tagline: string
  description: string
  color: string
  icon: string // emoji
  projectIds: string[]
  narrativeIntros: Record<string, string> // Per-project narrative intro
}

export const narrativeTours: NarrativeTour[] = [
  {
    id: 'ai-journey',
    name: 'AI projects',
    tagline: 'Six projects that use AI models',
    description:
      'Six projects that use AI models, from a spaced-repetition course to an AI artist.',
    color: '#00D9FF',
    icon: 'bot',
    projectIds: ['finance-quest', 'tubedigest', 'contradictme', 'stancestream', 'trace', 'lumira'],
    narrativeIntros: {
      'finance-quest':
        'A financial literacy course with spaced repetition and an AI coach that uses Claude, with GPT-4o-mini as a fallback.',
      tubedigest:
        'Turns long YouTube videos into summaries, topic tags and a mind map you can search.',
      contradictme:
        'You state a position and it argues the strongest opposing case. The chat runs through an Algolia Agent Studio agent.',
      stancestream:
        'AI agents debate in real time and use all four Redis data models. Built for the Redis AI Challenge 2025.',
      trace:
        'Paste a screenshot and Gemini 2.5 Flash writes a React component from a shadcn-style catalog. It won the DEV GitHub Finish-Up-A-Thon.',
      lumira: 'An AI artist in Python with ten emotional states and a memory of what it has made.',
    },
  },
  {
    id: 'fullstack-evolution',
    name: 'Full-stack projects',
    tagline: 'From a survey builder to a collaborative editor',
    description:
      'Five full-stack projects, from a survey builder to a practice monorepo for field operations.',
    color: '#9D4EDD',
    icon: 'rocket',
    projectIds: ['create-surveys', 'portfolio-pro', 'kindred', 'willwise', 'coulson-one'],
    narrativeIntros: {
      'create-surveys':
        'A survey builder on React, Vite and Firebase, with templates and real-time analytics.',
      'portfolio-pro':
        'A learning platform for AI development: 297 lessons in six tracks, a Monaco editor and Stripe subscriptions.',
      kindred:
        'A collaborative editor on Next.js 16 and React 19. Yjs syncs edits between people and keeps working offline.',
      willwise:
        'An estate planning app for digital assets, with a questionnaire, PDF generation and Stripe payments.',
      'coulson-one':
        'A practice monorepo from 2025: a NestJS API, a Next.js dashboard and an Expo app for oil and gas field operations.',
    },
  },
  {
    id: 'devtools-builder',
    name: 'Developer tools',
    tagline: 'Five tools for developers',
    description: 'Five tools for developers, from an accessibility checker to an image optimizer.',
    color: '#06FFA5',
    icon: 'code',
    projectIds: ['accessibility-checker', 'codememory', 'trace', 'imgzen', 'encryption-visualizer'],
    narrativeIntros: {
      'accessibility-checker':
        'Checks contrast against WCAG 2.1 and APCA, suggests colors, and simulates color blindness.',
      codememory: 'Flashcards and coding challenges scheduled with FSRS spaced repetition.',
      trace: 'Turns a screenshot into a React component you can edit.',
      imgzen: 'A Rust GitHub Action that makes AVIF and WebP copies of your images.',
      'encryption-visualizer': 'Step-by-step visualizations of AES, RSA and hashing.',
    },
  },
]

// Helper to get narrative tour by ID
export function getNarrativeTourById(id: string) {
  return narrativeTours.find((t) => t.id === id)
}
