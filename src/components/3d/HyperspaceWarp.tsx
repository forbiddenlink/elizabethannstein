'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'

const TUNNEL_LENGTH = 100
const TUNNEL_RADIUS = 15

interface HyperspaceWarpProps {
  isMobile?: boolean
}

/**
 * Hyperspace warp tunnel effect shown during galaxy navigation
 * Creates a starfield that stretches into lines during transition
 */
export function HyperspaceWarp({ isMobile = false }: HyperspaceWarpProps) {
  const STAR_COUNT = isMobile ? 380 : 1100
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [isWarping, setIsWarping] = useState(false)
  const warpProgress = useRef(0)
  const prevGalaxy = useRef<string | null>(null)
  /** First launch from entrance — longer, more saturated than galaxy-to-galaxy hops */
  const isEntryWarpRef = useRef(false)

  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const isWarpingIn = useViewStore((state) => state.isWarpingIn)
  const view = useViewStore((state) => state.view)

  useEffect(() => {
    if (
      selectedGalaxy &&
      prevGalaxy.current &&
      selectedGalaxy !== prevGalaxy.current &&
      view === 'galaxy'
    ) {
      isEntryWarpRef.current = false
      setIsWarping(true)
      warpProgress.current = 0
    }
    prevGalaxy.current = selectedGalaxy
  }, [selectedGalaxy, view])

  useEffect(() => {
    if (isWarpingIn) {
      isEntryWarpRef.current = true
      setIsWarping(true)
      warpProgress.current = 0
    }
  }, [isWarpingIn])

  // Generate star positions in a cylinder
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3)
    const velocities = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * TUNNEL_RADIUS
      const z = (Math.random() - 0.5) * TUNNEL_LENGTH

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = z

      velocities[i] = 0.5 + Math.random() * 1.5
    }

    return { positions, velocities }
  }, [STAR_COUNT])

  const vertexShader = `
    attribute float velocity;
    uniform float warpFactor;
    uniform float entryBoost;
    uniform float time;
    varying float vIntensity;
    varying float vStretch;

    void main() {
      vec3 pos = position;

      float stretch = warpFactor * velocity * 3.2 * entryBoost;
      vStretch = stretch;

      pos.z += time * velocity * warpFactor * (48.0 + entryBoost * 12.0);

      pos.z = mod(pos.z + 50.0, 100.0) - 50.0;

      float dist = length(pos.xy);
      float core = (0.28 + warpFactor * 0.72) * (0.85 + entryBoost * 0.2);
      vIntensity = (1.0 - dist / 20.0) * core;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      float sz = (3.2 + stretch * 16.0) * (320.0 / -mvPosition.z);
      gl_PointSize = sz * (1.0 + 0.12 * (entryBoost - 1.0) * warpFactor);
    }
  `

  const fragmentShader = `
    varying float vIntensity;
    varying float vStretch;
    uniform vec3 color;
    uniform vec3 colorAccent;
    uniform float warpFactor;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      center.y *= 1.0 + vStretch * 3.2;

      float dist = length(center);
      float alpha = smoothstep(0.5, 0.0, dist) * vIntensity;

      vec3 streak = mix(color, colorAccent, smoothstep(0.0, 0.45, vStretch) * warpFactor);
      vec3 finalColor = streak + vec3(0.55, 0.52, 0.65) * (1.0 - dist * 2.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  useFrame((state, delta) => {
    if (!materialRef.current) return

    if (isWarping) {
      const entry = isEntryWarpRef.current
      const endT = entry ? 1.72 : 1.0
      const spd = entry ? 1.15 : 2.0
      warpProgress.current += delta * spd

      const t = Math.min(1, warpProgress.current / endT)
      let warpFactor = 0
      if (t < 0.28) {
        warpFactor = t / 0.28
      } else if (t < (entry ? 0.72 : 0.7)) {
        warpFactor = 1
      } else if (t < 1.0) {
        const decelStart = entry ? 0.72 : 0.7
        warpFactor = 1 - (t - decelStart) / (1.0 - decelStart)
      } else {
        setIsWarping(false)
        isEntryWarpRef.current = false
        warpFactor = 0
      }

      const u = materialRef.current.uniforms
      u.warpFactor.value = warpFactor
      u.time.value = state.clock.elapsedTime
      u.entryBoost.value = entry ? 1.42 : 1.0
      if (entry) {
        u.color.value.set('#a78bfa')
        u.colorAccent.value.set('#22d3ee')
      } else {
        u.color.value.set('#6366f1')
        u.colorAccent.value.set('#38bdf8')
      }
    }
  })

  if (!isWarping) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={STAR_COUNT}
          array={velocities}
          itemSize={1}
          args={[velocities, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          warpFactor: { value: 0 },
          time: { value: 0 },
          entryBoost: { value: 1 },
          color: { value: new THREE.Color('#6366f1') },
          colorAccent: { value: new THREE.Color('#22d3ee') },
        }}
      />
    </points>
  )
}
