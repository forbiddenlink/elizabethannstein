'use client'

import { galaxies, narrativeTours } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Touch target minimum size (44x44px for accessibility)
const TOUCH_TARGET_SIZE = 'min-h-11 min-w-11'

function getGalaxyShortLabel(galaxyId: string, galaxyName: string): string {
  if (galaxyId === 'ai') return 'AI'
  if (galaxyId === 'experimental') return 'Lab'
  return galaxyName.split(' ')[0]
}

function getTourTone(tourId: string): string {
  switch (tourId) {
    case 'ai-breakthroughs':
      return 'ai'
    case 'creative-tech':
      return 'creative'
    case 'enterprise-impact':
      return 'enterprise'
    default:
      return 'default'
  }
}

function getGalaxyTone(galaxyId: string): string {
  switch (galaxyId) {
    case 'enterprise':
      return 'enterprise'
    case 'ai':
      return 'ai'
    case 'fullstack':
      return 'fullstack'
    case 'devtools':
      return 'devtools'
    case 'design':
      return 'creative'
    case 'experimental':
      return 'experimental'
    default:
      return 'default'
  }
}

export function MobileGalaxyNav() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const startJourney = useViewStore((state) => state.startJourney)
  const [activeTab, setActiveTab] = useState<'galaxies' | 'tours'>('galaxies')

  const hasEntered = useViewStore((state) => state.hasEntered)
  const panelOpen = activeTab === 'tours'

  // Hide during exploration mode, journey mode, and before entrance
  if (view === 'exploration' || isJourneyMode || !hasEntered) return null

  return (
    <>
      {/* Bottom Navigation Bar - positioned in thumb-friendly zone (bottom 40% of screen) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        {/* Safe area padding for devices with home indicators */}
        <div className="pb-safe">
          {/* Glass morphism background */}
          <div className="mobile-galaxy-nav-shell absolute inset-0" />

          {/* Top border glow */}
          <div className="mobile-galaxy-nav-border absolute top-0 left-0 right-0 h-px" />

          {/* Tab Switcher */}
          <div className="relative px-4 pt-3">
            <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('galaxies')
                }}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                  TOUCH_TARGET_SIZE,
                  activeTab === 'galaxies'
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/60 active:bg-white/10',
                )}
              >
                Galaxies
              </button>
              <button
                onClick={() => {
                  setActiveTab('tours')
                }}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                  TOUCH_TARGET_SIZE,
                  activeTab === 'tours'
                    ? 'bg-linear-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 shadow-lg'
                    : 'text-white/60 active:bg-white/10',
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Tours
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'galaxies' ? (
              <motion.nav
                key="galaxies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative px-2 py-3"
              >
                {/* Galaxy Grid - 2 rows for thumb reach */}
                <div className="grid grid-cols-4 gap-2 px-2">
                  {/* All Galaxies */}
                  <button
                    onClick={reset}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-200',
                      TOUCH_TARGET_SIZE,
                      view === 'universe'
                        ? 'bg-white/20 scale-105 shadow-lg'
                        : 'bg-white/5 active:scale-95 active:bg-white/15',
                    )}
                    aria-label="View all galaxies"
                  >
                    <div
                      className={cn(
                        'mobile-galaxy-nav-dot w-4 h-4 rounded-full bg-white shadow-lg',
                        view === 'universe' && 'animate-pulse',
                      )}
                    />
                    <span className="text-xs font-medium text-white/90">All</span>
                  </button>

                  {/* Galaxy buttons */}
                  {galaxies.map((galaxy) => (
                    <button
                      key={galaxy.id}
                      onClick={() => zoomToGalaxy(galaxy.id)}
                      className={cn(
                        'flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-200',
                        TOUCH_TARGET_SIZE,
                        selectedGalaxy === galaxy.id
                          ? 'bg-white/20 scale-105 shadow-lg'
                          : 'bg-white/5 active:scale-95 active:bg-white/15',
                      )}
                      aria-label={`View ${galaxy.name}`}
                    >
                      <div
                        className={cn(
                          'mobile-galaxy-nav-dot w-4 h-4 rounded-full shadow-lg transition-all duration-200',
                          selectedGalaxy === galaxy.id && 'animate-pulse scale-110',
                        )}
                        data-tone={getGalaxyTone(galaxy.id)}
                        data-active={selectedGalaxy === galaxy.id ? 'true' : 'false'}
                      />
                      <span className="text-xs font-medium text-white/90 truncate max-w-full">
                        {getGalaxyShortLabel(galaxy.id, galaxy.name)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.nav>
            ) : (
              <motion.div
                key="tours"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative px-4 py-3"
              >
                {/* Tours List - Scrollable with large touch targets */}
                <div className="flex flex-col gap-2 max-h-50 overflow-y-auto scrollbar-hide">
                  {/* Default Galaxy Tour */}
                  <button
                    onClick={() => startJourney()}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl bg-white/5 transition-all duration-200',
                      'active:scale-[0.98] active:bg-white/10',
                      TOUCH_TARGET_SIZE,
                    )}
                  >
                    <span className="text-2xl" role="img" aria-label="Galaxy icon">
                      🌌
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">Galaxy Overview</div>
                      <div className="text-sm text-white/60">
                        Visit each galaxy&apos;s highlights
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Narrative Tours */}
                  {narrativeTours.map((tour) => (
                    <button
                      key={tour.id}
                      onClick={() => startJourney(tour.id)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl bg-white/5 transition-all duration-200',
                        'active:scale-[0.98] active:bg-white/10',
                        TOUCH_TARGET_SIZE,
                      )}
                    >
                      <span className="text-2xl" role="img" aria-label={`${tour.name} icon`}>
                        {tour.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div
                          className="font-medium mobile-tour-label"
                          data-tone={getTourTone(tour.id)}
                        >
                          {tour.name}
                        </div>
                        <div className="text-sm text-white/60">{tour.tagline}</div>
                      </div>
                      <svg
                        className="w-5 h-5 text-white/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-42 z-30 mx-auto h-8 w-44 rounded-full bg-linear-to-r from-indigo-500/0 via-indigo-400/20 to-fuchsia-400/0 blur-2xl transition-opacity duration-300 lg:hidden',
          panelOpen ? 'opacity-100' : 'opacity-45',
        )}
        aria-hidden="true"
      />

      {/* Swipe hint indicator - shows briefly on first visit */}
      <SwipeHint />
    </>
  )
}

// Swipe hint component for first-time users
function SwipeHint() {
  const [showHint, setShowHint] = useState(false)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  const shouldShowHint = view === 'galaxy' && Boolean(selectedGalaxy)

  // Show hint when user is in galaxy view
  useEffect(() => {
    if (shouldShowHint) {
      const hasSeenHint = localStorage.getItem('mobile-swipe-hint-seen')
      if (!hasSeenHint) {
        setShowHint(true)
        const timer = setTimeout(() => {
          setShowHint(false)
          localStorage.setItem('mobile-swipe-hint-seen', 'true')
        }, 4000)
        return () => clearTimeout(timer)
      }
    }
  }, [shouldShowHint])

  useEffect(() => {
    if (shouldShowHint) return
    setShowHint(false)
  }, [shouldShowHint])

  if (!showHint) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 lg:hidden pointer-events-none"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/10">
        <motion.div
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/60"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </motion.div>
        <span className="text-sm text-white/80">Swipe to switch galaxies</span>
      </div>
    </motion.div>
  )
}
