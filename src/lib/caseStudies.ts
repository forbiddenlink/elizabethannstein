/**
 * Long-form case studies, keyed by project id. A project listed here renders these
 * sections on /work/[slug] in place of the one-line challenge / solution / impact blurbs.
 * Client work stays at the accomplishment level: no internal version strings, ticket ids,
 * environment names or links to client systems.
 */
export interface CaseStudySection {
  heading: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export const CASE_STUDIES: ReadonlyMap<string, readonly CaseStudySection[]> = new Map([
  [
    'security-readiness-platform',
    [
      {
        heading: 'What it is',
        paragraphs: [
          'Organizations take a 52-question security-readiness assessment across five areas: endpoints, identity, email, network and incident response. An assessor scores it, and the organization gets a report with a prioritized 30, 60 and 90-day plan. It runs in production, with Dynamics 365 and Dataverse as the system of record.',
        ],
      },
      {
        heading: 'Version one lived inside the CRM',
        paragraphs: [
          'I built it first as a Power Apps form on Dataverse, over twelve implementation phases: the data model, Power Automate orchestration, the assessor front end, and solution packaging so it could move from development to test to production.',
          'It worked, but the form kept pushing back. Every new behavior meant another business rule layered onto it, and the CRM put hard limits on branding and layout.',
        ],
      },
      {
        heading: 'Why I moved the front end out',
        paragraphs: [
          'I kept the data in the CRM and moved the experience out of it. The assessment became a Next.js app with Microsoft sign-in. Each organization gets its own link to take it, and results write back to Dataverse through its API. The CRM stays the one place an organization’s record lives; the app is a better way in.',
          'I ported the scoring engine from the in-CRM JavaScript instead of rewriting it, so scores could not quietly change during the move.',
        ],
      },
      {
        heading: 'Decisions I’d make again',
        paragraphs: [],
        bullets: [
          'Lock each assessment to the question version it started on. Questions change, and an assessment halfway done should not.',
          'Generate the AI summary on the server only, so the API key never reaches the browser.',
          'Port working logic before improving it. A rewrite and a migration at the same time make every difference impossible to explain.',
        ],
      },
      {
        heading: 'What I’d do differently',
        paragraphs: [
          'Write tests that exercise real branches before trusting them. One of my early tests passed against code that was broken, because every mock value was empty and no branch ever ran.',
          'And check that a release changed what is actually running, not only that the run went green.',
        ],
      },
    ],
  ],
  [
    'flo-labs',
    [
      {
        heading: 'What it was',
        paragraphs: [
          'Flo Labs runs AI and robotics ventures, education programs and research. From September 2024 to January 2026 I was its Design Team Lead: I led three to four developers, along with WordPress specialists and SEO interns, across six production sites. Those were flolabs.international, flolabsrd.com, CAIPO.ai, FloStudios.ai, MoodChanger.ai and RoboCollective.ai.',
        ],
      },
      {
        heading: 'One design system for six sites',
        paragraphs: [
          'Six sites built separately drift apart: different buttons, different spacing, six ways of doing the same thing. I built one design system and a shared component library and moved the sites onto Next.js on top of it, so a fix or a new component landed everywhere at once instead of six times.',
        ],
      },
      {
        heading: 'The migration I had to argue for',
        paragraphs: [
          'The sites were on WordPress, and I wanted Strapi and Next.js. Instead of arguing in the abstract, I built a proof of concept and showed the two side by side.',
          'I also did not ask for a rewrite. New sites went on Strapi and Next.js, and the existing WordPress sites stayed up and maintained. That is the version the client approved, and it let us change direction without putting the live sites at risk.',
        ],
      },
      {
        heading: 'Turning a prototype into a product',
        paragraphs: [
          'I inherited a proof-of-concept AI travel planner: more than 100 files, no tests, no design system, and a team waiting for direction. I wrote a phased plan so the team could keep shipping during the refactor, set up code review, and moved it onto the shared design system.',
          'Along the way I built its test suite, 270 frontend tests and 12 backend tests, and designed the 22 prompt systems behind its travel features. It went from proof of concept to production.',
        ],
      },
      {
        heading: 'Decisions I’d make again',
        paragraphs: [],
        bullets: [
          'Propose a migration as a path, not a rewrite. New work on the new stack, old work left alone until it has a reason to move.',
          'Show a working proof of concept instead of a slide. It ends the argument faster.',
          'Put tests in while refactoring, so the team can change code without guessing what breaks.',
        ],
      },
    ],
  ],
  [
    'timeslip-search',
    [
      {
        heading: 'The hard part was dates, not search',
        paragraphs: [
          'Algolia made querying hundreds of thousands of records the easy part. The hard part was turning what people type into something a search can filter on. People write “show me 1985”, “from 1970 to 1980”, “the entire 80s”, a birthday, or two dates to compare.',
          'So every input becomes a start and an end. I strip the command words, parse what is left with chrono-node, and turn the result into a range that each of the four indices filters on. A single date is a range of one day.',
        ],
      },
      {
        heading: 'The bug that taught me the most',
        paragraphs: [
          'One search for a specific date in 1988 came back empty, and the data was there. The parser attached a time of day to the date, the stored records used a different one, and the gap pushed real records outside the range.',
          'The fix was to normalize at the boundary: every range now starts at midnight and ends at the last millisecond of its last day, before it touches a query. Since then I treat time zones as input validation, not as a detail for later.',
        ],
      },
      {
        heading: 'Getting the data in',
        paragraphs: [
          'The chart data alone is about 352,000 rows. Each source has its own ingest script, uploading in batches of 1,000 so the import does not hit rate limits. When the Wikimedia endpoint changed and started returning errors, only that script changed and only that index was rebuilt.',
        ],
      },
      {
        heading: 'Decisions I’d make again',
        paragraphs: [],
        bullets: [
          'Parse every input to a range. It removes a whole class of special cases.',
          'One ingest script per source, so one broken upstream API never means re-importing everything.',
          'Explain an empty result. A date outside the data or in the future gets a “no signal” screen that says why, instead of a blank page.',
        ],
      },
    ],
  ],
  [
    'rocket-vitals',
    [
      {
        heading: 'My part',
        paragraphs: [
          'I lead its development and have written most of it: 894 of its 930 commits since February 2026.',
        ],
      },
      {
        heading: 'The number on the homepage is a test',
        paragraphs: [
          'A QA product that overstates its own checks has a credibility problem. The “385+ checks” on the marketing site is generated from the check catalog, and a test fails the build if the two drift apart.',
          'A second test ties every catalog entry to an issue the scanner actually emits, so the site cannot advertise a check that never runs.',
        ],
      },
      {
        heading: 'Lab numbers and real visitors',
        paragraphs: [
          'A lab test shows what a page can do on a simulated device. It does not show what real visitors got. Alongside its own runs, the scanner pulls field data from Google’s Chrome UX Report API, including Interaction to Next Paint, so a report can say both.',
        ],
      },
      {
        heading: 'Reports belong to whoever ran them',
        paragraphs: [
          'A scan of a client’s site can surface things nobody wants public. A report opens only in the browser that ran the scan, for a signed-in owner, or through a shared link.',
        ],
      },
      {
        heading: 'Decisions I’d make again',
        paragraphs: [],
        bullets: [
          'Generate marketing claims from the code they describe, and test that they match.',
          'Report field data next to lab data. A page can pass in the lab and still be slow for real visitors.',
          'Scope reports to their owner by default and make sharing a deliberate act.',
        ],
      },
    ],
  ],
])
