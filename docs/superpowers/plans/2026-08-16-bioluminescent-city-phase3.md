# Bioluminescent City — Phase 3 (Interactivity) Plan

**Date:** 2026-08-16
**Branch:** `feat/bioluminescent-city`
**Written against:** 48147bb0 (re-validate refs if HEAD moved)
**Spec:** `docs/superpowers/specs/2026-08-16-bioluminescent-city-design.md`
**Prior:** Phase 2 ✅ code-done @ d7a4af48 (crystalline-bio look on demo data).

## Goal

Complete the 3rd moat pillar — **interactive explore** (spec: "hover/click/unfold/time-scrub, not a rendered video"). Stays on **demo data** (art-first; real data = Phase 1, gated on Liz's visual go/no-go). No confidentiality surface touched.

Constraints (carried from Phase 2):
- Respect `prefers-reduced-motion` on every animated addition.
- Reuse `WebGPUCanvas`; no galaxy touch; deterministic from seed.
- Keep suite green (181 baseline).
- No composer bloom dependency.

## Slices (build one at a time)

### 3a — Camera polish  ← THIS SLICE
Damped orbit + slow idle auto-rotate that pauses on drag and while a node is
selected. Reduced-motion disables auto-rotate. Pure `OrbitControls` config +
a drag-state flag — makes the existing look feel premium immediately. Visual-only.

### 3b — Unfold-to-detail
Click a structure → camera eases to frame it + the structure emphasizes
(scale/glow bump, neighbors dim). Richer `CityInfoPanel` (metrics readout,
district biome, connected count). Deselect returns camera to overview.

### 3c — Time-scrub
Slider replays the reef building across time: structures appear/grow by
`ageDays` as the scrub advances. Deterministic; scrub is the headline
interaction. Reduced-motion → instant jumps, no tween.

### 3d — Mobile + low-end fallback
Touch controls, DPR/particle-count guard on low-end, graceful reduced
experience (fewer motes, no auto-rotate) via a perf check. Keyboard nav for a11y.

## Verification per slice
- `pnpm lint` + `pnpm biome:check` clean.
- `pnpm test` green (new pure helpers tested; interaction is visual).
- Visual: `pnpm dev` → `/city`.
- Review-clean before advancing.

## Out of scope
- Real data / sanitizer / gate = Phase 1 (validation zone, Liz sign-off).
- galaxyData de-stale = separate side task.
