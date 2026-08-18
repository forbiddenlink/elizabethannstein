import { Download } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'
import styles from './about.module.css'

const aboutDescription =
  "Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Sole developer on a cybersecurity nonprofit's security-readiness platform (Dynamics 365, in production). Algolia Agent Studio Challenge winner. Concurrent paid work at three orgs."

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
        <header className="eHeader">
          <p className="eEyebrow">About</p>
          <div className={styles.heroRow}>
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
            <div className={styles.heroText}>
              <h1 className="eTitle">
                Hi, I&apos;m <em>Liz.</em>
              </h1>
              <p className="eLede">
                I design and build software that actually ships, then keep the receipts. Right now
                that&apos;s a Dynamics 365 platform in production for a cybersecurity nonprofit,
                Craft CMS sites at Rocketpark, and a stack of side projects, one of which won the
                Algolia Agent Studio.
              </p>
            </div>
          </div>

          <div className={styles.availBanner}>
            <p className={styles.availHead}>
              <span className="eDot" aria-hidden="true" />
              Available now
            </p>
            <p className={styles.availBody}>
              Open to <strong>contract</strong> and <strong>advisory</strong> engagements, frontend,
              full-stack, AI integration, or Power Platform.
            </p>
          </div>
        </header>

        {/* Quick Glance */}
        <section className={styles.info} aria-labelledby="quick-glance-heading">
          <p className="eLabel" id="quick-glance-heading" style={{ marginBottom: '0.4rem' }}>
            Quick glance
          </p>
          <div className={styles.infoGrid}>
            <div>
              <p className="eLabel">Core skills</p>
              <div className={styles.specList}>
                <div className={styles.specRow}>
                  <span className={styles.specTerm}>React / Next.js</span>
                  <span className={styles.specDef}>Core stack</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specTerm}>TypeScript</span>
                  <span className={styles.specDef}>Primary language</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specTerm}>AI Integration</span>
                  <span className={styles.specDef}>Production + R&amp;D</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specTerm}>Full-Stack (Node/Python)</span>
                  <span className={styles.specDef}>UI to API</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specTerm}>Design Systems</span>
                  <span className={styles.specDef}>Team delivery</span>
                </div>
              </div>
            </div>

            <div>
              <p className="eLabel">Browse by focus</p>
              <ul className={styles.focusList}>
                <li>
                  <Link href="/work?filter=enterprise" className={styles.focusLink}>
                    <span>Enterprise projects</span>
                    <span className={styles.focusCount}>{enterpriseCount} &rarr;</span>
                  </Link>
                </li>
                <li>
                  <Link href="/work?filter=ai" className={styles.focusLink}>
                    <span>AI &amp; ML work</span>
                    <span className={styles.focusCount}>{aiCount} &rarr;</span>
                  </Link>
                </li>
                <li>
                  <Link href="/work?filter=fullstack" className={styles.focusLink}>
                    <span>Full-stack apps</span>
                    <span className={styles.focusCount}>{fullstackCount} &rarr;</span>
                  </Link>
                </li>
              </ul>
              <Link href="/work" className={styles.viewAll}>
                View all {projectCount} projects &rarr;
              </Link>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="/resume/elizabeth-stein-resume.pdf" download className="eBtn eBtnPrimary">
              <Download className="w-4 h-4" aria-hidden="true" />
              Download résumé
            </a>
            <Link href="/contact" className="eBtn eBtnGhost">
              Send a message
            </Link>
          </div>
        </section>

        {/* 30-second reel */}
        <section className={styles.reel} aria-labelledby="reel-heading">
          <p className="eLabel" id="reel-heading">
            The 30-second version
          </p>
          <p className={styles.reelNote}>No time for the galaxy? Here is the highlight reel.</p>
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
        </section>

        {/* About Me */}
        <section className={styles.section} aria-labelledby="about-me-heading">
          <div className={styles.sectionHead}>
            <span className="eFolio">No. 01</span>
            <h2 className={styles.sectionTitle} id="about-me-heading">
              About Me
            </h2>
          </div>
          <div className={styles.bioText}>
            <p>
              I&apos;m the sole developer on a cybersecurity nonprofit&apos;s security-readiness
              platform, a Dynamics 365 / Power Platform / Dataverse system live in production.
              Concurrently I run Craft CMS work at Rocketpark across a 11-site client portfolio, and
              from 2024-2026 I led a 4-dev team across Flo Labs&apos; 6-site Next.js + Strapi
              ecosystem.
            </p>
            <p>
              Off the clock I publish to npm (Specter: 65 CLI commands, 14 MCP tools), build
              observability in Rust (Chronicle), and write MCP servers instead of just consuming AI
              APIs. Won the Algolia Agent Studio Challenge ($750) in March 2026 with TimeSlipSearch,
              a conversational AI agent over 420k pop-culture records.
            </p>
            <p>
              B.S. in Information Technology, Software Development from Capella University
              (conferred March 2026), Summa Cum Laude, 3.98 GPA, University Honors Pathway,
              Dean&apos;s List every quarter. I work in small, shippable steps with clear commits
              and documentation so future me, and teammates, don&apos;t suffer.
            </p>
          </div>
        </section>

        {/* What I Do */}
        <section className={styles.section} aria-labelledby="what-i-do-heading">
          <div className={styles.sectionHead}>
            <span className="eFolio">No. 02</span>
            <h2 className={styles.sectionTitle} id="what-i-do-heading">
              What I Do
            </h2>
          </div>
          <div className={styles.doList}>
            <div className={styles.doRow}>
              <span className={styles.doNum}>01</span>
              <div>
                <h3 className={styles.doTitle}>Microsoft Power Platform</h3>
                <p className={styles.doBody}>
                  Dynamics 365 / Dataverse / Power Apps Canvas / Power Automate. Primary developer
                  on a 12-phase assessment platform now live in production. m365 and pac CLIs are
                  daily drivers.
                </p>
              </div>
            </div>
            <div className={styles.doRow}>
              <span className={styles.doNum}>02</span>
              <div>
                <h3 className={styles.doTitle}>Next.js + React 19 Full-Stack</h3>
                <p className={styles.doBody}>
                  End-to-end features from UI to API and data layer. Better Auth, MSAL, Drizzle,
                  Neon, Supabase. Comfortable with Spring Boot, REST APIs, and production-ready
                  backends.
                </p>
              </div>
            </div>
            <div className={styles.doRow}>
              <span className={styles.doNum}>03</span>
              <div>
                <h3 className={styles.doTitle}>Craft CMS &amp; Editor Workflows</h3>
                <p className={styles.doBody}>
                  Twig templates, Composer plugins, project-config CLI, Herd-based local dev.
                  Content modeling and template architecture that makes editors&apos; lives easier
                  across a 11-site client portfolio.
                </p>
              </div>
            </div>
            <div className={styles.doRow}>
              <span className={styles.doNum}>04</span>
              <div>
                <h3 className={styles.doTitle}>AI Integration &amp; MCP</h3>
                <p className={styles.doBody}>
                  I write MCP servers, not just consume LLM APIs. Algolia Agent Studio winner.
                  Shipped 14 MCP tools on npm (Specter), Rust-backed observability (Chronicle), RAG
                  pipelines, and multi-agent platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Snapshot */}
        <section className={styles.section} aria-labelledby="tech-snapshot-heading">
          <div className={styles.sectionHead}>
            <span className="eFolio">No. 03</span>
            <h2 className={styles.sectionTitle} id="tech-snapshot-heading">
              Tech Snapshot
            </h2>
          </div>
          <div className={styles.specSheet}>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>Power Platform</span>
              <span className={styles.specSheetValue}>
                Dynamics 365, Dataverse, Power Apps Canvas, Power Automate, Azure AD / MSAL, m365
                CLI, pac CLI
              </span>
            </div>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>Frontend</span>
              <span className={styles.specSheetValue}>
                Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Three.js, GSAP, Framer
                Motion
              </span>
            </div>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>Backend</span>
              <span className={styles.specSheetValue}>
                Node.js, Rust (Axum), Python, FastAPI, Java / Spring Boot, Express, REST APIs
              </span>
            </div>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>AI &amp; Integration</span>
              <span className={styles.specSheetValue}>
                Claude / Anthropic, OpenAI GPT-4, Algolia Agent Studio, MCP Protocol, RAG pipelines,
                Langfuse, Hugging Face
              </span>
            </div>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>Data &amp; Auth</span>
              <span className={styles.specSheetValue}>
                PostgreSQL, Neon, Supabase, Drizzle, Prisma, Redis, SQLite, Better Auth, MSAL
              </span>
            </div>
            <div className={styles.specSheetRow}>
              <span className={styles.specSheetLabel}>CMS &amp; Infra</span>
              <span className={styles.specSheetValue}>
                Craft CMS, Twig, Strapi, Vercel, Railway, Docker, Inngest, Playwright, Sentry
              </span>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section
          id="testimonial"
          className={styles.section}
          aria-labelledby="testimonial-heading"
          style={{ scrollMarginTop: '6rem' }}
        >
          <div className={styles.sectionHead}>
            <span className="eFolio">No. 04</span>
            <h2 className={styles.sectionTitle} id="testimonial-heading">
              What a Client Says
            </h2>
          </div>
          <blockquote className={styles.quoteBlock}>
            <span className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </span>
            <p className={styles.quoteText}>
              Elizabeth was the backbone of this project. While every team member played a role, it
              was Elizabeth who carried the technical weight and delivered a product that exceeded
              expectations. What set Elizabeth apart beyond her technical ability was her
              communication. A technically brilliant person who cannot communicate is difficult to
              work with. Elizabeth was both brilliant and a pleasure to collaborate with, and that
              combination is genuinely rare.
            </p>
            <footer className={styles.quoteFooter}>
              <div>
                <cite className={styles.quoteCite}>Brenna Martin</cite>
                <span className={styles.quoteRole}>
                  Founder &amp; Station Director, DareU Radio
                </span>
                <span className={styles.quoteHonorific}>
                  Best-Selling Author &middot; Corporate Transition Expert
                </span>
              </div>
              <a
                href="/testimonials/brenna-martin-dareu-radio.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="eBtn eBtnGhost"
              >
                View full letter
              </a>
            </footer>
          </blockquote>
        </section>

        {/* Highlights */}
        <section className={styles.section} aria-labelledby="highlights-heading">
          <div className={styles.sectionHead}>
            <span className="eFolio">No. 05</span>
            <h2 className={styles.sectionTitle} id="highlights-heading">
              Highlights
            </h2>
          </div>
          <div className={styles.hlList}>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>01</span>
              <p className={styles.hlText}>
                <strong>Sole developer</strong> on a cybersecurity nonprofit&apos;s
                security-readiness platform: Dynamics 365 / Power Platform / Dataverse system live
                in production, 12 implementation phases shipped
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>02</span>
              <p className={styles.hlText}>
                Led a 4-person team shipping 6 production sites with a unified design system and
                modern Next.js + Strapi architecture (Flo Labs, 2024-2026)
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>03</span>
              <p className={styles.hlText}>
                Software Engineer at Rocketpark agency: Craft CMS upgrades, MCP server wrapper, Twig
                template architecture across 11 client sites
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>04</span>
              <p className={styles.hlText}>
                Built a portfolio spanning {projectCount} projects across enterprise, AI,
                full-stack, devtools, creative, and experimental work
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>05</span>
              <p className={styles.hlText}>
                Built AI systems ranging from multi-agent platforms and GPT-4 Vision integrations to
                MCP tooling and local-first observability products
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>06</span>
              <p className={styles.hlText}>
                Created full educational platforms: Portfolio-Pro (269 lessons, 144 projects),
                Finance Quest (17 chapters, 30+ calculators with SM-2 spaced repetition)
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>07</span>
              <p className={styles.hlText}>
                Navigated 64,806-file enterprise codebase (Coulson One) and built monorepo
                architectures with NestJS, Next.js, and React Native
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>08</span>
              <p className={styles.hlText}>
                Graduated Summa Cum Laude (3.98 GPA), University Honors Pathway, Dean&apos;s List
                every quarter, while shipping production projects full-time
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>09</span>
              <p className={styles.hlText}>
                Won $750 Algolia Agent Studio Challenge with TimeSlipSearch, &ldquo;conversational
                time machine&rdquo; exploring 420,000+ pop culture records
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>10</span>
              <p className={styles.hlText}>
                Published npm packages (ally-a11y, @purplegumdropz/specter) and built Rust-powered
                observability tools (Chronicle)
              </p>
            </div>
            <div className={styles.hlRow}>
              <span className={styles.hlNum}>11</span>
              <p className={styles.hlText}>
                Shipped multiple SaaS products with Stripe billing live: AutomaDocs, HireReady, and
                Testimoniq
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta} aria-labelledby="cta-heading">
          <p className="eLabel">Let&apos;s talk</p>
          <h2 className={styles.sectionTitle} id="cta-heading">
            Let&apos;s Build Something
          </h2>
          <p className={`eLede ${styles.ctaLede}`}>
            Whether you&apos;re looking to collaborate on a project or just want to chat about web
            development, AI integration, or design systems, I&apos;d love to hear from you.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="eBtn eBtnPrimary">
              Get in touch{' '}
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <a href="/resume/elizabeth-stein-resume.pdf" download className="eBtn eBtnGhost">
              <Download className="w-4 h-4" aria-hidden="true" />
              Download résumé
            </a>
            <Link href="/work" className="eBtn eBtnGhost">
              View my work
            </Link>
          </div>
          <div className={styles.socialRow}>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">GitHub Profile</span>
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">LinkedIn Profile</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
