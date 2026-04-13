'use client'

/**
 * Post-processing effects for cinematic quality
 *
 * KNOWN ISSUE: EffectComposer can silently break the entire render pipeline,
 * making all 3D content invisible while <Html> overlays still work (because
 * they're DOM elements, not rendered through Three.js).
 *
 * History:
 * - 5eeb48c6: Removed post-processing entirely to fix flickering
 * - Re-added with multisampling={8}, stencilBuffer={false}
 * - Still causes invisible planets on some Three.js + postprocessing combos
 *
 * Current fix: Disabled by default. Set ENABLE_POST_PROCESSING=true or
 * use ?pp=1 URL param to opt in. The 3D scene looks great without it.
 */

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useEffect, useMemo, useState } from 'react'
import { Vector2 } from 'three'
import { useViewStore } from '@/lib/store'

interface PostProcessingEffectsProps {
  enabled?: boolean
  isMobile?: boolean
}

/**
 * Cinematic post-processing effects for the galaxy scene
 * - Bloom: Glowing planets and stars (Awwwards-style glow)
 * - Vignette: Darkened edges for focus
 * - ChromaticAberration: Subtle lens distortion for AAA feel
 * - Noise: Film grain for cinematic texture
 *
 * Disabled by default due to compatibility issues with
 * Three.js 0.182 + postprocessing 6.38 causing invisible meshes.
 * Enable with ?pp=1 in the URL for testing.
 */
export function PostProcessingEffects({
  enabled = true,
  isMobile = false,
}: PostProcessingEffectsProps) {
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)

  // Post-processing is opt-in via URL param (?pp=1) due to known rendering bugs
  const [ppEnabled, setPpEnabled] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setPpEnabled(params.get('pp') === '1')
    }
  }, [])

  // Cinematic bloom — punchy highlights without blowing midtones (Awwwards-style glow)
  const bloomIntensity = isMobile ? 0.75 : 1.15
  const bloomKernel = isMobile ? KernelSize.MEDIUM : KernelSize.LARGE

  const isProjectView = view === 'project' || selectedProject
  const dynamicBloom = isProjectView ? bloomIntensity * 1.35 : bloomIntensity

  // Memoize chromatic aberration offset to prevent re-renders
  const caOffset = useMemo(() => {
    const intensity = isMobile ? 0 : isProjectView ? 0.0008 : 0.00035
    return new Vector2(intensity, intensity)
  }, [isMobile, isProjectView])

  // Film grain — slightly tighter on desktop for premium texture
  const noiseOpacity = isMobile ? 0.07 : 0.12

  if (!enabled || !ppEnabled) return null

  return (
    <EffectComposer multisampling={8} stencilBuffer={false} enableNormalPass={false}>
      <Bloom
        intensity={dynamicBloom}
        luminanceThreshold={0.14}
        luminanceSmoothing={0.88}
        kernelSize={bloomKernel}
        mipmapBlur
      />
      <ChromaticAberration offset={caOffset} radialModulation={true} modulationOffset={0.5} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={noiseOpacity} />
      <Vignette offset={0.28} darkness={0.52} />
    </EffectComposer>
  )
}
