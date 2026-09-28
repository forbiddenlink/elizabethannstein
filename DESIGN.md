# DESIGN.md

Design system for the content site (`/`, `/work`, `/work/[slug]`, `/about`, `/contact`,
`/privacy`, 404). Approved direction: **A, "Live ledger"** (2026-09-27). The prototype lives in
`design-research/prototypes/`; the research behind each decision is in
`design-research/log.md` (reference IDs in brackets below). `/explore` and `/city` keep their
own dark showcase system and are out of scope here (`.impeccable.md`).

Implementation source of truth: `src/styles/editorial.css` (the `.editorial` scope, `--le-*`
tokens, `.e*` primitives).

## Principles

1. **Proof before adjectives.** The live-systems ledger is the one bold element on the site.
   Everything that claims something should show the thing (a live check, a screenshot, a spec
   row, a link). Original decision.
2. **One page chrome.** The same masthead and colophon footer on every content page and on
   404 [08, 13].
3. **Every number comes from data.** Counts are derived from `galaxyData.ts` / `FLAGSHIPS`, and
   a stat renders only if it is a literal value [05, 11].
4. **No generated decoration posing as evidence.** A project without a screenshot gets an
   honest typographic plate (what it is, stack, status), never procedural art [14; original].
5. **Quiet chrome.** Sentence-case labels, mono only for machine data (hosts, latency, years),
   no arrow appended to every button, no numbering on things that are not a sequence.

## Color

Semantic tokens (light / dark). Both themes are hand-tuned; do not lighten `--le-muted`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--le-paper` | `#efeadf` | `#141109` | page background |
| `--le-paper-2` | `#e6e0d2` | `#1c1810` | raised surfaces: ledger, plates |
| `--le-paper-3` | `#ddd6c4` | `#241f15` | image wells |
| `--le-ink` | `#191510` | `#f0eadb` | primary text, strong rules |
| `--le-ink-2` | `#4d473b` | `#b6af9c` | secondary text, descriptions |
| `--le-muted` | `#5d574c` | `#908871` | metadata; AA 4.5:1 on every surface |
| `--le-rule` / `--le-rule-strong` | `#cfc7b4` / ink | `#2f2a1f` / ink | hairlines / section rules |
| `--le-accent` / `--le-accent-ink` | `#1b34c9` / `#142699` | `#97a6ff` / `#b7c2ff` | links, focus, active nav, numbers |
| `--le-live` | `#2f7d4f` | `#5fce8e` | live status dot |
| `--le-down` | `#a4321f` | `#f08a74` | not-responding status |
| `--le-cat-*` | muted hues | lifted hues | category dots only, always with a text label |

Pairings: body text is `--le-ink` or `--le-ink-2` on `--le-paper`/`--le-paper-2`; status is
always a word plus a dot, never colour alone.

## Typography

- **Fraunces** (`--le-display`): headlines, titles, reading body. Variable `opsz`; large sizes
  use `opsz 144`.
- **Space Grotesk** (`--le-sans`): UI (nav, buttons, labels, spec-table keys). Sentence case.
- **JetBrains Mono** (`--le-mono`): machine data only (hosts, latency, dates, versions).

Scale (fluid): home claim `clamp(2.25rem, 4.6vw, 3.9rem)/1.04`; page title
`clamp(2.4rem, 5vw, 4.2rem)/1.02`; section title `clamp(1.5rem, 2.6vw, 2rem)/1.1`; row title
`clamp(1.3rem, 2.1vw, 1.65rem)/1.15`; body `1.0625-1.125rem/1.55-1.65`; UI `0.875-0.9375rem`;
metadata `0.8125rem`. Line length at most ~38em for prose. `text-wrap: balance` on headlines,
`pretty` on paragraphs.

## Space, grid, breakpoints

- Container `max-width: 76rem` (`.eWrap`), gutter `--le-gutter: clamp(1rem, 4.5vw, 3.5rem)`.
- Section rhythm: `clamp(2rem, 5vw, 3.5rem)` between sections, each opened by a strong rule.
- Home fold: 7fr / 5fr (claim / ledger). Case head: 6fr / 6fr (facts / plate). Story rows:
  3fr / 8fr (label / prose). On a case page the Numbers row comes first, directly under the
  head, so a reader who stops after the facts still sees them (second pass, ref 04).
- Breakpoints: `960px` (two columns collapse to one), `640px` (tables become stacked rows).
  Masthead stays one line down to 320px (smaller type below 360px).

## Surfaces, borders, radii, shadows

Flat paper. Elevation is a 1px ink border plus `--le-paper-2`; no shadows, no radius except
status dots. Hairlines (`--le-rule`) separate rows; strong rules (`--le-rule-strong`) open
sections and frame plates and the ledger.

## Imagery and icons

- Screenshots (`public/screenshots/*.webp`, mapped in `projectScreenshots.ts`) render as
  **plates**: 1px ink frame, 16:10 well, greyscale at rest, full colour on hover/focus of the
  containing link and on the case-study page itself [14]. Caption row below in mono: host left,
  years right.
- No screenshot: **typographic plate** with title (or a one-line summary) plus a short
  key/value list (stack, status, why no screenshot when confidential).
- Icons: lucide-react only where a glyph clarifies (external-link, search clear). External
  links carry a trailing ↗; internal links do not [11].

## Components and states

| Component | Where | States |
|---|---|---|
| `SiteHeader` | all content pages, 404 | link hover (ink), `aria-current` (accent underline), focus ring |
| `SiteFooter` | all content pages, 404 | theme toggle `aria-pressed`, ↗ on external links |
| `ThemeToggle` | footer | persisted in `localStorage`, applied before paint by an inline script |
| Live ledger | home | checking (blinking muted dot), live (dot + ms), not responding (hollow red dot + reason), unknown (hollow muted dot, "not checked": the status check itself failed, never reported as down), refresh button disabled while checking, `aria-live` on the timestamp |
| Index row | home, /work | whole row is a link; hover tint + accent title; status cell = word + mono detail |
| Plate / typeplate | /work selected, case head | greyscale / colour |
| Spec table (`.eSpec`) | case head | label / value rows |
| Archive table | /work | filters (search, category chips, sort), empty state with reset; descriptions clamped to two lines (full text stays in the DOM and on the case page) |
| Buttons | everywhere | primary (ink fill, accent on hover), ghost (border), disabled (0.5 opacity) |
| Contact form | /contact | idle, field errors, submitting, success (focus moves to the confirmation heading), error (typed values kept), "Send another message" returns focus to Name |
| Link rows and cards | home, /work | name comes from the title (`aria-labelledby`), description from the summary (`aria-describedby`), so plate text and meta are not read as part of the link name |

## Motion

- One orchestrated moment: the ledger rows stagger from "checking" to their result on load,
  with a brief live-tint pulse per row. Everything else is static except hover/focus colour
  changes and the screenshot colour transition (0.35s).
- `prefers-reduced-motion: reduce` removes all animation and transitions (existing global
  rule in `editorial.css`).

## Constraints

- Never invent metrics, testimonials, customers or capabilities. A stat renders only if the
  data holds it.
- Keep the AA contrast guarantees documented at the top of `editorial.css`.
- 44px minimum touch targets for nav, buttons and filter chips.
- `/explore` remains opt-in and lazy; content pages never import 3D code.
- Tests that assert UI copy live in `e2e/`; update them in the same change as the UI.

## Changelog

- 2026-09-27 second pass: unknown ledger state, archive clamp, Numbers first on case pages,
  320px masthead, contact focus handling and sentence-case form copy. Evidence in
  `design-research/second-pass.md`.
