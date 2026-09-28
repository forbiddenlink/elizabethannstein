# Implementation plan (Direction A)

Written against `533969db` on branch `feat/live-ledger-redesign`, 2026-09-27.

1. Tokens + primitives: `src/styles/editorial.css` (`--le-down`, sentence-case `.eEyebrow`/`.eLabel`, `.ePlate`, `.eTypeplate`, `.eSpec`, `.eStatus`). [W1-W5]
2. Chrome: rewrite `SiteHeader` (one line, no pills), `SiteFooter` (colophon, résumé, 3D galaxy, theme), new `ThemeToggle`, no-flash theme script in `src/app/layout.tsx`. [W1, W2]
3. Home: rewrite `src/components/home/LiveSystemsIndex.tsx` + css: shared chrome, claim + ledger fold, rows link to `/work/[id]`, derived counts, keep `?p=` redirect and `/api/status`. [W1, W2, W5]
4. /work: `WorkPageClient.tsx` + css: Selected plates (FLAGSHIPS) + Archive table; filters in one bar; fix Surprise me. Keep `filter`/`q`/`tag`/`sort` URL contract. [W3, W7]
5. Case study: `ProjectCaseStudy.tsx` + css and `src/app/work/[slug]/page.tsx`: spread head, spec table, plate, literal numbers only, remove generated panel, generated boilerplate and `TheReceiptsDrawer` (generic unverified claims), chapter rail no longer overlaps. [W4]
6. About: consolidate `src/app/about/page.tsx` to Now / Previously / Skills / Testimonial / Credentials. [W6]
7. Contact, privacy, 404, error: inherit chrome; 404 title. [W1, W7]
8. Tests: update e2e specs that assert the removed UI; unit tests; build.
9. Browser verification at 1440 / 900 / 390, light + dark, keyboard, reduced motion, form states; final screenshots; coverage.md.
