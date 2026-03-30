'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'
import { getGalaxyCenterPosition } from '@/lib/utils'
import { galaxies } from '@/lib/galaxyData'

// Easing functions for smooth animations
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

interface CameraKeyframe {
  position: THREE.Vector3
  target: THREE.Vector3
  fov: number
  duration: number
  easing?: (t: number) => number
}

// Cinematic intro sequence - dramatic fly-in from deep space
const INTRO_SEQUENCE: CameraKeyframe[] = [
  // Start: Far above and behind, looking down at the galaxies
  {
    position: new THREE.Vector3(0, 120, 180),
    target: new THREE.Vector3(0, 0, 0),
    fov: 35,
    duration: 0,
  },
  // Sweep down and forward
  {
    position: new THREE.Vector3(40, 60, 100),
    target: new THREE.Vector3(0, 0, 0),
    fov: 40,
    duration: 2.5,
    easing: easeOutCubic,
  },
  // Final position - standard overview
  {
    position: new THREE.Vector3(0, 20, 60),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
    duration: 2,
    easing: easeInOutQuart,
  },
]

// Galaxy tour - visit each galaxy with smooth transitions
function generateGalaxyTourSequence(): CameraKeyframe[] {
  const sequence: CameraKeyframe[] = []
  const cameraHeight = 18
  const cameraDistance = 32

  // Start from current overview
  sequence.push({
    position: new THREE.Vector3(0, 20, 60),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
    duration: 0,
  })

  // Visit each galaxy
  galaxies.forEach((galaxy, i) => {
    const [gx, gy, gz] = getGalaxyCenterPosition(i)

    // Approach angle varies per galaxy for visual interest
    const approachAngle = (i / galaxies.length) * Math.PI * 0.5
    const offsetX = Math.cos(approachAngle) * cameraDistance
    const offsetZ = Math.sin(approachAngle) * cameraDistance + cameraDistance

    sequence.push({
      position: new THREE.Vector3(gx + offsetX, gy + cameraHeight, gz + offsetZ),
      target: new THREE.Vector3(gx, gy, gz),
      fov: 50,
      duration: 2.5,
      easing: easeInOutQuart,
    })

    // Brief pause at each galaxy (hold position)
    sequence.push({
      position: new THREE.Vector3(gx + offsetX, gy + cameraHeight, gz + offsetZ),
      target: new THREE.Vector3(gx, gy, gz),
      fov: 50,
      duration: 1.5,
    })
  })

  // Return to overview
  sequence.push({
    position: new THREE.Vector3(0, 25, 65),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
    duration: 2,
    easing: easeInOutQuart,
  })

  return sequence
}

interface CinematicState {
  isPlaying: boolean
  currentSequence: CameraKeyframe[]
  keyframeIndex: number
  keyframeProgress: number
}

/**
 * Cinematic camera controller for intro and tour animations
 * Automatically plays intro when user first enters, provides tour functionality
 */
export function CinematicCamera({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree()
  const hasEntered = useViewStore((s) => s.hasEntered)
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)
  const endJourney = useViewStore((s) => s.endJourney)
  const setSelectedGalaxy = useViewStore((s) => s.selectGalaxy)

  const [hasPlayedIntro, setHasPlayedIntro] = useState(false)
  const cinematicState = useRef<CinematicState>({
    isPlaying: false,
    currentSequence: [],
    keyframeIndex: 0,
    keyframeProgress: 0,
  })

  const startPosition = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const startFov = useRef(45)

  // Start intro sequence when user enters
  useEffect(() => {
    if (hasEntered && !hasPlayedIntro) {
      // Small delay to let entrance animation complete
      const timer = setTimeout(() => {
        startSequence(INTRO_SEQUENCE)
        setHasPlayedIntro(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [hasEntered, hasPlayedIntro])

  // Start tour when tour mode is activated
  useEffect(() => {
    if (isJourneyMode) {
      startSequence(generateGalaxyTourSequence())
    }
  }, [isJourneyMode])

  const startSequence = (sequence: CameraKeyframe[]) => {
    if (sequence.length === 0) return

    const state = cinematicState.current
    state.isPlaying = true
    state.currentSequence = sequence
    state.keyframeIndex = 0
    state.keyframeProgress = 0

    // Set initial position from first keyframe
    const first = sequence[0]
    camera.position.copy(first.position)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = first.fov
      camera.updateProjectionMatrix()
    }
    camera.lookAt(first.target)

    // Disable orbit controls during cinematic
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }

    // Store start for interpolation to next keyframe
    if (sequence.length > 1) {
      startPosition.current.copy(first.position)
      startTarget.current.copy(first.target)
      startFov.current = first.fov
    }
  }

  const endSequence = () => {
    const state = cinematicState.current
    state.isPlaying = false
    state.currentSequence = []
    state.keyframeIndex = 0
    state.keyframeProgress = 0

    // Re-enable orbit controls
    if (controlsRef.current) {
      controlsRef.current.enabled = true
      controlsRef.current.update()
    }

    // End tour mode if it was a tour
    if (isJourneyMode) {
      endJourney()
    }
  }

  useFrame((_, delta) => {
    const state = cinematicState.current
    if (!state.isPlaying || state.currentSequence.length === 0) return

    const currentKeyframe = state.currentSequence[state.keyframeIndex]
    const nextIndex = state.keyframeIndex + 1

    // If this is the last keyframe, end the sequence
    if (nextIndex >= state.currentSequence.length) {
      endSequence()
      return
    }

    const nextKeyframe = state.currentSequence[nextIndex]

    // Skip keyframes with 0 duration (they're just starting positions)
    if (nextKeyframe.duration === 0) {
      state.keyframeIndex = nextIndex
      startPosition.current.copy(nextKeyframe.position)
      startTarget.current.copy(nextKeyframe.target)
      startFov.current = nextKeyframe.fov
      return
    }

    // Progress through current keyframe transition
    state.keyframeProgress += delta / nextKeyframe.duration

    if (state.keyframeProgress >= 1) {
      // Move to next keyframe
      state.keyframeIndex = nextIndex
      state.keyframeProgress = 0
      startPosition.current.copy(nextKeyframe.position)
      startTarget.current.copy(nextKeyframe.target)
      startFov.current = nextKeyframe.fov

      // Update selected galaxy during tour
      if (isJourneyMode && nextIndex > 0 && nextIndex <= galaxies.length * 2) {
        const galaxyIndex = Math.floor((nextIndex - 1) / 2)
        if (galaxyIndex < galaxies.length) {
          setSelectedGalaxy(galaxies[galaxyIndex].id)
        }
      }
      return
    }

    // Interpolate camera position, target, and FOV
    const easing = nextKeyframe.easing || ((t: number) => t)
    const t = easing(state.keyframeProgress)

    camera.position.lerpVectors(startPosition.current, nextKeyframe.position, t)

    const currentTarget = new THREE.Vector3().lerpVectors(
      startTarget.current,
      nextKeyframe.target,
      t
    )
    camera.lookAt(currentTarget)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = startFov.current + (nextKeyframe.fov - startFov.current) * t
      camera.updateProjectionMatrix()
    }

    // Update orbit controls target to match
    if (controlsRef.current) {
      controlsRef.current.target.copy(currentTarget)
    }
  })

  return null
}

/**
 * UI button to start the galaxy tour
 */
export function GalaxyTourButton() {
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)
  const startJourney = useViewStore((s) => s.startJourney)
  const hasEntered = useViewStore((s) => s.hasEntered)
  const view = useViewStore((s) => s.view)

  // Only show in universe view after entering
  if (!hasEntered || view !== 'universe' || isJourneyMode) return null

  return (
    <button
      onClick={() => startJourney()}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
    >
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Take the Tour
      </span>
    </button>
  )
}

/**
 * Tour progress indicator
 */
export function TourProgress() {
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)
  const selectedGalaxy = useViewStore((s) => s.selectedGalaxy)
  const endJourney = useViewStore((s) => s.endJourney)

  if (!isJourneyMode) return null

  const currentIndex = galaxies.findIndex((g) => g.id === selectedGalaxy)
  const currentGalaxy = currentIndex >= 0 ? galaxies[currentIndex] : null

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Progress dots */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
        {galaxies.map((galaxy, i) => (
          <div
            key={galaxy.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-white scale-125'
                : i < currentIndex
                  ? 'bg-white/60'
                  : 'bg-white/20'
            }`}
            style={{
              backgroundColor: i === currentIndex ? galaxy.color : undefined,
            }}
          />
        ))}
      </div>

      {/* Current galaxy name */}
      {currentGalaxy && (
        <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-center">
          <div className="text-xs text-white/50 uppercase tracking-wider">Now visiting</div>
          <div className="text-lg font-semibold text-white" style={{ color: currentGalaxy.color }}>
            {currentGalaxy.name}
          </div>
          <div className="text-sm text-white/70">{currentGalaxy.projects.length} projects</div>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={() => endJourney()}
        className="text-xs text-white/50 hover:text-white/80 transition-colors"
      >
        Press ESC or click to skip
      </button>
    </div>
  )
}
