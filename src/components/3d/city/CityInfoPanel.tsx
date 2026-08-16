'use client'
import type { CityDistrict, CityNode } from '@/lib/city/types'

export function CityInfoPanel({
  node,
  district,
}: {
  node: CityNode | null
  district: CityDistrict | null
}) {
  if (!node) return null
  return (
    <aside
      data-testid="city-info-panel"
      style={{ borderColor: district?.palette.glow ?? '#39ffd0' }}
      className="absolute right-6 top-6 w-65 rounded-xl border bg-black/80 p-4 text-[#cfeee6] backdrop-blur-md"
    >
      <h2 className="m-0 text-base">{node.id}</h2>
      <p className="mt-1 mb-3 opacity-70">{district?.label ?? node.districtId}</p>
      <dl className="grid grid-cols-[1fr_auto] gap-1 text-sm">
        <dt>Activity</dt>
        <dd>{Math.round(node.metrics.activityScore * 100)}%</dd>
        <dt>Size</dt>
        <dd>{Math.round(node.metrics.sizeScore * 100)}%</dd>
        <dt>Age</dt>
        <dd>{node.metrics.ageDays}d</dd>
      </dl>
    </aside>
  )
}
