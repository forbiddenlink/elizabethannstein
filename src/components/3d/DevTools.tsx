'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useControls, folder, Leva } from 'leva'
import Stats from 'stats-gl'

// Only render in development
const isDev = process.env.NODE_ENV === 'development'

/**
 * GPU/FPS monitoring overlay using stats-gl
 * Only renders in development mode
 */
export function StatsMonitor() {
  const { gl } = useThree()
  const statsRef = useRef<Stats | null>(null)

  useEffect(() => {
    if (!isDev) return

    const stats = new Stats({
      trackGPU: true,
    })
    stats.init(gl)
    document.body.appendChild(stats.dom)
    statsRef.current = stats

    // Position in top-left corner
    stats.dom.style.position = 'fixed'
    stats.dom.style.top = '10px'
    stats.dom.style.left = '10px'
    stats.dom.style.zIndex = '99999'

    return () => {
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom)
      }
    }
  }, [gl])

  // Update stats in sync with R3F render loop
  useFrame(() => {
    statsRef.current?.update()
  })

  return null
}

/**
 * Leva controls panel for tweaking scene parameters
 * Only renders in development mode
 */
export function SceneControls({
  onSettingsChange,
}: {
  onSettingsChange?: (settings: SceneSettings) => void
}) {
  const settings = useControls({
    Scene: folder({
      fogNear: { value: 80, min: 10, max: 200, step: 5 },
      fogFar: { value: 300, min: 100, max: 500, step: 10 },
      ambientIntensity: { value: 0.4, min: 0, max: 1, step: 0.05 },
    }),
    Lighting: folder({
      keyLightIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
      fillLightIntensity: { value: 0.4, min: 0, max: 1, step: 0.05 },
      rimLightIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    }),
    Camera: folder({
      fov: { value: 45, min: 30, max: 90, step: 1 },
      minDistance: { value: 10, min: 5, max: 50, step: 1 },
      maxDistance: { value: 150, min: 50, max: 300, step: 5 },
    }),
    Performance: folder({
      dpr: { value: 1, min: 0.5, max: 2, step: 0.25 },
      antialias: true,
    }),
  })

  useEffect(() => {
    onSettingsChange?.(settings as SceneSettings)
  }, [settings, onSettingsChange])

  return null
}

export interface SceneSettings {
  fogNear: number
  fogFar: number
  ambientIntensity: number
  keyLightIntensity: number
  fillLightIntensity: number
  rimLightIntensity: number
  fov: number
  minDistance: number
  maxDistance: number
  dpr: number
  antialias: boolean
}

/**
 * Leva panel wrapper - hidden in production
 */
export function DevToolsPanel() {
  if (!isDev) return null
  return <Leva collapsed titleBar={{ title: 'Scene Controls' }} />
}
