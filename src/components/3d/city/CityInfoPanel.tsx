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
      style={{
        position: 'absolute',
        right: 24,
        top: 24,
        width: 260,
        padding: 16,
        borderRadius: 12,
        background: 'rgba(3,8,16,0.8)',
        color: '#cfeee6',
        border: `1px solid ${district?.palette.glow ?? '#39ffd0'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16 }}>{node.id}</h2>
      <p style={{ margin: '4px 0 12px', opacity: 0.7 }}>{district?.label ?? node.districtId}</p>
      <dl style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, fontSize: 13 }}>
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
