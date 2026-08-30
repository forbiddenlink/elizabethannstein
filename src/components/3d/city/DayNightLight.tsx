'use client'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type * as THREE from 'three'

type Props = {
  activity: number
  reducedMotion?: boolean
}

// Ambient tied to commit rhythm: a livelier fleet glows brighter, and the reef
// breathes through a slow day-night cycle. Frozen under reduced-motion.
export function DayNightLight({ activity, reducedMotion }: Props) {
  const ref = useRef<THREE.HemisphereLight>(null)
  const base = 0.2 + activity * 0.4

  useFrame((state) => {
    if (!ref.current) return
    if (reducedMotion) {
      ref.current.intensity = base
      return
    }
    const cycle = 0.5 + Math.sin(state.clock.elapsedTime * 0.15) * 0.5
    ref.current.intensity = base * (0.55 + cycle * 0.75)
  })

  return <hemisphereLight ref={ref} args={['#20406a', '#010208', 0.35]} />
}
