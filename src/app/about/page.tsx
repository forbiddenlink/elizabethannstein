import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'
import styles from './about.module.css'

const aboutDescription =
  "Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Sole developer on a cybersecurity nonprofit's security-readiness platform (Dynamics 365, in production). Algolia Agent Studio Challenge winner. Eleven client sites on Craft CMS at Rocketpark."

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
    'Claude / Anthropic, OpenAI GPT-4, Algolia Agent Studio, MCP Protocol, RAG pipelines, Langfuse, Hugging Face',
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
              I design and build software that actually ships, then keep the receipts. Right now
              that&apos;s a Dynamics 365 platform in production for a cybersecurity nonprofit, Craft
              CMS sites at Rocketpark, and a stack of side projects, one of which won the Algolia
              Agent Studio.
            </p>
            <p className={styles.avail}>
              <span className="eStateDot" aria-hidden="true" />
              Available now for contract and advisory work: frontend, full-stack, AI integration, or
              Power Platform.
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
              As Director of Software Engineering at a cybersecurity nonprofit, I&apos;m the sole
              developer on its security-readiness platform, a Dynamics 365 / Power Platform /
              Dataverse system live in production. Concurrently I&apos;m a Software Engineering
              Intern at Rocketpark, where I lead development on Rocket Vitals, the agency&apos;s
              website QA product, and maintain an 11-site Craft CMS portfolio. From 2024-2026 I led
              a 4-dev team across Flo Labs&apos; 6-site Next.js + Strapi ecosystem.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="clock-heading">
          <h2 id="clock-heading">Off the clock</h2>
          <div className={styles.prose}>
            <p>
              I publish to npm (Specter: 65 CLI commands, 14 MCP tools; ally-a11y), build
              observability in Rust (Chronicle), and write MCP servers instead of just consuming AI
              APIs. Won the Algolia Agent Studio Challenge ($750) in March 2026 with TimeSlipSearch,
              a conversational AI agent over 420k pop-culture records.
            </p>
            <p>
              Also shipped: SaaS products with live Stripe billing (AutomaDocs, HireReady,
              Testimoniq) and two learning platforms, Portfolio-Pro (269 lessons, 144 projects) and
              Finance Quest (17 chapters, 30+ calculators with SM-2 spaced repetition).
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="do-heading">
          <h2 id="do-heading">What I do</h2>
          <dl className={styles.doList}>
            <div>
              <dt>Microsoft Power Platform</dt>
              <dd>
                Dynamics 365 / Dataverse / Power Apps Canvas / Power Automate. Primary developer on
                a 12-phase assessment platform now live in production. m365 and pac CLIs are daily
                drivers.
              </dd>
            </div>
            <div>
              <dt>Next.js + React 19 full-stack</dt>
              <dd>
                End-to-end features from UI to API and data layer. Better Auth, MSAL, Drizzle, Neon,
                Supabase. Comfortable with Spring Boot, REST APIs, and production-ready backends.
              </dd>
            </div>
            <div>
              <dt>Craft CMS and editor workflows</dt>
              <dd>
                Twig templates, Composer plugins, project-config CLI, Herd-based local dev. Content
                modeling and template architecture that makes editors&apos; lives easier across an
                11-site client portfolio.
              </dd>
            </div>
            <div>
              <dt>AI integration and MCP</dt>
              <dd>
                I write MCP servers, not just consume LLM APIs. Shipped 14 MCP tools on npm
                (Specter), Rust-backed observability (Chronicle), RAG pipelines, and multi-agent
                platforms.
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
          <h2 id="testimonial-heading">In a client&apos;s words</h2>
          <figure className={styles.quote}>
            <blockquote>
              <p>
                Elizabeth was the backbone of this project. While every team member played a role,
                it was Elizabeth who carried the technical weight and delivered a product that
                exceeded expectations. What set Elizabeth apart beyond her technical ability was her
                communication. A technically brilliant person who cannot communicate is difficult to
                work with. Elizabeth was both brilliant and a pleasure to collaborate with, and that
                combination is genuinely rare.
              </p>
            </blockquote>
            <figcaption>
              <cite>Brenna Martin</cite>, Founder and Station Director, DareU Radio.{' '}
              <a
                href="/testimonials/brenna-martin-dareu-radio.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="eLink"
              >
                Read the full letter (PDF)
              </a>
            </figcaption>
          </figure>
        </section>

        <section className={styles.row} aria-labelledby="education-heading">
          <h2 id="education-heading">Education</h2>
          <div className={styles.prose}>
            <p>
              B.S. in Information Technology, Software Development from Capella University
              (conferred March 2026), Summa Cum Laude, 3.98 GPA, University Honors Pathway,
              Dean&apos;s List every quarter. I work in small, shippable steps with clear commits
              and documentation so future me, and teammates, don&apos;t suffer.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="reel-heading">
          <h2 id="reel-heading">The 30-second version</h2>
          <div>
            <div className={styles.reelFrame}>
              {/* biome-ignore lint/a11y/useMediaCaption: silent showreel with no spoken audio; all content is on-screen text. */}
              <video
                controls
                preload="none"
                playsInline
                poster="/reel-poster.webp"
                aria-label="30-second portfolio showreel"
              >
                <source src="/reel.webm" type="video/webm" />
                <source src="/reel.mp4" type="video/mp4" />
              </video>
            </div>
            <p className={styles.browse}>
              Or browse the work:{' '}
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
