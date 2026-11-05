# The herbarium: design

Written against: `323eaea5` (main, 2026-10-28)
Status: draft, awaiting Liz's approval
Mockup: `.superpowers/brainstorm/40728-1793218896/content/herbarium-bonsai-v2.html` (section A)

## Intent

The 3D space galaxy at `/explore` no longer feels right for this portfolio. Liz wants a
nature-themed interactive showcase in its place: something with strong visuals that people can
explore, the way they could fly through the galaxy.

The chosen direction is a **herbarium**: a naturalist's field journal where every project is a
pressed botanical specimen. Opening a specimen is the signature moment. The ink drawing lifts
off the page and becomes a living 3D plant.

Why this direction won over the alternatives (a floating garden island, a single bonsai tree, a
firefly game, an overgrown ruin, a watershed):

- **It belongs to the site that already exists.** The content site is an editorial,
  print-magazine design (paper tones, ink, Fraunces). A field journal is the same language,
  so the showcase reads as a chapter of the site instead of a separate theme. The galaxy never
  fit that way.
- **It is honest.** Every plant is generated from real project data, which matches the site's
  first design principle, "proof before adjectives" (`DESIGN.md`).
- **It is unusual.** Research (2026-10-28) found garden-themed portfolios built from
  hand-modelled scenes, and many photoreal WebGPU grass demos, but no site that grows plants
  from real data. Stylized ink work (for example Codrops' "Still", 2026-09) stands out more than
  realism in the current field.
- **It stays fast.** The journal is flat drawings. 3D loads only when a visitor opens a
  specimen.

## Goals

1. A new route, `/herbarium`, presenting all projects in `galaxyData.ts` as illustrated
   specimens in a field-journal layout.
2. Each specimen's drawing is generated from that project's data, so no two look alike and new
   projects get a plate automatically.
3. Opening a specimen shows the plant as a living 3D object the visitor can turn, with wind
   motion and lighting that follows the visitor's time of day, beside a specimen card of
   facts and links.
4. The galaxy is switched off, not deleted (see "Retiring the galaxy").
5. The page works well on a phone and without WebGL.

## Non-goals

- Changing `/work`, `/work/[slug]`, the homepage layout, or any other content page beyond
  swapping the link text. `/work` stays the plain, fast archive recruiters use.
- A walkable garden or landscape scene. Plants appear one at a time, inside the journal. A
  garden can be a later project.
- Finishing or removing `/city`. It stays paused, hidden, and untouched.
- Deleting galaxy code.

## Anti-goals (would count as failure even if it works)

- **Clip-art botany.** If the drawings look generic, cartoonish, or AI-generated, the concept
  fails. Art direction is the main risk and the main work.
- **Invented facts.** Never show a metric, status, or claim the data does not hold (`DESIGN.md`
  constraint). Mock Latin names are clearly playful, but every fact on a specimen card comes
  from data.
- **A slow journal.** If the plate grid pulls in three.js, or the first load gets noticeably
  heavier than `/work`, it has failed.
- **A dead end for impatient visitors.** Someone who will not click into specimens must still
  be able to scan every project and reach its case study from the journal.

## What the visitor sees

### The journal (the page)

- Uses the editorial system: `src/styles/editorial.css`, `--le-*` tokens, Fraunces, Space
  Grotesk, JetBrains Mono, the shared `SiteHeader` / `SiteFooter`, and both light and dark
  themes.
- A title page or opening spread: "Herbarium of shipped work", a volume line ("collected 2023
  to 2026", derived from the data), and a short note on how to read it.
- An **index of families**: the six categories (`galaxies` in `galaxyData.ts`) shown as plant
  families with playful Latin names (Enterprisaceae, Intellectaceae, Plenistackaceae,
  Instrumentaceae, Designaceae, Experimentaceae), each with a category dot and a specimen count
  derived from data.
- **Plates**: one per project, grouped by family, featured projects first within each family.
  Each plate shows a figure number, the drawing, a mock Latin binomial, the real project name,
  and the date range in mono. Two leader-line labels ("a", "b") point at parts of the plant;
  the specimen card explains them as the first two items of the stack.

### The specimen drawing (generated)

Drawn as SVG ink line work on paper, in the style of the mockup: stem, leaves with midribs and
veins, a head, roots below a hatched soil line.

How data shapes the drawing:

| Data | Drawing |
|---|---|
| `id` | seed for all randomness, so a project's plant is stable across visits and deploys |
| `galaxy` (category) | plant form family (for example flowering, fern, grass, berry, leafy branch) and the watercolor hue |
| `size` | how lush the plant is: leaf count, height |
| `featured` | flowers or fruits; non-featured plants are leafy only |
| `tags` | the labeled parts on the plate |
| `dateRange` | collection date on the plate |
| `status: 'archived'` | a pressed, faded look (dried specimen) |

### Opening a specimen (the signature moment)

- The drawing animates: ink strokes draw in, a watercolor wash fades in using the category hue,
  the plant settles into a slow sway. Then it becomes, or is replaced by, a 3D version of the
  same plant that the visitor can rotate.
- The 3D plant matches the 2D drawing's structure (same seed, same parts), styled to look drawn
  rather than photoreal (ink outlines, flat or toon shading, paper-toned backdrop).
- Lighting follows the visitor's local time of day. Wind moves the leaves.
- A **specimen card** beside it, using the existing spec-table pattern (`.eSpec`): collected
  (dates), family, parts (stack), habit (size, featured), status (only if a live URL exists,
  checked through the existing `/api/status` path, using the same honest states as the home
  ledger: live, not responding, unknown), plus links to the case study, live site and GitHub
  where the data has them.
- The opened specimen has its own URL (a query param or nested route) so it can be shared and
  the back button closes it.

## Constraints

- Follow `DESIGN.md` and `.impeccable.md`. Content-site rules apply: AA contrast in both themes,
  44px touch targets, status shown as a word plus a dot, never colour alone.
- **No three.js in the journal bundle.** The 3D viewer is lazy-loaded on first open, the same
  way `/explore` lazy-loads `GalaxyScene.tsx`. The existing stack is three `^0.186`,
  `@react-three/fiber` 9, drei 10.
- Without WebGL, or with `prefers-reduced-motion: reduce`, the opened specimen shows the
  finished 2D drawing (wash applied, no animation) and the card. Nothing is lost except the
  3D turntable.
- Keyboard: plates are buttons or links in a logical order, the opened specimen traps focus,
  Escape closes it, and focus returns to the plate (the mockup does this).
- Every visible count is derived from `galaxyData.ts`; nothing is hardcoded.
- Projects that are noindexed elsewhere (`isProofCatalogProject` in `proofLayer.ts`) still get a
  plate, but their links follow the same rules the `/work` archive uses.
- Tests that assert UI copy live in `e2e/` and change with the UI. The nightly regression suite
  must stay green.

## Retiring the galaxy

"Off, not deleted." The galaxy stays reachable only for someone who knows the URL.

- Repoint the content-site links to `/herbarium`:
  - `src/components/home/LiveSystemsIndex.tsx:382` ("fly through it as a 3D galaxy")
  - `src/components/ui/SiteFooter.tsx:44` ("3D galaxy")
  - the `/explore` entries in `src/components/ui/CommandPalette.tsx` (around lines 98 and 153)
- Remove `/explore` from `src/app/sitemap.ts`, add `/herbarium`.
- Give `/explore` `robots: { index: false, follow: false }` in its layout, the same pattern
  `/city` uses (`src/app/city/layout.tsx`). **My call:** noindex instead of a redirect, so the
  galaxy still works by direct URL if Liz wants to compare or bring it back.
- Keep every file under `src/components/3d/` and `src/app/explore/`.
- Update `e2e/smoke/routes.smoke.spec.ts` (it lists `/explore`) and add `/herbarium`.
- Update `CLAUDE.md` and `README.md` where they describe `/explore` as the showcase.

## Decided

- Direction: the herbarium (Liz picked it from the mockups, 2026-10-28).
- It lives on its own route, `/herbarium`; `/work` is untouched. *(My call, Liz agreed.)*
- All projects get a plate. *(My call, Liz agreed.)*
- The 3D plant opens inside the journal, not in a separate garden scene. *(My call, Liz
  agreed.)*
- `/city` stays paused and hidden. *(My call, Liz agreed.)*
- The galaxy is switched off and kept. *(Liz.)*

## Settled after the builder check (2026-10-28)

These were open questions from a fresh-context review. Each is my call unless marked otherwise.

- **Plate count and size.** `galaxyData.ts` holds 89 projects (16 featured), counted by
  flattening `galaxies`. Every project gets a full-size plate of the same size, as in the
  mockup Liz picked, with featured plates first in each family. Drawings come from the
  generator, so the art pass judges the generator across all 89 at once on a contact sheet
  rather than hand-tuning each plate.
- **Live status.** `/api/status` only pings `FLAGSHIPS` entries with `status: 'live'` and a
  `statusUrl` (`src/app/api/status/route.ts:10`). The card shows a status row only for those
  projects and omits the row for everyone else. The route is not extended to arbitrary URLs,
  so no new outbound-ping or abuse surface is added.
- **What the drawing may claim.** `tags` is the only fact source for labelled parts ("a", "b").
  Leaf, flower, root and fern shapes are decorative and carry no claimed meaning beyond the
  mapping table above. The card's "Habit" row reads the size as Flagship (`supermassive`),
  Large, Medium or Small, plus ", featured" when `featured` is true.
- **URLs and indexing.** `/herbarium` is one indexable page. An opened specimen is a query
  param (`/herbarium?specimen=<id>`) on that page, with the canonical URL staying
  `/herbarium`. There are no per-specimen pages. "Read the case study" links to `/work/<id>`,
  which already applies `noindex` to non-catalog projects itself (`src/app/work/[slug]/page.tsx:94`).
- **Dates.** "Collected 2023 to 2026" is the min and max of every four-digit year found in the
  `dateRange` strings. A plate shows its `dateRange` as written.
- **Performance budget.** The 3D viewer is one shared lazy chunk, loaded on the first open and
  cached after that. The journal's first-load JS stays within 30KB of `/work`'s, and its
  Lighthouse performance score stays no lower than `/work`'s on the same run.

## Left to the builder

- The exact plant-form vocabulary and how many forms exist per category, as long as each
  category is recognisable and drawings stay varied.
- Latin names: generated from titles or hand-written per project. A small hand-written map for
  featured projects plus a generated fallback is fine.
- How the 2D-to-3D handoff looks (crossfade, the drawing extruding, or the 3D model drawing
  itself in), as long as it feels like one continuous moment.
- How the 3D plant is built (procedural geometry from the same seed is expected).
- Journal layout details: pages versus one long scroll, plates per row at each breakpoint,
  whether families get divider pages.
- Whether the journal has light filtering (by family) beyond the index.

## Suggested build order

Each step is shippable on its own and gets a visual check against real screenshots before the
next.

1. **Drawing generator** as a pure function (seed and project in, SVG out), with unit tests for
   determinism and data mapping. Art direction pass on all plates.
2. **The journal route** with the index, plates, specimen card (2D only), shareable URLs,
   both themes, and mobile layout.
3. **Retire the galaxy** (links, sitemap, noindex, tests, docs).
4. **3D specimen viewer**, lazy-loaded, with the 2D fallback.
5. **Polish**: time-of-day lighting, wind, the 2D-to-3D transition, live status on the card.
