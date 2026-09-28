# Design directions

Snapshot 2026-09-27. Both directions keep the approved 2026-08-18 editorial palette and type
(cream paper / ink / cobalt; Fraunces, Space Grotesk, JetBrains Mono), because that direction is
recent, deliberate, and distinctive against the dark-SaaS default. The difference is structure.

## A. Live ledger (recommended, prototyped)

The site's one original asset, real production systems checked on page load, moves into the
fold as the single bold element. Everything else gets quieter.

- Home: name-plus-claim sentence (refs 02, 04) on the left, the live-systems ledger on the right
  (original; row grammar from ref 10), so the fold uses the full width (refs 01, 07). Selected
  work rows are direct links to case studies; the accordion goes. Stat bento removed.
- Chrome: one masthead (name + Work / About / Contact) and one colophon footer on every content
  page and 404 (refs 08, 13). Theme toggle moves to the footer, persists, and exposes
  `aria-pressed`. The 3D galaxy link lives in the footer and the "80 more" line.
- /work: "Selected" with evidence plates (real screenshots in greyscale that regain colour on
  hover, ref 14; honest typographic plates where no screenshot exists, original) and an
  "Archive" table with one full sentence per project (refs 01, 09, 12). Search and category stay,
  in one bar above the archive only.
- Case study: a spread (ref 03): title, lede, spec table (ref 05) left; evidence plate right,
  sticky. Then brief / build / shipped as labelled rows, then a Numbers row that renders only
  literal values from data. The generated "System surface" and fake stat tiles go.
- Template chrome reduced: sentence-case labels instead of tracked caps on every heading, fewer
  middle-dot strings, mono only for machine data (hosts, latency, years), no arrow appended to
  every button, no 01-08 numbering (the flagships are not a sequence).

## B. Casebook (alternative, not prototyped)

Each flagship becomes a full-width chapter on the homepage: a large plate on one side and a
sticky caption on the other (refs 03, 07), with the live status as a small caption line.

- Stronger visual impact when screenshots exist.
- But only 2 of the 8 flagships have a screenshot in `public/screenshots/` (TimeSlipSearch,
  AutomaDocs); the two most important ones (Security Readiness Platform, Craft CMS Ecosystem) are
  client-confidential and cannot have one. Six of eight chapters would lead with text plates,
  which makes the page long (roughly 8 viewport heights before the archive) without adding
  evidence, and pushes the live-status idea into a caption.

## Comparison (judgment, no scores)

| Criterion | A. Live ledger | B. Casebook |
|---|---|---|
| Audience and task fit (scan in seconds) | Claim, proof and CTA in one screen; flagships as a scannable list | Slower; one project per screen |
| Content clarity | Every row states what, who, status | Rich for 2 projects, thin for 6 |
| Distinctiveness | Live ledger is unique to Liz | Plate-and-caption is a common portfolio format |
| Consistency across families | Same masthead, rows, plates, spec table everywhere | Homepage diverges from /work and case pages |
| Mobile | Ledger stacks under the claim; rows collapse to two lines | Very long scroll |
| Accessibility | Text status (not colour-only), table semantics, `aria-live` on the check time | Similar, more images needing alt text |
| Performance / complexity | Restyle of existing components; no new dependencies | Needs new screenshots the project cannot legally have |

## What the prototype does not prove yet

- About page and contact page are not prototyped; they inherit the masthead, footer, spec-table
  and section-row patterns. About will be consolidated to Now / Previously / Skills /
  Testimonial / Credentials.
- The AutomaDocs screenshot has a cookie banner baked in (asset issue, recapture recommended;
  not something the redesign can fix in CSS).
