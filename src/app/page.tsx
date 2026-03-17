'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'
import { useViewStore } from '@/lib/store'
import { DeepLinkHandler } from '@/components/ui/DeepLinkHandler'
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation'
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { AnimatedText, FadeIn } from '@/components/ui/AnimatedText'
import { InteractiveParticles } from '@/components/ui/InteractiveParticles'
import { RippleEffect } from '@/components/ui/RippleEffect'
import { SoundManager } from '@/components/ui/SoundManager'
import { TouchGestures } from '@/components/ui/TouchGestures'
import { GlowOrb } from '@/components/ui/FloatingElement'
import { ContactSection } from '@/components/ui/ContactSection'
import { ResumeDownload } from '@/components/ui/ResumeDownload'
import { Entrance } from '@/components/ui/Entrance'
import { StickyContactCTA } from '@/components/ui/StickyContactCTA'
import { LoadingProgress } from '@/components/ui/LoadingProgress'
import { StatsBar } from '@/components/ui/StatsBar'
import { ScreenReaderAnnouncer } from '@/components/ui/ScreenReaderAnnouncer'
import { AccessibleView, AccessibleViewToggle, useAccessibleView } from '@/components/ui/AccessibleView'
import { GalaxyHint } from '@/components/ui/GalaxyHint'

// Lazy load 3D scene - critical for < 200KB landing bundle
const GalaxyScene = dynamic(() => import('@/components/3d/GalaxyScene'), {
  ssr: false,
  loading: () => <LoadingProgress />,
})
// Lazy load heavy/modal components for better initial load
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette').then(m => ({ default: m.CommandPalette })), { ssr: false })
const ProjectModal = dynamic(() => import('@/components/ui/ProjectModal').then(m => ({ default: m.ProjectModal })), { ssr: false })
const GalaxyGuide = dynamic(() => import('@/components/ui/GalaxyGuide').then(m => ({ default: m.GalaxyGuide })), { ssr: false })
const ExplorationOverlay = dynamic(() => import('@/components/ui/ExplorationOverlay').then(m => ({ default: m.ExplorationOverlay })), { ssr: false })
const MorphingShape = dynamic(() => import('@/components/ui/MorphingShape').then(m => ({ default: m.MorphingShape })), { ssr: false })

function getVisibilityClasses(isJourneyMode: boolean, hasEntered: boolean): string {
  if (isJourneyMode) return 'opacity-0 pointer-events-none'
  if (hasEntered) return 'opacity-100 translate-y-0'
  return 'opacity-0 translate-y-4'
}

export default function HomePage() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const hasEntered = useViewStore((state) => state.hasEntered)
  const { isAccessibleMode, toggle: toggleAccessibleMode } = useAccessibleView()

  // Render accessible text-only view if user prefers it
  if (isAccessibleMode) {
    return (
      <>
        <AccessibleViewToggle isAccessibleMode={isAccessibleMode} onToggle={toggleAccessibleMode} />
        <AccessibleView />
      </>
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Accessible View Toggle */}
      <AccessibleViewToggle isAccessibleMode={isAccessibleMode} onToggle={toggleAccessibleMode} />

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
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

      {/* Contact & Social Links */}
      <ContactSection />

      {/* Resume Download */}
      <ResumeDownload />

      {/* Sticky Contact CTA */}
      <StickyContactCTA />

      {/* Hidden handlers */}
      <Suspense fallback={null}>
        <DeepLinkHandler />
        <ProjectModal />
      </Suspense>
      <KeyboardNavigation />
      <ScreenReaderAnnouncer />
      <PerformanceMonitor />
      <KeyboardShortcutsHelp />

      {/* Decorative Background Elements */}
      <div aria-hidden="true">
        <MorphingShape />
        {/* Ambient Glow Orbs - Responsive sizing */}
        <div className="hidden md:block">
          <GlowOrb color="#6366F1" size={300} x={20} y={30} />
          <GlowOrb color="#A855F7" size={250} x={80} y={60} />
          <GlowOrb color="#EC4899" size={200} x={50} y={80} />
        </div>
        <div className="md:hidden">
          <GlowOrb color="#6366F1" size={120} x={15} y={25} />
          <GlowOrb color="#A855F7" size={100} x={85} y={55} />
          <GlowOrb color="#EC4899" size={80} x={50} y={80} />
        </div>
      </div>

      {/* Interactive Particles Layer */}
      <InteractiveParticles count={50} />

      {/* Header Overlay - Top Left (hidden during tour) */}
      <header id="main-content" tabIndex={-1} className={`absolute top-4 left-4 md:top-8 md:left-8 z-10 pointer-events-none transition-all duration-500 ${isJourneyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="glass-card rounded-2xl p-4 md:p-6 max-w-md lg:max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight drop-shadow-2xl flex items-center gap-2 md:gap-3">
            {/* Star icon */}
            <span className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 shrink-0 inline-flex items-center justify-center">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Available for hire
              </span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-md leading-relaxed mb-3 drop-shadow-lg">
              Full-stack developer + design systems + AI integration
            </p>
            <div className="flex items-center gap-3 pointer-events-auto flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center min-h-11 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors duration-200 drop-shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
              >
                Let's Talk
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center min-h-11 px-3 py-2 text-sm text-white/90 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 drop-shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
              >
                About me
              </Link>
            </div>
            <StatsBar />
          </FadeIn>
        </div>
      </header>

      {/* Quick Actions - Bottom Center (hidden during tour) */}
      <div className={`absolute bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3 items-center transition-all duration-500 ${getVisibilityClasses(isJourneyMode, hasEntered)}`}>
        <Link
          href="/work"
          className="ripple-button group w-full md:w-auto rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 text-white font-semibold hover:bg-white/30 hover:border-white/60 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 pointer-events-auto flex items-center justify-center gap-2 px-5 py-3"
        >
          <span className="whitespace-nowrap leading-none text-sm">View all work</span>
          <span className="inline-block transition-transform group-hover:translate-x-1 leading-none text-sm">→</span>
        </Link>
      </div>

      {/* AI Galaxy Guide */}
      <GalaxyGuide />

      {/* First-visit galaxy navigation hint — auto-dismisses, centered bottom, no positional conflicts */}
      <GalaxyHint />

      {/* Entrance Overlay - MUST BE LAST to sit on top of everything until dismissed */}
      <Entrance />
    </main>
  )
}
