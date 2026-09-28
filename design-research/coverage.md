# Coverage tracker

Snapshot 2026-09-27, against `e0192a6a`; Impl./Verified filled after implementation on `feat/live-ledger-redesign`. Inventory source: repo read + subagent inventory
(routes, chrome, component usage, states, e2e specs). Status values: Inspected / Planned /
Updated / Unchanged (reason) / Blocked (requirement) / Excluded (reason). "Verified" is only
written after a browser check of the implemented app.

## Routes and page families

| Area | Paths | Inspected | Findings | Planned change | Impl. | Verified |
|---|---|---|---|---|---|---|
| Home `/` | `src/app/page.tsx`, `src/components/home/LiveSystemsIndex.tsx` + `.module.css` | Yes, 1440 + 390 | W1 own chrome, W2 counts, W5 empty half-fold, bento restates index, accordion hides case links, status grammar | Shared chrome; claim headline + proof column; rows link to case; normalised status cell | Updated | Yes: 1440/390, light/dark, ledger resolves, Refresh, no overflow |
| Work index `/work` | `src/app/work/page.tsx`, `src/components/work/WorkPageClient.tsx` + `.module.css` | Yes | W3 control overload, flat rows, truncation, no imagery; W7 Surprise me | Selected (with plates) + Archive list; controls collapsed into one bar | Updated | Yes: 1440/390, filter chip, search, URL sync (e2e) |
| Work empty state | `WorkPageClient.tsx:423-431` | Code read | Copy fine, needs visual check after restyle | Restyle only | Updated: "Clear filters" button refocuses search | Yes: e2e `empty search offers a way back` |
| Case study `/work/[slug]` rich | `src/app/work/[slug]/page.tsx`, `src/components/projects/ProjectCaseStudy.tsx` + `.module.css` | Yes (`security-readiness-platform`) | W4 filler panel, fake stat | Spread head: facts table + evidence plate; honest numbers only | Updated | Yes: 1440/390 light/dark |
| Case study flagship w/ demo | same, `timeslip-search` | Yes | W4 duplicate stat, emoji lede, rail overlap | Same system; keep interactive demo | Updated: emoji stripped at render, demo section labelled | Yes: 1440/390 |
| Case study sparse | same, `mcp-wrapper` | Yes | W4 generated panel dominates a thin page | Typographic plate, compact layout | Updated (same template, typeplate) | Code path shared; axe smoke on `/work/chronicle` |
| Case interactive widgets | `src/components/projects/{TimeSlipScrubber,TraceComparison,HireReadySimulator,InteractiveTerminal,TheReceiptsDrawer}.tsx` | Partly (TimeSlip seen) | Dark widgets inside paper page | Frame consistently; internals unchanged | Updated framing and headings; widget internals unchanged; TheReceiptsDrawer removed (asserted identical CI/test claims for every project) | Yes: TimeSlip at 390 |
| Chapter rail / scroll progress | `src/components/ui/CaseStudyChapterRail.tsx`, `ScrollProgress.tsx` | Yes | W4 overlaps gutter, covers mobile CTA | Reposition / hide on mobile | Rail removed (page is short enough without it; fixed the overlap); ScrollProgress unchanged | Yes |
| About `/about` | `src/app/about/page.tsx`, `about.module.css` | Yes | W6 repetition, 3 CTA clusters | Consolidate to Now / Previously / Skills / Testimonial / Credentials | Updated: one head, label/content rows, Highlights folded into rows | Yes: 1440/390 light/dark |
| Contact `/contact` | `src/app/contact/page.tsx`, `ContactForm.tsx` + css | Yes (idle state) | Solid; header issues only | Inherit chrome; verify states | Updated: page head, sentence-case labels | Yes: 1440/390 light/dark |
| Contact form states | `ContactForm.tsx`, `src/app/api/contact/route.ts` | Code read | idle/submitting/success/error exist; dev mode returns ok without sending | Verify in browser with blank key or route stub | Second pass: focus management, error contrast, copy (S3, S4, S9) | Improved and verified (second pass): success, error, send-again with `/api/contact` stubbed; real Resend send not exercised by design |
| Privacy `/privacy` | `src/app/privacy/page.tsx` | Yes | Long prose reads fine | Inherit chrome and prose tokens | Updated: page head | Yes |
| 404 | `src/app/not-found.tsx` | Yes | W1 no chrome; generic title | Add shared chrome + title | Updated: shared chrome, title "Page not found", noindex | Yes: e2e error-pages pass |
| Error boundary | `src/app/error.tsx` | Code read | Not reproducible without forcing a throw | Inherit tokens; review only | Updated: shared chrome | Code only (needs a forced throw) |
| Global error | `src/app/global-error.tsx` | Code read | Deliberately outside `.editorial` | Unchanged (must not depend on layout) | Unchanged (must not depend on layout) | n/a |
| Loading | `src/app/loading.tsx` | Code read | Shimmer bar, no text | Review only | Unchanged (neutral shimmer) | Removed in second pass (S11, owner approved): its Suspense fallback hid all content without JS. Verified: content visible with JS off on every content page |
| `/explore` 3D galaxy | `src/app/explore/*`, `src/components/3d/*`, galaxy `ui/*` | Screenshot only | Separate dark system by design; dev FPS monitor visible in dev | Excluded: separate showcase system per `.impeccable.md` 2026-08-18; entry links only | Excluded | Its ProjectModal renders ProjectCaseStudy outside `.editorial`, so tokens are unset there; pre-existing, now noted |
| `/city` | `src/app/city/*`, `src/components/3d/city/*` | Screenshot only | In-progress, noindex | Excluded: in-progress creative track | Excluded | n/a |
| OG / icons / manifest | `src/app/opengraph-image.tsx`, `api/og/*`, `icon.tsx` | Not rendered | Not part of visible UX redesign | Unchanged | Unchanged | n/a |

## Shared components and tokens

| Area | Paths | Consumers | Findings | Planned | Impl. | Verified |
|---|---|---|---|---|---|---|
| Editorial tokens + primitives | `src/styles/editorial.css` | every content page | Good base; missing screenshot plate, spec table, status primitives | Extend, do not replace | Updated: --le-down, sentence-case eEyebrow/eLabel/eBtn, eSect, ePageHead, eState, ePlate, eTypeplate, eSpec | Yes |
| SiteHeader | `src/components/ui/SiteHeader.tsx` + css | work, case, about, contact, privacy | Wraps on mobile; theme not persisted | One-line masthead; used on home + 404 too | Updated: one line, 3 links | Yes: 390 one line |
| SiteFooter | `src/components/ui/SiteFooter.tsx` + css | same | "two organisations"; home has a different footer | Single colophon footer incl. résumé link | Updated: colophon, résumé, 3D galaxy, privacy, theme | Yes |
| AskAIAboutMe | `src/components/ui/AskAIAboutMe.tsx` | SiteFooter | Deep-link chips, not chat | Restyle within footer | Updated: sentence case, 44px chips | Yes |
| RandomProjectButton | `src/components/ui/RandomProjectButton.tsx` | /work | W7 unstyled | Fix classes | Updated call site: `eBtn eBtnGhost` | Yes |
| ProjectPlaceholder | `src/components/ui/ProjectPlaceholder.tsx` | work, case | Generated card | Replace in case head with typographic plate | Removed (no consumers left) | n/a |
| Command palette | `src/components/ui/CommandPalette*.tsx` | global Cmd+K | Works on content pages | Unchanged; check it still opens | Unchanged | Yes: smoke Cmd+K passes |
| Theme toggle | SiteHeader + LiveSystemsIndex | all content | Not persisted, duplicated | One toggle, persisted, `aria-pressed` | Updated: ThemeToggle + pre-paint script, localStorage `le-theme` | Yes: persists across navigation, aria-pressed flips |
| Unused components | `GalaxyFilter, ProjectBadges, ScrollReveal, SocialProofBadges, StarryBackground, TiltCard, VideoEmbed` | none | Dead code | Unchanged (out of scope; mention only) | Unchanged (out of scope) | n/a |

## Journeys

| Journey | Status |
|---|---|
| Recruiter: land on / → scan flagships → open case → download résumé | Inspected (baseline) |
| Recruiter on phone: / → contact | Inspected (baseline) |
| Browse /work, filter by category, search, empty state, reset | Verified (e2e work-filters, 4 tests) |
| Case study → prev/next → related | Inspected (baseline) |
| Contact form: validation errors, success | Improved and verified (second pass): stubbed success moves focus to the confirmation, stubbed error keeps values, send-again focuses Name (e2e + browser) |
| Home ledger when the status check fails | Improved and verified (second pass): rows read "Unknown", never "Not responding" |
| Phone at 320px, every content page | Improved and verified (second pass): no horizontal overflow, masthead on one line |

## Second pass

Full matrix, prioritised findings and remaining gaps: `second-pass.md`. References:
`second-pass-references.md`. Screenshots: `shots/second-pass/`.
| Theme switch persists across navigation | Verified (browser) |
| Keyboard-only pass through header, index rows, filters, form | Verified: skip link first, 2px accent focus ring on links, chips are buttons with aria-pressed |
