'use client'

import { useEffect, useState } from 'react'
import { useViewStore } from '@/lib/store'
import { HolographicProjectPanel } from './HolographicProjectPanel'

export function ExplorationOverlay() {
  const view = useViewStore((state) => state.view)
  const isLanding = useViewStore((state) => state.isLanding)
  const [showInstructions, setShowInstructions] = useState(true)
  const [_nearCrystal, _setNearCrystal] = useState(false)

  useEffect(() => {
    if (view === 'exploration' && !isLanding) {
      // Show instructions briefly after landing
      const timer = setTimeout(() => setShowInstructions(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [view, isLanding])

  if (view !== 'exploration') return null

  return (
    <>
      {/* Landing HUD */}
      {isLanding && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-medium text-white">Approaching the planet</div>
            <div className="mt-2 text-sm text-white/60">Landing</div>
          </div>
        </div>
      )}

      {/* Exploration Instructions */}
      {!isLanding && showInstructions && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-black/70 border border-white/15 rounded-lg px-8 py-6">
            <div className="text-white text-sm font-medium mb-4 text-center">
              Exploring the planet
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">
                  W
                </kbd>
                <span className="text-white/80">Forward</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">
                  S
                </kbd>
                <span className="text-white/80">Back</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">
                  A
                </kbd>
                <span className="text-white/80">Left</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">
                  D
                </kbd>
                <span className="text-white/80">Right</span>
              </div>
              <div className="flex items-center gap-3 col-span-2 justify-center">
                <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white">
                  ESC
                </kbd>
                <span className="text-white/80">Back to the galaxy</span>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/60">
              Click to move the camera. Look around for project details.
            </div>
          </div>
        </div>
      )}

      {/* Click to dismiss hint */}
      {!isLanding && showInstructions && (
        <button
          type="button"
          onClick={() => setShowInstructions(false)}
          className="fixed bottom-10 right-10 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg min-h-11 text-white/70 hover:text-white text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          Hide controls
        </button>
      )}

      {/* Holographic project panel - show after short delay */}
      <HolographicProjectPanel show={!isLanding && !showInstructions} />
    </>
  )
}
