'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  position: [number, number, number]
  height: number
  glow: number
  color: string
  glowColor: string
  selected?: boolean
  onSelect?: () => void
}

export function BioStructure({
  position,
  height,
  glow,
  color,
  glowColor,
  selected,
  onSelect,
}: Props) {
  const core = useRef<THREE.Mesh>(null)
  const glowColorObj = useMemo(() => new THREE.Color(glowColor), [glowColor])
  useFrame((state) => {
    // Gentle breathing pulse; brighter when selected.
    const t = state.clock.elapsedTime
    const pulse = 0.85 + Math.sin(t * 1.5 + position[0]) * 0.15
    const mat = core.current?.material as THREE.MeshStandardMaterial | undefined
    if (mat) mat.emissiveIntensity = glow * pulse * (selected ? 1.8 : 1)
  })
  return (
    <group position={[position[0], height / 2, position[2]]}>
      {/* core */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: R3F mesh — Three.js pointer events, not DOM */}
      <mesh
        ref={core}
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <cylinderGeometry args={[0.18, 0.32, height, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColorObj}
          emissiveIntensity={glow}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* additive halo (fake bloom, no composer) */}
      <mesh scale={[1.6, 1.05, 1.6]}>
        <cylinderGeometry args={[0.22, 0.4, height, 6]} />
        <meshBasicMaterial
          color={glowColorObj}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
