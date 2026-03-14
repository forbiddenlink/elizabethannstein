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

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useViewStore } from '@/lib/store'

interface PostProcessingEffectsProps {
  enabled?: boolean
  isMobile?: boolean
}

/**
 * Cinematic post-processing effects for the galaxy scene
 * - Bloom: Glowing planets and stars
 * - Vignette: Darkened edges for focus
 *
 * NOTE: Currently disabled due to flickering bug - see warning above
 */
export function PostProcessingEffects({ enabled = true, isMobile = false }: PostProcessingEffectsProps) {
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)

  // Reduce effects on mobile for performance
  const bloomIntensity = isMobile ? 0.6 : 1.0
  const bloomKernel = isMobile ? KernelSize.SMALL : KernelSize.LARGE

  // Increase bloom when viewing a project (dramatic focus)
  const isProjectView = view === 'project' || selectedProject
  const dynamicBloom = isProjectView ? bloomIntensity * 1.3 : bloomIntensity

  if (!enabled) return null

  return (
    <EffectComposer multisampling={isMobile ? 0 : 4}>
      <Bloom
        intensity={dynamicBloom}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        kernelSize={bloomKernel}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
      />
    </EffectComposer>
  )
}
