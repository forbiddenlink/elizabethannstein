'use client'

import { Billboard, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { galaxies } from '@/lib/galaxyData'
import { isSceneProject } from '@/lib/proofLayer'
import { useViewStore } from '@/lib/store'
import { getGalaxyCenterPosition } from '@/lib/utils'
import { SCENE_FONT, toSceneText } from './sceneFont'

// Labels stay visible at any distance, from the whole-map view down to close range, where they
// fade out so they do not sit on top of the planets.
const FADE_OUT_START = 50 // start fading out (close)
const FADE_OUT_END = 38 // fully invisible when very close
const BASE_FONT = 1.1

interface GalaxyLabelProps {
  name: string
  projectCount: number
  position: [number, number, number]
  color: string
  index: number
}

function GalaxyLabel({ name, projectCount, position, color, index: _index }: GalaxyLabelProps) {
  const nameRef = useRef<any>(null)
  const countRef = useRef<any>(null)
  const lineRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const posVec = useMemo(() => new THREE.Vector3(...position), [position])

  // Typewriter effect state (imperative, no re-renders)
  const typewriterRef = useRef({ chars: 0, lastTime: 0, revealed: false })
  const [_displayName, setDisplayName] = useState(name)

  // Label sits above the galaxy core
  const labelY = position[1] + 14
  const labelPos: [number, number, number] = [position[0], labelY, position[2]]

  useFrame((state) => {
    const dist = camera.position.distanceTo(posVec)

    let opacity = 1
    if (dist <= FADE_OUT_START) {
      opacity = Math.max(0, Math.min(1, (dist - FADE_OUT_END) / (FADE_OUT_START - FADE_OUT_END)))
    }

    // Hold the label at a readable on-screen size: scale with distance, never below 1.
    if (groupRef.current) {
      const targetPx = size.width >= 768 ? 15 : 13
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 45
      const worldPerPx = (2 * Math.tan((fov * Math.PI) / 360) * dist) / size.height
      groupRef.current.scale.setScalar(Math.max(1, (targetPx * worldPerPx) / BASE_FONT))
    }

    // Typewriter: trigger when label first becomes visible
    const tw = typewriterRef.current
    if (opacity > 0.05 && !tw.revealed) {
      const now = state.clock.elapsedTime
      if (now - tw.lastTime > 0.045) {
        // ~22fps typewriter
        tw.lastTime = now
        tw.chars = Math.min(name.length, tw.chars + 1)
        setDisplayName(name.slice(0, tw.chars) + (tw.chars < name.length ? '█' : ''))
        if (tw.chars >= name.length) tw.revealed = true
      }
    } else if (opacity < 0.02 && tw.revealed) {
      // Reset typewriter when label disappears
      tw.chars = 0
      tw.revealed = false
      setDisplayName(name)
    }

    if (nameRef.current) {
      nameRef.current.material.opacity = opacity
    }
    if (countRef.current) {
      countRef.current.material.opacity = opacity * 0.7
    }
    if (lineRef.current) {
      ;(lineRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.25
    }
  })

  return (
    <group position={labelPos}>
      <Billboard>
        <group ref={groupRef}>
          {/* Galaxy name */}
          <Text
            ref={nameRef}
            font={SCENE_FONT}
            fontSize={BASE_FONT}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
            position={[0, 0.3, 0]}
            material-transparent={true}
            material-opacity={0}
            material-depthWrite={false}
            material-depthTest={false}
            material-toneMapped={false}
            material-fog={false}
            renderOrder={20}
          >
            {toSceneText(name)}
          </Text>

          {/* Project count subtitle */}
          <Text
            ref={countRef}
            font={SCENE_FONT}
            fontSize={0.55}
            color={color}
            anchorX="center"
            anchorY="top"
            position={[0, -0.1, 0]}
            material-transparent={true}
            material-opacity={0}
            material-depthWrite={false}
            material-depthTest={false}
            material-toneMapped={false}
            material-fog={false}
            renderOrder={20}
          >
            {`${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`}
          </Text>
        </group>
      </Billboard>

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
        const sceneCount = galaxy.projects.filter((p) => isSceneProject(p.id)).length
        if (sceneCount === 0) return null

        const position = getGalaxyCenterPosition(index)
        return (
          <GalaxyLabel
            key={galaxy.id}
            name={galaxy.name}
            projectCount={sceneCount}
            position={position}
            color={galaxy.color}
            index={index}
          />
        )
      })}
    </>
  )
}
