# Portfolio Overhaul Design — elizabethannstein.com
Date: 2026-06-04
Owner: Liz (Elizabeth Stein)

## Direction
"Job-hunt first, layered." Keep the maximalist 3D galaxy (it is the differentiator and proves Three.js/GSAP skill better than any bullet). ADD a fast recruiter-scannable signal lane on top, and DEMOTE the noise so the strongest work is unmistakable in 30 seconds.

## Audience lens (recruiter / eng manager, 30s scan)
They want, fast: (1) Is she real? (2) What is the best thing she built? (3) Proof (live link, win, production, npm). (4) Resume + contact. The galaxy delivers wow but hides the answers. Fix = surface answers without killing the wow.

## Findings (verified 2026-06-04)
- 90 projects across 6 galaxies (Enterprise 9, AI Frontier 14, Full-Stack 17, DevTools 20, Design 9, Experiment Lab 21). 12 featured.
- **Flagship is buried:** TimeSlipSearch (Algolia Agent Studio Challenge winner, $750, DEV-featured) sits in "The Experiment Lab" galaxy. It is the strongest external validation and is mis-shelved as a toy. Data on it is rich (impactMetrics, win link) — just positioned wrong.
- **Screenshots:** only ~2 of 12 featured projects have a screenshot. 10 featured render near-blank cards. Biggest visual signal gap. Network-enabled capture works (live sites 200).
- **Dead GitHub links:** chronicle, portfolio-pro, kindred, finance-quest, automadocs repos are PRIVATE. Existing github links on kindred/finance-quest/automadocs cards 404 for the public. Only Specter + StanceStream are public repos.
- **No credentials surface:** new B.S. (Summa Cum Laude, Capella 2026), npm publish, contest win are not presented as a quick-scan credential strip.
- **Root clutter:** ~10 dated audit/phase .md files (COMPREHENSIVE_AUDIT, PHASE_*, READY_TO_DEPLOY, etc.) in repo root.
- Resume: already fixed this session (Summa Cum Laude added, degree conferred, dead .edu email removed, rebuilt PDF/DOCX, synced to public/).

## Decisions
- **Name:** Liz married; was Emerson, now legally Stein. Brand = Elizabeth Stein, clean. No Emerson note on public docs.
- **Diploma:** credentials line + verify link on site, NO diploma image. File saved 3x + verify sidecar (code 26DV-5YJE-EONO).
- **Private repos:** do NOT expose code. REMOVE github links that point to private repos (no 404s). Keep public ones (Specter, StanceStream). Liz can selectively publish later.
- **Pruning:** keep all galaxies, but Experiment Lab is excluded from the featured/hero reel and visually labeled as playground. Featured reel = curated top tier only.

## Top tier (the signal layer) — ~12, all with real proof
1. TimeSlipSearch — award winner (promote out of experimental; pin as flagship)
2. CyberReady Clinic Ready5 — production Dynamics/Power Platform
3. Specter — published npm + public repo
4. Chronicle — Rust observability (case study; repo private, show "private" not a 404)
5. CRC Lead Gen — production Next.js
6. Rocketpark Craft ecosystem — agency production
7. Coulson One — enterprise scale (64,806 files)
8. StanceStream — live + public repo
9. Finance Quest — live (has screenshot)
10. AutomaDocs — live SaaS
11. Portfolio-Pro — live
12. Kindred — (live? confirm; else relationship/full-stack showcase)

## Workstreams
1. **Resume** — DONE (this session).
2. **Diploma** — saved + backed up DONE. Add credentials strip to site (B.S. Summa Cum Laude + verify, npm, Algolia win).
3. **galaxyData curation** — promote TimeSlipSearch from experimental to a flagship position; strip dead private github links; ensure top-tier featured set is exactly the proof-backed list; add a `credentials` export for the strip.
4. **Screenshots** — network-enabled Playwright capture of top-tier live sites into public/screenshots (close the 10-card gap). Map orphan `explain-this-code` screenshot to its project id.
5. **Fast lane** — /work leads with top tier + filters; About page gets credentials strip + current-roles + photo; resume download prominent. Optional homepage "Recruiter mode / Skip intro → top work" shortcut.
6. **Visual polish** — micro-interactions already strong; optional Remotion 20-30s showreel (galaxy flythrough + top 5 projects + credentials) for LinkedIn/OG/hero. Decide later.
7. **Cleanup** — move root audit/phase .md files to docs/archive/.

## Out of scope (YAGNI)
- Rebranding to Emerson. Diploma image display. Making private repos public (Liz's call later). Screenshotting all 90 projects (top tier first; long tail later).
