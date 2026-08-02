# Portfolio Redesign — Editorial Direction

Written against: 3c0f08c7 (main, 2026-08-02)
Status: DESIGN (destination doc — reality lives in code + ledger)
Supersedes direction of: docs/plans/2026-06-04-portfolio-overhaul-design.md (which chose "keep galaxy as hero")

## Problem

Portfolio worry: reads generic / AI-slop, unfocused. Grounded findings this session:

- **86 projects, only ~14 featured.** Real client/contract work (CRC Ready5, Rocketpark
  Craft, Coulson One) is buried among ~52 thin experiments.
- **3D WebGL cosmic portfolio is now a recognized GitHub-boilerplate category** (Three.js +
  GSAP + glassmorphism). The concept's *genericness* is what reads as template, not the 3D
  itself. Also 800KB-2MB JS, hurts Core Web Vitals (site had an 11s LCP history).
- **Fonts were dead weight** — Space Grotesk + JetBrains Mono loaded in layout.tsx but never
  mapped in Tailwind v4, so `font-sans` fell back to the system stack. (FIXED this session.)
- **Voice is repetitive** — the same 3-4 proof points (Capella 3.98 Summa, CRC sole-dev
  Dynamics, Algolia $750 win) repeat verbatim across meta / hero / entrance (twice) / about.
- **Honesty leaks** — several projects had fabricated/unverifiable metrics (ImgZen "90%",
  Spiral Sounds "95% coverage / A+ security" with no repo, Portfolio-Pro "9.3/10", Consent
  Compass "full GDPR compliance", Security Trainer "3x retention", CodeCompass "80%").
  (FIXED this session — softened to real capability language.)

## Existing infrastructure (DO NOT rebuild — extend)

Prior July overhaul already built a recruiter fast-lane over the galaxy:
- `src/lib/proofLayer.ts` — PRIMARY_PROOF_IDS (crc-ready5 / timeslipsearch / specter),
  tiers FAST_TRACK (6) / SCENE (15) / ARCHIVE (7 hidden).
- `HiringFastTrack` modal, `HeroHighlightReel`, `Entrance` proof pills all wired to it.

So a curation layer EXISTS. The redesign question is whether to (a) sharpen that layer, or
(b) pivot the front door from galaxy-first to editorial-first. See Open Question below.

## Research POV (award-winning portfolios 2024-2026)

- Winning curated range is **3-6 (up to ~8) featured projects**. "Three excellent prove it;
  twelve mixed prove the opposite."
- Anti-AI-slop lever is **voice, not visuals** — sharp specific copy reads human even on a
  generic visual layer. Strategic imperfection (grain, hand-drawn, rough grids) > more polish.
- Distinctive concepts **couple the metaphor to what the person does** (Bruno Simon drivable
  car, Cassie Evans illustrated desk, Josh Comeau teaching engine, Phantom.Land WebGL-pitches-
  WebGL). A decorative space theme is not coupled to "designer + full-stack dev who ships."

## Concept

**"Everything here is real, shipped, and running."** A developer flexes *production software*,
not mockups. Differentiation = range + velocity + it-actually-works — the one story 86 shipped
projects earns and no template can fake. Honest to Elizabeth's reality (mostly dev, few net-new
design artifacts, so a design↔code toggle was ruled out this session).

## Flagship set (provisional — final pick is a Phase 3 visible decision)

Built on verifiability: CRC Ready5 (live, production, client) · Rocketpark Craft (client, 10
sites) · TimeSlipSearch ($750 Algolia win, DEV.to) · Specter (npm-published) · Trace (DEV.to
win, live+gh) · AutomaDocs (live SaaS, Stripe) · hq (daily-driver, 216 tests) · + one of
HireReady / StanceStream / Coulson One / Chronicle for range.

## Phases

1. **Curation + honesty + type** — DONE 2026-08-02: fonts wired, fabricated claims softened.
   tsc clean, 73/73 tests. (Flagship-flag curation deferred to Phase 3.)
2. **Copy** — kill verbatim-repeated proof points; sharpen voice; de-space-theme where it hurts
   clarity. Source of truth: src/lib/constants.ts (SITE.*), about/page.tsx, case-study template.
3. **Editorial IA + visual system** — build as a REVIEWABLE PREVIEW first (not blind ship):
   new hero, curated home, editorial case-study layout, real type pairing (display face). Decide
   galaxy fate: opt-in "explore all" vs sharpened-as-is. Extend proofLayer, don't rebuild.
4. **Case-study depth** — pull real specs from Notion (Project Diagrams index, TimeSlipSearch /
   StanceStream "How It Works", Project Registry DB) into richer case studies. Needs a rich-content
   field on the Project type (currently only short strings).
5. **Verify + ship** — build, tests, Lighthouse; branch cleanup; resolve open PRs (release-please
   1.1.0, #55 OG-image, #57 deps); commit-or-discard the react-doctor tooling diff; deploy.

## Open question (needs Elizabeth's call)

Full pivot (galaxy → opt-in, editorial front door) vs sharpen-existing (keep galaxy hero, tighten
proofLayer curation + voice + type). The pivot reverses the June/July "keep galaxy as flex"
decision. Recommendation: build the editorial home as a preview at a temp route, compare side by
side with the live galaxy, then decide with eyes on both — don't discard working 3D work unseen.
