# Reference log

Research run 2026-09-27. Every entry below was opened live in Playwright (Chromium) this session,
scrolled, and captured at 1440x1000 and 390x844. Weakness IDs refer to `brief.md`.

Weakness IDs (short form, full evidence in brief.md):
- W1 chrome is split across page families (home has its own status bar and footer, 404 has none, mobile header wraps to two rows)
- W2 contradictory numbers across pages (88 / 86 / "80 more" / 60, "two" vs "three" organisations)
- W3 /work front-loads five rows of controls, then 60 near-identical text rows with truncated descriptions
- W4 case studies lead with a generated decorative "System surface" panel and filler stat blocks instead of real evidence
- W5 homepage: fold is half empty on desktop, stat bento restates the index, index rows expand in place instead of leading to the case study
- W6 /about is long and repeats the same proof points three times
- W7 component defects (unstyled "Surprise me", theme choice not persisted, chapter rail covers the mobile CTA)

---

## 01 Brittany Chiang (competitor: frontend engineer portfolio)

- URL: https://brittanychiang.com (+ https://brittanychiang.com/archive)
- Title: "Brittany Chiang" / "Archive | Brittany Chiang"
- Hero headline: "Brittany Chiang" (subhead "Frontend Engineer", "I build accessible, pixel-perfect experiences for the web.")
- Screenshots: shots/refs/01-brittanychiang-desktop.png, -detail.png, -mobile.png, -archive.png
- Useful pattern: two-column split on desktop. Identity + section nav + socials stay sticky on the left while experience and projects scroll on the right, so the fold is never half empty. The archive is a plain sortable-looking table (Year / Project / Made at / Built with / Link) that scans 40+ items with no filters at all.
- Addresses: W5 (fold use), W3 (archive as table instead of control panel + cards)
- Transfer: a sticky identity column for the homepage and case-study meta; an archive table with year / project / org / stack / link columns for the long tail of /work, with the curated set above it.
- Would not transfer: the dark navy + teal palette and the template itself, which is widely cloned (it is a known "portfolio boilerplate" look, the same genericness risk .impeccable.md names).
- Interaction: scroll-spy nav observed while scrolling (active item changed from ABOUT). Not otherwise tested.
- Access limits: none. Observed a horizontal scrollbar at 390px on the homepage (their defect, noted so we do not copy the fixed-width sticky column naively).

## 02 Rauno Freiberg (adjacent: design engineer portfolio)

- URL: https://rauno.me
- Title: "Rauno Freiberg"
- Hero headline: "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details"
- Screenshots: shots/refs/02-rauno-desktop.png, -detail.png, -mobile.png
- Useful pattern: the headline is one declarative sentence that carries name, discipline, and who the work is for, set with a hanging indent so the line breaks read as typography rather than a centered block. A tick-mark "ruler" at the top shows position in the sequence of slides.
- Addresses: W5 (headline doing more work than a name alone)
- Transfer: replace the bare "Elizabeth / Stein." masthead with a name-plus-claim sentence set large, with deliberate breaks. A small position ruler could label where you are in a case study (a quieter version of the existing chapter rail).
- Would not transfer: vertical scroll hijacked into a horizontal slide deck. Recruiters scanning on phones need normal document scroll, and on 390px the slide sits in a sea of empty grey.
- Interaction: scroll observed to translate slides horizontally. Not tested further.
- Access limits: none.

## 03 Stripe Press (adjacent: editorial catalogue from an engineering company)

- URL: https://press.stripe.com (+ https://press.stripe.com/the-art-of-doing-science-and-engineering)
- Title: "Stripe Press — Ideas for progress"
- Hero headline: no hero headline on the index (the h1 is the wordmark "Stripe Press"; the page opens straight into the stack of book spines)
- Screenshots: shots/refs/03-stripe-press-desktop.png, -detail.png, -book.png, -mobile.png
- Useful pattern: the catalogue IS the homepage; each item is a physical object (a spine) carrying title and author, so the index needs no cards or filters. The detail page is a strict two-column spread: object on the left, serif title + author + one long paragraph + a stack of bordered, full-width link rows on the right. Each book re-tints the whole page, so every item has an identity while the typography stays constant.
- Addresses: W3 (index where the list itself is the design), W4 (detail page as a spread: artefact left, facts right)
- Transfer: case-study heads as a spread (real artefact or screenshot on one side, title / role / facts / outbound link rows on the other). Per-project accent tint drawn from the existing muted `--le-cat-*` hues, applied to a thin band or the folio rather than the full page. Outbound links as full-width bordered rows with an arrow cell.
- Would not transfer: the 3D spine stack (that belongs with /explore, not the content site) and full-page recolouring, which would fight the cream paper system and hurt AA contrast control.
- Interaction: scroll observed (spines animate). Book page opened by URL, not by click.
- Access limits: none. On 390px the spines crop both titles at the edges (their defect).

## 04 Maggie Appleton (adjacent: designer-developer, serif editorial voice)

- URL: https://maggieappleton.com
- Title: "Maggie Appleton"
- Hero headline: "Maggie makes visual essays about programming, design, and anthropology."
- Screenshots: shots/refs/04-maggieappleton-desktop.png, -detail.png, -mobile.png (a /projects probe returned her 404, "This page doesn’t exist"; that screenshot is -projects.png and is not used as evidence)
- Useful pattern: the display serif headline is a full sentence with only the name set in bold weight, so name and claim read as one line of thought. Below it, two plain sans lines: role, then current employer as the only coloured link. Index sections pair a main column of illustrated items with a narrow column of text-only entries, which gives two densities on one page without a filter UI.
- Addresses: W5 (name + claim headline, one coloured signal), W3 (two densities: featured with imagery, long tail as a text list)
- Transfer: homepage headline in Fraunces as "Elizabeth Stein builds ..." with weight contrast on the name; the cobalt accent reserved for the single most important link. On /work, featured projects with imagery in a wide column and the archive as a compact text list.
- Would not transfer: bespoke illustration per item (Liz has no illustration library; inventing art would be placeholder filler). Mobile collapses nav into a hamburger for three links, which costs a tap for no gain.
- Interaction: observed only.
- Access limits: none.

## 05 Oxide Computer, Specifications (adjacent: engineering company, spec-sheet voice)

- URL: https://oxide.computer/product/specifications
- Title: "Specifications | Oxide Computer Company"
- Hero headline: "Specifications"
- Screenshots: shots/refs/05-oxide-desktop.png, -detail.png, -mobile.png
- Useful pattern: key/value spec table with hairline rules; grouped rows use an indented sub-label (label, then indented child labels) instead of nested boxes; every value is a literal number with its unit. A footnote row inside the table ("Actual specifications will vary based on configuration") carries the caveat right where the numbers are. On mobile the two columns stack to label-over-value with the value indented, so no horizontal scroll.
- Addresses: W4 (replace decorative panels and "In production" posing as a stat with a real spec table), W2 (numbers only where they are literal and sourced)
- Transfer: the case-study facts block becomes a proper spec table (Role / Org / Years / Status / Stack / Links), plus an optional "Numbers" group that only renders values that exist in the data. The existing `.eMono` + rule tokens already fit this.
- Would not transfer: dark-mode-only neon-green brand, dense nav, cookie banner.
- Interaction: observed only. Cookie banner left untouched.
- Access limits: none.

## 06 Guillaume Colombel (Awwwards portfolio category, "Portfolio 2026" nominee; interactive developer)

- Found via: https://www.awwwards.com/websites/portfolio/ (gallery screenshot shots/refs/gallery-awwwards-portfolio.png), then opened https://guillaumecolombel.fr/
- Title: "Guillaume Colombel — Freelance Interactive Developer"
- Hero headline: "Guillaume Colombel, freelance interactive developer" (present in the DOM as h1 but not visible on first paint; the viewport shows a WebGL object)
- Screenshots: shots/refs/06-guillaumecolombel-desktop.png (first paint after ~6s: a black screen with an outline), -detail.png (after one wheel scroll), -mobile.png
- Useful pattern: the 3D object IS the project index. Scrolling rotates through numbered projects ("01 CLARTÉ", "02 Jean Paul Gaultier — La Favorite" ...) and the project name is set huge on a curved band. Numbered sequence + one object at a time = strong sense of place.
- Addresses: mostly a counter-reference for W5, and a guide for how /explore should differ from the content site.
- Transfer: keep the numbered-sequence idea (already present as 01-08 on the homepage). Confirms the current split: the 3D experience belongs in /explore as an opt-in showcase, never as the recruiter's first paint.
- Would not transfer: 6 seconds of near-black before anything readable; the name is invisible until JS and WebGL load; no path to a CV, contact, or plain list on first paint. For Liz's audience (recruiters deciding in seconds) this is the failure the 2026-08-18 editorial pivot fixed.
- Interaction: one mouse-wheel scroll tested; it advanced the object and revealed project names.
- Access limits: none. Heavy WebGL; mobile renders the same scene with a single "About" link.

## 07 Nick Clement (Siteinspire portfolio category; product designer)

- Found via: https://www.siteinspire.com/websites?categories=19 (gallery screenshot shots/refs/gallery-siteinspire-portfolio.png), then opened https://nickclement.com/
- Title: "Nick Clement — Designer"
- Hero headline: "Complex ideas, made clear"
- Screenshots: shots/refs/07-nickclement-desktop.png, -detail.png, -mobile.png
- Useful pattern: a fixed 1/3 + 2/3 grid on desktop. The narrow left column holds a sticky caption per project (name, one-line hook in white, one-line explanation in grey, small tags), the wide right column holds the artefact. The caption sticks while its image scrolls, so text and evidence stay paired. Mobile stacks to image-then-caption with the same three-line caption pattern.
- Addresses: W3 (featured work with evidence instead of a text-only row), W4 (artefact paired with a short caption), W5 (left column prevents the empty half-fold)
- Transfer: for /work featured entries and for the case-study head: a sticky caption column (title, one-line hook, org/years, status) beside a real screenshot when one exists in `public/screenshots/` (15 do), or beside a typographic plate when none does. The "hook in ink + explanation in muted ink" two-tone caption maps directly onto `--le-ink` / `--le-muted`.
- Would not transfer: client logo strip (brief bans it, and Liz's clients are confidential), black background, stock-photo lifestyle imagery.
- Interaction: wheel scroll tested; header text changed from logo to "Nick Clement · Design Director" after scrolling (compact sticky header). Observed caption sticking.
- Access limits: none.

## 08 Corentin Bernadou (Codrops case study + the portfolio itself; freelance developer)

- Found via: https://tympanus.net/codrops/?s=editorial+layout
- URLs: https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/ and https://corentinbernadou.com/
- Titles: "Inside Corentin Bernadou’s Portfolio: Swiss-Inspired Layouts, WebGL Geometry, and Thoughtful Motion | Codrops" / "Corentin Bernadou · Freelance Developer"
- Hero headline: article h1 is the title above; the site's h1 is "Corentin Bernadou" (visually led by a giant orange "FW" for Featured Works)
- Screenshots: shots/refs/08-desktop.png, 08-detail.png, 08-mobile.png (article); shots/refs/08-bernadou-site-desktop.png, 08-bernadou-site-mobile.png (site)
- Useful pattern: print-magazine metadata as UI: "Issue N°003 / Coll. 2026 · Ref. EDI-032026-R02" next to name and role; availability as a dated fact in the top corner ("Available Oct. 2026"); navigation as an inline comma list ("Featured Works, Archive, About") that makes the featured/archive split explicit. The author writes that the direction came from studying grids and margins in printed books, with "a deliberately limited color palette of orange, white, and black" (quoted from the article).
- Addresses: W3 (explicit Featured vs Archive split in the IA), W1 (a compact one-line masthead that carries identity, status and nav together), W5
- Transfer: Liz's site already speaks this dialect (folios, datelines, mono metadata). Push it into the shared header: a one-line masthead with name, a dated availability fact, and nav, identical on every content page. Split /work into "Selected" and "Archive" rather than a Proof/Full-catalog toggle.
- Would not transfer: the pixel rulers and the 3D photo cube (decoration for a motion developer's audience), black-and-orange palette, tiny grey text that fails contrast.
- Interaction: observed only (article read; site loaded at both widths).
- Access limits: none.

## 09 Dan Mall, Portfolio (Lapa Ninja portfolio category; design-systems consultant)

- Found via: https://www.lapa.ninja/category/portfolio/ (gallery screenshot shots/refs/gallery-lapa.png). The Lapa entry links to https://danmall.com/, which is now a coaching landing page; the portfolio itself is https://danmall.com/portfolio
- Title: "Dan Mall’s Portfolio"
- Hero headline: "PORT FOLIO" (h1 text reads "PORT"; set as a giant knockout over photography)
- Screenshots: shots/refs/09-danmall-desktop.png (landing, not used), 09-danmall-portfolio-desktop.png, -detail.png, -mobile.png
- Useful pattern: an "IN TEXT" section where every past engagement is one first-person sentence under the client mark: "I created the first design system for this payroll company before it was called design systems." Dozens of items read as a story in the time it takes to scan a list, with no filters, cards, or metrics. On mobile it becomes a single column of mark + sentence.
- Addresses: W3 (the long tail of 80 projects needs a scan-in-seconds format, not 60 truncated rows), W6 (one sentence per item instead of repeating proof points)
- Transfer: the /work archive as a list where each row is year, title, and ONE full sentence written verb-first ("Built…", "Shipped…", "Led…") taken from existing `project.description` data, never truncated with an ellipsis.
- Would not transfer: client logos (Liz's key clients are confidential and many projects are personal), black background, stock floral photography, the joke-y knockout headline.
- Interaction: observed only.
- Access limits: the Lapa listing is stale (points at a page that no longer is the portfolio). Mobile screenshot was taken after a reload that kept the scroll position, so it shows the IN TEXT list rather than the top.

---

## Blocked or excluded attempts (not counted)

- Mobbin (https://mobbin.com/search/apps/web?content_type=screens&q=portfolio): redirected to the logged-out marketing page (`/?redirect_to=...`). No authorized session available in this browser. Screenshot of the wall: shots/refs/gallery-mobbin.png. Not retried.
- Refero (https://refero.design/?search=portfolio): loaded the marketing page with a "Log In/Sign Up" gate; search results not reachable without an account. Screenshot: shots/refs/gallery-refero.png. Not retried.
- Godly (https://godly.website/?search=portfolio): now redirects to recent.design; the search parameter was dropped and the feed carried no portfolio results. Not used.
- Land-book portfolio category (https://land-book.com/?category=portfolio): the first 40 entries were paid Framer/Webflow templates, not real portfolios. Excluded as not representative. Screenshot: shots/refs/gallery-landbook-portfolio.png.

## 10 21st.dev "Activity Feed" component (component gallery)

- Found via: https://21st.dev/s/timeline (redirected to https://21st.dev/community/components/s/timeline; gallery screenshot shots/refs/gallery-21st-timeline.png)
- URL: https://21st.dev/@felipemenezes098/components/item-19
- Title: "Activity Feed | Community Components | 21st"
- Hero headline: "Activity Feed" (component page title)
- Screenshots: shots/refs/10-21st-activityfeed-desktop.png, -mobile.png
- Useful pattern: each row is icon / bold event title / muted one-line detail / right-aligned relative time, separated by hairlines. The time column is the only right-aligned element, so the eye can scan recency down one edge.
- Addresses: W5 (the homepage status column mixes "live · 15ms", "on npm", "Dynamics 365 / IN PRODUCTION", "216 tests · daily driver" in two stacked lines of different sizes, with a misaligned dot on the hq row)
- Transfer: normalise the flagship status cell to one grammar: dot + one status word (Live, In production, Published) on line one, and one mono detail (latency, registry, host) on line two, both right-aligned. Status stays text, not an icon, so it survives without colour.
- Would not transfer: the demo's fake people and events (we only show real system state), generic icon set, the component's default Inter styling.
- Interaction: the preview was clicked into from the gallery; the refresh control was not exercised. The component itself is static in the demo.
- Access limits: component code view is public; "Copy prompt" and "Remix" were not used.

## 11 Paco Coursey (competitor/adjacent: design engineer, Linear / ex-Vercel)

- URL: https://paco.me
- Title: "Paco Coursey"
- Hero headline: "Paco Coursey" (a small h1, followed by the sentence "Crafting interfaces. Building polished software and web experiences…")
- Screenshots: shots/refs/11-paco-desktop.png (full page), -mobile.png
- Useful pattern: the entire site is one page that reads in under a minute: two sentences of identity with the employer as an inline link, then three short columns (Building / Projects / Writing), each item a link plus one plain sentence. Outbound links carry a ↗ glyph; internal ones do not. An italic serif phrase inside a sans paragraph adds voice with one gesture.
- Addresses: W6 (/about repeats itself; this shows how little text is needed), W2 (no counts at all, so nothing can contradict)
- Transfer: shorten /about to identity, current roles, a short "how I work" and credentials, with each fact stated once. Use ↗ only for external links site-wide. The one-italic-phrase gesture is already in Liz's system (`.eLede em`); use it once per page, not in every heading.
- Would not transfer: the near-total absence of evidence. Paco can rely on name recognition; a recruiter meeting Liz for the first time needs live links and case detail.
- Interaction: observed only.
- Access limits: none.

## 12 Craig Mod, Collected Essays + "As We May Read" (adjacent: editorial long-form, print sensibility)

- URLs: https://craigmod.com/essays/ and https://craigmod.com/essays/as_we_may_read/
- Titles: "Collected Essays of Craig Mod" / "As We May Read — by Craig Mod"
- Hero headline: "Collected essays by Craig Mod" (index); "As We May Read" with dek "From print to digital and back to print" (essay)
- Screenshots: shots/refs/12-craigmod-desktop.png, -essay-desktop.png, -detail.png, -mobile.png
- Useful pattern: index rows are dateline (small caps, spaced) / serif title / one sans dek line, nothing else, and the list scans fast. The essay opens with a captioned photograph, then a centered serif title and italic dek, then a drop-cap body. The same sequence survives intact at 390px, and the mobile nav fits on three short lines without a hamburger.
- Addresses: W3 (dateline / title / one-line dek as the archive row), W4 (case study reading order: artefact with caption, title + dek, then prose), W1 (mobile nav without a menu button)
- Transfer: the archive row format for /work (Liz's `dateRange` becomes the dateline). Case-study order: facts table first for recruiters, then a captioned evidence figure, then the three-part story. Captions in `.eMono` small caps for every figure. Mobile header as two short lines of plain links rather than a pill + toggle + wrap.
- Would not transfer: low-contrast grey nav text (reads under AA), the photographic hero (Liz's work is software; screenshots and diagrams are the equivalent, not photography).
- Interaction: observed; opened the first essay from the index by its link URL.
- Access limits: none.

## 13 Emil Kowalski (competitor/adjacent: design engineer, Linear / ex-Vercel)

- URL: https://emilkowal.ski (+ https://emilkowal.ski/ui/friction-as-a-feature)
- Title: "Emil Kowalski"
- Hero headline: no hero headline (no h1; the page opens with a two-line name block "Emil Kowalski / Design Engineer")
- Screenshots: shots/refs/13-emilkowalski-desktop.png (full page), -detail.png (article), -mobile.png
- Useful pattern: a single 520px column with labelled sections (Today / Projects / Writing / More) and very wide vertical gaps between sections, so hierarchy comes from spacing rather than rules, boxes, or size jumps. Every item is title + one muted line. The article page keeps the identical name block, so the chrome never changes between page types.
- Addresses: W1 (one identical, calm header on every page type), W6 (section labels "Today" and "Previously" replace a long bio)
- Transfer: a "Now / Previously" pair on /about instead of three overlapping sections. Keep the header block identical across home, index, case study, about, contact, 404.
- Would not transfer: the minimalism as a whole. Liz's audience expects proof and a CTA; a site this bare depends on existing reputation, which is also true of 11 (Paco).
- Interaction: opened the first writing link found on the page; observed only.
- Access limits: none.

## 14 Lynn Fisher, Work (adjacent: developer-designer, paper-textured editorial)

- URL: https://lynnandtonic.com (+ https://lynnandtonic.com/work/)
- Title: "Lynn Fisher" / "Work | Lynn Fisher"
- Hero headline: "Lynn Fisher" (home); "Work" under a roman numeral folio "II" (work page)
- Screenshots: shots/refs/14-lynnandtonic-desktop.png, -work.png, -detail.png, -mobile.png
- Useful pattern: every project screenshot is rendered in greyscale inside a thin ink border on a warm paper background, with a caption row below: title in small caps on the left, bare domain on the right. Wildly different products (a streaming mashup, a concert archive, illustrations) read as one set because colour is removed and the frame is constant. A roman-numeral folio above the page title marks the section like a book chapter.
- Addresses: W3 and W4 (Liz has 15 real screenshots with clashing palettes; dropped raw onto cream paper they would fight the system). Also W5 (index with evidence).
- Transfer: show real product screenshots from `public/screenshots/` as ink-framed plates with a CSS `filter: grayscale(1) contrast(1.05)` plus a multiply blend on paper, restoring colour on hover/focus and when reduced-motion users open the case. Caption row: title left, bare domain right in mono. Existing folios ("No. 01") already play the roman-numeral role.
- Would not transfer: the decorative blackletter-ish display face and the single narrow centred column for the index (wastes a 1440 screen for a recruiter scanning eight flagships).
- Interaction: observed only (hover state not tested).
- Access limits: none.

---

## Research summary: weakness to evidence map

14 references inspected (01-14). Competitor or adjacent individual portfolios: 01, 02, 04, 11, 13, 14 (six). Gallery-sourced: 06 (Awwwards), 07 (Siteinspire), 09 (Lapa Ninja), 10 (21st.dev), 08 (Codrops). Blocked sources listed above are excluded from the count.

| Weakness | Evidence | Direction it suggests |
|---|---|---|
| W1 split chrome | 08 one-line masthead with status + nav; 13 identical header on every page type; 12 mobile nav as plain lines, no hamburger | One shared masthead on every content page and 404, one line at 390px |
| W2 contradictory numbers | 05 literal values with units, caveat in-table; 11 no counts at all | Derive every count from data; drop decorative stats |
| W3 /work overload | 01 archive table; 04 two densities; 09 one sentence per item; 12 dateline/title/dek rows; 14 unified greyscale plates; 08 explicit Featured vs Archive | Selected (plates) + Archive (table rows, full sentences); controls in one compact bar |
| W4 case filler | 03 spread (artefact left, facts right); 05 spec table; 07 caption paired with artefact; 12 captioned figure then prose; 14 greyscale plate | Facts table + real screenshot plate; typographic plate when no screenshot; no generated art |
| W5 home fold/index | 01 and 07 two-column fold; 02 and 04 name + claim sentence; 10 single status grammar | Claim headline left, live proof column right; rows link to cases; normalised status cell |
| W6 /about repetition | 11 two sentences + three short columns; 13 Today / Previously | Now / Previously / Skills / Testimonial / Credentials, each fact once |
| W7 defects | none needed | Original fixes |

Original solutions needed (no reference shows them): the live-status proof column (our own asset), and a typographic plate for projects with no screenshot that is honest (title, stack, status set as type) rather than generated decoration.
