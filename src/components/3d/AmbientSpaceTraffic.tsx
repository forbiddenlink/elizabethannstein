'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Satellite } from '@/components/3d/SpaceStation'
/**
 * Distant satellites & scouts — always visible in free roam (universe view).
 * Journey mode has its own story beats (TourElements); this layer sells “lived-in space”
 * without duplicating aliens/stations or tanking FPS (few meshes, large orbits).
 */
import { useViewStore } from '@/lib/store'

/** Simple probe shape — reads as craft at distance, cheap to render */
function ScoutProbe({
  orbitRadius,
  height,
  speed,
  phase,
  tint,
}: Readonly<{
  orbitRadius: number
  height: number
  speed: number
  phase: number
  tint: string
}>) {
  const ref = useRef<THREE.Group>(null)
  const color = useMemo(() => new THREE.Color(tint), [tint])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phase
    ref.current.position.x = Math.cos(t) * orbitRadius
    ref.current.position.z = Math.sin(t) * orbitRadius
    ref.current.position.y = height + Math.sin(t * 0.7) * 2.5
    ref.current.rotation.y = -t * 1.2
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.08
  })

  return (
    <group ref={ref}>
      <mesh>
        <coneGeometry args={[0.35, 1.1, 5]} />
        <meshStandardMaterial
          color={color}
          metalness={0.75}
          roughness={0.28}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.45, 0.2, 0.55]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.45} />
      </mesh>
      <pointLight position={[0, 0.2, 0.5]} color={color} intensity={0.35} distance={6} />
    </group>
  )
}

interface AmbientSpaceTrafficProps {
  isMobile?: boolean
}

export function AmbientSpaceTraffic({ isMobile = false }: AmbientSpaceTrafficProps) {
  const view = useViewStore((s) => s.view)
  const hasEntered = useViewStore((s) => s.hasEntered)
  const isJourneyMode = useViewStore((s) => s.isJourneyMode)

  const satellites = useMemo(() => {
    const n = isMobile ? 2 : 5
    const out: { pos: [number, number, number]; r: number; spd: number }[] = []
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.7
      const r = 48 + (i % 3) * 6
      out.push({
        pos: [Math.cos(a) * 18, 4 + (i % 4) * 3, Math.sin(a) * 18] as [number, number, number],
        r: r + i * 2.2,
        spd: 0.12 + i * 0.035,
      })
    }
    return out
  }, [isMobile])

  const probes = useMemo(() => {
    const n = isMobile ? 1 : 3
    return Array.from({ length: n }, (_, i) => ({
      orbitRadius: 56 + i * 9,
      height: 6 + i * 4,
      speed: 0.09 + i * 0.02,
      phase: i * 2.1,
      tint: ['#94a3b8', '#a78bfa', '#22d3ee'][i % 3],
    }))
  }, [isMobile])

  if (!hasEntered || isJourneyMode || view !== 'universe') return null

  return (
    <group>
      {satellites.map((s, i) => (
        <Satellite
          key={`ambient-sat-${i}`}
          position={s.pos}
          orbitRadius={s.r}
          orbitSpeed={s.spd}
          scale={isMobile ? 0.55 : 0.75}
        />
      ))}
      {probes.map((p, i) => (
        <ScoutProbe key={`probe-${i}`} {...p} />
      ))}
    </group>
  )
}
