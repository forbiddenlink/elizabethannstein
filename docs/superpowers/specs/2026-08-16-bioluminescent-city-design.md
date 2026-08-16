# Bioluminescent City — Design Spec

**Status:** Draft for review (destination doc, freeze on approval)
**Date:** 2026-08-16
**Written against:** branch `feat/award-tier-polish` (elizabethannstein). Re-validate file refs if HEAD moves.
**Track:** A of 3 (siblings: Sandworld, and a "something new" — Postmortem Roguelike / Rules Cartographer — both deferred, own specs later).

---

## One-line

An interactive, bioluminescent-organic city grown from Liz's real dev history, living on the `elizabethannstein` portfolio — visitors explore her career as an explorable place.

## Why this, why her (the moat)

Fuses three things no one else can combine: her real multi-service fleet data + her design taste + her own tooling (`hq`, `codebase-memory-mcp`). A generic "git history as a growing city" is **already free via Gource** — so that alone is a clone and is explicitly out of scope as the value prop.

**Anti-Gource thesis (non-negotiable).** The project earns "unique" only on the three axes Gource cannot touch:
1. **Bespoke bioluminescent art direction** — a designed world, not a default viz.
2. **Multi-service fusion** — GitHub + Vercel + more, not just commits.
3. **Interactive explore** — hover/click/unfold/time-scrub, not a rendered video.

If any of the three is cut to save time, the project has become a clone. Stop and rethink instead.

## Goals

- A portfolio showpiece that reads as *extraordinary* in the first 5 seconds.
- Generated from Liz's real (sanitized) fleet data, refreshed automatically.
- Interactive and explorable, works on desktop; graceful reduced experience on mobile/low-end.
- Ships incremental value: a beautiful thing exists at Phase 1, everything after is polish.

## Non-goals (explicit)

- **Not a live ops/monitoring tool.** Consensus rejected the always-on "ambient organism you glance at" — same failure mode as a wire that dies unwatched. This is a visitor-facing showpiece, opened on demand, not a dashboard Liz must remember to check.
- **No live private feed on the public site.** Public skin renders a committed static snapshot only.
- **No client/confidential data** (see Confidentiality Gate).
- Not the "one engine, four skins" synthesis — that was dropped when the tracks were split. This spec is the City alone.
- **Do not modify the existing galaxy** (`GalaxyScene.tsx`, `galaxyData.ts`, `/explore`). The city is additive.

## Existing-system reconciliation (verified 2026-08-16, branch `feat/bioluminescent-city`)

The portfolio already has a large 3D system. Verdict from a full read: **ship the city as a NEW mode/route, reuse only the rendering substrate.**

- **Existing `/explore`** = a hand-curated *galaxy* — 86 `Project` objects in `src/lib/galaxyData.ts` (~2195 lines, narrative-authored, single source of truth per repo CLAUDE.md). Metaphor: projects as stars in 6 themed galaxies, with tour/journey modes (`src/components/3d/GalaxyScene.tsx`). This is portfolio *highlights*, a different truth-source from the city's *fleet telemetry*. Reskinning it would gut its curated storytelling — so the city is separate.
- **REUSE (do not rebuild):**
  - `src/components/3d/WebGPUCanvas.tsx` — generic WebGPU/WebGL-fallback Canvas wrapper, zero galaxy logic (`:35-168`). City mounts through it.
  - `src/lib/webgpu.ts` `checkWebGPUSupport()` — renderer detection.
  - Route pattern: `src/app/explore/page.tsx` loads its scene via `dynamic(..., { ssr: false })` inside an error boundary. City route (`/city`) mirrors this.
- **DO NOT TOUCH:** `GalaxyScene.tsx`, `galaxyData.ts`, and everything galaxy-specific (star meshes, camera state machine, tour system).

### Known gotcha — glow (affects Phase 0 directly)

`src/components/3d/PostProcessingEffects.tsx` is the existing bloom/postprocessing path: WebGL-only (`@react-three/postprocessing` classic EffectComposer, **not** TSL nodes), carries a documented flicker/invisible-render bug, and ships **disabled by default**. The bioluminescent glow therefore CANNOT depend on it. Phase 0 must achieve glow via emissive materials + a WebGPU/TSL bloom (or another verified path), and proving that glow works is part of the look go/no-go.

### Data-staleness finding (Liz's accuracy ask)

`galaxyData.ts` holds **86** projects; repo `CLAUDE.md` claims 90; the real fleet is ~90-97 repos. The existing galaxy is already stale vs reality. Reconciling `galaxyData.ts` against the live fleet is a **separate task** (it touches the galaxy, out of City scope) — tracked, not done here unless chosen.

## Art direction — bioluminescent-organic

- Coral / mycelium / deep-sea forms, not literal buildings.
- Dark scene, volumetric glow, soft particle drift, HDR bloom.
- **Life = light + growth:** active repos pulse bright and grow tall; dormant repos dim to cold husks.
- **Districts = biomes** with distinct palettes: personal / agency / CRC (names sanitized on the public skin — see gate).
- One cohesive, deliberately-designed world. The design quality *is* the differentiator.

## Stack (confirmed, already installed)

- **Next 16 · React 19** (existing portfolio).
- **React Three Fiber 9.6 + `three` 0.185** — already in `package.json`. No new core dep required.
- **Three WebGPU/TSL renderer** for glow/shader work (feature-detect; fall back to WebGL renderer where WebGPU is unavailable).
- `@react-three/drei` — present (used by `GalaxyScene` PerformanceMonitor).
- Deploy: Vercel (existing).
- **Resolved:** existing 3D usage read (see Existing-system reconciliation). City reuses `WebGPUCanvas.tsx` + `webgpu.ts`; does not add a second renderer layer.

## Architecture

Three concerns, cleanly separated so each is testable in isolation:

```
city-core/     # renderer + procedural layout + interaction. Consumes a CityModel. Data-source-agnostic.
adapters/      # snapshot(sanitized, static) — the only adapter this spec ships. (demo adapter for dev/tests.)
integration/   # React/Next mount point + portfolio route/embed.
```

The contract between adapter and renderer is a single **`CityModel`** object.

### Data pipeline (bronze / silver / gold)

- **Bronze** — raw pulls from `hq` / GitHub API (+ later Vercel etc.). Untouched.
- **Silver** — normalized into `CityModel` (types, dedup, cleansing only; no business/display logic).
- **Gold** — render-ready layout (positions, heights, glow curves) derived deterministically from silver.

The **snapshot adapter** runs the bronze→silver→sanitize path and emits a static `CityModel` JSON committed to the repo. An **automation wire** (launchd or GH Action, per the wire-shipping pattern) regenerates it on a schedule → git commit → Vercel rebuild. Runtime does no live fleet calls on the public skin.

### `CityModel` contract (draft — finalize in plan)

```
CityModel = {
  generatedAt: ISO string,
  districts: [{ id, label, palette }],           // label sanitized on public skin
  nodes: [{
    id,                 // stable seed for procedural placement
    districtId,
    metrics: { ageDays, activityScore, sizeScore },  // drive height/glow; NO raw counts that identify clients
    // NO names/urls/secrets/error data on public skin
  }],
  edges: [{ from, to }] // dependency filaments, public repos only
}
```

### Procedural-from-history

- Deterministic layout, `seed = node.id` → stable across renders (reproducibility; matches the explicit-identity rule).
- Position by district biome; height/age/glow from `metrics`; connective filaments from `edges`.
- Result: the reef is laid out the way the work actually grew, not randomly.

### Interactivity (the moat)

- Hover → stats bloom (sanitized).
- Click a structure → it unfolds into a detail view for that node.
- Time-scrub slider → replay the reef building itself across time.
- Smooth orbit/dolly camera. Respect `prefers-reduced-motion`.

## Confidentiality Gate (validation zone — fails closed)

The snapshot sanitizer is the one true security boundary of the public skin.

- **Allowlist, not denylist:** only fields explicitly marked public-safe reach the committed JSON.
- **Strip:** client/CRC names + identifiers, repo names/URLs that reveal clients, secrets, Sentry error data, Stripe/revenue data.
- **Test that fails closed:** an automated check scans the emitted `CityModel` for forbidden patterns (client name list, key prefixes, url hosts) and **fails the build** on any hit. Public skin ships only when it passes green.
- Manual review of the first generated snapshot before first publish.

## Phasing (effort-honest — initial estimates were ~3-4x low per consensus)

- **Phase 0 — spike (days). GOAL: nail the look.** R3F scene, one hand-authored `CityModel`, one bioluminescent structure type, glow + dark scene + one biome, click→info. **Go/no-go gate:** if the spike is not visibly extraordinary, rethink the art before investing weeks. Throwaway-friendly.
- **Phase 1 — hero.** Snapshot adapter + sanitizer + fail-closed test → real sanitized reef live on the portfolio.
- **Phase 2 — beauty.** Full shader/glow pass, all biomes, day-night tied to commit rhythm, particle systems.
- **Phase 3 — interactivity.** Time-scrub, unfold-to-detail, camera polish, reduced-motion + mobile fallback.

Value ships at Phase 1. Phases 2-3 are optional polish, not prerequisites.

## v1 definition

**v1 = Phase 0 spike.** Smallest thing that answers the single riskiest question: *does it look extraordinary?* No real data, no pipeline, no gate yet — pure look.

## Risks

- **Look-quality risk (highest).** Generative 3D that looks like a Shadertoy demo fails the whole premise. Mitigated by the Phase 0 go/no-go.
- **Effort risk.** Making it not-generic is the hard 80%. Mitigated by phasing + shipping at Phase 1.
- **Gource-equivalence risk.** Managed by the anti-Gource thesis being a hard constraint.
- **Confidentiality risk.** Managed by the fail-closed sanitizer gate.
- **Glow-path risk.** The existing bloom (`PostProcessingEffects`) is buggy + disabled; the city's whole look depends on glow working. Mitigated by proving emissive + WebGPU/TSL bloom in Phase 0 (part of the go/no-go).
- **Perf risk.** WebGPU availability + mobile. Mitigated by the existing `WebGPUCanvas` WebGL fallback + reduced experience path.

## Open questions

- RESOLVED: extend or stand alone → **new mode/route (`/city`), reuse `WebGPUCanvas` + `webgpu.ts` only** (see reconciliation).
- RESOLVED: branch → `feat/bioluminescent-city` (created off `feat/award-tier-polish`).
- UNCONFIRMED: which services beyond GitHub feed v1 metrics (GitHub-only is fine for Phase 1).
- UNCONFIRMED: exact biome palette values (Liz's design call).
- UNCONFIRMED: whether to also reconcile the stale `galaxyData.ts` (86 vs ~90-97 real) — separate task, Liz's call.
