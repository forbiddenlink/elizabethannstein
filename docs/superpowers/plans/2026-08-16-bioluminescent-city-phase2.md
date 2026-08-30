# Bioluminescent City — Phase 2 (Beauty) Plan

**Date:** 2026-08-16
**Branch:** `feat/bioluminescent-city`
**Written against:** d8bec639 (re-validate refs if HEAD moved)
**Spec:** `docs/superpowers/specs/2026-08-16-bioluminescent-city-design.md`
**Prior:** Phase 0 plan `2026-08-16-bioluminescent-city-phase0.md` (✅ done @ bbf4bea3)

## Goal

Form language shift **cylinder → crystalline-bio** (faceted glowing crystal-organisms; sharper/premium, not soft coral). Full look pass on **demo data** — real sanitized fleet (Phase 1) wired AFTER the look lands. Art-first, decided 2026-08-16.

Constraints (from spec, non-negotiable):
- No dependency on `PostProcessingEffects` composer bloom (WebGL-only, buggy, disabled). Glow = emissive + additive shells / TSL only.
- Do NOT touch galaxy (`GalaxyScene.tsx`, `galaxyData.ts`, `/explore`). City is additive.
- Reuse `WebGPUCanvas` + `webgpu.ts`. No second renderer layer.
- Deterministic from `seedFromId(node.id)` — stable across renders.
- `prefers-reduced-motion` respected.
- Keep test suite green (170/170 baseline).

## Slices (build one at a time)

### 2a — Crystalline form language  ← THIS SLICE
Replace `BioStructure` cylinder with a **faceted crystal cluster**: a tall main shard (octahedron/bipyramid, `flatShading`) + 1-2 deterministic secondary shards. Premium glow without composer: emissive flat-shaded core + additive rim shell + bright inner seed. Dormant nodes (low activityScore) desaturate to cold husks. New pure helper `crystalShards(seed, height)` — deterministic shard transforms, unit-tested. **Go/no-go: does crystalline read as premium on demo data?**

### 2b — Biomes
3 districts (personal / agency / CRC — labels sanitized on public skin) with distinct palettes. Expand `demoCity` to multi-district. District-clustered layout (each biome its own region, not one spiral). **Palette values = Liz's design call** (spec Open Question, UNCONFIRMED) — surface options, don't guess-freeze.

### 2c — Atmosphere
Depth fog tuning, drifting particle field (motes), subtle ground grid/reflection, vignette. Reduced-motion kills drift.

### 2d — Filaments + day-night
Connective filaments from `edges` (glowing curves between shards). Day-night ambient tied to commit rhythm (demo: derive from node ageDays/activity aggregate). Deferred pixel visual-baseline (Docker) once art stabilizes.

## Verification per slice
- `pnpm lint` (tsc) + `pnpm biome:check` clean.
- `pnpm test` green (new helper tests added).
- Visual: `pnpm dev` → `/city`, eyeball on demo data.
- Review-clean before advancing to next slice.

## Out of scope (Phase 2)
- Real data / sanitizer / fail-closed gate = Phase 1.
- Time-scrub, unfold-to-detail, mobile fallback = Phase 3.
- galaxyData de-stale = separate side task.
