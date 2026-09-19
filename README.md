# elizabethannstein.com

> Editorial-first developer portfolio with an opt-in 3D galaxy showcase and an in-progress
> bioluminescent-city visualization. Built with Next.js 16, React 19, and React Three Fiber.
> Live at [elizabethannstein.com](https://elizabethannstein.com).

[![CI](https://github.com/forbiddenlink/elizabethannstein/actions/workflows/ci.yml/badge.svg)](https://github.com/forbiddenlink/elizabethannstein/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/forbiddenlink/elizabethannstein/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/forbiddenlink/elizabethannstein/actions/workflows/lighthouse.yml)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://elizabethannstein.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## What it does

The content site (`/`, `/work`, `/work/[slug]`, `/about`, `/contact`, `/privacy`) is
editorial-primary: a fine-print-magazine-style design language (see `.impeccable.md`'s
2026-08-18 direction change), not a 3D scene. It ships a live-status homepage
(`LiveSystemsIndex`, checking flagship deploys client-side so pings never block first
paint), a curated `/work` case-study index, a Galaxy Guide AI assistant (MiniMax), an
Arcjet-protected contact API, full Playwright E2E coverage across 7 browser profiles,
visual regression snapshots, weekly Claude-driven maintenance, Lighthouse CI, and Sentry
telemetry.

Two opt-in showcase routes carry the 3D work:

- `/explore` - the original galaxy showcase: 88 projects across 6 themed galaxies, rendered
  as planets in a WebGL/WebGPU scene you fly through, with cinematic camera moves.
- `/city` - an in-progress bioluminescent-city visualization grown from sanitized dev-fleet
  data (see `docs/superpowers/ROADMAP-creative-tracks.md` for phase status).

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js ^16.3 (App Router, `src/` layout, `proxy.ts` for `/api/*`), React ^19.2 |
| Language | TypeScript 7.0 strict |
| Styling | Tailwind CSS v4; `src/styles/editorial.css` for content pages |
| 3D / WebGL | three.js ^0.185, React Three Fiber ^9, @react-three/drei, @react-three/postprocessing, @react-three/rapier (physics), postprocessing, WebGPU canvas with WebGL fallback |
| Animation | GSAP ^3.15, Framer Motion ^13, Theatre.js (`@theatre/core`) for `/explore` cinematics |
| State | Zustand ^5, nuqs (URL state) |
| Email | Resend (contact form) |
| AI | MiniMax (Galaxy Guide assistant - server-only key) |
| Abuse protection | Arcjet (`/api/*`) |
| Observability | Sentry, Vercel Analytics, Speed Insights, next-axiom |
| Testing | Vitest, Playwright (smoke, visual, 7 browser/device projects) |
| Tooling | Biome, lefthook, lighthouse CI, r3f-perf, stats-gl, Leva (dev controls) |
| Hosting | Vercel |

## Architecture

```mermaid
flowchart LR
  V[Visitor] --> N[Next.js App Router]
  N -->|RSC pages| W[/, /work, /about, /contact, /privacy]
  N -->|opt-in 3D| E[/explore]
  N -->|opt-in 3D| C[/city]
  E -->|hydrate| CV[WebGPU/WebGL Canvas]
  CV --> RF[React Three Fiber Scene]
  RF --> G[GalaxyScene · Planets · Camera]
  RF --> TH[Theatre.js cinematics]
  N -->|Server Action| CT[/api/contact -> Resend]
  N -->|Server Action| AI[/api/chat -> MiniMax]
  CT -.->|guard| AJ[Arcjet]
  AI -.->|guard| AJ
  N --> S[Sentry, Vercel Analytics, Axiom]
```

3D scene components live in `src/components/3d/` (galaxies, planets, post-processing,
physics, cinematic camera, bioluminescent-city).

## Quickstart

```bash
git clone git@github.com:forbiddenlink/elizabethannstein.git
cd elizabethannstein
pnpm install
cp .env.example .env.local       # all vars are optional for local dev
pnpm dev                          # http://localhost:3000
```

Hardware: WebGL2-capable GPU for `/explore` and `/city`. WebGPU canvas auto-detects support
and falls back to WebGL. The rest of the site has no GPU requirement.

## Environment variables

| Variable | Required? | What it's for |
|----------|-----------|----------------|
| `NEXT_PUBLIC_SITE_URL` | Prod | Canonical URL for sitemap, OG metadata |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Client error reporting |
| `MINMAX_API_KEY` | Optional | Server-only - Galaxy Guide AI |
| `RESEND_API_KEY` | Optional | Contact form delivery |
| `CONTACT_FORWARD_TO` | Optional | Override contact form recipient |
| `ARCJET_KEY` | Recommended (prod) | Abuse protection on `/api/*` |
| `PLAYWRIGHT_PORT`, `BASE_URL` | Local E2E | Defaults to `:3100` |
| `ANALYZE` | Optional | `true` runs the bundle analyzer |

See `.env.example` for inline notes.

## Common commands

```bash
pnpm dev                       # next dev --webpack
pnpm build                     # production build
pnpm test                      # vitest
pnpm test:e2e                  # playwright (all projects)
pnpm test:e2e:smoke            # smoke project only
pnpm test:e2e:ci               # 7-project matrix (incl. mobile-chrome/safari)
pnpm test:e2e:visual           # visual regression snapshots
pnpm analyze                   # ANALYZE=true next build
pnpm screenshots               # capture project thumbnails via scripts/capture-screenshots.ts
pnpm city:snapshot             # regenerate the /city sanitized data snapshot
pnpm biome:check               # lint + format
```

CI (`e2e-smoke.yml`) runs `pnpm build` then the smoke project on every PR; the full 7-project
matrix (`test:e2e:ci`) runs on demand via `update-snapshots.yml`. Weekly Claude PR review and
maintenance workflows are wired in `.github/workflows/`.

## Project structure

```
src/
├── app/                 # Routes: /, /about, /contact, /privacy, /work, /work/[slug],
│                        #   /explore, /city, /health, /api/*
├── components/
│   ├── 3d/              # R3F components (galaxies, planets, FX, physics, city, cinematics)
│   ├── home/             # Editorial homepage (LiveSystemsIndex)
│   ├── projects/         # Project cards, case study UI
│   ├── work/             # /work index UI
│   └── ui/               # Shared primitives
├── hooks/, lib/, styles/, __tests__/
└── proxy.ts             # Next.js 16 proxy (was middleware.ts)
public/
├── images/              # Project thumbnails (.webp)
├── screenshots/         # Captured site screenshots
├── testimonials/
└── resume.pdf
```

## Roadmap

- [x] Editorial-primary redesign of `/`, `/work`, `/about`, `/contact`, `/privacy`
  (`.impeccable.md`, 2026-08-18)
- [x] Proof layer (`src/lib/proofLayer.ts`) - unified hero, 3D scene curation, `/work` proof catalog
- [x] Full Playwright 7-browser CI matrix
- [x] WebGPU canvas with WebGL fallback
- [x] Lighthouse CI workflow
- [x] Bioluminescent city Phase 0 (look spike) and Phase 2 (beauty) - see
  `docs/superpowers/ROADMAP-creative-tracks.md`
- [ ] Bioluminescent city Phase 1 (real sanitized data pipeline) - next
- [ ] Deep case studies for flagship projects (CRC, TimeSlip, Specter, HireReady, AutomaDocs)
- [ ] WebGPU "lite FX" performance mode (postprocessing blocks full WebGPU today)

## License

MIT - see [LICENSE](LICENSE).
