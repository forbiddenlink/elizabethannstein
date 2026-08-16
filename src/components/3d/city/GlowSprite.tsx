'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

let cached: THREE.CanvasTexture | null = null

// Soft radial glow texture, generated once and shared. Additive-blended, this
// reads as bloom on any renderer (no composer, works under WebGL/SwiftShader).
export function glowTexture(): THREE.CanvasTexture {
  if (cached) return cached
  const size = 128
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  cached = new THREE.CanvasTexture(c)
  return cached
}

type Props = { color: string; scale: number; opacity: number }

// Camera-facing bloom halo behind a structure.
export function GlowSprite({ color, scale, opacity }: Props) {
  const tex = useMemo(() => glowTexture(), [])
  return (
    <sprite scale={[scale, scale, scale]}>
      <spriteMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  )
}
