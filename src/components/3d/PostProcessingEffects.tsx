'use client'

/**
 * ⚠️ WARNING: POST-PROCESSING CAUSES FLICKERING
 *
 * This component is DISABLED because @react-three/postprocessing
 * causes visual flickering/flashing when used with:
 * - WebGPU renderer (not compatible)
 * - Multisampling enabled
 * - Dynamic uniform changes during render
 *
 * Attempted fixes that didn't work:
 * - Disabling multisampling (still flickers)
 * - Static bloom intensity (still flickers)
 * - Different kernel sizes (still flickers)
 *
 * The issue appears to be incompatibility between the postprocessing
 * library and the WebGPU/WebGL renderer setup in this project.
 *
 * DO NOT RE-ENABLE without thorough testing on multiple devices.
 *
 * Last attempted: 2026-03-14
 * Related files: GalaxyScene.tsx, WebGPUCanvas.tsx
 */

import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { KernelSize, BlendFunction } from 'postprocessing'
import { useViewStore } from '@/lib/store'
import { Vector2 } from 'three'

interface PostProcessingEffectsProps {
  enabled?: boolean
  isMobile?: boolean
}

/**
 * Cinematic post-processing effects for the galaxy scene
 * - Bloom: Glowing planets and stars
 * - Vignette: Darkened edges for focus
 * - ChromaticAberration: Subtle lens distortion for AAA feel
 * - Noise: Film grain for cinematic texture
 *
 * NOTE: Currently disabled due to flickering bug - see warning above
 */
export function PostProcessingEffects({ enabled = true, isMobile = false }: PostProcessingEffectsProps) {
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)

  // Cinematic bloom settings - subtle but impactful
  const bloomIntensity = isMobile ? 0.8 : 1.2
  const bloomKernel = isMobile ? KernelSize.MEDIUM : KernelSize.LARGE

  // Increase bloom when viewing a project (dramatic planet focus)
  const isProjectView = view === 'project' || selectedProject
  const dynamicBloom = isProjectView ? bloomIntensity * 1.4 : bloomIntensity

  // Chromatic aberration intensity - subtle edge distortion (disabled on mobile)
  const caIntensity = isMobile ? 0 : isProjectView ? 0.0008 : 0.0004

  // Film grain intensity
  const noiseOpacity = isMobile ? 0.08 : 0.15

  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={dynamicBloom}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        kernelSize={bloomKernel}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new Vector2(caIntensity, caIntensity)}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={noiseOpacity}
      />
      <Vignette
        offset={0.3}
        darkness={0.55}
      />
    </EffectComposer>
  )
}
