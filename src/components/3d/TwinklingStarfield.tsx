'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface StarfieldLayerProps {
  count: number
  radiusMin: number
  radiusMax: number
  parallaxSpeed: number // 0 = no movement, 1 = full camera tracking
  sizeMultiplier?: number
}

function StarfieldLayer({ count, radiusMin, radiusMax, parallaxSpeed, sizeMultiplier = 1 }: StarfieldLayerProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const prevCameraPos = useRef(new THREE.Vector3())

  const [positions, colors, sizes, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = radiusMin + Math.random() * (radiusMax - radiusMin)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Varied star colors (white, blue-white, yellow-white, red, purple-tinted)
      const colorType = Math.random()
      if (colorType < 0.55) {
        // White stars (most common)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      } else if (colorType < 0.72) {
        // Blue-white (hot stars)
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.15
        colors[i * 3 + 2] = 1
      } else if (colorType < 0.82) {
        // Yellow-white (sun-like)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.92 + Math.random() * 0.08
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.2
      } else if (colorType < 0.92) {
        // Purple-violet (themed with portfolio)
        colors[i * 3] = 0.85 + Math.random() * 0.15
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.2
        colors[i * 3 + 2] = 1
      } else {
        // Red giants
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.35 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.2
      }

      // Varied sizes (enhanced for more visible bright stars)
      const brightness = Math.random()
      const baseSize = brightness < 0.85 ? 0.6 + Math.random() * 1.8 : 2.5 + Math.random() * 3.5
      sizes[i] = baseSize * sizeMultiplier

      // Random phase for twinkling
      phases[i] = Math.random() * Math.PI * 2
    }

    return [positions, colors, sizes, phases]
  }, [count, radiusMin, radiusMax, sizeMultiplier])

  const vertexShader = `
    attribute float size;
    attribute float phase;
    varying vec3 vColor;
    varying float vTwinkle;
    uniform float time;

    void main() {
      vColor = color;

      // Enhanced multi-frequency twinkling for more dramatic effect
      float twinkle1 = sin(time * 2.5 + phase) * 0.3;
      float twinkle2 = sin(time * 4.2 + phase * 1.5) * 0.18;
      float twinkle3 = sin(time * 1.0 + phase * 0.7) * 0.12;
      float twinkle4 = sin(time * 6.0 + phase * 2.3) * 0.08;
      float twinkle = 0.65 + twinkle1 + twinkle2 + twinkle3 + twinkle4;

      vTwinkle = twinkle;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * twinkle * (380.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    varying float vTwinkle;

    void main() {
      // Circular star with enhanced soft glow
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Enhanced multi-layer glow effect
      float core = smoothstep(0.12, 0.0, dist);
      float innerGlow = smoothstep(0.3, 0.05, dist);
      float outerGlow = smoothstep(0.5, 0.15, dist);
      float halo = smoothstep(0.5, 0.35, dist) * 0.25;

      // Combine for more dramatic star appearance
      float brightness = core * 1.2 + innerGlow * 0.5 + outerGlow * 0.4 + halo;
      brightness *= vTwinkle;

      // Enhanced color bloom on bright stars
      vec3 finalColor = vColor;
      if (brightness > 0.7) {
        float bloomFactor = (brightness - 0.7) * 0.6;
        finalColor = mix(vColor, vec3(1.0), bloomFactor);
      }

      // Add subtle color rays on very bright stars
      float alpha = smoothstep(0.5, 0.0, dist);
      if (vTwinkle > 1.0) {
        alpha = min(1.0, alpha * 1.2);
      }

      gl_FragColor = vec4(finalColor * brightness, alpha);
    }
  `

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return

    // Update shader time
    const material = pointsRef.current.material as THREE.ShaderMaterial
    material.uniforms.time.value = state.clock.elapsedTime

    // Parallax effect: move layer opposite to camera movement
    // Far layers move less (lower parallaxSpeed), creating depth illusion
    const cameraDelta = new THREE.Vector3().subVectors(camera.position, prevCameraPos.current)
    const parallaxOffset = cameraDelta.multiplyScalar(parallaxSpeed - 1) // -1 to 0 range for counter-movement
    groupRef.current.position.add(parallaxOffset)

    prevCameraPos.current.copy(camera.position)
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
            args={[sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-phase"
            count={phases.length}
            array={phases}
            itemSize={1}
            args={[phases, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            time: { value: 0 }
          }}
          transparent
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

/**
 * Multi-layer parallax starfield
 * - Far layer: slowest movement, smallest stars (deep space backdrop)
 * - Mid layer: medium movement, medium stars
 * - Near layer: fastest movement, larger stars (foreground depth)
 */
export function TwinklingStarfield({ count = 5000 }: { count?: number }) {
  // Distribute stars across 3 depth layers
  const farCount = Math.floor(count * 0.5)   // 50% in far layer (most stars, smallest)
  const midCount = Math.floor(count * 0.35)  // 35% in mid layer
  const nearCount = count - farCount - midCount // 15% in near layer (fewer, larger)

  return (
    <group>
      {/* Far layer - distant stars, minimal parallax */}
      <StarfieldLayer
        count={farCount}
        radiusMin={350}
        radiusMax={500}
        parallaxSpeed={0.05}
        sizeMultiplier={0.7}
      />
      {/* Mid layer - medium distance */}
      <StarfieldLayer
        count={midCount}
        radiusMin={200}
        radiusMax={350}
        parallaxSpeed={0.15}
        sizeMultiplier={1.0}
      />
      {/* Near layer - closer stars, more parallax */}
      <StarfieldLayer
        count={nearCount}
        radiusMin={100}
        radiusMax={200}
        parallaxSpeed={0.3}
        sizeMultiplier={1.4}
      />
    </group>
  )
}
