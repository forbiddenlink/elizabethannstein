# Portfolio Improvement Plan — elizabethannstein.com

**Date:** April 13, 2026  
**Goal:** Awwwards / Bruno Simon level excellence  
**Current state:** 8.5/10 — exceptional technical execution, content gaps holding it back

---

## What Was Done Today

- Added 3 missing high-value projects to `galaxyData.ts`:
  - **Rocket Vitals** (DevTools) — your #2 active project, 200+ QA checks
  - **Testimoniq** (Full-Stack) — SaaS with Stripe billing, AI sentiment analysis
  - **Dwello** (Full-Stack) — PWA life maintenance tracker
- Fixed Flo Labs dateRange from '2024' to '2024-2026'
- Total projects: 87 → 90 (plus 3 narrative tours)

---

## Tier 1: Critical (Do These First)

### 1. Screenshots for All Projects
**Impact:** HIGHEST — 71 of 90 projects (79%) have no visual representation  
**Why:** Recruiters scan visually. A project without a screenshot feels unfinished.  

**How to do it fast:**
- Write a Playwright script that visits each project's live URL and captures a 1280x720 screenshot
- For projects without live URLs, screenshot the GitHub README or a code snippet
- Save as `/public/screenshots/{project-id}.png`
- Update the `PROJECT_SCREENSHOTS` map in `ProjectCaseStudy.tsx`

**Projects with live URLs to screenshot first (highest priority):**
- rocket-vitals, testimoniq, consent-compass, hire-ready, site-sheriff
- automadocs, stancestream, explainthiscode, contradictme, finance-quest
- accessibility-checker, craft-audit, security-trainer, coding-jokes

### 2. Verify All Live Links
**Why:** Dead demo links are worse than no links  
**Action:** Run a link checker across all `links.live` and `links.github` values in galaxyData.ts

### 3. Add GitHub Links Where Missing
**Count:** ~30 projects lack GitHub links  
**Action:** Cross-reference with github.com/forbiddenlink repos and add missing links

---

## Tier 2: High Impact (This Week)

### 4. Write 3–5 Deep Case Studies
**Which projects:** Pick your strongest for different audiences:
- **Rocket Vitals** — for agencies/dev tool companies (shows product thinking + scale)
- **MCP Wrapper** — for AI companies (shows cutting-edge MCP/AI integration)
- **Flo Labs ecosystem** — for leadership roles (shows team management at scale)
- **elizabethannstein.com itself** — meta case study (shows Three.js/creative engineering)
- **Repro-in-a-Box** — for QA/testing roles (shows testing expertise)

**Each case study should include:**
- Problem statement with real stakes
- Technical approach with architecture diagrams
- Before/after metrics (load times, test coverage, user growth)
- Lessons learned
- 3–5 screenshots showing the product

### 5. Make Journey Mode More Discoverable
**Current:** 3 narrative tours exist (ai-journey, fullstack-evolution, devtools-builder)  
**Problem:** Users might never find them  
**Fix:** Add a "Take a Tour" CTA on the homepage and /work page

### 6. Project Entry Animations on /work Page
**Current:** Projects just appear  
**Fix:** Staggered fade-in with GSAP ScrollTrigger, hover micro-interactions  
**Bruno Simon-level touch:** Projects could float/drift slightly, react to cursor proximity

---

## Tier 3: Polish (This Month)

### 7. Performance Dashboard
- Add a /performance route showing Lighthouse scores, bundle size, Core Web Vitals
- Shows you care about performance (recruiters love this)

### 8. Video Demos for Featured Projects
- Record 30-60 second Loom videos for top 5 projects
- Embed on case study pages using the existing `videoUrl` field in project data

### 9. Micro-interactions & Transitions
- Page transition animations (route changes)
- Cursor trail enhancements on project hover
- Parallax depth on project cards
- Sound design (optional but Awwwards-tier)

### 10. Dark/Light Mode Toggle
- Currently dark-only (which is fine for space theme)
- But having a polished toggle shows attention to detail

### 11. Blog / Writing Section
- Add a /blog route for technical writing
- Cross-post from dev.to or write originals
- Shows thought leadership (huge for job applications)

---

## Quick Wins (Under 1 Hour Each)

- [ ] Update project count in any hardcoded "84+ projects" text to "90+"
- [ ] Add a "Recently Added" or "New" badge to the 3 new projects
- [ ] Add a "Built at Rocket Park" badge to rocket-vitals and mcp-wrapper
- [ ] Ensure all featured projects have at least 3 impactMetrics
- [ ] Add `status: 'live'` to all deployed projects
- [ ] Add testimonial quotes to 2-3 projects (from colleagues, users, or clients)

---

## What NOT to Change

- The 3D galaxy theme is unique and memorable — don't flatten it
- The space metaphor (galaxies, stars, nebulae) is cohesive — lean into it more
- The procedural planet shaders are beautiful — they just need to be seen (screenshots!)
- The LOD system and performance optimizations are production-quality

---

## Competition Reference

**Bruno Simon (bruno-simon.com):**
- 3D car drives through portfolio — single metaphor carried throughout
- Every interaction feels physical and real
- Sound design adds immersion
- Key takeaway: **consistency of metaphor** + **physics-based interactions**

**What you already have that Bruno doesn't:**
- 90 real production projects (not just demos)
- Professional work experience (Rocket Park, Flo Labs, Coulson)
- Full case study system with metrics
- Accessibility built in (skip links, screen readers, @react-three/a11y)

**Gap to close:**
- Visual polish on every project (screenshots, videos)
- Micro-interactions that make exploration feel physical
- Sound design (ambient space sounds, click feedback)
- Loading experience (currently good, could be cinematic)
