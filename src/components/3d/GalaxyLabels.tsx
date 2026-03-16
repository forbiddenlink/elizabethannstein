'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { getGalaxyCenterPosition } from '@/lib/utils'
import { useViewStore } from '@/lib/store'

const FADE_IN_START = 60   // start fading in (far)
const FADE_IN_END = 28     // fully visible
const FADE_OUT_START = 22  // start fading out (close)
const FADE_OUT_END = 10    // fully invisible when very close

interface GalaxyLabelProps {
  name: string
  projectCount: number
  position: [number, number, number]
  color: string
  index: number
}

function GalaxyLabel({ name, projectCount, position, color, index }: GalaxyLabelProps) {
  const nameRef = useRef<any>(null)
  const countRef = useRef<any>(null)
  const lineRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const posVec = useMemo(() => new THREE.Vector3(...position), [position])

  // Label sits above the galaxy core
  const labelY = position[1] + 7.5
  const labelPos: [number, number, number] = [position[0], labelY, position[2]]

  useFrame(() => {
    const dist = camera.position.distanceTo(posVec)

    let opacity = 0
    if (dist > FADE_IN_START) {
      opacity = 0
    } else if (dist > FADE_IN_END) {
      opacity = 1 - (dist - FADE_IN_END) / (FADE_IN_START - FADE_IN_END)
      opacity = Math.max(0, Math.min(1, opacity))
    } else if (dist > FADE_OUT_START) {
      opacity = 1
    } else if (dist > FADE_OUT_END) {
      opacity = (dist - FADE_OUT_END) / (FADE_OUT_START - FADE_OUT_END)
      opacity = Math.max(0, Math.min(1, opacity))
    }

    if (nameRef.current) {
      nameRef.current.material.opacity = opacity * 0.95
    }
    if (countRef.current) {
      countRef.current.material.opacity = opacity * 0.5
    }
    if (lineRef.current) {
      ;(lineRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.25
    }
  })

  return (
    <group position={labelPos}>
      {/* Galaxy name */}
      <Text
        ref={nameRef}
        fontSize={1.1}
        color={color}
        anchorX="center"
        anchorY="bottom"
        position={[0, 0.3, 0]}
        font="/fonts/inter-bold.woff"
        material-transparent={true}
        material-opacity={0}
        material-depthWrite={false}
        outlineWidth={0.04}
        outlineColor="#000000"
        outlineOpacity={0.6}
      >
        {name}
      </Text>

      {/* Project count subtitle */}
      <Text
        ref={countRef}
        fontSize={0.55}
        color={color}
        anchorX="center"
        anchorY="top"
        position={[0, -0.1, 0]}
        font="/fonts/inter-regular.woff"
        material-transparent={true}
        material-opacity={0}
        material-depthWrite={false}
        letterSpacing={0.15}
      >
        {`${projectCount} PROJECTS`}
      </Text>

      {/* Thin vertical line from label down toward the core — subtle beacon */}
      <mesh ref={lineRef} position={[0, -(labelY - position[1]) / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, labelY - position[1] - 1.5, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function GalaxyLabels() {
  const view = useViewStore((state) => state.view)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)

  // Hide during exploration or journey (not relevant in these modes)
  if (view === 'exploration' || isJourneyMode) return null

  return (
    <>
      {galaxies.map((galaxy, index) => {
        const position = getGalaxyCenterPosition(index)
        return (
          <GalaxyLabel
            key={galaxy.id}
            name={galaxy.name}
            projectCount={galaxy.projects.length}
            position={position}
            color={galaxy.color}
            index={index}
          />
        )
      })}
    </>
  )
}
