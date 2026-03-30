'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  BatchedParticleRenderer,
  ParticleSystem,
  ConeEmitter,
  SphereEmitter,
  ConstantValue,
  IntervalValue,
  PiecewiseBezier,
  Bezier,
  SizeOverLife,
  RotationOverLife,
  ColorRange,
  RenderMode,
  Vector4,
} from 'three.quarks'
import { useViewStore } from '@/lib/store'

// Galaxy colors for tinting
const GALAXY_COLORS: Record<string, THREE.Color> = {
  enterprise:   new THREE.Color('#FF6B35'),
  ai:           new THREE.Color('#00D9FF'),
  fullstack:    new THREE.Color('#9D4EDD'),
  devtools:     new THREE.Color('#06FFA5'),
  design:       new THREE.Color('#FF6BAD'),
  experimental: new THREE.Color('#FFB347'),
}

const DEFAULT_NEBULA_COLOR = new THREE.Color('#4B0082')

interface QuarksNebulaEffectProps {
  readonly position?: [number, number, number]
  readonly scale?: number
  readonly particleCount?: number
  readonly isMobile?: boolean
}

/**
 * GPU-accelerated nebula particle effect using three.quarks
 * Creates layered, animated cosmic dust and gas clouds
 */
export function QuarksNebulaEffect({
  position = [0, 0, -100],
  scale = 1,
  particleCount = 2000,
  isMobile = false
}: QuarksNebulaEffectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const batchRendererRef = useRef<InstanceType<typeof BatchedParticleRenderer> | null>(null)
  const systemsRef = useRef<ParticleSystem[]>([])
  const { scene } = useThree()

  const selectedGalaxy = useViewStore((s) => s.selectedGalaxy)
  const view = useViewStore((s) => s.view)

  // Reduce particle count on mobile
  const actualCount = isMobile ? Math.floor(particleCount / 3) : particleCount

  // Target color based on current galaxy
  const targetColor = useMemo(() => {
    if (view === 'galaxy' && selectedGalaxy && GALAXY_COLORS[selectedGalaxy]) {
      return GALAXY_COLORS[selectedGalaxy]
    }
    return DEFAULT_NEBULA_COLOR
  }, [selectedGalaxy, view])

  // Create circular particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // Radial gradient for soft particle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  // Initialize particle systems
  useEffect(() => {
    if (!groupRef.current) return

    // Create batch renderer for GPU instancing
    const batchRenderer = new BatchedParticleRenderer()
    batchRendererRef.current = batchRenderer
    scene.add(batchRenderer)

    const systems: ParticleSystem[] = []

    // Layer 1: Deep background dust (largest, slowest)
    const bgDust = new ParticleSystem({
      duration: 0, // Infinite
      looping: true,
      startLife: new IntervalValue(8, 15),
      startSpeed: new IntervalValue(0.2, 0.5),
      startSize: new IntervalValue(15, 40),
      startRotation: new IntervalValue(0, Math.PI * 2),
      startColor: new ColorRange(
        new Vector4(0.3, 0.1, 0.5, 0.15),
        new Vector4(0.2, 0.05, 0.4, 0.25)
      ),
      emissionOverTime: new ConstantValue(actualCount * 0.3 / 10),
      shape: new SphereEmitter({
        radius: 150 * scale,
        thickness: 1,
      }),
      material: new THREE.MeshBasicMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.BillBoard,
      renderOrder: -100,
    })

    bgDust.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 1.2, 1.1, 0.8), 0]])))
    bgDust.addBehavior(new RotationOverLife(new IntervalValue(-0.05, 0.05)))

    bgDust.emitter.name = 'bgDust'
    systems.push(bgDust)

    // Layer 2: Mid-layer nebula clouds
    const midClouds = new ParticleSystem({
      duration: 0,
      looping: true,
      startLife: new IntervalValue(6, 12),
      startSpeed: new IntervalValue(0.3, 0.8),
      startSize: new IntervalValue(8, 25),
      startRotation: new IntervalValue(0, Math.PI * 2),
      startColor: new ColorRange(
        new Vector4(0.4, 0.15, 0.6, 0.2),
        new Vector4(0.6, 0.2, 0.7, 0.35)
      ),
      emissionOverTime: new ConstantValue(actualCount * 0.4 / 8),
      shape: new SphereEmitter({
        radius: 100 * scale,
        thickness: 0.8,
      }),
      material: new THREE.MeshBasicMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.BillBoard,
      renderOrder: -50,
    })

    midClouds.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.5, 1, 1.2, 0.3), 0]])))
    midClouds.addBehavior(new RotationOverLife(new IntervalValue(-0.1, 0.1)))

    midClouds.emitter.name = 'midClouds'
    systems.push(midClouds)

    // Layer 3: Bright star-like particles (smallest, sparkle)
    const sparkles = new ParticleSystem({
      duration: 0,
      looping: true,
      startLife: new IntervalValue(3, 6),
      startSpeed: new IntervalValue(0.1, 0.4),
      startSize: new IntervalValue(0.5, 3),
      startRotation: new ConstantValue(0),
      startColor: new ColorRange(
        new Vector4(0.8, 0.8, 1, 0.5),
        new Vector4(1, 1, 1, 0.9)
      ),
      emissionOverTime: new ConstantValue(actualCount * 0.2 / 4),
      shape: new SphereEmitter({
        radius: 120 * scale,
        thickness: 1,
      }),
      material: new THREE.MeshBasicMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.BillBoard,
      renderOrder: 0,
    })

    // Pulsing size for twinkle effect
    sparkles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 1.5, 0.8, 0.2), 0]])))

    sparkles.emitter.name = 'sparkles'
    systems.push(sparkles)

    // Layer 4: Colored accent particles (galaxy-tinted)
    const accents = new ParticleSystem({
      duration: 0,
      looping: true,
      startLife: new IntervalValue(5, 10),
      startSpeed: new IntervalValue(0.2, 0.6),
      startSize: new IntervalValue(5, 15),
      startRotation: new IntervalValue(0, Math.PI * 2),
      startColor: new ColorRange(
        new Vector4(targetColor.r, targetColor.g, targetColor.b, 0.15),
        new Vector4(targetColor.r * 1.2, targetColor.g * 1.2, targetColor.b * 1.2, 0.3)
      ),
      emissionOverTime: new ConstantValue(actualCount * 0.1 / 6),
      shape: new SphereEmitter({
        radius: 80 * scale,
        thickness: 0.6,
      }),
      material: new THREE.MeshBasicMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.BillBoard,
      renderOrder: -25,
    })

    accents.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.6, 1.1, 1, 0.4), 0]])))
    accents.addBehavior(new RotationOverLife(new IntervalValue(-0.08, 0.08)))

    accents.emitter.name = 'accents'
    systems.push(accents)

    // Add all systems to batch renderer and group
    systems.forEach((system) => {
      batchRenderer.addSystem(system)
      if (groupRef.current) {
        groupRef.current.add(system.emitter)
      }
    })

    systemsRef.current = systems

    // Cleanup
    return () => {
      systems.forEach((system) => {
        batchRenderer.deleteSystem(system)
        system.dispose()
      })
      scene.remove(batchRenderer)
      particleTexture.dispose()
    }
  }, [scene, scale, actualCount, particleTexture, targetColor])

  // Update color when galaxy changes
  useEffect(() => {
    const accents = systemsRef.current.find(s => s.emitter.name === 'accents')
    if (accents) {
      // Update start color for new particles
      accents.startColor = new ColorRange(
        new Vector4(targetColor.r, targetColor.g, targetColor.b, 0.15),
        new Vector4(targetColor.r * 1.2, targetColor.g * 1.2, targetColor.b * 1.2, 0.3)
      )
    }
  }, [targetColor])

  // Animation frame update
  useFrame((_, delta) => {
    // Update batch renderer (which updates all systems)
    if (batchRendererRef.current) {
      batchRendererRef.current.update(delta)
    }

    // Slow rotation of the entire nebula
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01
      groupRef.current.rotation.z += delta * 0.005
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* The particle systems are added imperatively */}
    </group>
  )
}

/**
 * GPU-accelerated galaxy core particle effect
 * Creates spiral arm particles with proper motion
 */
interface QuarksGalaxyCoreProps {
  readonly position: [number, number, number]
  readonly color: string
  readonly scale?: number
}

export function QuarksGalaxyCore({
  position,
  color,
  scale = 1,
}: QuarksGalaxyCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const batchRendererRef = useRef<InstanceType<typeof BatchedParticleRenderer> | null>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const { scene } = useThree()

  const colorObj = useMemo(() => new THREE.Color(color), [color])

  // Spiral arm particle texture
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    if (!groupRef.current) return

    const batchRenderer = new BatchedParticleRenderer()
    batchRendererRef.current = batchRenderer
    scene.add(batchRenderer)

    // Spiral arm particles
    const spiralSystem = new ParticleSystem({
      duration: 0,
      looping: true,
      startLife: new IntervalValue(4, 8),
      startSpeed: new ConstantValue(0),
      startSize: new IntervalValue(0.3, 1.2),
      startRotation: new ConstantValue(0),
      startColor: new ColorRange(
        new Vector4(colorObj.r * 0.8, colorObj.g * 0.8, colorObj.b * 0.8, 0.6),
        new Vector4(1, 1, 1, 0.9)
      ),
      emissionOverTime: new ConstantValue(50),
      shape: new ConeEmitter({
        radius: 0.5 * scale,
        arc: Math.PI * 2,
        thickness: 1,
        angle: Math.PI / 2, // Flat disc
      }),
      material: new THREE.MeshBasicMaterial({
        map: starTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.BillBoard,
      renderOrder: 10,
    })

    spiralSystem.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.5, 1, 0.8, 0.2), 0]])))

    batchRenderer.addSystem(spiralSystem)
    groupRef.current.add(spiralSystem.emitter)
    systemRef.current = spiralSystem

    return () => {
      batchRenderer.deleteSystem(spiralSystem)
      spiralSystem.dispose()
      scene.remove(batchRenderer)
      starTexture.dispose()
    }
  }, [scene, scale, colorObj, starTexture])

  useFrame((_, delta) => {
    if (batchRendererRef.current) {
      batchRendererRef.current.update(delta)
    }
    // Spiral rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Central glow */}
      <mesh>
        <circleGeometry args={[4 * scale, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.5}>
        <circleGeometry args={[4 * scale, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Warp speed / hyperspace particle effect using three.quarks
 * Creates streaking star lines during navigation transitions
 */
interface QuarksWarpEffectProps {
  readonly active: boolean
  readonly intensity?: number
}

export function QuarksWarpEffect({ active, intensity = 1 }: QuarksWarpEffectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const batchRendererRef = useRef<InstanceType<typeof BatchedParticleRenderer> | null>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const { scene, camera } = useThree()

  const streakTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createLinearGradient(0, 0, 0, 64)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.7, 'rgba(200, 220, 255, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    if (!groupRef.current) return

    const batchRenderer = new BatchedParticleRenderer()
    batchRendererRef.current = batchRenderer
    scene.add(batchRenderer)

    const warpSystem = new ParticleSystem({
      duration: 0,
      looping: true,
      startLife: new IntervalValue(0.3, 0.8),
      startSpeed: new IntervalValue(200, 400),
      startSize: new IntervalValue(0.1, 0.4),
      startRotation: new ConstantValue(0),
      startColor: new ColorRange(
        new Vector4(0.7, 0.8, 1, 0.5),
        new Vector4(1, 1, 1, 1)
      ),
      emissionOverTime: new ConstantValue(0), // Start inactive
      shape: new ConeEmitter({
        radius: 2,
        arc: Math.PI * 2,
        thickness: 1,
        angle: 0.1,
      }),
      material: new THREE.MeshBasicMaterial({
        map: streakTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      renderMode: RenderMode.StretchedBillBoard,
      speedFactor: 0.1,
      renderOrder: 100,
    })

    warpSystem.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 1, 1, 0.5), 0]])))

    batchRenderer.addSystem(warpSystem)
    groupRef.current.add(warpSystem.emitter)
    systemRef.current = warpSystem

    return () => {
      batchRenderer.deleteSystem(warpSystem)
      warpSystem.dispose()
      scene.remove(batchRenderer)
      streakTexture.dispose()
    }
  }, [scene, streakTexture])

  // Toggle emission based on active state
  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.emissionOverTime = new ConstantValue(active ? 500 * intensity : 0)
    }
  }, [active, intensity])

  useFrame((_, delta) => {
    if (batchRendererRef.current) {
      batchRendererRef.current.update(delta)
    }

    // Keep warp particles in front of camera
    if (groupRef.current && camera) {
      groupRef.current.position.copy(camera.position)
      groupRef.current.quaternion.copy(camera.quaternion)
      // Offset slightly forward
      const forward = new THREE.Vector3(0, 0, -10)
      forward.applyQuaternion(camera.quaternion)
      groupRef.current.position.add(forward)
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {/* Particle system attached imperatively */}
    </group>
  )
}
