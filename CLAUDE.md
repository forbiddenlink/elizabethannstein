# CLAUDE.md

This file provides guidance to agents when working with code in this repository.

## Project overview

A portfolio built with Next.js 16 (App Router). Since the 2026-08-18 direction change
(`.impeccable.md`), the content site (`/`, `/work`, `/about`, `/contact`, `/privacy`) is
**editorial-primary**: a fine-print-magazine-style design language, not 3D. The dark
"galaxy" system (88 projects across 6 galaxies, visualized as planets in a WebGL/WebGPU
3D scene) is retained as an opt-in showcase at `/explore`. A separate `/city` route hosts
an in-progress bioluminescent-city visualization built from sanitized dev-fleet data (see
`docs/superpowers/ROADMAP-creative-tracks.md`). Live site: https://elizabethannstein.com

## Stack

- Next.js ^16.3.3, React ^19.2.8, TypeScript 7.0.2
- pnpm (`pnpm-lock.yaml`)
- Biome (`biome.json`), ESLint (`eslint.config.mjs`), Prettier (`.prettierrc`)
- Vitest (unit), Playwright (E2E)
- Zustand for state
- Arcjet (`@arcjet/next`) for API shielding/bot rules, Resend for the contact form, `@sentry/nextjs` for error reporting

## Commands

```bash
pnpm dev              # Development server (webpack), http://localhost:3000
pnpm build            # Production build
pnpm start            # Run production server
pnpm lint             # TypeScript check (tsc --noEmit)
pnpm test             # Vitest unit tests (src/__tests__)
pnpm test:watch
pnpm test:coverage
pnpm test:e2e         # Playwright E2E (local dev server)
pnpm test:e2e:smoke
pnpm test:e2e:ui
pnpm test:e2e:headed
pnpm test:e2e:ci      # smoke + visual + Chromium/Firefox/WebKit/mobile (CI runs `next start` after build)
pnpm test:e2e:visual  # Playwright visual snapshots only (Chrome)
./scripts/update-visual-snapshots-docker.sh   # regenerate Linux baselines (match GitHub Actions)
pnpm biome:check
pnpm biome:fix
pnpm biome:format
pnpm analyze          # ANALYZE=true next build
pnpm screenshots      # tsx scripts/capture-screenshots.ts
pnpm city:snapshot    # tsx scripts/city-snapshot.mts
pnpm doctor           # npx react-doctor@latest
pnpm qa:setup         # preflight + frozen install + playwright install chromium
```

## Layout

- `src/lib/galaxyData.ts` - single source of truth for all project data. The `galaxies` array defines 6 galaxies (Enterprise, AI, Full-Stack, DevTools, Design, Experimental), each with an array of `Project` objects.
- `src/lib/store.ts` - Zustand stores: `useViewStore` (navigation state machine: `universe` → `galaxy` → `project` → `exploration`), `useMotionStore` (reduced motion preferences)
- `src/lib/types.ts` - core interfaces: `Project` (id, title, description, role, tags, galaxy, size, links, metrics, featured), `Galaxy` (id, name, color, projects[]), `ViewState`
- `src/components/3d/` - `GalaxyScene.tsx` (main container, orchestrates camera and all 3D elements), `EnhancedProjectStars.tsx` (project star/planet meshes), `RealisticPlanet.tsx` (procedural GLSL shaders with atmospheres), `PlanetSurfaceExplorer.tsx` (first-person exploration, WASD), `WebGPUCanvas.tsx` (WebGPU-ready renderer with WebGL fallback)
- `src/components/ui/` - `CommandPalette.tsx` (⌘K), `KeyboardNavigation.tsx` (arrows/numbers/ESC), `ProjectModal.tsx`, `GalaxyGuide.tsx` (AI chat assistant, uses `MINMAX_API_KEY`), `Entrance.tsx` (landing overlay)
- `src/app/` - routes (see Routes below)
- `src/proxy.ts` - Next.js 16 `proxy` (not `middleware`); Arcjet shield + bot rules for `/api/*`
- `src/__tests__/` - Vitest unit tests; `e2e/` - Playwright specs
- `scripts/` - screenshot capture, city snapshot, visual-snapshot regeneration, QA preflight

## Routes

- `/` - editorial homepage (`LiveSystemsIndex`), statically rendered; live status fetched
  client-side from `/api/status` so external pings never block first paint
- `/work` - SSG project list
- `/work/[slug]` - SSG case study pages (slug = `project.id`)
- `/explore` - the 3D galaxy showcase (client-side, lazy-loaded `GalaxyScene.tsx`)
- `/city` - bioluminescent-city visualization (in progress; see
  `docs/superpowers/ROADMAP-creative-tracks.md`)
- `/about`, `/contact`, `/privacy` - static pages, editorial design language
- `/health` - JSON uptime check (no-cache)
- `/api/*` - Arcjet shield + bot rules via `src/proxy.ts`

## Conventions

- Content pages (`/`, `/work`, `/about`, `/contact`, `/privacy`) use `src/styles/editorial.css`
  (the `.editorial` scope + `--le-*` tokens); the dark galaxy/glassmorphism system applies only
  to `/explore` and `src/components/3d/*`. See `.impeccable.md`'s 2026-08-18 direction change.
- `/explore` (`src/app/explore/page.tsx`) lazy-loads `GalaxyScene.tsx` to keep the initial bundle under 200KB.
- Camera navigation uses animated transitions between view states; galaxy positions are calculated by `getGalaxyCenterPosition()` in `utils.ts`.
- To add a project, edit `src/lib/galaxyData.ts` and append to the appropriate galaxy's `projects` array:
  ```typescript
  {
    id: 'slug-for-urls',
    title: 'Project Name',
    description: 'Description text',
    role: 'Developer',
    tags: ['React', 'TypeScript'],
    color: '#FF6B35',  // inherited from galaxy
    brightness: 1.5,   // 0.5-2.0, affects visual size
    size: 'large',     // small | medium | large | supermassive
    galaxy: 'ai',      // must match galaxy.id
    links: { github: '...', live: '...' },
    featured: true,
    dateRange: '2024',
  }
  ```

## Testing

- Unit: Vitest, tests in `src/__tests__/`. Run with `pnpm test`.
- E2E: Playwright, specs in `e2e/`. `pnpm test:e2e:ci` runs smoke + visual + Chromium/Firefox/WebKit/mobile projects against a production server (`next start`) built in CI.
- Visual regression: `pnpm test:e2e:visual` (Chrome only); regenerate Linux baselines with `./scripts/update-visual-snapshots-docker.sh` to match GitHub Actions.

## Env vars

From `.env.example`:
- `NEXT_PUBLIC_SITE_URL` - canonical links, sitemap, OG metadata
- `NEXT_PUBLIC_GA_ID` - optional, Google Analytics
- `NEXT_PUBLIC_SENTRY_DSN` - optional, Sentry error reporting (production only when set)
- `MINMAX_API_KEY` - server-only, Galaxy Guide AI (MiniMax); never expose to the client
- `RESEND_API_KEY` - server-only, contact form
- `CONTACT_FORWARD_TO` - optional override for contact mail delivery destination (defaults in code if unset)
- `ARCJET_KEY` - abuse protection for `/api/*`, recommended in production
- `PLAYWRIGHT_PORT`, `BASE_URL` - optional, local E2E/Playwright
- `ANALYZE` - optional, bundle analysis

## Gotchas

- `pnpm lint` runs `tsc --noEmit`, not ESLint directly (ESLint config exists but isn't wired to the `lint` script).
- CI runs `pnpm build && pnpm test:e2e:ci` (production server on port 3100 for visual snapshots).
- `GalaxyGuide.tsx` and other AI features require `MINMAX_API_KEY`; keep it server-only.

## Claude Code specific

Project skill in `.claude/skills/react-doctor/`: run `npx react-doctor@latest --verbose --scope changed` after React code changes and check the health score didn't regress; fix regressions before committing. Type `/doctor` for the full local-triage workflow (fetches the canonical playbook and runs a scan → filter → triage → fix → validate loop on the working tree).
