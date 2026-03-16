'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
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
  const STAR_COUNT = isMobile ? 300 : 800
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [isWarping, setIsWarping] = useState(false)
  const warpProgress = useRef(0)
  const prevGalaxy = useRef<string | null>(null)

  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const isWarpingIn = useViewStore((state) => state.isWarpingIn)
  const view = useViewStore((state) => state.view)

  // Detect galaxy change to trigger warp
  useEffect(() => {
    if (selectedGalaxy && prevGalaxy.current && selectedGalaxy !== prevGalaxy.current && view === 'galaxy') {
      setIsWarping(true)
      warpProgress.current = 0
    }
    prevGalaxy.current = selectedGalaxy
  }, [selectedGalaxy, view])

  // Trigger warp on initial entry into the galaxy
  useEffect(() => {
    if (isWarpingIn) {
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
  }, [])

  const vertexShader = `
    attribute float velocity;
    uniform float warpFactor;
    uniform float time;
    varying float vIntensity;
    varying float vStretch;

    void main() {
      vec3 pos = position;

      // Stretch stars into lines based on warp factor
      float stretch = warpFactor * velocity * 3.0;
      vStretch = stretch;

      // Move stars toward camera during warp
      pos.z += time * velocity * warpFactor * 50.0;

      // Wrap around when passing camera
      pos.z = mod(pos.z + 50.0, 100.0) - 50.0;

      // Intensity based on distance and warp
      float dist = length(pos.xy);
      vIntensity = (1.0 - dist / 20.0) * (0.3 + warpFactor * 0.7);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size increases with warp and decreases with distance
      gl_PointSize = (3.0 + stretch * 15.0) * (300.0 / -mvPosition.z);
    }
  `

  const fragmentShader = `
    varying float vIntensity;
    varying float vStretch;
    uniform vec3 color;

    void main() {
      // Create elongated shape based on stretch
      vec2 center = gl_PointCoord - vec2(0.5);

      // Stretch horizontally during warp
      center.y *= 1.0 + vStretch * 3.0;

      float dist = length(center);
      float alpha = smoothstep(0.5, 0.0, dist) * vIntensity;

      // Core glow
      vec3 finalColor = color + vec3(0.5) * (1.0 - dist * 2.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  useFrame((state, delta) => {
    if (!materialRef.current) return

    if (isWarping) {
      warpProgress.current += delta * 2

      // Warp in, hold, warp out
      let warpFactor = 0
      if (warpProgress.current < 0.3) {
        // Accelerate
        warpFactor = warpProgress.current / 0.3
      } else if (warpProgress.current < 0.7) {
        // Full warp
        warpFactor = 1
      } else if (warpProgress.current < 1.0) {
        // Decelerate
        warpFactor = 1 - (warpProgress.current - 0.7) / 0.3
      } else {
        setIsWarping(false)
        warpFactor = 0
      }

      materialRef.current.uniforms.warpFactor.value = warpFactor
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
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
          color: { value: new THREE.Color('#4488ff') }
        }}
      />
    </points>
  )
}
