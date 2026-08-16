'use client'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { crystalShards } from '@/lib/city/layout'
import { GlowSprite, glowTexture } from './GlowSprite'

type Props = {
  position: [number, number, number]
  height: number
  glow: number
  color: string
  glowColor: string
  seed: number
  selected?: boolean
  reducedMotion?: boolean
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
  reducedMotion,
  onSelect,
}: Props) {
  const cores = useRef<THREE.MeshStandardMaterial[]>([])
  const halo = useRef<THREE.Sprite>(null)
  const glowColorObj = useMemo(() => new THREE.Color(glowColor), [glowColor])
  const colorObj = useMemo(() => new THREE.Color(color), [color])
  const shards = useMemo(() => crystalShards(seed, height), [seed, height])
  const ground = useMemo(() => glowTexture(), [])
  // 0..1 liveliness → how hard this structure burns.
  const life = Math.min(1, Math.max(0, (glow - 0.15) / 1.85))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = reducedMotion ? 1 : 0.85 + Math.sin(t * 1.5 + position[0]) * 0.15
    const intensity = glow * pulse * (selected ? 2.4 : 1.4)
    for (const mat of cores.current) {
      if (mat) mat.emissiveIntensity = intensity
    }
    const h = halo.current?.material as THREE.SpriteMaterial | undefined
    if (h) h.opacity = (0.22 + life * 0.5) * pulse * (selected ? 1.5 : 1)
  })

  return (
    <group position={[position[0], height / 2, position[2]]}>
      {/* bloom halo behind the cluster */}
      <sprite ref={halo} scale={[height * 2.2, height * 2.2, height * 2.2]}>
        <spriteMaterial
          map={ground}
          color={glowColorObj}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

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
              roughness={0.15}
              metalness={0.2}
              flatShading
            />
          </mesh>
          {/* additive facet rim */}
          <mesh scale={[1.4, 1.12, 1.4]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color={glowColorObj}
              transparent
              opacity={0.14 + life * 0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ))}

      {/* light pooling on the reef floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2 + 0.02, 0]}>
        <planeGeometry args={[height * 2.6, height * 2.6]} />
        <meshBasicMaterial
          map={ground}
          color={glowColorObj}
          transparent
          opacity={0.18 + life * 0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {selected && <GlowSprite color={glowColor} scale={height * 3} opacity={0.25} />}
    </group>
  )
}
