# Design brief: elizabethannstein.com

Snapshot 2026-09-27. Written against `e0192a6a` (main). Audit run on the local dev server
(`pnpm dev`, http://localhost:3000) from this checkout; baseline screenshots are in
`shots/current/` at 1440x1000 and 390x844. Labels used below: **[Observed]** = seen in the
browser or code this session, **[Judgment]** = design opinion, **[Assumption]** = not verified.

## Audience and primary goals

- **Recruiters and hiring engineers** deciding in seconds whether to read further
  (`.impeccable.md` "Users"). [Assumption, carried from the repo's own design file; no
  analytics were consulted.]
- **Hiring managers at product/creative companies** who expect design sensibility, and
  **contract clients** (the site says "Open to contract work").
- Goals, in order: (1) understand who Liz is and what she ships within one screen,
  (2) see proof that it is real (live systems, case studies), (3) get the résumé or make
  contact, (4) optionally explore the 3D galaxy as a craft showcase.

## Page families and purposes

| Family | Route(s) | Purpose |
|---|---|---|
| Home | `/` | Identity + the 8 flagships with live status + CTAs |
| Work index | `/work` (`?filter ?q ?view ?tag ?sort`) | Browse 60 proof-tier / 88 total projects |
| Case study | `/work/[slug]` (88 SSG pages) | Evidence for one project |
| About | `/about` | Bio, skills, testimonial, credentials |
| Contact | `/contact` | Form (Resend) + direct channels |
| Privacy | `/privacy` | Long-form legal prose |
| System states | 404, `error.tsx`, `global-error.tsx`, `loading.tsx` | Recovery |
| Showcases | `/explore` (3D galaxy), `/city` (noindex, in progress) | Opt-in craft demos, separate dark system |

No authentication or roles exist (inventory §9).

## Brand qualities worth preserving [Observed + Judgment]

- The 2026-08-18 editorial language: cream paper / ink / cobalt, Fraunces + JetBrains Mono +
  Space Grotesk, hairline rules, folios and datelines. It is distinctive against the dark-SaaS
  portfolio default and matches "arresting + credible".
- The "live systems" idea: flagships that ping real production URLs (`/api/status`). No
  reference portfolio in the research set does this; it is the site's most original asset.
- Honest copy discipline (fabricated metrics were already removed in August) and the
  AA-tuned `--le-muted` values in `editorial.css:13-18`.
- `/explore` as an opt-in 3D showcase, never the first paint.

## Stack and technical constraints

Next.js 16.3.4 App Router, React 19, TypeScript, CSS Modules + scoped `editorial.css`
(Tailwind v4 present but content pages use modules), pnpm. Fonts via `next/font`. 15 real
product screenshots in `public/screenshots/`. Motion via CSS and small GSAP hooks
(`useGsapReveal`, `useMagnetic`). E2E specs that assert UI: see inventory §10 (visual
snapshots of `/work` and `/about` will need regeneration after any layout change).
Constraint from CLAUDE.md: keep `/explore` lazy and the initial bundle small.

## Strengths [Observed]

- Clear editorial type system with light and dark themes, AA-checked muted ink.
- Homepage fold names the person, role, and availability, with a primary CTA.
- Live status is real, fast (~15-20 ms responses observed) and degrades to static labels.
- Case studies are statically generated for all 88 projects; related / prev-next navigation exists.
- Contact form has full validation and states; dev mode never sends mail.
- No horizontal overflow on any content page at 390px (`ox:false` for all pages in the capture run).

## Prioritised weaknesses

**W1 Chrome is split across page families.** [Observed] `/` hand-rolls its own status bar
and footer (`LiveSystemsIndex.tsx:141`, `:356`) with different links and wording from
`SiteHeader`/`SiteFooter`; the homepage has no Work/About nav at the top. 404 renders with
no header or footer (`shots/current/404-desktop.png`). At 390px the shared header wraps to
two rows and drops the "Open to work" link (`work-mobile-fold.png`); the home status bar wraps
to three lines (`home-mobile.png`). The theme toggle lives in two places and does not persist
across navigation (`SiteHeader.tsx:18` only sets an attribute). [Judgment] Visitors lose their
bearings moving between home and the rest of the site.

**W2 Contradictory numbers.** [Observed] Home says "Eighty-eight things shipped"
(`LiveSystemsIndex.tsx:192`), "86 Projects shipped" (`:236`), "Selected work · 08 / 86"
(`:258`); `/work` says "60 proof-tier projects … Full catalog (88)"; home bento says
"3 Organisations … three teams" (`:243`) while both footers say "two organisations"
(`SiteFooter.tsx:50`, `LiveSystemsIndex.tsx:360`). `constants.ts:14` holds 88. A recruiter
who notices loses trust in every other number.

**W3 /work front-loads controls and flattens the work.** [Observed] Before the first project:
"Surprise me" button, an "At a glance" strip, search, Proof/Full toggle, 7 galaxy chips,
sort, 11 tag chips (`work-desktop-fold.png`). At 390px the first project appears after
~2.5 screens and the page is 17,316px tall. All 60 rows share one weight; descriptions are
truncated with an ellipsis mid-sentence. No imagery even though 15 screenshots exist.

**W4 Case studies lead with filler, not evidence.** [Observed] Projects without a
screenshot render a large generated "System surface" panel ("SYS.SPEC-01 … STATUS: ARCHIVAL
SPEC", random dots, a giant initial letter) as the first evidence block
(`case-rich-desktop.png`, `case-sparse-desktop.png`). Stat tiles show non-numbers as numbers
("In production" as a headline stat) and duplicates ("At a glance: 420,000 FILES" repeats
"420K+ records" on TimeSlipSearch, `case-flagship-desktop.png`). The TimeSlipSearch lede starts
with an emoji. The chapter rail overlaps the left gutter on desktop and covers the "View live
site" button at 390px (`case-flagship-mobile-fold.png`). Hero right half is empty at 1440.

**W5 Homepage fold and index.** [Observed] At 1440 the masthead occupies the left ~55% and the
right is blank; a 4-tile stat bento restates the index ("8/8 live", "86 projects") right above
it, with the index label jammed against the bento. Flagship rows expand in place and the
case-study page is only reachable through a link inside the expanded panel. The status column
mixes grammars ("live · 15ms", "Dynamics 365 / IN PRODUCTION", "216 tests · daily driver") and
the hq row's dot is misaligned. [Judgment] The expand-in-place accordion duplicates the case
pages and hides the path to them.

**W6 /about repeats itself.** [Observed] 5,866px at desktop: "About Me", "What I Do",
"Highlights" (10 bullets) and the header restate the same Dynamics 365 / Algolia / npm / Summa
facts three or four times; three separate CTA clusters; a video reel mid-page.

**W7 Component defects.** [Observed] "Surprise me" renders as an unstyled browser button with
a broken icon row (`RandomProjectButton` gets `className="eBtnGhost"` without the `eBtn` base,
`WorkPageClient.tsx:280`). 404 page `<title>` is the generic site title. Next dev indicator
covers content at bottom-left in dev only (not a production issue).

## What success looks like

- One header and one footer on every content page and on 404, fitting on one line at 390px.
- Every count on the site derives from data and agrees.
- The homepage fold uses the full width and leads with a claim, proof, and one primary action;
  each flagship row is a direct link to its case study.
- /work shows the selected work with real imagery first and the archive as a fast-scanning
  list, with filters available but not in the way.
- Case studies open with a facts table and real evidence (screenshot or live demo); no
  generated decoration, no fake stats.
- /about states each fact once.
- All of the above in light and dark, keyboard-operable with visible focus, AA contrast, and
  respecting reduced motion.
- No claim of conversion improvement is made; there is no analytics baseline in this work.
