'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_PARTICLES = 80
const PARTICLE_LIFETIME = 1.2 // seconds
const SPAWN_RATE = 0.02 // seconds between spawns

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
  size: number
  color: THREE.Color
}

/**
 * Stardust cursor trail - sparkle particles that follow the mouse
 * Creates a magical trailing effect as the user moves their cursor
 */
export function CursorTrail({ enabled = true }: { enabled?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { camera, mouse, raycaster, size } = useThree()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Particle pool
  const particles = useRef<Particle[]>([])
  const spawnTimer = useRef(0)
  const lastMousePos = useRef(new THREE.Vector3())
  const mouseVelocity = useRef(new THREE.Vector2())

  // Colors for particles (cosmic palette)
  const particleColors = useMemo(() => [
    new THREE.Color('#ffffff'), // White
    new THREE.Color('#a78bfa'), // Purple
    new THREE.Color('#818cf8'), // Indigo
    new THREE.Color('#60a5fa'), // Blue
    new THREE.Color('#f472b6'), // Pink
  ], [])

  // Buffer geometry attributes
  const [positions, colors, sizes, opacities] = useMemo(() => {
    return [
      new Float32Array(MAX_PARTICLES * 3),
      new Float32Array(MAX_PARTICLES * 3),
      new Float32Array(MAX_PARTICLES),
      new Float32Array(MAX_PARTICLES),
    ]
  }, [])

  const vertexShader = `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vOpacity = opacity;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Soft glowing particle
      float core = smoothstep(0.15, 0.0, dist);
      float glow = smoothstep(0.5, 0.1, dist);
      float brightness = core * 1.5 + glow * 0.5;

      // Sparkle effect - random bright flashes
      float sparkle = step(0.95, fract(sin(dot(gl_PointCoord, vec2(12.9898, 78.233))) * 43758.5453));
      brightness += sparkle * 0.3;

      vec3 finalColor = vColor * brightness;
      float alpha = glow * vOpacity;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  // Get 3D position from mouse
  const getMouseWorldPosition = (): THREE.Vector3 => {
    // Cast ray from camera through mouse position
    raycaster.setFromCamera(mouse, camera)

    // Place particles on a plane at a fixed distance from camera
    const distance = 30
    const direction = raycaster.ray.direction.clone()
    return camera.position.clone().add(direction.multiplyScalar(distance))
  }

  useFrame((state, delta) => {
    if (!enabled || !pointsRef.current || isMobile) return

    const currentMousePos = getMouseWorldPosition()

    // Track mouse velocity for burst spawning on fast movement
    mouseVelocity.current.set(
      (mouse.x - lastMousePos.current.x) / delta,
      (mouse.y - lastMousePos.current.y) / delta
    )
    const speed = mouseVelocity.current.length()

    // Spawn new particles
    spawnTimer.current += delta
    const spawnInterval = speed > 2 ? SPAWN_RATE * 0.5 : SPAWN_RATE // Faster spawn on quick movements

    while (spawnTimer.current >= spawnInterval && particles.current.length < MAX_PARTICLES) {
      spawnTimer.current -= spawnInterval

      // Random offset from cursor position
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8
      )

      // Initial velocity - slight upward drift with random spread
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        Math.random() * 0.3 + 0.1, // Upward drift
        (Math.random() - 0.5) * 0.5
      )

      // Add some of the mouse velocity for trailing effect
      if (speed > 0.5) {
        const trailVelocity = new THREE.Vector3(
          -mouseVelocity.current.x * 0.02,
          -mouseVelocity.current.y * 0.02,
          0
        )
        velocity.add(trailVelocity)
      }

      const particle: Particle = {
        position: currentMousePos.clone().add(offset),
        velocity,
        life: PARTICLE_LIFETIME,
        maxLife: PARTICLE_LIFETIME,
        size: 0.3 + Math.random() * 0.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      }

      particles.current.push(particle)
    }

    // Update existing particles
    const aliveParticles: Particle[] = []
    for (const p of particles.current) {
      p.life -= delta
      if (p.life > 0) {
        // Apply velocity with slight deceleration
        p.position.add(p.velocity.clone().multiplyScalar(delta))
        p.velocity.multiplyScalar(0.98)

        // Add subtle swirl
        const swirl = Math.sin(state.clock.elapsedTime * 3 + p.position.x) * 0.01
        p.position.x += swirl
        p.position.y += Math.cos(state.clock.elapsedTime * 2 + p.position.z) * 0.005

        aliveParticles.push(p)
      }
    }
    particles.current = aliveParticles

    // Update buffer geometry
    const geometry = pointsRef.current.geometry

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (i < particles.current.length) {
        const p = particles.current[i]
        const lifeRatio = p.life / p.maxLife

        positions[i * 3] = p.position.x
        positions[i * 3 + 1] = p.position.y
        positions[i * 3 + 2] = p.position.z

        colors[i * 3] = p.color.r
        colors[i * 3 + 1] = p.color.g
        colors[i * 3 + 2] = p.color.b

        // Size grows then shrinks
        const sizeScale = Math.sin(lifeRatio * Math.PI)
        sizes[i] = p.size * sizeScale

        // Fade out
        opacities[i] = lifeRatio * 0.8
      } else {
        // Hide unused particles
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0
        sizes[i] = 0
        opacities[i] = 0
      }
    }

    // Mark attributes for update
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
    geometry.attributes.size.needsUpdate = true
    geometry.attributes.opacity.needsUpdate = true

    lastMousePos.current.copy(currentMousePos)
  })

  if (isMobile) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={MAX_PARTICLES}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={MAX_PARTICLES}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={MAX_PARTICLES}
          array={opacities}
          itemSize={1}
          args={[opacities, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
