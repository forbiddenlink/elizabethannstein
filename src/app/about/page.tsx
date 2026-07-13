import { Code2, Cpu, Download, Palette, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'

const aboutDescription =
  "Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Sole developer on CyberReady Clinic's MSP Ready5 Assessment (Dynamics 365, in production). Algolia Agent Studio Challenge winner. Concurrent paid work at three orgs."

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
    <main className="min-h-screen bg-black text-white relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Skip Link for Accessibility */}
      <a
        href="#about-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <SiteHeader />

      {/* Main Content */}
      <div id="about-content" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              <div className="relative shrink-0 group">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 blur-sm group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all duration-500" />
                <Image
                  src="/images/profile.jpg"
                  alt="Elizabeth Stein"
                  width={200}
                  height={200}
                  className="relative rounded-xl border border-[var(--color-border)] object-cover"
                  priority
                />
              </div>
              <div>
                <p className="page-hero-kicker">About</p>
                <h1 className="page-hero-title text-5xl md:text-7xl mb-5">Hi, I&apos;m Liz</h1>
                <p className="text-2xl md:text-3xl text-white/88 leading-snug max-w-3xl tracking-tight">
                  Capella B.S., Summa Cum Laude (3.98 GPA, conferred March 2026). Currently shipping
                  production code at three orgs: Dynamics 365 work at CyberReady Clinic, Craft CMS at
                  Rocketpark, the Algolia Agent Studio winner on the side.
                </p>
              </div>
            </div>
          </div>

          {/* What I'm Looking For - FIRST for recruiters */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <h2 className="text-2xl font-semibold mb-4 text-white/70">Open to Opportunities</h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <p className="text-lg text-white/90 leading-relaxed">
                <strong className="inline-flex items-center gap-1.5 text-success mr-2">
                  <span className="relative flex h-2 w-2">
                    <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>{' '}
                  <span>Available now</span>
                </strong>{' '}
                Looking for <strong className="text-white">frontend</strong>,{' '}
                <strong className="text-white">UX engineering</strong>, or{' '}
                <strong className="text-white">full-stack</strong> roles with a strong product
                focus, where I can blend UI craftsmanship with solid engineering.
              </p>
            </div>
          </section>

          {/* Quick Glance for Recruiters */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <h2 className="text-2xl font-semibold mb-6 text-white/70">Quick Glance</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Skills Matrix */}
              <div className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                  Core Skills
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">React / Next.js</span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                      Core stack
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">TypeScript</span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                      Primary language
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">AI Integration</span>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                      Production + R&D
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Full-Stack (Node/Python)</span>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      UI to API
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Design Systems</span>
                    <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-1 rounded">
                      Team delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                  Browse by Focus
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/work?filter=enterprise"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-white/80 group-hover:text-white">
                      Enterprise Projects
                    </span>
                    <span className="text-xs text-orange-400">{enterpriseCount} projects →</span>
                  </Link>
                  <Link
                    href="/work?filter=ai"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-white/80 group-hover:text-white">AI & ML Work</span>
                    <span className="text-xs text-cyan-400">{aiCount} projects →</span>
                  </Link>
                  <Link
                    href="/work?filter=fullstack"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-white/80 group-hover:text-white">Full-Stack Apps</span>
                    <span className="text-xs text-purple-400">{fullstackCount} projects →</span>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/work"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View all {projectCount} projects →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="/resume/elizabeth-stein-resume.pdf" download className="btn btn-primary">
                <Download className="w-4 h-4" />
                Download Resume
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Send a Message
              </Link>
            </div>
          </section>

          {/* 30-second reel */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <h2 className="text-2xl font-semibold mb-2 text-white/70">The 30-Second Version</h2>
            <p className="text-white/55 mb-5">
              No time for the galaxy? Here is the highlight reel.
            </p>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-cyan-500/5 max-w-3xl">
              {/* biome-ignore lint/a11y/useMediaCaption: silent showreel with no spoken audio; all content is on-screen text. */}
              <video
                controls
                preload="none"
                playsInline
                poster="/reel-poster.webp"
                className="w-full h-auto block"
                aria-label="30-second portfolio showreel"
              >
                <source src="/reel.webm" type="video/webm" />
                <source src="/reel.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          {/* Bio Section */}
          <div className="section-divider mb-16" aria-hidden="true" />
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
              <div
                className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                aria-hidden="true"
              >
                <Sparkles className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              About Me
            </h2>
            <div className="space-y-4 text-lg text-white/(--text-opacity-primary) leading-relaxed bg-surface-2 p-8 rounded-lg border border-white/(--border-opacity-default)">
              <p>
                I&apos;m the sole developer on CyberReady Clinic&apos;s MSP Ready5 Assessment, a
                Dynamics 365 / Power Platform / Dataverse system live in production. Concurrently I
                run Craft CMS work at Rocketpark across a 10-site client portfolio, and from
                2024-2026 I led a 4-dev team across Flo Labs&apos; 6-site Next.js + Strapi
                ecosystem.
              </p>
              <p>
                Off the clock I publish to npm (Specter: 65 CLI commands, 14 MCP tools), build
                observability in Rust (Chronicle), and write MCP servers instead of just consuming
                AI APIs. Won the Algolia Agent Studio Challenge ($750) in March 2026 with
                TimeSlipSearch, a conversational AI agent over 420k pop-culture records.
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
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-8">What I Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-enterprise)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <Cpu className="w-6 h-6 text-[var(--color-galaxy-enterprise)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Microsoft Power Platform</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      Dynamics 365 / Dataverse / Power Apps Canvas / Power Automate. Primary
                      developer on a 12-phase assessment platform now live in production. m365 and
                      pac CLIs are daily drivers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-fullstack)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <Code2 className="w-6 h-6 text-[var(--color-galaxy-fullstack)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Next.js + React 19 Full-Stack</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      End-to-end features from UI to API and data layer. Better Auth, MSAL, Drizzle,
                      Neon, Supabase. Comfortable with Spring Boot, REST APIs, and production-ready
                      backends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-devtools)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <Palette className="w-6 h-6 text-[var(--color-galaxy-devtools)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Craft CMS &amp; Editor Workflows</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      Twig templates, Composer plugins, project-config CLI, Herd-based local dev.
                      Content modeling and template architecture that makes editors&apos; lives
                      easier across a 10-site client portfolio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-experimental)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <Sparkles className="w-6 h-6 text-[var(--color-galaxy-experimental)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Integration &amp; MCP</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      I write MCP servers, not just consume LLM APIs. Algolia Agent Studio winner.
                      Shipped 14 MCP tools on npm (Specter), Rust-backed observability (Chronicle),
                      RAG pipelines, and multi-agent platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Snapshot */}
          <div className="section-divider mb-16" aria-hidden="true" />
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Tech Snapshot</h2>
            <div className="bg-surface-2 border border-white/(--border-opacity-default) rounded-lg p-8 hover:bg-surface-3 transition-colors">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Microsoft Power Platform
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Dynamics 365, Dataverse, Power Apps Canvas, Power Automate, Azure AD / MSAL,
                    m365 CLI, pac CLI
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Frontend
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Three.js, GSAP,
                    Framer Motion
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Backend
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Node.js, Rust (Axum), Python, FastAPI, Java / Spring Boot, Express, REST APIs
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    AI &amp; Integration
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Claude / Anthropic, OpenAI GPT-4, Algolia Agent Studio, MCP Protocol, RAG
                    pipelines, Langfuse, Hugging Face
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Data &amp; Auth
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    PostgreSQL, Neon, Supabase, Drizzle, Prisma, Redis, SQLite, Better Auth, MSAL
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    CMS &amp; Infra
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Craft CMS, Twig, Strapi, Vercel, Railway, Docker, Inngest, Playwright, Sentry
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <div className="section-divider mb-16" aria-hidden="true" />
          <section
            id="testimonial"
            className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600 fill-mode-both scroll-mt-24"
          >
            <h2 className="text-3xl font-semibold mb-6">What Clients Say</h2>
            <blockquote className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 md:p-10">
              <div
                className="absolute -top-4 -left-2 text-6xl text-[var(--color-text-tertiary)] font-serif"
                aria-hidden="true"
              >
                "
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-white/90 italic mb-6 relative z-10">
                Elizabeth was the backbone of this project. While every team member played a role,
                it was Elizabeth who carried the technical weight and delivered a product that
                exceeded expectations... What set Elizabeth apart beyond her technical ability was
                her communication. A technically brilliant person who cannot communicate is
                difficult to work with. Elizabeth was both brilliant and a pleasure to collaborate
                with, and that combination is genuinely rare.
              </p>
              <footer className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <cite className="not-italic font-semibold text-white">Brenna Martin</cite>
                  <p className="text-white/60 text-sm">Founder & Station Director, DareU Radio</p>
                  <p className="text-white/40 text-xs mt-1">
                    Best-Selling Author | Corporate Transition Expert
                  </p>
                </div>
                <a
                  href="/testimonials/brenna-martin-dareu-radio.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                >
                  View Full Letter
                </a>
              </footer>
            </blockquote>
          </section>

          {/* Highlights */}
          <div className="section-divider mb-16" aria-hidden="true" />
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
            <ul className="space-y-4">
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  <strong className="text-white">Sole developer</strong> on CyberReady
                  Clinic&apos;s MSP Ready5 Assessment: Dynamics 365 / Power Platform / Dataverse
                  system live in production, 12 implementation phases shipped
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Led a 4-person team shipping 6 production sites with a unified design system and
                  modern Next.js + Strapi architecture (Flo Labs, 2024-2026)
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Software Engineer at Rocketpark agency: Craft CMS upgrades, MCP server wrapper,
                  Twig template architecture across 10 client sites
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Built a portfolio spanning {projectCount} projects across enterprise, AI,
                  full-stack, devtools, creative, and experimental work
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Built AI systems ranging from multi-agent platforms and GPT-4 Vision integrations
                  to MCP tooling and local-first observability products
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Created full educational platforms: Portfolio-Pro (269 lessons, 144 projects),
                  Finance Quest (17 chapters, 30+ calculators with SM-2 spaced repetition)
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Navigated 64,806-file enterprise codebase (Coulson One) and built monorepo
                  architectures with NestJS, Next.js, and React Native
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Graduated Summa Cum Laude (3.98 GPA), University Honors Pathway, Dean's List every
                  quarter, while shipping production projects full-time
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Won $750 Algolia Agent Studio Challenge with TimeSlipSearch, "conversational time
                  machine" exploring 420,000+ pop culture records
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Published npm packages (ally-a11y, @purplegumdropz/specter) and built Rust-powered
                  observability tools (Chronicle)
                </p>
              </li>
              <li className="bg-surface-2 border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Shipped multiple SaaS products with Stripe billing live: AutomaDocs, HireReady,
                  Testimoniq, and Site Sheriff
                </p>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center animate-in fade-in zoom-in duration-700 delay-1000 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Let's Build Something</h2>
            <p className="text-xl text-white/(--text-opacity-secondary) mb-8 max-w-2xl mx-auto">
              Whether you're looking to collaborate on a project or just want to chat about web
              development, AI integration, or design systems, I'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary px-8">
                Get in Touch
              </Link>
              <a
                href="/resume/elizabeth-stein-resume.pdf"
                download
                className="btn btn-secondary px-8"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
              <Link href="/work" className="btn btn-ghost px-8 border border-white/20">
                View My Work
              </Link>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://github.com/forbiddenlink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/(--text-opacity-tertiary) hover:text-white transition-colors"
              >
                <GitHubIcon className="w-6 h-6" aria-hidden="true" />
                <span className="sr-only">GitHub Profile</span>
              </a>
              <a
                href="https://linkedin.com/in/imkindageeky"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/(--text-opacity-tertiary) hover:text-white transition-colors"
              >
                <LinkedInIcon className="w-6 h-6" aria-hidden="true" />
                <span className="sr-only">LinkedIn Profile</span>
              </a>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
