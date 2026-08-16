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
- `@react-three/drei` for camera/controls/helpers (confirm presence; add if missing).
- Deploy: Vercel (existing).
- **Open item for planning:** the repo already imports `three`/R3F — investigate existing 3D usage before adding, integrate rather than duplicate (do not assume; read the code in the plan phase).

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
- **Perf risk.** WebGPU availability + mobile. Mitigated by WebGL fallback + reduced experience path.

## Open questions

- UNCONFIRMED: existing `three`/R3F usage in the repo — extend or stand alone? (Read in plan phase.)
- UNCONFIRMED: which services beyond GitHub feed v1 metrics (GitHub-only is fine for Phase 1).
- UNCONFIRMED: exact biome palette values (Liz's design call).
- UNCONFIRMED: branch/commit strategy for landing this alongside `feat/award-tier-polish`.
