'use client'

import { useViewStore } from '@/lib/store'
import { useEffect, useRef } from 'react'

const GALAXY_ORDER = ['enterprise', 'ai', 'fullstack', 'devtools', 'design', 'experimental']
const MIN_SWIPE_DISTANCE = 50
const MAX_SWIPE_TIME = 500
const MIN_SWIPE_VELOCITY = 0.3
const MAX_JOURNEY_STOPS = 6

function emitGestureFeedback(
  element: HTMLDivElement | null,
  direction: 'left' | 'right' | 'down',
  label: string,
) {
  if (!element) return

  element.dataset.direction = direction
  element.dataset.visible = 'true'
  element.textContent = label

  globalThis.setTimeout(() => {
    if (element) {
      element.dataset.visible = 'false'
    }
  }, 420)
}

function isHorizontalSwipe(deltaX: number, deltaY: number, deltaTime: number): boolean {
  const absX = Math.abs(deltaX)
  const absY = Math.abs(deltaY)
  const velocity = absX / deltaTime

  return (
    absX > absY &&
    absX > MIN_SWIPE_DISTANCE &&
    (deltaTime < MAX_SWIPE_TIME || velocity > MIN_SWIPE_VELOCITY)
  )
}

function isDownSwipe(deltaX: number, deltaY: number): boolean {
  const absX = Math.abs(deltaX)
  const absY = Math.abs(deltaY)
  return absY > MIN_SWIPE_DISTANCE * 2 && absY > absX && deltaY > 0
}

export function TouchGestures() {
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const reset = useViewStore((state) => state.reset)
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)

  // Journey mode state
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const nextJourneyStop = useViewStore((state) => state.nextJourneyStop)
  const prevJourneyStop = useViewStore((state) => state.prevJourneyStop)
  const journeyStep = useViewStore((state) => state.journeyStep)
  const endJourney = useViewStore((state) => state.endJourney)

  // Ref to track swipe state
  const swipeRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
  })
  const feedbackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const showFeedback = (direction: 'left' | 'right' | 'down', label: string) => {
      emitGestureFeedback(feedbackRef.current, direction, label)
    }

    const handleJourneySwipe = (deltaX: number): boolean => {
      if (!isJourneyMode) return false

      if (deltaX < 0 && journeyStep < MAX_JOURNEY_STOPS - 1) {
        nextJourneyStop()
      } else if (deltaX > 0 && journeyStep > 0) {
        prevJourneyStop()
      }

      return true
    }

    const handleGalaxySwipe = (deltaX: number) => {
      if (view !== 'galaxy' || !selectedGalaxy) return

      const currentIndex = GALAXY_ORDER.indexOf(selectedGalaxy)
      if (currentIndex === -1) return

      if (deltaX > 0 && currentIndex > 0) {
        zoomToGalaxy(GALAXY_ORDER[currentIndex - 1])
        showFeedback('right', 'Previous galaxy')
      } else if (deltaX < 0 && currentIndex < GALAXY_ORDER.length - 1) {
        zoomToGalaxy(GALAXY_ORDER[currentIndex + 1])
        showFeedback('left', 'Next galaxy')
      }
    }

    const handleDownwardSwipe = () => {
      if (isJourneyMode) {
        endJourney()
        showFeedback('down', 'Exit tour')
        return
      }

      if (view === 'galaxy' || view === 'project') {
        reset()
        showFeedback('down', 'Zoom out')
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      swipeRef.current = {
        startX: e.changedTouches[0].screenX,
        startY: e.changedTouches[0].screenY,
        startTime: Date.now(),
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX
      const touchEndY = e.changedTouches[0].screenY
      const touchEndTime = Date.now()

      const deltaX = touchEndX - swipeRef.current.startX
      const deltaY = touchEndY - swipeRef.current.startY
      const deltaTime = touchEndTime - swipeRef.current.startTime

      if (isHorizontalSwipe(deltaX, deltaY, deltaTime)) {
        if (handleJourneySwipe(deltaX)) {
          return
        }

        handleGalaxySwipe(deltaX)
      }

      if (isDownSwipe(deltaX, deltaY)) {
        handleDownwardSwipe()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [
    view,
    selectedGalaxy,
    zoomToGalaxy,
    reset,
    isJourneyMode,
    nextJourneyStop,
    prevJourneyStop,
    journeyStep,
    endJourney,
  ])

  return (
    <div
      ref={feedbackRef}
      className="touch-gesture-feedback fixed left-1/2 top-20 z-60 -translate-x-1/2 rounded-full border border-white/10 bg-black/75 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl"
      data-visible="false"
      data-direction="left"
      aria-hidden="true"
    />
  )
}
