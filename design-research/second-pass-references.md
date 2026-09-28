# Second-pass references

Written 2026-09-27 during the second pass on `feat/live-ledger-redesign`. Each entry was
written immediately after inspecting that site and before opening the next. Screenshots were
captured with headless Chromium at 1440x1000 and 390x844 (fold only, no login, cookie banners
not dismissed unless noted).

## Questions this pass needs to answer

- Q1. Status grammar: how should the ledger distinguish "a site is down" from "we could not run
  the check", and how should it date the check?
- Q2. Archive of 88 projects: is a four-column table with full descriptions the right density,
  and how do comparable filterable indexes handle counts, search and empty results?
- Q3. Case study: does a facts column plus narrative rows match how product case studies are
  read, and where do they put the primary link?
- Q4. Mobile masthead with three links: do comparable portfolios keep links inline at phone
  width or collapse them, and what happens at 320px?
- Q5. Contact form: how do comparable forms label fields and phrase the submit action and the
  response-time promise? (Observed only; no real form was submitted.)

## 01 GitHub Status (adjacent product: status page)

- URL: https://www.githubstatus.com/ . Title: "GitHub Status".
- Hero headline: no hero headline (no `h1`); the summary banner reads "All Systems Operational".
- Screenshots: `shots/second-pass/refs/01-githubstatus-desktop.png`, `01-githubstatus-mobile.png`.
- Question: Q1.
- Observed: one summary line first, then one row per component. Each row pairs a word
  ("Normal") with an icon, so state never relies on colour alone. The page states its window
  ("Uptime over the past 90 days", 30 days on mobile). On mobile the nav wraps to two centred
  lines rather than collapsing into a menu.
- Interaction tested: no (read-only page; hover tooltips not opened).
- Verdict: retain the ledger's word-plus-dot grammar and per-row layout. Improve one thing:
  GitHub separates the state of the component from the state of the reporting itself (its
  banner only speaks for components it measured). Our ledger conflated the two: when
  `/api/status` itself failed, every row said "Not responding". Add a distinct "Unknown" state
  with a footer that says the check failed. Tradeoff: one more state to style, but the current
  wording tells a visitor four live sites are down when they are not.
- Not adopted: 90-day uptime bars. The site has no stored history and inventing one would be
  a fabricated metric.

## 02 Vercel Templates (adjacent product: filterable index)

- URL: https://vercel.com/templates . Title: "Templates - Vercel".
- Hero headline: "Find your Template".
- Screenshots: `refs/02-vercel-templates-desktop.png`, `02-vercel-templates-mobile.png`,
  `02-vercel-templates-empty-desktop.png`.
- Question: Q2.
- Observed: search sits first and full width; filters are a checkbox list on desktop and hide
  behind a filter button on mobile. Every card description is cut to two lines; the full text
  lives on the detail page. Search state is written to the URL (`?search=`).
- Interaction tested: yes. Searching "zzqxnomatch" produced `?search=zzqxnomatch` and the empty
  state "No templates found. Try adjusting your filters or generate one for free in v0."
- Verdict: retain URL-synced search and our empty state (it already names the fix and offers a
  reset button, which Vercel does not). Improve density: our archive prints full 40-70 word
  descriptions, so 88 rows run past 12,000px on a phone. Clamp archive descriptions to two
  lines, keeping the full text in the DOM and on each case page. Tradeoff: a scanning visitor
  sees less per row; the name, year and category still carry the scan.
- Not adopted: a filter drawer on mobile. We have seven categories, which wrap to three short
  rows; a drawer would add a tap to reach them.

## 03 leerob.com (competitor: developer portfolio)

- URL: https://leerob.com/ . Title: "Lee Robinson".
- Hero headline: "@leerob".
- Screenshots: `refs/03-leerob-desktop.png`, `03-leerob-mobile.png`.
- Question: Q4 (and Q2 for the list rows).
- Observed: no navigation bar at all; the home page is the index and sections are headed lists.
  Blog rows are one line each: title left, date right, hairline between rows. A "Default /
  Long" toggle lets the reader choose bio length. Mobile keeps the same single column with no
  menu. The date column is plain sans, not mono.
- Interaction tested: no (toggle not clicked).
- Verdict: retain our inline three-link masthead; this reference shows a portfolio can drop
  menus entirely at phone width, which supports not adding a hamburger for three links. It
  also supports one-line index rows with the meta at the right, which is what our home index
  and archive already do. Nothing new to adopt: the bio-length toggle solves a problem we do
  not have (About is already consolidated).

## 04 Vercel customer story (adjacent product: case study)

- URL: https://vercel.com/customers/how-fern-runs-multi-tenant-docs-for-webflow-and-elevenlabs-on-vercel
  . Title: "How Fern runs multi-tenant docs for Webflow and ElevenLabs on Vercel | Customers | Vercel".
- Hero headline: "How Fern runs multi-tenant docs for Webflow and ElevenLabs on Vercel".
- Screenshots: `refs/04-vercel-customer-story-desktop.png`, `04-vercel-customer-story-mobile.png`.
- Question: Q3.
- Observed: breadcrumb ("Blog / Customers"), headline, byline, then the outcome numbers as a
  short list ("3x faster time to first byte", "Page load times reduced by 80%") before any
  image or narrative. Meta (date, duration) sits in a narrow right column on desktop and drops
  under the byline on mobile.
- Interaction tested: no.
- Verdict: retain our breadcrumb, headline and facts table. Improve order: our case page puts
  "Numbers" last, after three prose rows, so a reader who scans the head and leaves never sees
  them. Move the Numbers row to sit directly under the head, before the demo and the story.
  Tradeoff: the story reads less like a narrative arc; the numbers are literal data, so
  putting them early costs nothing in honesty.

## 05 brianlovin.com (competitor: designer-engineer portfolio)

- URL: https://brianlovin.com/ . Title: "Brian Lovin".
- Hero headline: "Brian Lovin" (as `h1`), followed by "I'm a software designer living in San
  Francisco, currently making AI products at Notion."
- Screenshots: `refs/05-brianlovin-desktop.png`, `05-brianlovin-mobile.png`.
- Question: Q2, Q4.
- Observed: all navigation hides behind a two-line menu icon at every width. Social links are
  icon-only. Project rows are the name plus a four-to-six word muted description on one line
  ("HN  A minimal hacker news reader").
- Interaction tested: no (menu not opened).
- Verdict: retain our visible three-link masthead. A hidden menu suits a site with many
  sections; ours has three destinations, and a recruiter should see "Work" without a tap.
  Retain word labels for GitHub and LinkedIn instead of bare icons, since the words are the
  accessible name and cost no space in a footer. The very short project descriptions support
  clamping our archive text (entry 02).

## 06 Linear contact sales (adjacent product: contact form)

- URL: https://linear.app/contact/sales . Title: "Talk to sales – Linear".
- Hero headline: "Contact sales".
- Screenshots: `refs/06-linear-contact-sales-desktop.png`, `06-linear-contact-sales-mobile.png`.
- Question: Q5.
- Observed: labels in sentence case above each field ("Full name", "Work email"), the submit
  reads "Send message" with no glyph, and the alternative channel sits on the same line as the
  button ("You can also email us at sales@linear.app"). The left column states what the
  visitor gets before the form. On mobile the form follows the intro in one column.
- Interaction tested: no. The form was not submitted, because it is a real sales inbox.
- Verdict: retain our layout (form panel first, direct channels beside it), which already
  matches. Improve copy consistency with our own DESIGN.md: our labels read "Your Name" and
  "Your Email" in title case and the button reads "Send Message" plus an arrow. Change to
  "Name", "Email", "Send message", and "Send another message", and swap the pulsing dot on
  the success state for the static status dot. Linear gives no evidence about focus handling
  after submit, so that fix (entry-independent, from our own browser test) stands on WCAG
  2.4.3 focus order, not on this reference.

## 07 Vercel Status (adjacent product: status page)

- URL: https://www.vercel-status.com/ . Title: "Vercel Status".
- Hero headline: no hero headline (no `h1`); the banner reads "All Systems Operational".
- Screenshots: `refs/07-vercel-status-desktop.png`, `07-vercel-status-mobile.png`.
- Question: Q1.
- Observed: same shape as GitHub's (entry 01): summary banner, then one row per component
  with the state word right-aligned ("Operational"), which is where our ledger puts it. On
  mobile the rows keep the name-left, state-right layout without stacking.
- Interaction tested: no.
- Verdict: retain the name-left, state-right row, including at 390px, which our ledger already
  does. Two independent status pages converge on the same grammar, which is enough evidence to
  keep it. No new pattern adopted.

A first attempt at entry 07, https://instatus.com/, was the vendor's marketing page ("GET READY
FOR DOWNTIME"), not a status page; its screenshots were deleted and it is not counted.

## Summary

| Question | Retain | Change |
|---|---|---|
| Q1 status | Word plus dot, name left state right (01, 07) | Separate "check failed" from "site down" (01) |
| Q2 archive | URL-synced search, empty state with reset (02) | Clamp archive descriptions to two lines (02, 05) |
| Q3 case study | Breadcrumb, facts table | Move Numbers up under the head (04) |
| Q4 masthead | Three inline links, no menu (03, 05) | None from research; 320px clipping is fixed from our own test |
| Q5 contact | Layout | Sentence-case labels and button, no arrows (06) |

Seven references inspected, two of them competitor portfolios (03, 05) and five adjacent
products (01, 02, 04, 06, 07). No authentication was bypassed; no form was submitted.
