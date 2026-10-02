# Design references v2 (Phase 2)

Snapshot as of 2026-10-02. Written for elizabethannstein.com redesign review.

Method note: pages were loaded with WebFetch, which returns a markdown extraction summarised by a small model, not raw HTML. "Observed fact" below is what that extraction reported. Computed styles, fonts and markup were not inspected, so none are claimed. Re-verify any fact in a real browser before building on it.

Test for every "steal": cover the logo, still know whose site it is.

## Sourcing status

| Source | Status | Note |
|---|---|---|
| Awwwards (awwwards.com/websites/portfolio/) | LOADED | Used for portfolio picks (Krasimir Stoimenov listed as "Portfolio '26", kstoimenov.com) |
| SiteInspire (siteinspire.com/websites?categories=editorial) | LOADED | Source of Surfer's Journal, Visual Society, Stereoscope, Union Boulangerie, Arc'teryx, Sam Thies, Felix Peault, Core-A |
| Godly (godly.website) | PARTIAL | 301 to recent.design; that page listed only site sections (Websites, OG Images, Tools, Jobs), no individual sites. Nothing cited from it |
| Land-book (land-book.com) | BLOCKED | HTTP 403 |
| Cooper Hewitt (collection.cooperhewitt.org, si.edu mirror) | BLOCKED | si.edu returned 403 |
| Field Notes brand (fieldnotesbrand.com) | BLOCKED | HTTP 403 |

## Print, editorial, specimen, atlas (6)

### 1. The Surfer's Journal Archives
- URL: https://archives.surfersjournal.com/
- Observed: Issues are grouped under year headers like "2026 - Vol. 35" and each issue is a thumbnail labelled with a Volume.Issue code such as "35.4". The extraction reports 187 issues across 35 volumes, and a nav of Issues, Collections, Search.
- Steal: Label things with a publication-style catalogue code instead of a title. A case study stamped "Vol. 3 / No. 2" (or "Ledger 07.2") carries identity in the code system alone, and nobody else's portfolio numbers its work this way.

### 2. The Public Domain Review
- URL: https://publicdomainreview.org/
- Observed: Dates use "DD Mon YYYY" (for example "30 Sep 2026"), bylines follow "By [Name]", and multi-category tags use slashes ("Books / Literature"). Nav is Essays, Collections, Explore, Sources, Shop.
- Steal: A fixed metadata grammar (date format, slash-joined tags, byline) repeated on every entry. Your ledger can use one rigid line format (system / status / checked-at) everywhere so the grammar is the signature.

### 3. Klim Type Foundry
- URL: https://www.klim.co.nz/
- Observed: Fonts are grouped as named collections (American Grotesk, Domaine, Founders Grotesk, Soehne, Tiempos, Untitled), with a separate "Fonts in use" gallery. The footer reports a build timestamp ("30 September 2026 at 3:12pm") and a copyright range of 2005 to 2026.
- Steal: Print the build timestamp in the footer as a colophon line. It is a tiny honest ledger entry, and it fits "live production systems" better than a generic copyright line.

### 4. Fonts In Use
- URL: https://fontsinuse.com/
- Observed: Three-tier taxonomy: 41 Topics, 23 Formats, 200+ Typefaces, each with entry counts. Entries carry a title plus year ("Delivery c. 2026"), designer credit, contributor credit, and 2 to 3 linked typefaces.
- Steal: Show the counts. "41 topics, 1,206 to 6,813 entries each" makes a catalogue feel authoritative. A portfolio index that states its own totals (N systems, N live) reads as a record, not a gallery.

### 5. David Rumsey Historical Map Collection
- URL: https://www.davidrumsey.com/
- Observed: Claims "over 151,000 maps and related images online" and "50+ million visitors" over 26 years, and offers a Georeferencer that overlays historical maps on modern ones.
- Steal: The overlay idea: the same subject shown at two points in time. A case study could overlay "v1 vs now" of the same system, which is a spec-sheet native device with real evidence value.

### 6. Stripe Press
- URL: https://press.stripe.com/
- Observed: A publisher site for 20+ books, a documentary and a podcast. The extraction groups the catalogue by theme (Business & Operations, Technology & Innovation, Progress & Infrastructure, Philosophy & Long-term Thinking).
- Steal: Treat each project as a titled book in a series with a shelf grouping. A thematic shelf label above each group gives a recruiter a reading order and an editorial voice in one move.

## Archive and catalogue (1)

### 7. Visual (Archives) Society
- URL: https://visualsociety.ch/
- Observed: Every item carries the same four metadata fields (Content type, Location, Collaborators, Year). Filters include Statement, Product, Catwalk, Campaign, Press, Event, Research. Releases are numbered "Statement N°0" to "N°6".
- Steal: Filter by content type with a fixed field set. A work index filtered by Role / Stack / Year / Status (the four fields on every row) works as the table of contents and is recognisable without a logo.

## Outside the industry: commerce, craft, food, outdoor (3)

### 8. Stereoscope Coffee
- URL: https://www.stereoscopecoffee.com/
- Observed: Organises its philosophy around a named framework, "Five Elements": Altitude, Soil, Fauna, Climate, Farmer & Roaster. Releases are named by origin and estate (Ethiopia Goro Muda, Tanzania Finagro Estate).
- Steal: Name your own fixed framework and apply it to every project (for example five labelled fields per case study). Product-spec vocabulary applied consistently is brand, with zero decoration.

### 9. Union Boulangerie
- URL: https://www.unionboulangerie.com/
- Observed: Names ingredient suppliers and origins (flour from Moulins de Brasseuil, butter from Charentes-Poitou, milk from Normandy's Maitres Laitiers du Cotentin) and shows shop hours per arrondissement. Includes a "gamified ingredient collection experience".
- Steal: Provenance as content. Name the real upstream parts of each build (hosting, DB, vendor) the way a bakery names its flour mill. It is a trust signal a recruiter can verify, and it is rarely done on dev portfolios.

### 10. Arc'teryx (US)
- URL: https://www.arcteryx.com/
- Observed: Repeats a ReBIRD(TM) repair, resale and trade-in program across the page, and the hero product (Sperro SV jacket) carries the tagline "Designed to persist". Navigation is organised by activity (Trail, Climb, Ski & Snowboard).
- Steal: A durability and maintenance claim as a first-class feature. For a dev portfolio: show uptime history and "last maintained" on each system as the equivalent of a repair program.

## Creative portfolios outside software (2)

### 11. Sam Thies
- URL: https://www.samthies.com/
- Observed: Seven projects, each tagged by format in a fixed set: Photography, Motion, Book, Archival Prints. Nav is Home, Projects, Shop, About.
- Steal: Format tags per project (Build, Design, Ops) instead of one blended label. It shows range in the index itself.

### 12. Felix Peault
- URL: https://www.felixpeault.com/
- Observed: Only three nav items: Series, Elsewhere, Info. The homepage is a grid of titled works ("Crossing generations", "Light corridor").
- Steal: Rename generic nav labels to a house vocabulary (Series, Elsewhere). Three words you cannot find on another dev site identify the owner faster than a wordmark.

## Portfolios and studios (2)

### 13. Krasimir Stoimenov (Awwwards listing "Portfolio '26")
- URL: https://kstoimenov.com/
- Observed: Headline "For founders who need it shipped, not workshopped", with counts (12 years, 87 projects, 6 continents, 6,000+ hours of UX research) and a primary CTA "Book a call".
- Steal: Lead with a single falsifiable claim plus hard counts. Your counts can be live (systems up, checks run) rather than self-reported.

### 14. CORE-A Studios
- URL: https://www.coreastudios.com/
- Observed: Offers both list and grid viewing modes for the work index, with a Korean/English language switch. Nav: Work, VFX, Updates, Team, Directors.
- Steal: Let the visitor flip the work index between a dense list (ledger rows) and a plate grid. A recruiter scanning in seconds chooses list; a designer chooses grid.

## Not used

- Mobbin, Town, Jakobsen Copenhagen and other SiteInspire listings were seen in lists only and were not loaded, so they are not cited.
- behfar.dev loaded but returned too little content to cite.
