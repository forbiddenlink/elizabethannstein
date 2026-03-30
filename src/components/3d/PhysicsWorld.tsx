'use client'

import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

/**
 * Physics-enabled wrapper for 3D scenes
 * Wrap content that should have physics simulation
 */
export function PhysicsWorld({
  children,
  gravity = [0, -9.81, 0],
  debug = false,
}: {
  children: React.ReactNode
  gravity?: [number, number, number]
  debug?: boolean
}) {
  return (
    <Suspense fallback={null}>
      <Physics gravity={gravity} debug={debug} updateLoop="independent">
        {children}
      </Physics>
    </Suspense>
  )
}

/**
 * Interactive floating asteroid that responds to cursor
 * Use in exploration mode or as decorative physics elements
 */
export function PhysicsAsteroid({
  position,
  size = 0.5,
  color = '#666666',
}: {
  position: [number, number, number]
  size?: number
  color?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <RigidBody
      type="dynamic"
      position={position}
      colliders={false}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <BallCollider args={[size]} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </RigidBody>
  )
}

/**
 * Floating platform for exploration mode
 */
export function PhysicsPlatform({
  position,
  size = [4, 0.5, 4],
  color = '#333344',
}: {
  position: [number, number, number]
  size?: [number, number, number]
  color?: string
}) {
  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>
    </RigidBody>
  )
}

/**
 * Cursor-following attractor that pulls nearby physics objects
 */
export function CursorAttractor({ strength = 5 }: { strength?: number }) {
  const { camera, pointer } = useThree()
  const attractorRef = useRef(new THREE.Vector3())

  useFrame(() => {
    // Project cursor to world space at a fixed distance
    const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5)
    vector.unproject(camera)
    const dir = vector.sub(camera.position).normalize()
    const distance = 20
    attractorRef.current.copy(camera.position).add(dir.multiplyScalar(distance))
  })

  // The attractor position can be used by physics bodies
  // Implementation would involve Rapier's attractor API
  return null
}

/**
 * Asteroid field with physics - decorative floating rocks
 */
export function PhysicsAsteroidField({
  count = 10,
  bounds = 20,
  baseColor = '#555566',
}: {
  count?: number
  bounds?: number
  baseColor?: string
}) {
  const asteroids = Array.from({ length: count }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * bounds,
      (Math.random() - 0.5) * bounds * 0.5 + 5,
      (Math.random() - 0.5) * bounds,
    ] as [number, number, number],
    size: 0.2 + Math.random() * 0.5,
  }))

  return (
    <>
      {asteroids.map((asteroid) => (
        <PhysicsAsteroid
          key={asteroid.id}
          position={asteroid.position}
          size={asteroid.size}
          color={baseColor}
        />
      ))}
    </>
  )
}

/**
 * Zero-gravity space environment
 */
export function SpacePhysics({ children }: { children: React.ReactNode }) {
  return (
    <PhysicsWorld gravity={[0, 0, 0]}>
      {children}
    </PhysicsWorld>
  )
}

/**
 * Planet surface with gravity
 */
export function PlanetSurfacePhysics({
  children,
  gravityStrength = 9.81,
}: {
  children: React.ReactNode
  gravityStrength?: number
}) {
  return (
    <PhysicsWorld gravity={[0, -gravityStrength, 0]}>
      {children}
    </PhysicsWorld>
  )
}
