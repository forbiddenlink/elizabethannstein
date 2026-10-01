'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { Scene3DErrorBoundary } from '@/components/ErrorBoundary'
import {
  AccessibleView,
  AccessibleViewToggle,
  useAccessibleView,
} from '@/components/ui/AccessibleView'
import { DeepLinkHandler } from '@/components/ui/DeepLinkHandler'
import { Entrance } from '@/components/ui/Entrance'
import { ExplorePanel } from '@/components/ui/ExplorePanel'
import { GalaxyHint } from '@/components/ui/GalaxyHint'
import { KeyboardNavigation } from '@/components/ui/KeyboardNavigation'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { LoadingProgress } from '@/components/ui/LoadingProgress'
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor'
import { RippleEffect } from '@/components/ui/RippleEffect'
import { ScreenReaderAnnouncer } from '@/components/ui/ScreenReaderAnnouncer'
import { SoundManager } from '@/components/ui/SoundManager'
import { TouchGestures } from '@/components/ui/TouchGestures'
import { useViewStore } from '@/lib/store'

// Lazy load 3D scene - critical for < 200KB landing bundle
const GalaxyScene = dynamic(() => import('@/components/3d/GalaxyScene'), {
  ssr: false,
  loading: () => <LoadingProgress />,
})
// Lazy load heavy/modal components for better initial load
const ProjectModal = dynamic(
  () => import('@/components/ui/ProjectModal').then((m) => ({ default: m.ProjectModal })),
  { ssr: false }
)
const GalaxyGuide = dynamic(
  () => import('@/components/ui/GalaxyGuide').then((m) => ({ default: m.GalaxyGuide })),
  { ssr: false }
)
const ExplorationOverlay = dynamic(
  () =>
    import('@/components/ui/ExplorationOverlay').then((m) => ({ default: m.ExplorationOverlay })),
  { ssr: false }
)
const MorphingShape = dynamic(
  () => import('@/components/ui/MorphingShape').then((m) => ({ default: m.MorphingShape })),
  { ssr: false }
)
const FirstVisitHints = dynamic(
  () => import('@/components/ui/FirstVisitHints').then((m) => ({ default: m.FirstVisitHints })),
  { ssr: false }
)
const PostTourCTA = dynamic(
  () => import('@/components/ui/PostTourCTA').then((m) => ({ default: m.PostTourCTA })),
  { ssr: false }
)
const HiringFastTrack = dynamic(
  () => import('@/components/ui/HiringFastTrack').then((m) => ({ default: m.HiringFastTrack })),
  { ssr: false }
)

// The full 3D galaxy — now an opt-in "explore all" experience at /explore.
// The editorial home at / is the front door; this is the maximalist flex.
export default function ExplorePage() {
  const hasEntered = useViewStore((state) => state.hasEntered)
  const { isAccessibleMode, toggle: toggleAccessibleMode, autoEnabled } = useAccessibleView()

  // Global "T" shortcut toggles the text-only accessible view. ScreenReaderAnnouncer
  // advertises this key to screen-reader users, so it must actually be wired.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 't' && e.key !== 'T') return
      const t = e.target as HTMLElement | null
      if (
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA' ||
        t?.tagName === 'SELECT' ||
        t?.isContentEditable
      )
        return
      e.preventDefault()
      toggleAccessibleMode()
    }
    globalThis.addEventListener('keydown', onKey)
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [toggleAccessibleMode])

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
    <main
      id="main-content"
      tabIndex={-1}
      className="relative w-full h-dvh overflow-hidden bg-black outline-none"
    >
      {/* Accessible View Toggle */}
      <AccessibleViewToggle
        isAccessibleMode={isAccessibleMode}
        onToggle={toggleAccessibleMode}
        autoEnabled={autoEnabled}
      />

      {/* Dev tools can inject attrs before hydrate */}
      <a
        href="#main-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-5 focus:py-2.5 focus:bg-white focus:text-black focus:rounded-xl focus:font-semibold focus:outline-none focus:ring-0"
      >
        Skip to main content
      </a>

      {/* Fullscreen 3D Scene - MUST BE FIRST for proper z-index */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Scene3DErrorBoundary maxRetries={3} retryDelay={2000}>
          <GalaxyScene />
        </Scene3DErrorBoundary>
      </div>

      {/* Ripple Effect */}
      <RippleEffect />

      {/* Sound Manager */}
      <SoundManager />

      {/* Touch Gestures */}
      <TouchGestures />

      {/* Command palette: global instance in root layout (CMD+K) */}

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

      <div aria-hidden="true">
        <MorphingShape />
      </div>

      {/* The only persistent chrome: name, one line, three links; collapses to a pill */}
      <ExplorePanel />

      {/* Galaxy Guide — after entrance so proof path stays first */}
      {hasEntered && <GalaxyGuide />}

      {/* Contextual first-visit hints — progressive onboarding for new visitors */}
      <FirstVisitHints />

      {/* First-visit galaxy navigation hint — auto-dismisses, centered bottom, no positional conflicts */}
      <GalaxyHint />

      {/* Post-tour CTA — shown after guided tour ends */}
      <PostTourCTA />

      {/* Hiring Fast Track — full-screen featured projects overlay */}
      <HiringFastTrack />

      {/* Entrance Overlay - MUST BE LAST to sit on top of everything until dismissed */}
      <Entrance />
    </main>
  )
}
