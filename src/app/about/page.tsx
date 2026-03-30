import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT, SITE } from '@/lib/constants'
import { allProjects, galaxies } from '@/lib/galaxyData'
import { Code2, Cpu, Download, Palette, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Me - Elizabeth Stein Portfolio',
  description:
    'Full-stack engineer and UX-minded builder specializing in modern web experiences, AI integration, and thoughtful design systems.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Me - Elizabeth Stein Portfolio',
    description:
      'Full-stack engineer and UX-minded builder specializing in modern web experiences, AI integration, and thoughtful design systems.',
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <SiteHeader />

      {/* Main Content */}
      <div id="about-content" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              <div className="relative shrink-0 group">
                {/* Animated glow layers */}
                <div className="absolute -inset-2 bg-linear-to-br from-purple-500/60 via-pink-500/40 to-cyan-500/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-linear-to-br from-purple-500/40 to-pink-500/40 rounded-2xl blur-md animate-pulse-subtle" />
                <Image
                  src="/images/profile.jpg"
                  alt="Elizabeth Stein"
                  width={200}
                  height={200}
                  className="relative rounded-2xl shadow-2xl shadow-purple-500/30 ring-2 ring-white/20 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority
                />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Hi, I'm Liz
                </h1>
                <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl">
                  I build modern web experiences with thoughtful UX and solid engineering.
                </p>
              </div>
            </div>
          </div>

          {/* What I'm Looking For - FIRST for recruiters */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <h2 className="text-2xl font-semibold mb-4 text-white/70">Open to Opportunities</h2>
            <div className="bg-linear-to-br from-purple-500/15 via-pink-500/10 to-orange-500/10 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <p className="text-lg text-white/90 leading-relaxed">
                <strong className="inline-flex items-center gap-1.5 text-success mr-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>{' '}
                  <span>Available now</span>
                </strong>{' '}
                Looking for <strong className="text-white">frontend</strong>,{' '}
                <strong className="text-white">UX engineering</strong>, or{' '}
                <strong className="text-white">full-stack</strong> roles with a strong product
                focus—where I can blend UI craftsmanship with solid engineering.
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
              <a
                href="/resume/elizabeth-stein-resume.pdf"
                download
                className="btn btn-primary"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
              <a
                href={`mailto:${CONTACT.email}?subject=Job%20Opportunity`}
                className="btn btn-secondary"
              >
                Schedule a Chat
              </a>
            </div>
          </section>

          {/* Bio Section */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-purple/20" aria-hidden="true">
                <Sparkles className="w-6 h-6 text-accent-purple" />
              </div>
              About Me
            </h2>
            <div className="space-y-4 text-lg text-white/(--text-opacity-primary) leading-relaxed bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <p>
                I'm a full-stack developer and UX/UI-minded builder who loves turning messy ideas
                into clean, usable products. I care deeply about design details, accessibility, and
                making things feel fast and intuitive — but I also enjoy the backend puzzle of APIs,
                data flows, and systems that actually hold up in real life.
              </p>
              <p>
                I work best in small, shippable steps, with clear commits and documentation so
                future me (and teammates) don't suffer. B.S. in Software Development from Capella
                University (March 2026, 3.98 GPA). Previously led a design team shipping 6
                production sites for a client ecosystem.
              </p>
            </div>
          </section>

          {/* What I Do */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-8">What I Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-fullstack)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-[var(--color-galaxy-fullstack)]/20 to-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-[var(--color-galaxy-fullstack)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Frontend Excellence</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      Polished, responsive interfaces with reusable components and consistent UI
                      patterns. I bridge design intent and implementation details—spacing,
                      typography, states, responsiveness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-ai)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-[var(--color-galaxy-ai)]/20 to-cyan-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 text-[var(--color-galaxy-ai)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Full-Stack Features</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      End-to-end feature development from UI to API integration and data flow.
                      Comfortable with Java/Spring Boot services, REST APIs, and production-ready
                      backends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-devtools)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-[var(--color-galaxy-devtools)]/20 to-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6 text-[var(--color-galaxy-devtools)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">CMS & Content Systems</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      CMS-driven sites and content workflows, including Craft CMS environments.
                      Content modeling, migrations, and template architecture that makes editors'
                      lives easier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle border-l-3 border-l-[var(--color-galaxy-experimental)] p-6 card-hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-[var(--color-galaxy-experimental)]/20 to-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-[var(--color-galaxy-experimental)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Integration</h3>
                    <p className="text-white/(--text-opacity-secondary)">
                      AI-powered interfaces and workflows, from multi-agent platforms to GPT-4
                      Vision integrations. Built autonomous AI artist with mood systems, MCP
                      tooling, and RAG-powered documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Snapshot */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Tech Snapshot</h2>
            <div className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-2xl p-8 hover:bg-surface-3 transition-colors">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Frontend
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Three.js, GSAP
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Backend
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Java, Spring Boot, Node.js, REST APIs, Python
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    CMS & Platforms
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Craft CMS, Strapi, WordPress, Vercel, Firebase
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    AI & Integration
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Claude/Anthropic, OpenAI GPT-4, Stable Diffusion, MCP Protocol, Algolia Agent
                    Studio
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Data & Infrastructure
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    PostgreSQL, Supabase, MongoDB, Redis, Prisma, Docker, Git/GitHub
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/(--text-opacity-primary)">
                    Process
                  </h3>
                  <p className="text-white/(--text-opacity-secondary) leading-relaxed">
                    Agile/Scrum, CI/CD, testing, documentation
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section
            id="testimonial"
            className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600 fill-mode-both scroll-mt-24"
          >
            <h2 className="text-3xl font-semibold mb-6">What Clients Say</h2>
            <blockquote className="relative bg-linear-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-white/20 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
              <div
                className="absolute -top-4 -left-2 text-6xl text-white/20 font-serif"
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
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
            <ul className="space-y-4">
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Built a portfolio spanning {projectCount} projects across enterprise, AI,
                  full-stack, devtools, creative, and experimental work
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Led a 4-person team shipping 6 production sites with a unified design system and
                  modern Next.js + Strapi architecture
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Built AI systems ranging from multi-agent platforms and GPT-4 Vision integrations
                  to MCP tooling and local-first observability products
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Created full educational platforms: Portfolio-Pro (205 lessons), Finance Quest (17
                  chapters, 30+ calculators, 85% retention rate)
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Navigated 64,806-file enterprise codebase (Coulson One) and built monorepo
                  architectures with NestJS, Next.js, and React Native
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Graduated with 3.98 GPA, Dean's List every quarter, while shipping production
                  projects full-time
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Won $750 Algolia Agent Studio Challenge with TimeSlipSearch—"conversational time
                  machine" exploring 420,000+ pop culture records
                </p>
              </li>
              <li className="bg-surface-2 backdrop-blur-sm border border-white/(--border-opacity-default) rounded-xl p-6 hover:bg-surface-3 transition-all hover:translate-x-2 flex items-start gap-4">
                <span
                  className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-white/(--text-opacity-primary)">
                  Published npm package (ally-a11y)—accessibility CLI with real-time auto-fix, and
                  built Rust-powered observability tools
                </p>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center animate-in fade-in zoom-in duration-700 delay-1000 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Let's Build Something</h2>
            <p className="text-xl text-white/(--text-opacity-secondary) mb-8 max-w-2xl mx-auto">
              Whether you're looking to collaborate on a project or just want to chat about web
              development, AI integration, or design systems—I'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={`mailto:${CONTACT.email}`}
                className="btn btn-primary px-8"
              >
                Get in Touch
              </a>
              <a
                href="/resume/elizabeth-stein-resume.pdf"
                download
                className="btn btn-secondary px-8"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
              <Link
                href="/work"
                className="btn btn-ghost px-8 border border-white/20"
              >
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
