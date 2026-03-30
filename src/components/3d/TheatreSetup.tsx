'use client'

import { getProject, types } from '@theatre/core'
import studio from '@theatre/studio'
import { SheetProvider, editable as e, useCurrentSheet } from '@theatre/r3f'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Initialize Theatre.js studio in development
const isDev = process.env.NODE_ENV === 'development'

if (isDev && typeof window !== 'undefined') {
  studio.initialize()
  // Hide studio by default - use toggle button to show when authoring animations
  studio.ui.hide()
}

// Create a Theatre.js project for the galaxy scene
const galaxyProject = getProject('Galaxy Portfolio', {
  // In production, you'd load saved state here:
  // state: savedState
})

// Main camera animation sheet
const cameraSheet = galaxyProject.sheet('Camera Animations')

// Predefined camera sequences
export const CAMERA_SEQUENCES = {
  universeOverview: {
    position: { x: 0, y: 20, z: 60 },
    target: { x: 0, y: 0, z: 0 },
    fov: 45,
  },
  galaxyZoom: {
    position: { x: 0, y: 15, z: 35 },
    target: { x: 0, y: 0, z: 0 },
    fov: 50,
  },
  projectClose: {
    position: { x: 4, y: 3, z: 9 },
    target: { x: 0, y: 0, z: 0 },
    fov: 40,
  },
  cinematicSweep: {
    position: { x: 30, y: 25, z: 50 },
    target: { x: 0, y: 0, z: 0 },
    fov: 45,
  },
}

/**
 * Theatre.js camera controller for cinematic animations
 * Wrap your scene content with this to enable timeline-based camera control
 */
export function TheatreCameraController({ children }: { children: React.ReactNode }) {
  return (
    <SheetProvider sheet={cameraSheet}>
      {children}
      <AnimatedCamera />
    </SheetProvider>
  )
}

/**
 * Camera that can be animated via Theatre.js timeline
 */
function AnimatedCamera() {
  const { camera } = useThree()
  const sheet = useCurrentSheet()
  const sequenceLength = 10 // seconds

  // Create editable camera properties
  const cameraObj = useRef(
    cameraSheet.object('Main Camera', {
      position: types.compound({
        x: types.number(0, { range: [-100, 100] }),
        y: types.number(20, { range: [0, 100] }),
        z: types.number(60, { range: [0, 150] }),
      }),
      target: types.compound({
        x: types.number(0, { range: [-50, 50] }),
        y: types.number(0, { range: [-20, 20] }),
        z: types.number(0, { range: [-50, 50] }),
      }),
      fov: types.number(45, { range: [20, 90] }),
    })
  )

  useFrame(() => {
    if (!sheet) return

    const values = cameraObj.current.value

    // Update camera position
    camera.position.set(values.position.x, values.position.y, values.position.z)

    // Update camera FOV if it's a PerspectiveCamera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = values.fov
      camera.updateProjectionMatrix()
    }

    // Look at target
    camera.lookAt(values.target.x, values.target.y, values.target.z)
  })

  return null
}

/**
 * Play a camera animation sequence
 */
export function playCameraSequence(
  sequenceName: keyof typeof CAMERA_SEQUENCES,
  duration: number = 2
) {
  const sequence = cameraSheet.sequence
  // Theatre.js sequence playback would be configured here
  // For now, this is a placeholder for the animation system
  console.log(`Playing sequence: ${sequenceName} over ${duration}s`)
}

/**
 * Hook to control Theatre.js playback
 */
export function useTheatrePlayback() {
  const [isPlaying, setIsPlaying] = useState(false)

  const play = () => {
    cameraSheet.sequence.play({ iterationCount: 1 })
    setIsPlaying(true)
  }

  const pause = () => {
    cameraSheet.sequence.pause()
    setIsPlaying(false)
  }

  const reset = () => {
    cameraSheet.sequence.position = 0
    setIsPlaying(false)
  }

  return { isPlaying, play, pause, reset }
}

/**
 * Toggle button for Theatre.js studio (dev only)
 */
export function TheatreStudioToggle() {
  const [isVisible, setIsVisible] = useState(false)

  if (!isDev) return null

  const toggle = () => {
    if (isVisible) {
      studio.ui.hide()
    } else {
      studio.ui.restore()
    }
    setIsVisible(!isVisible)
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-32 right-4 z-50 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
      title="Toggle Theatre.js Studio"
    >
      {isVisible ? 'Hide' : 'Show'} Timeline
    </button>
  )
}
