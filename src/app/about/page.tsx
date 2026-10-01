import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'
import styles from './about.module.css'

const aboutDescription =
  "I'm Liz, a full-stack engineer and designer. I'm the sole developer on a Dynamics 365 platform in production for a cybersecurity nonprofit, I lead development on Rocket Vitals at Rocket Park, and I graduated Summa Cum Laude from Capella in March 2026."

export const metadata: Metadata = {
  title: 'About',
  description: aboutDescription,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Elizabeth Stein',
    description: aboutDescription,
    url: '/about',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

const RESUME_HREF = '/resume/elizabeth-stein-resume.pdf'

const STACK: ReadonlyArray<readonly [string, string]> = [
  [
    'Power Platform',
    'Dynamics 365, Dataverse, Power Apps Canvas, Power Automate, Azure AD / MSAL, m365 CLI, pac CLI',
  ],
  [
    'Frontend',
    'Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Three.js, GSAP, Framer Motion',
  ],
  ['Backend', 'Node.js, Rust (Axum), Python, FastAPI, Java / Spring Boot, Express, REST APIs'],
  [
    'AI and integration',
    'Claude / Anthropic, OpenAI, Algolia Agent Studio, MCP, RAG pipelines, Langfuse, Hugging Face',
  ],
  [
    'Data and auth',
    'PostgreSQL, Neon, Supabase, Drizzle, Prisma, Redis, SQLite, Better Auth, MSAL',
  ],
  [
    'CMS and infra',
    'Craft CMS, Twig, Strapi, Vercel, Railway, Docker, Inngest, Playwright, Sentry',
  ],
]

export default function AboutPage() {
  const projectCount = allProjects.length
  const enterpriseCount =
    galaxies.find((galaxy) => galaxy.id === 'enterprise')?.projects.length ?? 0
  const aiCount = galaxies.find((galaxy) => galaxy.id === 'ai')?.projects.length ?? 0
  const fullstackCount = galaxies.find((galaxy) => galaxy.id === 'fullstack')?.projects.length ?? 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: SITE.name,
      jobTitle: SITE.title,
      url: SITE.url,
      sameAs: [CONTACT.github, CONTACT.linkedin],
      knowsAbout: [...SITE.knowsAbout],
      description: SITE.shortDescription,
    },
  }

  return (
    <div className="editorial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#about-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <SiteHeader />

      <main id="about-content" className="eWrap">
        <header className={styles.head}>
          <div className={styles.photoFrame}>
            <Image
              src="/images/profile.jpg"
              alt="Elizabeth Stein"
              width={148}
              height={148}
              sizes="148px"
              priority
            />
          </div>
          <div>
            <h1 className={styles.title}>Hi, I&apos;m Liz.</h1>
            <p className={styles.lede}>
              I&apos;m a full-stack engineer and designer. I like the part of the job where
              something real goes live and people start using it. Most of what I build is in
              production somewhere, and the rest is how I learn.
            </p>
            <p className={styles.avail}>
              <span className="eStateDot" aria-hidden="true" />
              Open to full-stack and product engineering roles, remote from Washington, PA (US
              Eastern). Contracts welcome.
            </p>
            <div className={styles.actions}>
              <a href={RESUME_HREF} download className="eBtn eBtnPrimary">
                Download résumé (PDF)
              </a>
              <Link href="/contact" className="eBtn eBtnGhost">
                Send a message
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.row} aria-labelledby="now-heading">
          <h2 id="now-heading">Now</h2>
          <div className={styles.prose}>
            <p>
              I&apos;m Director of Software Engineering at a cybersecurity nonprofit. Since June
              2026 I&apos;ve been the only developer on its security-readiness assessment, which
              runs in production on Dynamics 365, Power Platform, and Dataverse. I&apos;ve shipped
              twelve implementation phases on it, plus the Next.js app assessors use.
            </p>
            <p>
              At Rocket Park, a Craft CMS agency, I lead development on Rocket Vitals, its website
              QA scanner, and keep eleven client sites upgraded and running.
            </p>
            <p>
              Before that, from 2024 to 2026, I led a team of four developers across Flo Labs&apos;
              six Next.js and Strapi sites.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="clock-heading">
          <h2 id="clock-heading">Off the clock</h2>
          <div className={styles.prose}>
            <p>
              I build my own products. TimeSlipSearch won the Algolia Agent Studio Challenge in
              March 2026, and Trace won the DEV GitHub Finish-Up-A-Thon in July. AutomaDocs and
              HireReady are live with Stripe checkout.
            </p>
            <p>
              I also publish developer tools. Specter is a CLI on npm that explains an unfamiliar
              codebase, with an MCP server so Claude can ask it questions. hq is the command-line
              dashboard I open every morning.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="do-heading">
          <h2 id="do-heading">What I do</h2>
          <dl className={styles.doList}>
            <div>
              <dt>Microsoft Power Platform</dt>
              <dd>
                Dynamics 365, Dataverse, Power Apps, and Power Automate, including solution
                packaging and promotion between environments. I work in the m365 and pac CLIs every
                day.
              </dd>
            </div>
            <div>
              <dt>Full-stack Next.js and React</dt>
              <dd>
                A feature from the database to the screen: schema, API, auth, and UI. Usually
                Drizzle or Prisma on Postgres, with Better Auth or Microsoft sign-in.
              </dd>
            </div>
            <div>
              <dt>Craft CMS and editor workflows</dt>
              <dd>
                Twig templates built from Figma, plugin and version upgrades, and content models
                that editors can actually use.
              </dd>
            </div>
            <div>
              <dt>AI integration and MCP</dt>
              <dd>
                MCP servers, retrieval pipelines, and agents built on the Claude, OpenAI, and
                Algolia APIs, with the evaluation and logging to tell when they go wrong.
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.row} aria-labelledby="stack-heading">
          <h2 id="stack-heading">Stack</h2>
          <dl className={`eSpec ${styles.spec}`}>
            {STACK.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="testimonial"
          className={styles.row}
          aria-labelledby="testimonial-heading"
          style={{ scrollMarginTop: '6rem' }}
        >
          <h2 id="testimonial-heading">From a client</h2>
          <figure className={styles.quote}>
            <blockquote>
              <p>
                Elizabeth was the backbone of this project. While every team member played a role in
                bringing the DAREU Radio website to life, it was Elizabeth who carried the technical
                weight and delivered a product that exceeded expectations.
              </p>
              <p>
                &hellip; A technically brilliant person who cannot communicate is difficult to work
                with. Elizabeth was both brilliant and a pleasure to collaborate with, and that
                combination is genuinely rare.
              </p>
            </blockquote>
            <figcaption>
              <cite>Brenna Martin</cite>, Founder and Station Director, DareU Radio, on the station
              website I built through Capella&apos;s Riipen program
            </figcaption>
          </figure>
        </section>

        <section className={styles.row} aria-labelledby="education-heading">
          <h2 id="education-heading">Education</h2>
          <div className={styles.prose}>
            <p>
              B.S. in Information Technology, Software Development, from Capella University,
              conferred March 2026. Summa Cum Laude, 3.98 GPA, University Honors Pathway,
              Dean&apos;s List every quarter.
            </p>
            <p>
              I work in small, shippable steps with clear commits and documentation so future me,
              and teammates, don&apos;t suffer.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="work-heading">
          <h2 id="work-heading">The work</h2>
          <div>
            <p className={styles.browse}>
              By area:{' '}
              <Link href="/work?filter=enterprise#archive">enterprise ({enterpriseCount})</Link>,{' '}
              <Link href="/work?filter=ai#archive">AI ({aiCount})</Link>,{' '}
              <Link href="/work?filter=fullstack#archive">full-stack ({fullstackCount})</Link>, or{' '}
              <Link href="/work">all {projectCount} projects</Link>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
