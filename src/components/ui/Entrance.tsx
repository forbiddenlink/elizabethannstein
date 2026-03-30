'use client'

import { MagneticButton } from '@/components/ui/MagneticButton'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { getProjectById } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Brain, Building2, Code2, Rocket, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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

// Seeded random for consistent star positions (fixes hydration mismatch)
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Generate star particles for background
function StarParticles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 1) * 100,
        y: seededRandom(i * 2) * 100,
        size: seededRandom(i * 3) * 2 + 0.5,
        delay: seededRandom(i * 4) * 3,
        duration: 2 + seededRandom(i * 5) * 3,
      })),
    [],
  )

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 0.8, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Hero projects for quick scan
const heroProjects = [
  {
    id: 'chronicle',
    highlight: 'Rust AI observability',
    icon: Brain,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'autodocs-ai',
    highlight: 'Product Hunt launch',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'timeslip-search',
    highlight: '$750 contest win',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'hire-ready',
    highlight: 'Voice AI SaaS',
    icon: Code2,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'coulson-one',
    highlight: '64K+ files',
    icon: Building2,
    gradient: 'from-orange-500 to-red-600',
  },
]

function HeroProjectsQuick() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.2 }}
      className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto"
    >
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
    </motion.div>
  )
}

// Animated letter component
function AnimatedLetter({
  char,
  index,
  total,
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

  // Skip entrance on repeat visits
  useEffect(() => {
    if (globalThis.window && !hasEntered) {
      const hasVisited = localStorage.getItem('ea-has-visited')
      if (hasVisited) {
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
    // Start hyperspace warp immediately, enter the galaxy after 1.4s
    setWarpingIn(true)
    setTimeout(() => {
      enter()
      setWarpingIn(false)
    }, 1400)
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
          className="fixed inset-0 z-100 bg-black flex flex-col items-center overflow-y-auto"
        >
          {/* Animated star particles */}
          <StarParticles />

          {/* Multiple gradient layers for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-950/40 via-purple-950/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(99,102,241,0.05)_60deg,transparent_120deg)] pointer-events-none" />

          {/* Animated rings */}
          <motion.div
            className="absolute w-150 h-150 md:w-200 md:h-200 rounded-full border border-white/5"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-100 h-100 md:w-150 md:h-150 rounded-full border border-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-50 h-50 md:w-100 md:h-100 rounded-full border border-indigo-500/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-3 sm:gap-7 lg:gap-10 px-4 py-4 sm:py-8 min-h-full w-full max-w-2xl mx-auto justify-center shrink-0">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-2 sm:gap-3 text-indigo-400/80"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.3em] font-light uppercase">
                Full-Stack Developer Portfolio
              </span>
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Main title with letter animation */}
            <div className="space-y-3 sm:space-y-4">
              <div
                className="text-[2.15rem] sm:text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.05em] sm:tracking-tighter"
                aria-hidden="true"
              >
                <div className="overflow-hidden pb-1 flex items-center justify-center gap-2 sm:gap-4">
                  {/* Decorative star icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 shrink-0"
                  >
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 animate-pulse" />
                    <div className="absolute inset-0.5 sm:inset-1 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
                    <div className="absolute inset-1 sm:inset-1.5 rounded-full bg-white/80" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <span className="whitespace-nowrap bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
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
                  <span className="bg-linear-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
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
                transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-0.75 w-full max-w-lg mx-auto bg-linear-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-white/72 text-[14px] md:text-[1.15rem] font-light tracking-[0.01em] max-w-[22rem] sm:max-w-xl mx-auto leading-relaxed"
            >
              Portfolio systems for teams, products, and AI-native experiences.
              <br />
              <span className="hidden sm:inline text-white/40 text-sm md:text-base">
                Designed to feel cinematic on first contact and rigorous on every deeper read.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.68 }}
              className="entrance-editorial-panel w-full max-w-3xl rounded-4xl px-4 py-3.5 sm:px-5 sm:py-5 md:px-7 md:py-6"
            >
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl text-left">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.26em] sm:tracking-[0.32em] text-white/35 mb-2 sm:mb-3">
                    What You’re Entering
                  </p>
                  <p className="text-[13px] sm:text-sm md:text-base leading-relaxed text-white/68">
                    A spatial portfolio organized like a star map: each galaxy groups a body of
                    work, each project opens as a detailed system, and the flow is built to reward
                    curiosity without losing clarity.
                  </p>
                </div>
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

            {/* Galaxy metaphor explainer — hidden on very small phones to save space */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.75 }}
              className="hidden sm:flex flex-col items-center gap-3"
            >
              <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/30">
                Built for recruiters, collaborators, and design-conscious technical teams.
              </div>
              <p className="text-[11px] tracking-[0.15em] text-white/25 uppercase">
                Click any star to see that project · Arrow keys to navigate
              </p>
            </motion.div>

            {/* Enter button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="mt-0.5 sm:mt-4"
            >
              <MagneticButton
                strength={0.5}
                glowOnHover
                onClick={handleEnter}
                className="entrance-launch-button group relative px-9 py-3.5 sm:px-14 sm:py-6 md:px-16 md:py-7 rounded-[1.75rem] overflow-hidden transition-all duration-500"
              >
                {/* Animated border shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10 flex items-center gap-3 sm:gap-4 text-white font-semibold tracking-[0.11em] sm:tracking-[0.15em] text-[13px] md:text-base">
                  {isEntering ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      LAUNCHING...
                    </motion.span>
                  ) : (
                    <>
                      <ScrambleText className="tracking-[0.15em] inline-block min-w-[13ch]">
                        VIEW MY WORK
                      </ScrambleText>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </span>
              </MagneticButton>
            </motion.div>

            {/* Featured Work — visible on all devices for recruiter visibility */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
              className="mt-1 text-center w-full"
            >
              <p className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.3em] text-white/30 uppercase mb-2">
                Featured Work
              </p>
              <HeroProjectsQuick />
            </motion.div>

            {/* Quick actions - appear immediately for impatient users */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-3 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-6"
            >
              <Link
                href="/work"
                className="text-[11px] tracking-[0.2em] text-white/55 hover:text-white/85 transition-colors uppercase flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5"
              >
                View All Projects →
              </Link>
              <button
                onClick={handleEnter}
                className="text-[11px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors uppercase"
              >
                Skip intro
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
