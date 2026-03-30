'use client'

import {
  AccessibleView,
  AccessibleViewToggle,
  useAccessibleView,
} from '@/components/ui/AccessibleView'
import { AnimatedText, FadeIn } from '@/components/ui/AnimatedText'
import { DeepLinkHandler } from '@/components/ui/DeepLinkHandler'
import { Entrance } from '@/components/ui/Entrance'
import { GlowOrb } from '@/components/ui/FloatingElement'
import { GalaxyHint } from '@/components/ui/GalaxyHint'
import { InteractiveParticles } from '@/components/ui/InteractiveParticles'
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { LoadingProgress } from '@/components/ui/LoadingProgress'
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor'
import { RippleEffect } from '@/components/ui/RippleEffect'
import { ScreenReaderAnnouncer } from '@/components/ui/ScreenReaderAnnouncer'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { SoundManager } from '@/components/ui/SoundManager'
import { StatsBar } from '@/components/ui/StatsBar'
import { TouchGestures } from '@/components/ui/TouchGestures'
import { useViewStore } from '@/lib/store'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

// Lazy load 3D scene - critical for < 200KB landing bundle
const GalaxyScene = dynamic(() => import('@/components/3d/GalaxyScene'), {
  ssr: false,
  loading: () => <LoadingProgress />,
})
// Lazy load heavy/modal components for better initial load
const CommandPalette = dynamic(
  () => import('@/components/ui/CommandPalette').then((m) => ({ default: m.CommandPalette })),
  { ssr: false },
)
const ProjectModal = dynamic(
  () => import('@/components/ui/ProjectModal').then((m) => ({ default: m.ProjectModal })),
  { ssr: false },
)
const GalaxyGuide = dynamic(
  () => import('@/components/ui/GalaxyGuide').then((m) => ({ default: m.GalaxyGuide })),
  { ssr: false },
)
const ExplorationOverlay = dynamic(
  () =>
    import('@/components/ui/ExplorationOverlay').then((m) => ({ default: m.ExplorationOverlay })),
  { ssr: false },
)
const MorphingShape = dynamic(
  () => import('@/components/ui/MorphingShape').then((m) => ({ default: m.MorphingShape })),
  { ssr: false },
)

function getVisibilityClasses(isJourneyMode: boolean, hasEntered: boolean): string {
  if (isJourneyMode) return 'opacity-0 pointer-events-none'
  if (hasEntered) return 'opacity-100 translate-y-0'
  return 'opacity-0 translate-y-4'
}

export default function HomePage() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const hasEntered = useViewStore((state) => state.hasEntered)
  const view = useViewStore((state) => state.view)
  const { isAccessibleMode, toggle: toggleAccessibleMode, autoEnabled } = useAccessibleView()
  const heroVisibility = getVisibilityClasses(isJourneyMode, hasEntered)
  const isUniverseView = view === 'universe'

  // Render accessible text-only view if user prefers it
  if (isAccessibleMode) {
    return (
      <>
        <AccessibleViewToggle
          isAccessibleMode={isAccessibleMode}
          onToggle={toggleAccessibleMode}
          autoEnabled={autoEnabled}
        />
        <AccessibleView />
      </>
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Accessible View Toggle */}
      <AccessibleViewToggle
        isAccessibleMode={isAccessibleMode}
        onToggle={toggleAccessibleMode}
        autoEnabled={autoEnabled}
      />

      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Fullscreen 3D Scene - MUST BE FIRST for proper z-index */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <GalaxyScene />
      </div>

      {/* Ripple Effect */}
      <RippleEffect />

      {/* Sound Manager */}
      <SoundManager />

      {/* Touch Gestures */}
      <TouchGestures />

      {/* Command Palette (CMD+K) */}
      <CommandPalette />

      {/* Exploration Mode Overlay */}
      <ExplorationOverlay />

      {/* Hidden handlers */}
      <Suspense fallback={null}>
        <DeepLinkHandler />
        <ProjectModal />
      </Suspense>
      <KeyboardNavigation />
      <ScreenReaderAnnouncer />
      <PerformanceMonitor />
      <KeyboardShortcutsHelp />

      {/* Decorative Background Elements — pushed to right side to avoid header overlap */}
      <div aria-hidden="true">
        <MorphingShape />
        {/* Ambient Glow Orbs - positioned away from header card */}
        <div className="hidden md:block">
          <GlowOrb color="#6366F1" size={140} x={65} y={15} />
          <GlowOrb color="#A855F7" size={120} x={85} y={50} />
          <GlowOrb color="#EC4899" size={100} x={55} y={80} />
        </div>
        <div className="md:hidden">
          <GlowOrb color="#6366F1" size={50} x={75} y={15} />
          <GlowOrb color="#A855F7" size={40} x={85} y={50} />
        </div>
      </div>

      {/* Interactive Particles Layer */}
      <InteractiveParticles count={50} />

      {/* Header Overlay - Top Left (hidden during tour and before entrance) */}
      <header
        id="main-content"
        tabIndex={-1}
        className={`absolute left-4 right-4 top-4 z-10 pointer-events-none transition-all duration-700 md:top-8 md:left-8 md:right-auto ${heroVisibility}`}
      >
        <div className="glass-card max-w-lg rounded-[1.75rem] p-4 sm:p-5 md:p-6 lg:max-w-xl">
          <h1 className="mb-2 flex items-center gap-2 text-[1.75rem] leading-none font-black tracking-tight drop-shadow-2xl sm:text-4xl md:mb-3 md:gap-3 md:text-5xl lg:text-6xl">
            {/* Star icon */}
            <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center sm:h-8 sm:w-8 md:h-10 md:w-10">
              <span className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 animate-pulse" />
              <span className="absolute inset-0.5 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
              <span className="absolute inset-1 rounded-full bg-white/80" />
            </span>
            <span className="text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <AnimatedText type="chars" stagger={0.05}>
                Elizabeth Stein
              </AnimatedText>
            </span>
          </h1>
          <FadeIn delay={0.8} direction="up">
            {/* Available badge */}
            <div className="mb-2 flex items-center gap-2 md:mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300 md:px-3 md:text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{'Available for hire'}</span>
              </span>
            </div>
            <p className="mb-3 max-w-md text-sm leading-relaxed text-white/82 drop-shadow-lg sm:text-base md:text-xl md:text-white/90">
              I build fast, beautiful web apps with thoughtful UX and solid engineering
            </p>
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center rounded-lg bg-purple-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-200 drop-shadow-md hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 md:min-h-11 md:px-4"
              >
                Let's Talk
              </Link>
              <a
                href="/resume/elizabeth-stein-resume.pdf"
                download="Elizabeth_Stein_Resume.pdf"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/85 transition-colors duration-200 drop-shadow-md hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 md:min-h-11 md:text-sm md:text-white/90"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Resume
              </a>
              <Link
                href="/about"
                className="inline-flex min-h-10 items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/85 transition-colors duration-200 drop-shadow-md hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 md:min-h-11 md:text-white/90"
              >
                About
              </Link>
              <Link
                href="/work"
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 md:min-h-11 ${isUniverseView ? 'bg-white/12 text-white/90 hover:bg-white/18 hover:text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                aria-label="View all projects in list view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span className="sr-only sm:not-sr-only">List View</span>
              </Link>
              <a
                href="https://linkedin.com/in/imkindageeky"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hidden items-center justify-center rounded-lg p-2.5 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 lg:inline-flex"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/forbiddenlink"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hidden lg:inline-flex items-center justify-center p-2.5 text-white/70 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-3 md:mt-4">
              <StatsBar />
            </div>
          </FadeIn>
        </div>
      </header>

      {/* AI Galaxy Guide */}
      <GalaxyGuide />

      {/* First-visit galaxy navigation hint — auto-dismisses, centered bottom, no positional conflicts */}
      <GalaxyHint />

      {/* Entrance Overlay - MUST BE LAST to sit on top of everything until dismissed */}
      <Entrance />
    </main>
  )
}
