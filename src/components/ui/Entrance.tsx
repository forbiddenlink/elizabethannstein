'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Brain, Building2, Code2, Rocket, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SITE } from '@/lib/constants'
import { getProjectById } from '@/lib/galaxyData'
import { FAST_TRACK_IDS, SCENE_PROJECT_IDS } from '@/lib/proofLayer'
import { useViewStore } from '@/lib/store'

const GALAXY_MARKERS = [
  { label: 'Enterprise', tone: 'enterprise' },
  { label: 'AI / ML', tone: 'ai' },
  { label: 'Full-Stack', tone: 'fullstack' },
  { label: 'Dev Tools', tone: 'devtools' },
  { label: 'Creative', tone: 'creative' },
  { label: 'Experiments', tone: 'experimental' },
] as const

const FIRST_NAME_LETTERS = 'ELIZABETH'.split('').map((char, index) => ({
  id: `first-${char}-${index}`,
  char,
  index,
}))

const LAST_NAME_LETTERS = 'STEIN'.split('').map((char, index) => ({
  id: `last-${char}-${index}`,
  char,
  index,
}))

/** Visual metadata for FAST_TRACK_IDS — ids come from proofLayer only */
const FAST_TRACK_ENTRANCE_META: Record<
  (typeof FAST_TRACK_IDS)[number],
  { highlight: string; icon: typeof Building2; gradient: string }
> = {
  'crc-ready5-assessment': {
    highlight: 'Dynamics 365 · in production',
    icon: Building2,
    gradient: 'from-orange-500 to-red-600',
  },
  'timeslip-search': {
    highlight: '$750 Algolia win',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-600',
  },
  specter: {
    highlight: 'npm · MCP tools',
    icon: Code2,
    gradient: 'from-emerald-500 to-teal-600',
  },
  trace: {
    highlight: 'Contest winner · screenshot to React',
    icon: Trophy,
    gradient: 'from-lime-500 to-emerald-600',
  },
  chronicle: {
    highlight: 'Rust AI observability',
    icon: Brain,
    gradient: 'from-cyan-500 to-blue-600',
  },
  'autodocs-ai': {
    highlight: 'Live SaaS · Stripe',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-600',
  },
  'coulson-one': {
    highlight: 'Enterprise · 64K+ files',
    icon: Building2,
    gradient: 'from-orange-500 to-red-600',
  },
}

const heroProjects = FAST_TRACK_IDS.map((id) => ({ id, ...FAST_TRACK_ENTRANCE_META[id] }))

function HeroProjectsQuick() {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
      {heroProjects.map((hero) => {
        const project = getProjectById(hero.id)
        if (!project) return null
        const Icon = hero.icon
        return (
          <Link
            key={hero.id}
            href={`/work/${hero.id}`}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className={`p-1 rounded-full bg-linear-to-br ${hero.gradient}`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-white/70 group-hover:text-white transition-colors">
              {hero.highlight}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

// Animated letter component
function AnimatedLetter({
  char,
  index,
  total: _total,
}: Readonly<{ char: string; index: number; total: number }>) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.5 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

export function Entrance() {
  const hasEntered = useViewStore((state) => state.hasEntered)
  const enter = useViewStore((state) => state.enter)
  const setWarpingIn = useViewStore((state) => state.setWarpingIn)
  const [isEntering, setIsEntering] = useState(false)

  // Skip entrance on repeat visits or deep links
  useEffect(() => {
    if (globalThis.window && !hasEntered) {
      const hasVisited = localStorage.getItem('ea-has-visited')
      const deepLinkId = new URLSearchParams(window.location.search).get('p')
      if (hasVisited || (deepLinkId && getProjectById(deepLinkId))) {
        if (deepLinkId && getProjectById(deepLinkId)) {
          localStorage.setItem('ea-has-visited', 'true')
        }
        enter()
      }
    }
  }, [hasEntered, enter])

  const handleEnter = () => {
    setIsEntering(true)
    // Mark as visited for future sessions
    if (globalThis.window) {
      localStorage.setItem('ea-has-visited', 'true')
    }
    // Start hyperspace warp immediately, enter the galaxy after brief transition
    setWarpingIn(true)
    setTimeout(() => {
      enter()
      setWarpingIn(false)
    }, 600)
  }

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: 'blur(30px)',
          }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center overflow-y-auto"
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-3 sm:gap-7 lg:gap-10 px-4 py-4 sm:py-8 min-h-full w-full max-w-2xl mx-auto justify-center shrink-0">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-[10px] sm:text-[11px] tracking-[0.28em] sm:tracking-[0.32em] font-medium uppercase text-white/50">
                Proof-first · {FAST_TRACK_IDS.length} flags to plant · full catalog on /work
              </span>
            </motion.div>

            {/* Main title with letter animation */}
            <div className="space-y-3 sm:space-y-4">
              <div
                className="text-[2.15rem] sm:text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.03em]"
                aria-hidden="true"
              >
                <div className="overflow-hidden pb-1 flex items-center justify-center gap-2 sm:gap-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-[var(--color-text-primary)] shrink-0"
                  />
                  <span className="whitespace-nowrap text-white">
                    {FIRST_NAME_LETTERS.map((letter) => (
                      <AnimatedLetter
                        key={letter.id}
                        char={letter.char}
                        index={letter.index}
                        total={FIRST_NAME_LETTERS.length}
                      />
                    ))}
                  </span>
                </div>
                <div className="overflow-hidden pb-1">
                  <span className="text-white/92">
                    {LAST_NAME_LETTERS.map((letter) => (
                      <AnimatedLetter
                        key={letter.id}
                        char={letter.char}
                        index={FIRST_NAME_LETTERS.length + letter.index}
                        total={LAST_NAME_LETTERS.length}
                      />
                    ))}
                  </span>
                </div>
              </div>

              {/* Enhanced gradient line under name */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-full max-w-md mx-auto bg-[var(--color-border)]"
              />
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-[var(--color-text-secondary)] text-base md:text-lg font-light tracking-[0.005em] max-w-[22rem] sm:max-w-xl mx-auto leading-relaxed"
            >
              {SCENE_PROJECT_IDS.length} flagship systems in the galaxy. Full catalog on /work.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.72 }}
              className="max-w-md text-[11px] sm:text-xs leading-relaxed text-white/36 italic md:max-w-lg"
            >
              {SITE.narrativeThesis}
            </motion.p>

            {/* Primary action first — clearest path into the experience */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.82, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4 sm:gap-5 w-full"
            >
              <button
                type="button"
                onClick={handleEnter}
                className="group inline-flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-text-primary)] px-8 py-3.5 sm:px-12 sm:py-5 text-[13px] sm:text-sm font-semibold tracking-[0.12em] uppercase text-black transition-colors duration-150 hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                {isEntering ? (
                  <span>Launching...</span>
                ) : (
                  <>
                    <span>Enter the map</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                <Link
                  href="/work"
                  className="text-[11px] tracking-[0.2em] text-white/85 hover:text-white transition-colors uppercase flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/25 hover:border-white/50 hover:bg-white/10"
                >
                  Browse the full index →
                </Link>
                <a
                  href="/resume/elizabeth-stein-resume.pdf"
                  download="Elizabeth_Stein_Resume.pdf"
                  className="text-[11px] tracking-[0.2em] text-white/85 hover:text-white transition-colors uppercase flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/25 hover:border-white/50 hover:bg-white/10"
                >
                  Download resume
                </a>
                <button
                  type="button"
                  onClick={handleEnter}
                  className="text-[11px] tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase underline-offset-4 hover:underline"
                >
                  Skip intro
                </button>
              </div>
            </motion.div>

            {/* Featured — proof points without scrolling past the CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 2.02, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1 text-center w-full"
            >
              <p className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.3em] text-white/30 uppercase mb-2">
                Featured systems
              </p>
              <HeroProjectsQuick />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 2.18, ease: [0.22, 1, 0.36, 1] }}
              className="entrance-editorial-panel w-full max-w-3xl rounded-lg px-4 py-3.5 sm:px-5 sm:py-5 md:px-7 md:py-6"
            >
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-center">
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-left sm:grid-cols-3 md:min-w-76">
                  {GALAXY_MARKERS.map((marker) => (
                    <div
                      key={marker.label}
                      className="entrance-galaxy-chip rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white/65"
                      data-tone={marker.tone}
                    >
                      <span className="entrance-galaxy-chip-dot mr-2 inline-block h-1.5 w-1.5 rounded-full" />
                      {marker.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
