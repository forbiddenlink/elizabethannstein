'use client'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import WebGPUCanvas from '@/components/3d/WebGPUCanvas'
import { glowIntensity, layoutPositions, seedFromId, structureHeight } from '@/lib/city/layout'
import type { CityModel } from '@/lib/city/types'
import { usePrefersReducedMotion } from '@/lib/store'
import { BioStructure } from './BioStructure'
import { Motes } from './Motes'

type Props = {
  model: CityModel
  selectedId: string | null
  onSelectNode: (id: string | null) => void
}

export default function CityScene({ model, selectedId, onSelectNode }: Props) {
  const positions = useMemo(() => layoutPositions(model), [model])
  const districtById = useMemo(() => new Map(model.districts.map((d) => [d.id, d])), [model])
  const reducedMotion = usePrefersReducedMotion()
  return (
    <WebGPUCanvas camera={{ position: [14, 9, 16], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 18, 60]} />
      <hemisphereLight args={['#20406a', '#010208', 0.35]} />
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
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#03060d" roughness={1} />
      </mesh>
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
        minDistance={6}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
      />
    </WebGPUCanvas>
  )
}
