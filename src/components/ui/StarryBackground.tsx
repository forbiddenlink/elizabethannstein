'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { TwinklingStarfield } from '@/components/3d/TwinklingStarfield'
import { usePrefersReducedMotion } from '@/lib/store'

export function StarryBackground() {
  const reducedMotion = usePrefersReducedMotion()

  // Reduced-motion (OS preference or the in-app MotionToggle): skip the
  // animated 3000-star WebGL canvas entirely and render a static space
  // backdrop. Avoids vestibular strain and the battery/crash cost of an
  // always-on WebGL loop on low-power devices.
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0b0b1c_0%,#000000_72%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Canvas gl={{ antialias: false, alpha: false }} camera={{ position: [0, 0, 100], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 50, 150]} />

        <Suspense fallback={null}>
          <TwinklingStarfield count={3000} />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
    </div>
  )
}
