'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { CityInfoPanel } from '@/components/3d/city/CityInfoPanel'
import { Scene3DErrorBoundary } from '@/components/ErrorBoundary'
import { demoCity } from '@/lib/city/demoCity'

// Lazy load 3D scene — mirrors the /explore pattern (keeps this route's bundle lean).
const CityScene = dynamic(() => import('@/components/3d/city/CityScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-dvh bg-[#02040a] flex items-center justify-center">
      <p className="text-sm text-white/50">Loading city…</p>
    </div>
  ),
})

export default function CityPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedNode = useMemo(
    () => demoCity.nodes.find((n) => n.id === selectedId) ?? null,
    [selectedId]
  )
  const district = useMemo(
    () => demoCity.districts.find((d) => d.id === selectedNode?.districtId) ?? null,
    [selectedNode]
  )
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative w-full h-dvh overflow-hidden bg-[#02040a] outline-none"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Scene3DErrorBoundary maxRetries={3} retryDelay={2000}>
          <CityScene model={demoCity} selectedId={selectedId} onSelectNode={setSelectedId} />
        </Scene3DErrorBoundary>
      </div>
      <CityInfoPanel node={selectedNode} district={district} />
    </main>
  )
}
