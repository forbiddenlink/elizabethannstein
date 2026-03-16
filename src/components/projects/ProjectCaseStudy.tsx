'use client'

import type { Project } from '@/lib/types'
import { formatDateRange } from '@/lib/utils'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ExternalLink, Github, ArrowLeft } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import { GenerativeHero } from '@/components/ui/GenerativeHero'
import { ProjectBadges } from '@/components/ui/ProjectBadges'
import { SocialProof } from '@/components/ui/SocialProofBadges'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

// Map project IDs to their screenshot paths
const PROJECT_SCREENSHOTS: Record<string, string> = {
  // Enterprise
  'flo-labs': '/screenshots/flo-labs.png',
  'caipo-ai': '/screenshots/caipo-ai.webp',
  'moodchanger-ai': '/screenshots/moodchanger-ai.png',
  'hephaestus': '/screenshots/hephaestus.png',
  'robocollective-ai': '/screenshots/robocollective-ai.webp',
  // AI Frontier
  'finance-quest': '/screenshots/finance-quest.webp',
  'stancestream': '/screenshots/stance-stream.png',
  'explainthiscode': '/screenshots/explain-this-code.webp',
  'tubedigest': '/screenshots/tubedigest.png',
  'contradictme': '/screenshots/contradictme.webp',
  'dev-interviewer': '/screenshots/dev-interviewer.png',
  // Full-Stack
  'portfolio-pro': '/screenshots/portfolio-pro.png',
  'create-surveys': '/screenshots/create-surveys.png',
  'quantum-forge': '/screenshots/quantum-forge.webp',
  'skill-mapper': '/screenshots/skill-mapper.png',
  'reprise': '/screenshots/reprise.webp',
  // DevTools
  'componentcompass': '/screenshots/componentcompass.png',
  'security-trainer': '/screenshots/security-trainer.png',
  'encryption-visualizer': '/screenshots/encryption-visualizer.png',
  // Creative
  'goodstuff-foodtruck': '/screenshots/goodstuff-foodtruck.png',
  'studio-furniture': '/screenshots/studio-furniture.png',
  'rivet': '/screenshots/rivet.png',
  // Experimental
  'pollyglot': '/screenshots/pollyglot.png',
  'guts-and-glory': '/screenshots/guts-and-glory.png',
  'plant-therapy': '/screenshots/plant-therapy.webp',
  'timeslip-search': '/screenshots/timeslip-search.webp',
  'mythos': '/screenshots/mythos.webp',
  'apoc-bnb': '/screenshots/apoc-bnb.png',
  'canvas-flow': '/screenshots/canvas-flow.png',
}

// Tech stack badge colours by category
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  // Frameworks
  'React':        { bg: 'rgba(97,218,251,0.12)',  text: '#61dafb', border: 'rgba(97,218,251,0.3)'  },
  'Next.js':      { bg: 'rgba(255,255,255,0.08)', text: '#ffffff', border: 'rgba(255,255,255,0.2)' },
  'Vue.js':       { bg: 'rgba(66,184,131,0.12)',  text: '#42b883', border: 'rgba(66,184,131,0.3)'  },
  'Svelte':       { bg: 'rgba(255,62,0,0.12)',    text: '#ff3e00', border: 'rgba(255,62,0,0.3)'    },
  // Languages
  'TypeScript':   { bg: 'rgba(49,120,198,0.15)',  text: '#4fc3f7', border: 'rgba(49,120,198,0.35)' },
  'JavaScript':   { bg: 'rgba(247,223,30,0.12)',  text: '#f7df1e', border: 'rgba(247,223,30,0.3)'  },
  'Python':       { bg: 'rgba(255,212,59,0.12)',  text: '#ffd43b', border: 'rgba(255,212,59,0.3)'  },
  'Rust':         { bg: 'rgba(222,165,132,0.12)', text: '#dea584', border: 'rgba(222,165,132,0.3)' },
  // AI / ML
  'AI':           { bg: 'rgba(139,92,246,0.15)',  text: '#c4b5fd', border: 'rgba(139,92,246,0.35)' },
  'OpenAI':       { bg: 'rgba(16,163,127,0.12)',  text: '#10a37f', border: 'rgba(16,163,127,0.3)'  },
  'Claude':       { bg: 'rgba(214,89,35,0.12)',   text: '#f97316', border: 'rgba(214,89,35,0.3)'   },
  'LLM':          { bg: 'rgba(139,92,246,0.12)',  text: '#a78bfa', border: 'rgba(139,92,246,0.3)'  },
  'Machine Learning': { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  // Backend / DB
  'Node.js':      { bg: 'rgba(104,160,99,0.12)',  text: '#68a063', border: 'rgba(104,160,99,0.3)'  },
  'Supabase':     { bg: 'rgba(62,207,142,0.12)',  text: '#3ecf8e', border: 'rgba(62,207,142,0.3)'  },
  'PostgreSQL':   { bg: 'rgba(51,103,145,0.12)',  text: '#336791', border: 'rgba(51,103,145,0.3)'  },
  'MongoDB':      { bg: 'rgba(71,162,72,0.12)',   text: '#47a248', border: 'rgba(71,162,72,0.3)'   },
  'Redis':        { bg: 'rgba(220,49,49,0.12)',   text: '#dc3131', border: 'rgba(220,49,49,0.3)'   },
  'Prisma':       { bg: 'rgba(42,43,54,0.4)',     text: '#5a67d8', border: 'rgba(90,103,216,0.3)'  },
  // Styling
  'Tailwind':     { bg: 'rgba(6,182,212,0.12)',   text: '#06b6d4', border: 'rgba(6,182,212,0.3)'   },
  'CSS':          { bg: 'rgba(236,107,175,0.12)', text: '#ec6baf', border: 'rgba(236,107,175,0.3)' },
  'GSAP':         { bg: 'rgba(136,206,18,0.12)',  text: '#88ce12', border: 'rgba(136,206,18,0.3)'  },
  'Three.js':     { bg: 'rgba(255,255,255,0.08)', text: '#e0e0e0', border: 'rgba(255,255,255,0.2)' },
  // DevOps
  'Docker':       { bg: 'rgba(36,150,237,0.12)',  text: '#2496ed', border: 'rgba(36,150,237,0.3)'  },
  'Vercel':       { bg: 'rgba(255,255,255,0.08)', text: '#d4d4d8', border: 'rgba(255,255,255,0.15)'},
  'Stripe':       { bg: 'rgba(99,91,255,0.12)',   text: '#635bff', border: 'rgba(99,91,255,0.3)'   },
}
const DEFAULT_TAG = { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.15)' }

function getTagStyle(tag: string) {
  return TAG_COLORS[tag] ?? DEFAULT_TAG
}

// ── Animated count-up hook ─────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setValue(parseFloat((ease * target).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals])

  return { value, ref }
}

// ── Metric Card with count-up ──────────────────────────────────────────────
function MetricCard({ label, value, color }: Readonly<{ label: string; value: string; color?: string }>) {
  // Parse numeric prefix for animation (e.g. "1,200" → 1200, "84" → 84)
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''))
  const suffix = value.replace(/^[\d,. ]+/, '')
  const isNumeric = !isNaN(numeric) && numeric > 0
  const decimals = value.includes('.') ? 1 : 0
  const { value: animated, ref } = useCountUp(isNumeric ? numeric : 0, 1200, decimals)

  const displayValue = isNumeric
    ? `${animated.toLocaleString(undefined, { maximumFractionDigits: decimals })}${suffix}`
    : value

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 hover:border-white/30 hover:from-white/15 hover:to-white/10 transition-all duration-200"
      style={{ boxShadow: color ? `0 0 20px ${color}15` : undefined }}
    >
      <div
        className="text-3xl font-bold mb-2 tabular-nums"
        style={{ color: color ?? 'white' }}
      >
        {displayValue}
      </div>
      <div className="text-sm text-white/60 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}

// ── Impact metric mini-cards ───────────────────────────────────────────────
function ImpactMetricCard({ label, value, icon, color }: { label: string; value: string; icon?: string; color: string }) {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''))
  const suffix = value.replace(/^[\d,. %x+]+/, '')
  const isNumeric = !isNaN(numeric) && numeric > 0
  const decimals = value.includes('.') ? 1 : 0
  const { value: animated, ref } = useCountUp(isNumeric ? numeric : 0, 1600, decimals)

  const displayValue = isNumeric
    ? `${animated.toLocaleString(undefined, { maximumFractionDigits: decimals })}${suffix}`
    : value

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${color}10`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}20, transparent 70%)` }}
      />
      <div className="relative z-10">
        {icon && <div className="text-2xl mb-2" aria-hidden="true">{icon}</div>}
        <div
          className="text-2xl md:text-3xl font-bold tabular-nums mb-1"
          style={{ color }}
        >
          {displayValue}
        </div>
        <div className="text-xs text-white/60 font-medium uppercase tracking-wider leading-tight">{label}</div>
      </div>
    </motion.div>
  )
}

// ── Screenshot hero with parallax ─────────────────────────────────────────
function ScreenshotHero({ project, screenshotPath }: { project: Project; screenshotPath?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <div
      ref={containerRef}
      className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm relative group"
      style={{ boxShadow: `0 0 60px ${project.color}15` }}
    >
      <div className="aspect-video relative overflow-hidden">
        {screenshotPath ? (
          <motion.div className="absolute inset-0 scale-110" style={{ y }}>
            <Image
              src={screenshotPath}
              alt={`${project.title} application interface`}
              width={1280}
              height={800}
              priority
              className="object-cover object-top w-full h-full"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900">
            <GenerativeHero name={project.title} color={project.color} />
          </div>
        )}

        {/* Gradient overlay — lighter at top, more at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

        {/* Live URL overlay CTA */}
        {project.links?.live && (
          <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)`,
                color: 'white',
                boxShadow: `0 0 30px ${project.color}60`,
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Open Live Site
            </a>
          </div>
        )}

        {/* Browser chrome top bar — makes it feel like a real browser screenshot */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-black/40 to-transparent flex items-center px-3 gap-1.5 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          {project.links?.live && (
            <div className="ml-2 flex-1 max-w-xs bg-white/10 rounded text-[10px] text-white/40 px-2 py-0.5 truncate font-mono">
              {project.links.live.replace('https://', '')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helper text generators ─────────────────────────────────────────────────
function getChallengeText(project: Project): string {
  if (project.challenge) return project.challenge
  if (project.metrics?.files) {
    const teamPart = project.metrics.team ? ` across a team of ${project.metrics.team} developers` : ''
    return `Building and maintaining a large-scale application with ${project.metrics.files.toLocaleString()} files${teamPart}.`
  }
  return 'Building a production-ready application that delivers real value while maintaining code quality and user experience.'
}

function getSolutionText(project: Project): string {
  if (project.solution) return project.solution
  if (project.tags.includes('AI')) {
    const techStack = project.tags.filter(t => ['Next.js', 'React', 'TypeScript', 'Supabase', 'OpenAI', 'Claude'].includes(t)).join(', ') || 'modern web technologies'
    return `Built with ${techStack}, integrating AI capabilities for enhanced functionality.`
  }
  return `Architected with ${project.tags.slice(0, 3).join(', ')}, focusing on performance, accessibility, and maintainability.`
}

function getImpactText(project: Project): string {
  if (project.impact) return project.impact
  if (project.metrics?.tests) {
    const userPart = project.metrics.users ? `Serving ${project.metrics.users}.` : 'Production-ready and deployed.'
    return `${project.metrics.tests} automated tests ensuring reliability. ${userPart}`
  }
  if (project.links?.live) {
    return 'Successfully deployed to production and actively maintained. Built with modern best practices for performance and accessibility.'
  }
  return `Completed as a learning project, demonstrating proficiency in ${project.tags.slice(0, 2).join(' and ')}.`
}

// ── Main component ─────────────────────────────────────────────────────────
interface ProjectCaseStudyProps {
  readonly project: Project
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const screenshotPath = PROJECT_SCREENSHOTS[project.id]

  return (
    <article className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16 space-y-12">
      {/* ── Header ── */}
      <header className="mb-12">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
              {project.title}
            </h1>
            {project.company && (
              <p className="text-2xl text-white/70 font-medium">{project.company}</p>
            )}
          </div>
          <div
            className="w-20 h-20 rounded-2xl shrink-0 shadow-lg"
            style={{
              backgroundColor: project.color,
              opacity: project.brightness * 0.6,
              boxShadow: `0 0 40px ${project.color}40`,
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-base text-white/70 mb-4">
          <span className="px-3 py-1 bg-white/5 rounded-full">{project.role}</span>
          <span className="px-3 py-1 bg-white/5 rounded-full">{formatDateRange(project.dateRange)}</span>
        </div>

        <ProjectBadges project={project} />
        <SocialProof
          githubRepo={project.links?.github?.replace('https://github.com/', '')}
          tests={project.metrics?.tests ? { count: project.metrics.tests, passing: true } : undefined}
          metrics={project.metrics?.users ? [{ label: 'Users', value: project.metrics.users }] : undefined}
        />
      </header>

      {/* ── Glowing Live CTA (if live URL exists) ── */}
      {project.links?.live && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg overflow-hidden group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${project.color}cc, ${project.color}88)`,
              boxShadow: `0 0 40px ${project.color}40, 0 8px 24px rgba(0,0,0,0.3)`,
              border: `1px solid ${project.color}50`,
            }}
          >
            {/* Animated shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <ExternalLink className="w-5 h-5 relative z-10" />
            <span className="relative z-10">View Live Site</span>
          </a>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/20 font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <GitHubIcon className="w-5 h-5" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      )}
      {/* GitHub only (no live URL) */}
      {!project.links?.live && project.links?.github && (
        <div className="mb-4">
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/20 font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            <GitHubIcon className="w-5 h-5" />
            <span>View Source Code</span>
          </a>
        </div>
      )}

      {/* ── Overview ── */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Overview</h2>
        <p className="text-xl leading-relaxed text-white/90 font-light mb-6">{project.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🎯</span>
              <span>Challenge</span>
            </h3>
            <p className="text-white/70 leading-relaxed">{getChallengeText(project)}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">⚡</span>
              <span>Solution</span>
            </h3>
            <p className="text-white/70 leading-relaxed">{getSolutionText(project)}</p>
          </motion.div>

          {/* Impact hero card */}
          <motion.div whileHover={{ scale: 1.03, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="md:col-span-2 relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 overflow-hidden group"
            style={{ boxShadow: `0 0 40px ${project.color}40, 0 0 80px ${project.color}20, inset 0 0 60px ${project.color}10` }}
          >
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}60, transparent 70%)`, animation: 'pulse 3s ease-in-out infinite' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">📈</span>
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Impact</span>
              </h3>
              <p className="text-lg text-white/90 font-medium leading-relaxed">{getImpactText(project)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Screenshot / Generative Hero ── */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          {screenshotPath ? 'Live Preview' : 'System Architecture'}
        </h2>
        <ScreenshotHero project={project} screenshotPath={screenshotPath} />
      </section>

      {/* ── Impact Metrics (if populated) ── */}
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span style={{ color: project.color }}>◆</span>
            <span>By the numbers</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.impactMetrics.map((m) => (
              <ImpactMetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                icon={m.icon}
                color={project.color}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Project Metrics (files/tests/team/users) ── */}
      {project.metrics && Object.keys(project.metrics).length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.metrics.files && (
              <MetricCard label="Files" value={project.metrics.files.toLocaleString()} color={project.color} />
            )}
            {project.metrics.tests && (
              <MetricCard label="Tests" value={project.metrics.tests.toString()} color={project.color} />
            )}
            {project.metrics.team && (
              <MetricCard label="Team Size" value={project.metrics.team.toString()} color={project.color} />
            )}
            {project.metrics.users && (
              <MetricCard label="Users" value={project.metrics.users} color={project.color} />
            )}
          </div>
        </section>
      )}

      {/* ── Testimonial ── */}
      {project.testimonial && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">💬</span>
            Client Testimonial
          </h2>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 md:p-10"
            style={{ boxShadow: `0 0 40px ${project.color}20` }}
          >
            <div className="absolute -top-4 -left-2 text-6xl text-white/20 font-serif" aria-hidden="true">"</div>
            <p className="text-lg md:text-xl leading-relaxed text-white/90 italic mb-6 relative z-10">{project.testimonial.quote}</p>
            <footer className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <cite className="not-italic font-semibold text-white">{project.testimonial.author}</cite>
                <p className="text-white/60 text-sm">{project.testimonial.role}</p>
                {project.testimonial.date && <p className="text-white/40 text-xs mt-1">{project.testimonial.date}</p>}
              </div>
              {project.links?.testimonial && (
                <a
                  href={project.links.testimonial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Letter
                </a>
              )}
            </footer>
          </motion.blockquote>
        </section>
      )}

      {/* ── Tech Stack — colour-coded by category ── */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Tech Stack</h2>
        <div className="flex flex-wrap gap-2.5">
          {project.tags.map((tag) => {
            const style = getTagStyle(tag)
            return (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-4 py-2 rounded-lg text-sm font-semibold cursor-default select-none"
                style={{
                  background: style.bg,
                  color: style.text,
                  border: `1px solid ${style.border}`,
                }}
              >
                {tag}
              </motion.span>
            )
          })}
        </div>
      </section>

      {/* ── Navigation ── */}
      <nav className="pt-8 border-t border-white/10">
        <a href="/work" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to all projects
        </a>
      </nav>
    </article>
  )
}
