'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'

interface RippleInstance {
  id: number
  position: THREE.Vector3
  startTime: number
  color: THREE.Color
}

interface ClickRippleProps {
  isMobile?: boolean
}

/**
 * Expanding ring wave effect when selecting a planet
 * Creates satisfying visual feedback
 */
export function ClickRipple({ isMobile = false }: ClickRippleProps) {
  const [ripples, setRipples] = useState<RippleInstance[]>([])
  const rippleIdRef = useRef(0)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const prevProject = useRef<string | null>(null)

  // Trigger ripple when project is selected
  useEffect(() => {
    if (selectedProject && selectedProject !== prevProject.current) {
      // Get project position from store or use camera target
      const newRipple: RippleInstance = {
        id: rippleIdRef.current++,
        position: new THREE.Vector3(0, 0, 0), // Will be set by planet
        startTime: Date.now(),
        color: new THREE.Color('#ffffff')
      }
      setRipples(prev => [...prev, newRipple])

      // Clean up old ripples
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 2000)
    }
    prevProject.current = selectedProject
  }, [selectedProject])

  return (
    <group>
      {ripples.map(ripple => (
        <RippleRing key={ripple.id} ripple={ripple} isMobile={isMobile} />
      ))}
    </group>
  )
}

function RippleRing({ ripple, isMobile }: { ripple: RippleInstance; isMobile: boolean }) {
  // Reduce geometry segments on mobile
  const segments = isMobile ? [32, 24, 16] : [64, 48, 32]
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const elapsed = (Date.now() - ripple.startTime) / 1000
    const duration = 1.5

    if (elapsed > duration) return

    const progress = elapsed / duration
    const easeOut = 1 - Math.pow(1 - progress, 3)

    // Scale rings outward
    const scale = 1 + easeOut * 8
    const opacity = (1 - progress) * 0.6

    if (ringRef.current) {
      ringRef.current.scale.setScalar(scale)
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity
    }

    if (ring2Ref.current) {
      ring2Ref.current.scale.setScalar(scale * 0.7)
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * 0.7
    }

    if (ring3Ref.current) {
      ring3Ref.current.scale.setScalar(scale * 0.4)
      const mat = ring3Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity * 0.5
    }
  })

  return (
    <group position={ripple.position}>
      {/* Primary ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, segments[0]]} />
        <meshBasicMaterial
          color={ripple.color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, segments[1]]} />
        <meshBasicMaterial
          color={ripple.color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Tertiary ring */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.6, segments[2]]} />
        <meshBasicMaterial
          color={ripple.color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
