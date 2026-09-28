# Second pass: design, functionality and coverage review

Snapshot 2026-09-27 on `feat/live-ledger-redesign` (branched from `main` at `533969db`), working
tree including the first-pass implementation. Research: `second-pass-references.md`.
Evidence: `shots/second-pass/` (`before-*` = first-pass implementation, `after-*` = after this
pass, `refs/` = references).

## How this pass verified things

- Browser checks ran with headless Chromium through Playwright scripts against two servers:
  `pnpm dev` on :3000 and a production build (`pnpm build`, `next start`) on :3200. The
  production server was confirmed fresh by port PID after each rebuild, because one run was
  found to be served by a stale process from an older build; every result from that run was
  discarded and repeated (see "Process note" below).
- No deployed environment was used. Nothing here claims to describe elizabethannstein.com.
- Contact submissions were always stubbed with `page.route('**/api/contact')`; no mail was sent.
  The live-status route was stubbed to produce the "one down" and "check failed" states.
- Accessibility: axe (`@axe-core/playwright`, WCAG 2.0/2.1/2.2 A and AA tags) on stateful screens,
  plus manual keyboard checks. An axe pass is not a compliance claim.

## Prioritised findings

| ID | Priority | Area | Evidence | User impact | Fix | Verification |
|---|---|---|---|---|---|---|
| S1 | High | Masthead, every content page | At 320px, `header nav` right edge exceeded the viewport; "Contact" was clipped (`before-home-320.png`, overflow probe listed `NAV.SiteHeader_nav`) | Contact link partly off-screen on small phones | Smaller type and link padding below 360px (`SiteHeader.module.css`) | 320px: nav right edge 302px of 320 on home, work, case, contact; no overflow (`after-home-320.png`) |
| S2 | High | Home ledger | Stubbed `/api/status` abort: every row read "Not responding / no answer in 4.5 s", footer "0 of 4 responding" (`before-ledger-network-fail.png`) | Tells a recruiter four live products are down when the check simply did not run | New `unknown` state: "Unknown / not checked", footer "The status check failed. Refresh to try again." `resolvePhase` and `ledgerSummary` in `src/lib/flagshipDisplay.ts` | Unit tests (6) in `src/__tests__/ledgerStatus.test.ts`; browser: `after-ledger-network-fail-{light,dark}.png`; axe none serious/critical |
| S3 | High | Contact form | After a stubbed successful send, `document.activeElement` was `BODY`; after "Send another", also `BODY` | Keyboard and screen-reader users lose their place (WCAG 2.4.3) | Focus the "Message received." heading on success; focus Name on "Send another message" (`ContactForm.tsx`) | Browser: focus = "Message received." then `#name`, light and dark; e2e assertions added in `contact-form.spec.ts` |
| S4 | High | Contact error state | axe `color-contrast` on the error alert, light theme (error text used the "creative" category hue on its own tint) | Error message hard to read at the moment it matters | Error uses `--le-down` border and icon, ink text (`ContactForm.module.css`) | axe none serious/critical on the error state, light and dark (`after-contact-error-{light,dark}.png`) |
| S5 | Medium | Case study order | Numbers row rendered last, after three prose rows | A reader who scans the head and leaves never sees the figures | Numbers row moved directly under the head (ref 04) | `after-case-security-{1440,768,390}.png` |
| S6 | Medium | Case study at 768px | Stacked head made the 16:10 text plate a full-width, mostly empty block (`before-case-security-768.png`) | Pushes the story down with empty space | Text plate sizes to its content when the head stacks (scoped to case pages) | `after-case-security-768.png` |
| S7 | Medium | /work archive density | Full 40-70 word descriptions per row; /work ~17,400px tall at 390px | Slow scanning on phones | Descriptions clamped to two lines; full text in the DOM and on each case page (refs 02, 05) | `after-work-390.png`; row text still exposed to assistive tech |
| S8 | Medium | Link names (home rows, /work cards) | Link accessible name included plate text, org line, status and description | Screen readers read a paragraph per link | `aria-labelledby` title, `aria-describedby` summary | ARIA snapshot: `link "Security Readiness Platform"` etc. on both pages |
| S9 | Medium | Contact copy | "Your Name", "Send Message →", "Send another →", pulsing dot on success | Inconsistent with DESIGN.md sentence case and no-arrow rule | "Name", "Email", "Send message", "Send another message", static dot (ref 06) | Browser and e2e (`/Send another/` selector still matches) |
| S10 | Medium | Footer on phones | Email wrapped mid-word ("hello@elizabethannst / ein.com") in a two-column footer | Looks broken; harder to copy | Single-column footer at 480px and below | `after-contact-390-check.png` |
| S11 | Medium, not fixed | No-JS / pre-hydration | Production HTML puts page content in `<div hidden id="S:0">` behind the root `src/app/loading.tsx` Suspense fallback; with JavaScript disabled only the loading bar shows (h1 not visible on /, /work, /contact) | Visitors and tools without JS see nothing; content is still in the HTML source | Needs a decision: remove or rework the route-level loading state. Pre-existing (`loading.tsx` is not in this branch's diff) | Blocked on owner decision; see "Remaining gaps" |
| S12 | Optional, not fixed | Demo widgets | TimeSlip, Trace, HireReady and terminal demos keep their own dark styling inside paper pages | Visual seam, not a usability problem | Left as is: restyling four widgets is out of proportion to the benefit | n/a |

## Coverage matrix

| Area | Paths | Previous claimed status | Evidence from this review | Issue or uncertainty | Action | Result |
|---|---|---|---|---|---|---|
| Home `/` | `src/components/home/LiveSystemsIndex.tsx` | Updated, verified | 320/390/768/1440; stubbed one-down and check-failed states; axe | S1, S2, S8 | Fixed | Improved and verified |
| Home legacy `?p=` redirect | same | Not listed | e2e deep-link smoke 43/43 (CI mode), 4/4 isolated in dev | One cold-dev flake, passes on production build | None | Verified unchanged |
| Work `/work` | `src/components/work/WorkPageClient.tsx` | Updated, verified | 320-1440; `/` shortcut focuses search; Tab to chips, Space toggles and writes `?filter=ai`; axe on empty state | S7, S8 | Fixed | Improved and verified |
| Work empty state | same | Updated, verified | `?q=zzzz-no-match`, axe none | None | None | Verified unchanged |
| Work tag deep link | same | Not listed | Click "Next.js 16" on a case page: `/work?tag=Next.js+16`, "9 of 88 shown", scrolled to archive | None | None | Verified unchanged |
| Case study rich | `src/components/projects/ProjectCaseStudy.tsx`, `src/app/work/[slug]/page.tsx` | Updated, verified | security-readiness-platform at 390/768/1440 | S5, S6 | Fixed | Improved and verified |
| Case study with demo | same, `timeslip-search`, `hq` | Updated, verified | hq terminal at 768 and 320; TimeSlip at 390 | S12 (optional) | None | Partially verified: demo internals not exercised beyond render |
| Case study sparse | same, `mcp-wrapper` | Code path shared | 768 and 320 screenshots, no overflow | None | None | Verified unchanged |
| Invalid slug | `dynamicParams = false` | Verified by e2e | CI-mode regression 66/66 | `NoFallbackError` lines in server log are the expected 404 path | None | Verified unchanged |
| About `/about` | `src/app/about/page.tsx` | Updated, verified | 390/768/1440 | None found | None | Verified unchanged |
| Contact `/contact` + form | `src/app/contact/page.tsx`, `src/components/ui/ContactForm.tsx` | Partly verified | Stubbed success, error, send-again, empty submit (native validation focuses Name); axe on success and error | S3, S4, S9 | Fixed | Improved and verified (stubbed API only; real Resend path not exercised by design) |
| Contact API | `src/app/api/contact/route.ts` | Not reviewed | Read: validates, honeypot, dev returns `{ ok: true, dev: true }` without a key | None | None | Verified unchanged (code read) |
| Status API | `src/app/api/status/route.ts` | Updated | `x-checked-at` header read by the ledger | None | None | Verified unchanged |
| Privacy `/privacy` | `src/app/privacy/page.tsx` | Updated, verified | 320/768 | None | None | Verified unchanged |
| 404 | `src/app/not-found.tsx` | Updated, verified | 320/768 screenshots; e2e error pages | None | None | Verified unchanged |
| Error boundary | `src/app/error.tsx` | Code only | Not forced | Needs a thrown error to render | None | Partially verified: code review only |
| Loading | `src/app/loading.tsx` | Unchanged | Causes S11 | See S11 | Flagged | Blocked on owner decision |
| Global error | `src/app/global-error.tsx` | Unchanged | Code read | None | None | Intentionally excluded (must not depend on layout) |
| Masthead | `src/components/ui/SiteHeader.tsx` | Updated, verified | 320 probe | S1 | Fixed | Improved and verified |
| Footer + theme | `SiteFooter.tsx`, `ThemeToggle.tsx`, layout script | Updated, verified | 390 wrap; theme persists (first pass) | S10 | Fixed | Improved and verified |
| Command palette | `src/components/ui/CommandPalette.tsx` | Unchanged | Routes it pushes (`/work`, `/work?filter=`, `/about`, `/contact`, `/explore`) all still exist; Cmd+K smoke passes | None | None | Verified unchanged |
| Ask AI links | `AskAIAboutMe.tsx` | Updated | Rendered in every footer | Links open third-party sites; not followed | None | Partially verified: render only |
| `/explore`, `/city` | `src/app/explore/*`, `src/app/city/*` | Excluded | `ProjectModal` renders `ProjectCaseStudy` outside `.editorial` | Tokens unset inside the 3D modal (pre-existing) | Not changed | Intentionally excluded (separate showcase system) |
| OG images, icons, manifest | `src/app/api/og/*`, `icon.tsx`, `opengraph-image.tsx` | Unchanged | Not visible UI | None | None | Intentionally excluded |
| Authentication, roles | none | n/a | The app has no sign-in or roles | n/a | n/a | Not applicable |

## Process note

One verification run was served by a `next start` process left over from the previous build
(`pkill -f "next start"` did not stop it; the process was found by port and killed). That run
showed the contact form without its CSS and reported the error state as passing axe. Both
results were wrong and were re-run on a server confirmed fresh by PID. The contrast failure in
S4 came from the earlier, valid run.

## Remaining gaps

- S11 (no-JS content hidden behind the root loading fallback) is pre-existing and needs your
  call. Removing `src/app/loading.tsx` would show content without JS but also removes the
  navigation loading bar.
- Real email delivery through Resend was not exercised, on purpose.
- `error.tsx` was not rendered in a browser.
- Zoom was approximated with a 720px viewport at device scale 2; browser text-only zoom was not
  tested.
- Demo widgets were checked for render and overflow, not for every interaction.
