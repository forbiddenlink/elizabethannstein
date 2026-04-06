'use client'

/**
 * Post-processing effects for cinematic quality
 *
 * FIX APPLIED: Using multisampling={8} and stencilBuffer={false} to prevent flickering.
 * WebGPU is excluded at the GalaxyScene level - this only runs on WebGL.
 *
 * Key settings that prevent flickering:
 * - multisampling={8} for anti-aliased edges
 * - stencilBuffer={false} to avoid buffer conflicts
 * - Static bloom threshold (no dynamic updates during render)
 * - disableNormalPass to reduce buffer swaps
 */

import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { KernelSize, BlendFunction } from 'postprocessing'
import { useViewStore } from '@/lib/store'
import { Vector2 } from 'three'
import { useMemo } from 'react'

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
 * FIXED: Using multisampling={8}, stencilBuffer={false}, enableNormalPass={false}
 * to prevent flickering. Only enabled for WebGL renderer.
 */
export function PostProcessingEffects({ enabled = true, isMobile = false }: PostProcessingEffectsProps) {
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)

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

  if (!enabled) return null

  return (
    <EffectComposer multisampling={8} stencilBuffer={false} enableNormalPass={false}>
      <Bloom
        intensity={dynamicBloom}
        luminanceThreshold={0.14}
        luminanceSmoothing={0.88}
        kernelSize={bloomKernel}
        mipmapBlur
      />
      <ChromaticAberration
        offset={caOffset}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={noiseOpacity}
      />
      <Vignette
        offset={0.28}
        darkness={0.52}
      />
    </EffectComposer>
  )
}
