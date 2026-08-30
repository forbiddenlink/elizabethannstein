# Bioluminescent City — Phase 1 (Real Data) Plan

**Date:** 2026-08-16
**Branch:** `feat/bioluminescent-city`
**Written against:** ac7ab312 (re-validate refs if HEAD moved)
**Spec:** `docs/superpowers/specs/2026-08-16-bioluminescent-city-design.md` (Confidentiality Gate section)
**Prior:** Phase 2 look landed @ 9899bc2b (glow pass).

## Goal

Turn the demo reef into Liz's **real sanitized fleet**. Moat pillar #2 (multi-service
fusion). "Value ships at Phase 1."

## VALIDATION ZONE — fails closed

Per `adversarial-on-high-stakes` + `no-secrets-in-persistence`: the public skin renders a
committed static snapshot. If one client/CRC name, repo URL, secret, or error/revenue datum
reaches that committed JSON, it is published. So the sanitizer is built and proven BEFORE any
real data flows, and the first real snapshot gets manual review + Liz sign-off.

### Accountability contract (filled at ship — 1b, 2026-08-16)
- **Checklist:** scope set to PERSONAL-PUBLIC only (Liz sign-off); allowlist = hashed id +
  generic label + palette + normalized metrics; fail-closed gate green (196 tests incl.
  planted-leak catch); sanitizer hardened after security review (429d55c1); first snapshot
  manually reviewed.
- **Evidence:** `assertClean` passed in-generator ("gate: clean"); grep of committed
  `snapshot.json` for repo names / urls / secret prefixes = zero hits; districts show hashed
  ids + "Biome A-D" labels only.
- **Owner:** Liz.
- **Status after:** `src/lib/city/snapshot.json` committed @ 2295fde1 (52 nodes / 4 biomes),
  live at `/city`. Rollback = revert that commit. Regenerate = `pnpm city:snapshot`.
  Refresh cadence not yet automated → 1c.

## Status
- **1a ✅** @ 1f3e6b34 (+ hardening 429d55c1) — sanitizer + fail-closed gate.
- **1b ✅** @ 2295fde1 — adapter + real snapshot + wired /city + real-scale layout/glow tuning.
- **1c** [next] — automation wire to refresh the snapshot on a schedule.

## Slices

### 1a — Sanitizer + fail-closed gate  ← THIS SLICE (synthetic data only)
Build the security boundary first, no real data.
- `sanitizeCity(raw)` → allowlist transform emitting a public-safe `CityModel`:
  - `node.id` → **opaque hash** (repo names/ids can identify clients; never emit raw).
  - `district.id` → hash; `district.label` → generic ("Biome A/B/C"); palette kept.
  - `metrics` → keep `{ageDays, activityScore, sizeScore}` (normalized 0..1 scores; no raw
    counts that identify clients).
  - `edges` → kept only where both endpoints survive; hashed.
  - Everything else DROPPED (allowlist, not denylist).
- `assertClean(json)` → fail-closed scan of the emitted string for forbidden patterns:
  client/CRC name list, secret prefixes (`sk_`,`ghp_`,`npm_`,`xoxb-`,`napi_`, …), URL hosts,
  emails. Throws on any hit.
- TDD against a synthetic **dirty** model (planted client name + fake key + url) proving the
  gate strips + the assert catches a leak. **No real fleet data.**
- **→ present allowlist to Liz for sign-off before 1b.**

### 1b — Adapter (real pull) — AFTER sign-off
`hq` / GitHub bronze pull → silver `CityModel` → `sanitizeCity` → `assertClean` → write
`src/lib/city/snapshot.json`. Manual review of first output. Wire `/city` to load the
snapshot instead of `demoCity`.

### 1c — Automation wire
launchd or GH Action (per `wire-shipping-pattern`) regenerates snapshot on a schedule →
commit → Vercel rebuild. Runtime does NO live fleet calls on the public skin.

## Verification
- 1a: `pnpm test` green incl. new sanitizer + leak-catch tests; tsc/biome clean.
- 1b: forbidden-scan green on REAL emitted JSON (evidence line); manual eyeball; Liz sign-off.
- 1c: `launchctl list | grep` or green `gh run` pasted before "shipped".

## Out of scope
- Phase 3 interactivity (demo-data track).
- galaxyData de-stale.
