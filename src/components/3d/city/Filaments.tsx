'use client'
import { QuadraticBezierLine } from '@react-three/drei'
import { useMemo } from 'react'
import type { CityModel } from '@/lib/city/types'

type Props = {
  model: CityModel
  positions: Map<string, [number, number, number]>
}

// Dependency filaments — glowing arcs between connected structures.
// Arc upward so the reef reads as woven rather than a flat graph.
export function Filaments({ model, positions }: Props) {
  const glowById = useMemo(
    () => new Map(model.districts.map((d) => [d.id, d.palette.glow])),
    [model]
  )
  const nodeDistrict = useMemo(() => new Map(model.nodes.map((n) => [n.id, n.districtId])), [model])

  return (
    <group>
      {model.edges.map((e) => {
        const a = positions.get(e.from)
        const b = positions.get(e.to)
        if (!a || !b) return null
        const start: [number, number, number] = [a[0], 0.4, a[2]]
        const end: [number, number, number] = [b[0], 0.4, b[2]]
        const span = Math.hypot(b[0] - a[0], b[2] - a[2])
        const mid: [number, number, number] = [
          (a[0] + b[0]) / 2,
          0.4 + span * 0.35,
          (a[2] + b[2]) / 2,
        ]
        const color = glowById.get(nodeDistrict.get(e.from) ?? '') ?? '#39ffd0'
        return (
          <QuadraticBezierLine
            key={`${e.from}-${e.to}`}
            start={start}
            end={end}
            mid={mid}
            color={color}
            lineWidth={1.2}
            transparent
            opacity={0.35}
          />
        )
      })}
    </group>
  )
}
