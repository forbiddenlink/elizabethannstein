'use client'
import { OrbitControls } from '@react-three/drei'
import { useMemo, useState } from 'react'
import WebGPUCanvas from '@/components/3d/WebGPUCanvas'
import {
  fleetActivity,
  glowIntensity,
  layoutPositions,
  seedFromId,
  structureHeight,
} from '@/lib/city/layout'
import type { CityModel } from '@/lib/city/types'
import { usePrefersReducedMotion } from '@/lib/store'
import { BioStructure } from './BioStructure'
import { DayNightLight } from './DayNightLight'
import { Filaments } from './Filaments'
import { Motes } from './Motes'

type Props = {
  model: CityModel
  selectedId: string | null
  onSelectNode: (id: string | null) => void
}

export default function CityScene({ model, selectedId, onSelectNode }: Props) {
  const positions = useMemo(() => layoutPositions(model), [model])
  const districtById = useMemo(() => new Map(model.districts.map((d) => [d.id, d])), [model])
  const activity = useMemo(() => fleetActivity(model), [model])
  const reducedMotion = usePrefersReducedMotion()
  const [dragging, setDragging] = useState(false)
  return (
    <WebGPUCanvas camera={{ position: [19, 12, 21], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 18, 60]} />
      <DayNightLight activity={activity} reducedMotion={reducedMotion} />
      <Motes reducedMotion={reducedMotion} />
      <pointLight position={[0, 12, 0]} intensity={20} distance={60} color="#39ffd0" />
      {/* ground */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: R3F mesh — Three.js pointer events, not DOM */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMissed={() => onSelectNode(null)}
        onClick={(e) => {
          e.stopPropagation()
          onSelectNode(null)
        }}
      >
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#03060d" roughness={1} />
      </mesh>
      <Filaments model={model} positions={positions} />
      {model.nodes.map((n) => {
        const p = positions.get(n.id)
        const d = districtById.get(n.districtId)
        if (!p || !d) return null
        return (
          <BioStructure
            key={n.id}
            position={p}
            height={structureHeight(n.metrics.sizeScore)}
            glow={glowIntensity(n.metrics.activityScore)}
            color={d.palette.base}
            glowColor={d.palette.glow}
            seed={seedFromId(n.id)}
            reducedMotion={reducedMotion}
            selected={selectedId === n.id}
            onSelect={() => onSelectNode(n.id)}
          />
        )
      })}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reducedMotion && !dragging && selectedId === null}
        autoRotateSpeed={0.3}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
        minDistance={6}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2.1}
      />
    </WebGPUCanvas>
  )
}
