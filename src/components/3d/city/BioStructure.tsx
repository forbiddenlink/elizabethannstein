'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { crystalShards } from '@/lib/city/layout'

type Props = {
  position: [number, number, number]
  height: number
  glow: number
  color: string
  glowColor: string
  seed: number
  selected?: boolean
  onSelect?: () => void
}

export function BioStructure({
  position,
  height,
  glow,
  color,
  glowColor,
  seed,
  selected,
  onSelect,
}: Props) {
  const cores = useRef<THREE.MeshStandardMaterial[]>([])
  const glowColorObj = useMemo(() => new THREE.Color(glowColor), [glowColor])
  const colorObj = useMemo(() => new THREE.Color(color), [color])
  const shards = useMemo(() => crystalShards(seed, height), [seed, height])

  useFrame((state) => {
    // Gentle breathing pulse; brighter when selected.
    const t = state.clock.elapsedTime
    const pulse = 0.85 + Math.sin(t * 1.5 + position[0]) * 0.15
    const intensity = glow * pulse * (selected ? 1.8 : 1)
    for (const mat of cores.current) {
      if (mat) mat.emissiveIntensity = intensity
    }
  })

  return (
    <group position={[position[0], height / 2, position[2]]}>
      {shards.map((shard, i) => (
        <group key={i} position={shard.offset} scale={shard.scale} rotation={shard.rotation}>
          {/* faceted crystal core */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: R3F mesh — Three.js pointer events, not DOM */}
          <mesh
            onPointerDown={(e) => {
              e.stopPropagation()
              onSelect?.()
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) cores.current[i] = m
              }}
              color={colorObj}
              emissive={glowColorObj}
              emissiveIntensity={glow}
              roughness={0.25}
              metalness={0.3}
              flatShading
            />
          </mesh>
          {/* additive rim halo (fake bloom, no composer) */}
          <mesh scale={[1.45, 1.15, 1.45]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color={glowColorObj}
              transparent
              opacity={0.12 + glow * 0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
