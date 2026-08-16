# Creative Tracks Roadmap

**Date:** 2026-08-16 (decision snapshot — freeze; update only on a real priority change)
**Origin:** open-ended "build something new + cool" brainstorm → research sweeps → multi-agent consensus. Scored on: unique · useful · excellent · visual · wanted · needed · fun.

Three separate tracks (deliberately NOT one merged engine — decided during brainstorm). Build order below; one at a time, each gets brainstorm → spec → plan → build.

## Track A — Bioluminescent City 🌆 (LEAD)

Interactive bioluminescent-organic city on the `elizabethannstein` public portfolio, grown from real (sanitized) dev-fleet data. Moat = her data + her tooling (`hq`, `codebase-memory-mcp`) + her design taste. Anti-Gource: wins only on bespoke art + multi-service fusion + interactive explore.

- **Phase 0 — look spike: ✅ DONE** (branch `feat/bioluminescent-city`, kept local, @ bbf4bea3). `/city` route, glowing structures from demo metrics, click→info, 170/170 tests, review-clean. Spec: `docs/superpowers/specs/2026-08-16-bioluminescent-city-design.md`. Plan: `docs/superpowers/plans/2026-08-16-bioluminescent-city-phase0.md`.
- **Phase 1 — real data:** bronze/silver/gold pipeline → sanitized `CityModel` snapshot, wire-refreshed. Fail-closed sanitizer gate (no client/CRC/secrets/error/revenue data). [next]
- **Phase 2 — beauty (← current focus):** form = **crystalline-bio** (faceted glowing crystal-organisms). Shader/glow pass, biomes, atmosphere/fog, day-night from commit rhythm, connective filaments, particles. **Art-first** — iterate look on demo data, wire real sanitized data (Phase 1) after. (Decided 2026-08-16.)
- **Phase 3 — interactivity:** time-scrub, unfold-to-detail, camera polish, keyboard nav (a11y), mobile fallback.
- Deferred: pixel visual-baseline (via Docker script once art stabilizes); CityInfoPanel cosmetic drift (backdrop-blur, font-size).

## Track B — Sandworld 🌋 (QUEUED, 3rd)

Decided direction: **programmable WebGPU falling-sand sandbox + a live element DSL.** Standalone creative toy, NOT tied to portfolio/fleet. Better-than-existing hook: user-scriptable elements (Powder Toy/Noita are fixed). Own repo/spec TBD when reached.

## Track C — Incident/Corpus tools ✨ (QUEUED, 2nd) — BOTH eventually

From consensus. Build both over time; pick lead when reached.
- **Postmortem Roguelike** — explore real incidents (Do-Not-Retry log, past leaks/dead-wire) as dungeon levels. Panel favorite; uncopyable (private incident prose); local TUI; days not weeks; harvests new incidents so it never plateaus.
- **Rules Cartographer** — mine her ~25 rules/ledger/memory files for contradictions, staleness, dead rules, budget drift. Highest NEEDED in the sweep; most uncopyable.

## Side task — galaxyData de-stale

Existing `/explore` galaxy (`src/lib/galaxyData.ts`) is stale (~86 curated vs ~90-97 real repos; CLAUDE.md wrongly says 90). Diff report commissioned 2026-08-16 (read-only, curation aid — NOT auto-add, excludes client/CRC/private). Liz curates from the report.

## Considered & rejected (don't re-litigate)
- "One engine, four skins" synthesis — dropped when tracks were split for focus.
- City as a live private ops dashboard — consensus killed it (always-on glance-object = the unwatched-wire failure mode). City is a portfolio showpiece only.
- Web-aggregated idea board (Mycelium, generic code-city, etc.) — superseded by the uniquely-hers consensus winners.
