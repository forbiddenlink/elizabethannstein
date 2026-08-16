# Bioluminescent City — Phase 0 (Look Spike) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the bioluminescent city looks *extraordinary* — one glowing structure type, dark scene, one biome, hand-authored data, click→info — on a new `/city` route, before investing in the data pipeline.

**Architecture:** New `/city` route renders a client-only `CityScene` mounted through the EXISTING `WebGPUCanvas` (WebGPU renderer + WebGL fallback already wired). Structures are placed by a deterministic, pure layout function from a hand-authored `CityModel` fixture. Glow comes from emissive materials + an additive halo mesh — NOT the existing `PostProcessingEffects` bloom (buggy, disabled). Pure logic is TDD-tested; the look is a human go/no-go plus a Playwright visual baseline.

**Tech Stack:** Next 16 (App Router), React 19, three 0.185, @react-three/fiber 9.6, @react-three/drei, Vitest (jsdom), Playwright (visual), Biome 2.5.2, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-16-bioluminescent-city-design.md`

## Global Constraints

- **Do NOT modify** `src/components/3d/GalaxyScene.tsx`, `src/lib/galaxyData.ts`, `src/app/explore/*`, or any galaxy-specific component. The city is additive.
- **Reuse, don't rebuild:** mount via `src/components/3d/WebGPUCanvas.tsx`; use `checkWebGPUSupport` from `src/lib/webgpu.ts`. Do not add a second renderer-detection layer.
- **Glow constraint:** do NOT use `src/components/3d/PostProcessingEffects.tsx` (documented render bug, ships disabled). Achieve glow with emissive materials + additive halo geometry.
- **Route pattern:** load the scene with `dynamic(() => import(...), { ssr: false })` inside an error boundary, mirroring `src/app/explore/page.tsx`.
- **No real fleet data in Phase 0.** Hand-authored fixture only; sanitizer/pipeline is Phase 1.
- Package manager: **pnpm**. Respect Biome (`pnpm biome:check`).
- All new city code lives under `src/lib/city/`, `src/components/3d/city/`, `src/app/city/`, tests in `src/__tests__/`.

---

### Task 1: CityModel types + hand-authored demo fixture

**Files:**
- Create: `src/lib/city/types.ts`
- Create: `src/lib/city/demoCity.ts`
- Test: `src/__tests__/cityModel.test.ts`

**Interfaces:**
- Produces:
  - `CityDistrict = { id: string; label: string; palette: { base: string; glow: string } }`
  - `CityNode = { id: string; districtId: string; metrics: { ageDays: number; activityScore: number; sizeScore: number } }` — `activityScore`/`sizeScore` in `0..1`, `ageDays >= 0`
  - `CityEdge = { from: string; to: string }`
  - `CityModel = { generatedAt: string; districts: CityDistrict[]; nodes: CityNode[]; edges: CityEdge[] }`
  - `demoCity: CityModel` — one district ("personal"), ~8 nodes, a few edges.

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/cityModel.test.ts
import { describe, it, expect } from 'vitest'
import { demoCity } from '@/lib/city/demoCity'

describe('demoCity fixture', () => {
  it('has at least one district and several nodes', () => {
    expect(demoCity.districts.length).toBeGreaterThanOrEqual(1)
    expect(demoCity.nodes.length).toBeGreaterThanOrEqual(6)
  })
  it('has unique node ids', () => {
    const ids = demoCity.nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every node references an existing district', () => {
    const districtIds = new Set(demoCity.districts.map((d) => d.id))
    for (const n of demoCity.nodes) expect(districtIds.has(n.districtId)).toBe(true)
  })
  it('every edge references existing nodes', () => {
    const nodeIds = new Set(demoCity.nodes.map((n) => n.id))
    for (const e of demoCity.edges) {
      expect(nodeIds.has(e.from)).toBe(true)
      expect(nodeIds.has(e.to)).toBe(true)
    }
  })
  it('metrics are in valid ranges', () => {
    for (const n of demoCity.nodes) {
      expect(n.metrics.ageDays).toBeGreaterThanOrEqual(0)
      expect(n.metrics.activityScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.activityScore).toBeLessThanOrEqual(1)
      expect(n.metrics.sizeScore).toBeGreaterThanOrEqual(0)
      expect(n.metrics.sizeScore).toBeLessThanOrEqual(1)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/__tests__/cityModel.test.ts`
Expected: FAIL — cannot resolve `@/lib/city/demoCity`.

- [ ] **Step 3: Write the types**

```ts
// src/lib/city/types.ts
export type CityDistrict = { id: string; label: string; palette: { base: string; glow: string } }
export type CityNode = {
  id: string
  districtId: string
  metrics: { ageDays: number; activityScore: number; sizeScore: number }
}
export type CityEdge = { from: string; to: string }
export type CityModel = {
  generatedAt: string
  districts: CityDistrict[]
  nodes: CityNode[]
  edges: CityEdge[]
}
```

- [ ] **Step 4: Write the demo fixture**

```ts
// src/lib/city/demoCity.ts
import type { CityModel } from './types'

export const demoCity: CityModel = {
  generatedAt: '2026-08-16T00:00:00.000Z',
  districts: [{ id: 'personal', label: 'Personal', palette: { base: '#0a2a4f', glow: '#39ffd0' } }],
  nodes: [
    { id: 'n1', districtId: 'personal', metrics: { ageDays: 12, activityScore: 0.95, sizeScore: 0.7 } },
    { id: 'n2', districtId: 'personal', metrics: { ageDays: 40, activityScore: 0.7, sizeScore: 0.4 } },
    { id: 'n3', districtId: 'personal', metrics: { ageDays: 5, activityScore: 0.85, sizeScore: 0.9 } },
    { id: 'n4', districtId: 'personal', metrics: { ageDays: 200, activityScore: 0.15, sizeScore: 0.5 } },
    { id: 'n5', districtId: 'personal', metrics: { ageDays: 90, activityScore: 0.45, sizeScore: 0.3 } },
    { id: 'n6', districtId: 'personal', metrics: { ageDays: 365, activityScore: 0.05, sizeScore: 0.6 } },
    { id: 'n7', districtId: 'personal', metrics: { ageDays: 25, activityScore: 0.6, sizeScore: 0.8 } },
    { id: 'n8', districtId: 'personal', metrics: { ageDays: 60, activityScore: 0.3, sizeScore: 0.2 } },
  ],
  edges: [
    { from: 'n1', to: 'n3' },
    { from: 'n1', to: 'n7' },
    { from: 'n2', to: 'n5' },
    { from: 'n3', to: 'n7' },
  ],
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/__tests__/cityModel.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/city/types.ts src/lib/city/demoCity.ts src/__tests__/cityModel.test.ts
git commit -m "feat(city): add CityModel types + demo fixture with invariant tests"
```

---

### Task 2: Deterministic layout + metric mappings (pure)

**Files:**
- Create: `src/lib/city/layout.ts`
- Test: `src/__tests__/cityLayout.test.ts`

**Interfaces:**
- Consumes: `CityModel`, `CityNode` from `src/lib/city/types.ts`.
- Produces:
  - `seedFromId(id: string): number` — stable non-negative int hash.
  - `structureHeight(sizeScore: number): number` — returns `0.5 + sizeScore * 3` (range `0.5..3.5`), monotonic non-decreasing.
  - `glowIntensity(activityScore: number): number` — returns `0.15 + activityScore * 1.85` (range `0.15..2`), monotonic non-decreasing.
  - `layoutPositions(model: CityModel): Map<string, [number, number, number]>` — deterministic; same model → identical map. `y` is always `0` (structures sit on a ground plane; height is the mesh's own scale, not its position).

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/cityLayout.test.ts
import { describe, it, expect } from 'vitest'
import { demoCity } from '@/lib/city/demoCity'
import { seedFromId, structureHeight, glowIntensity, layoutPositions } from '@/lib/city/layout'

describe('city layout', () => {
  it('seedFromId is stable and non-negative', () => {
    expect(seedFromId('n1')).toBe(seedFromId('n1'))
    expect(seedFromId('n1')).toBeGreaterThanOrEqual(0)
    expect(seedFromId('n1')).not.toBe(seedFromId('n2'))
  })
  it('structureHeight is monotonic in sizeScore', () => {
    expect(structureHeight(0.2)).toBeLessThan(structureHeight(0.8))
  })
  it('glowIntensity is monotonic in activityScore', () => {
    expect(glowIntensity(0.1)).toBeLessThan(glowIntensity(0.9))
  })
  it('layoutPositions is deterministic across calls', () => {
    const a = layoutPositions(demoCity)
    const b = layoutPositions(demoCity)
    expect([...a.entries()]).toEqual([...b.entries()])
  })
  it('produces a position for every node, all on the ground plane', () => {
    const pos = layoutPositions(demoCity)
    for (const n of demoCity.nodes) {
      expect(pos.has(n.id)).toBe(true)
      expect(pos.get(n.id)![1]).toBe(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/__tests__/cityLayout.test.ts`
Expected: FAIL — cannot resolve `@/lib/city/layout`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/city/layout.ts
import type { CityModel } from './types'

export function seedFromId(id: string): number {
  // FNV-1a 32-bit, forced non-negative.
  let h = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function structureHeight(sizeScore: number): number {
  return 0.5 + sizeScore * 3
}

export function glowIntensity(activityScore: number): number {
  return 0.15 + activityScore * 1.85
}

export function layoutPositions(model: CityModel): Map<string, [number, number, number]> {
  const out = new Map<string, [number, number, number]>()
  const radius = 8
  for (const node of model.nodes) {
    const s = seedFromId(node.id)
    // Deterministic golden-angle spiral packing on the ground plane.
    const idx = s % 997
    const angle = idx * 2.399963 // golden angle (radians)
    const r = radius * Math.sqrt(((s >>> 5) % 100) / 100)
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    out.set(node.id, [x, 0, z])
  }
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/__tests__/cityLayout.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/city/layout.ts src/__tests__/cityLayout.test.ts
git commit -m "feat(city): add deterministic layout + metric mappings"
```

---

### Task 3: Bioluminescent structure + scene + `/city` route (the look)

**Files:**
- Create: `src/components/3d/city/BioStructure.tsx`
- Create: `src/components/3d/city/CityScene.tsx`
- Create: `src/app/city/page.tsx`
- Test: `e2e/visual/city.spec.ts`

**Interfaces:**
- Consumes: `CityModel` (`types.ts`), `demoCity` (`demoCity.ts`), `layoutPositions`/`structureHeight`/`glowIntensity` (`layout.ts`), `WebGPUCanvas` (`src/components/3d/WebGPUCanvas.tsx`).
- Produces:
  - `BioStructure` props: `{ position: [number, number, number]; height: number; glow: number; color: string; glowColor: string; selected?: boolean; onSelect?: () => void }`
  - `CityScene` props: `{ model: CityModel; selectedId: string | null; onSelectNode: (id: string | null) => void }` (default export, client component).

Glow approach (no PostProcessingEffects): each structure = a tapered vertical mesh with `meshStandardMaterial` `emissive`/`emissiveIntensity`, wrapped by a slightly larger additive-blended translucent "halo" mesh. Dark scene, low ambient, one point/hemisphere light. This reads as bioluminescent without any bloom composer.

- [ ] **Step 1: Write the BioStructure component**

```tsx
// src/components/3d/city/BioStructure.tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  position: [number, number, number]
  height: number
  glow: number
  color: string
  glowColor: string
  selected?: boolean
  onSelect?: () => void
}

export function BioStructure({ position, height, glow, color, glowColor, selected, onSelect }: Props) {
  const core = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    // Gentle breathing pulse; brighter when selected.
    const t = state.clock.elapsedTime
    const pulse = 0.85 + Math.sin(t * 1.5 + position[0]) * 0.15
    const mat = core.current?.material as THREE.MeshStandardMaterial | undefined
    if (mat) mat.emissiveIntensity = glow * pulse * (selected ? 1.8 : 1)
  })
  return (
    <group position={[position[0], height / 2, position[2]]}>
      {/* core */}
      <mesh
        ref={core}
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
      >
        <cylinderGeometry args={[0.18, 0.32, height, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={new THREE.Color(glowColor)}
          emissiveIntensity={glow}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* additive halo (fake bloom, no composer) */}
      <mesh scale={[1.6, 1.05, 1.6]}>
        <cylinderGeometry args={[0.22, 0.4, height, 6]} />
        <meshBasicMaterial
          color={new THREE.Color(glowColor)}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Write the CityScene**

```tsx
// src/components/3d/city/CityScene.tsx
'use client'
import { useMemo } from 'react'
import WebGPUCanvas from '@/components/3d/WebGPUCanvas'
import { OrbitControls } from '@react-three/drei'
import { BioStructure } from './BioStructure'
import { layoutPositions, structureHeight, glowIntensity } from '@/lib/city/layout'
import type { CityModel } from '@/lib/city/types'

type Props = {
  model: CityModel
  selectedId: string | null
  onSelectNode: (id: string | null) => void
}

export default function CityScene({ model, selectedId, onSelectNode }: Props) {
  const positions = useMemo(() => layoutPositions(model), [model])
  const districtById = useMemo(
    () => new Map(model.districts.map((d) => [d.id, d])),
    [model],
  )
  return (
    <WebGPUCanvas camera={{ position: [10, 8, 12], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 14, 40]} />
      <hemisphereLight args={['#20406a', '#010208', 0.35]} />
      <pointLight position={[0, 12, 0]} intensity={20} distance={60} color="#39ffd0" />
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onPointerMissed={() => onSelectNode(null)}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#03060d" roughness={1} />
      </mesh>
      {model.nodes.map((n) => {
        const p = positions.get(n.id)!
        const d = districtById.get(n.districtId)!
        return (
          <BioStructure
            key={n.id}
            position={p}
            height={structureHeight(n.metrics.sizeScore)}
            glow={glowIntensity(n.metrics.activityScore)}
            color={d.palette.base}
            glowColor={d.palette.glow}
            selected={selectedId === n.id}
            onSelect={() => onSelectNode(n.id)}
          />
        )
      })}
      <OrbitControls enablePan={false} minDistance={6} maxDistance={30} maxPolarAngle={Math.PI / 2.1} />
    </WebGPUCanvas>
  )
}
```

Note: confirm `WebGPUCanvas` is a default export and accepts `camera`/`dpr` props by reading `src/components/3d/WebGPUCanvas.tsx` first; adapt the import/props to its actual signature.

- [ ] **Step 3: Write the `/city` route**

```tsx
// src/app/city/page.tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { demoCity } from '@/lib/city/demoCity'

const CityScene = dynamic(() => import('@/components/3d/city/CityScene'), { ssr: false })

export default function CityPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  return (
    <main style={{ position: 'fixed', inset: 0, background: '#02040a' }}>
      <CityScene model={demoCity} selectedId={selectedId} onSelectNode={setSelectedId} />
    </main>
  )
}
```

- [ ] **Step 4: Manually run the dev server and LOOK**

Run: `pnpm dev`, open `http://localhost:3000/city`.
Expected: a dark scene with several glowing, gently pulsing structures; clicking one brightens it; orbit works.

- [ ] **Step 5: Write a Playwright smoke test (renders a canvas)**

```ts
// e2e/visual/city.spec.ts
import { test, expect } from '@playwright/test'

test('/city renders a 3D canvas', async ({ page }) => {
  await page.goto('/city')
  const canvas = page.locator('canvas')
  await expect(canvas.first()).toBeVisible({ timeout: 15000 })
})
```

- [ ] **Step 6: Run the smoke test**

Run: `pnpm test:e2e:smoke` (or `pnpm exec playwright test e2e/visual/city.spec.ts`)
Expected: PASS. (If the runner needs a webServer, confirm `playwright.config.ts` starts the dev server; adapt if needed.)

- [ ] **Step 7: Biome + commit**

```bash
pnpm biome:check
git add src/components/3d/city/BioStructure.tsx src/components/3d/city/CityScene.tsx src/app/city/page.tsx e2e/visual/city.spec.ts
git commit -m "feat(city): bioluminescent structures + scene on /city route"
```

---

### Task 4: Click → info overlay

**Files:**
- Create: `src/components/3d/city/CityInfoPanel.tsx`
- Modify: `src/app/city/page.tsx` (render the panel from selection state)
- Test: `e2e/visual/city.spec.ts` (extend)

**Interfaces:**
- Consumes: `CityNode`, `CityDistrict` (`types.ts`), `demoCity`.
- Produces: `CityInfoPanel` props `{ node: CityNode | null; district: CityDistrict | null }` — a DOM overlay (not in the Canvas), returns `null` when `node` is null.

- [ ] **Step 1: Write the CityInfoPanel**

```tsx
// src/components/3d/city/CityInfoPanel.tsx
'use client'
import type { CityNode, CityDistrict } from '@/lib/city/types'

export function CityInfoPanel({ node, district }: { node: CityNode | null; district: CityDistrict | null }) {
  if (!node) return null
  return (
    <aside
      data-testid="city-info-panel"
      style={{
        position: 'absolute', right: 24, top: 24, width: 260, padding: 16,
        borderRadius: 12, background: 'rgba(3,8,16,0.8)', color: '#cfeee6',
        border: `1px solid ${district?.palette.glow ?? '#39ffd0'}`, backdropFilter: 'blur(8px)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16 }}>{node.id}</h2>
      <p style={{ margin: '4px 0 12px', opacity: 0.7 }}>{district?.label ?? node.districtId}</p>
      <dl style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, fontSize: 13 }}>
        <dt>Activity</dt><dd>{Math.round(node.metrics.activityScore * 100)}%</dd>
        <dt>Size</dt><dd>{Math.round(node.metrics.sizeScore * 100)}%</dd>
        <dt>Age</dt><dd>{node.metrics.ageDays}d</dd>
      </dl>
    </aside>
  )
}
```

- [ ] **Step 2: Wire it into the page**

```tsx
// src/app/city/page.tsx  (replace the <main> body)
'use client'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { demoCity } from '@/lib/city/demoCity'
import { CityInfoPanel } from '@/components/3d/city/CityInfoPanel'

const CityScene = dynamic(() => import('@/components/3d/city/CityScene'), { ssr: false })

export default function CityPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedNode = useMemo(
    () => demoCity.nodes.find((n) => n.id === selectedId) ?? null,
    [selectedId],
  )
  const district = useMemo(
    () => demoCity.districts.find((d) => d.id === selectedNode?.districtId) ?? null,
    [selectedNode],
  )
  return (
    <main style={{ position: 'fixed', inset: 0, background: '#02040a' }}>
      <CityScene model={demoCity} selectedId={selectedId} onSelectNode={setSelectedId} />
      <CityInfoPanel node={selectedNode} district={district} />
    </main>
  )
}
```

- [ ] **Step 3: Extend the Playwright test — clicking a structure shows the panel**

```ts
// append to e2e/visual/city.spec.ts
test('/city shows info panel after clicking a structure', async ({ page }) => {
  await page.goto('/city')
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15000 })
  const box = await page.locator('canvas').first().boundingBox()
  if (!box) throw new Error('no canvas box')
  // Click near center where structures are clustered.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect(page.getByTestId('city-info-panel')).toBeVisible({ timeout: 5000 })
})
```

- [ ] **Step 4: Run the tests**

Run: `pnpm exec playwright test e2e/visual/city.spec.ts`
Expected: both PASS. (Click coordinates may need nudging; adjust to hit a structure.)

- [ ] **Step 5: Biome + commit**

```bash
pnpm biome:check
git add src/components/3d/city/CityInfoPanel.tsx src/app/city/page.tsx e2e/visual/city.spec.ts
git commit -m "feat(city): click-to-inspect info overlay"
```

---

### Task 5: Look go/no-go gate + visual baseline

**Files:**
- Modify: `e2e/visual/city.spec.ts` (add a screenshot baseline)
- Create: `docs/superpowers/plans/2026-08-16-bioluminescent-city-phase0.md` go/no-go note (append result at bottom).

**Interfaces:** none (verification + decision task).

- [ ] **Step 1: Human look review (the actual point of Phase 0)**

Open `/city`. Judge honestly against the spec's bar: *does it look extraordinary, unmistakably designed, and clearly not a generic Gource/Shadertoy demo?* Rate each: art direction, glow quality, motion feel, "would I put this on my portfolio."

- [ ] **Step 2: Record the verdict**

Append to this plan file a short "Phase 0 verdict" section: GO (proceed to Phase 1 data pipeline) or NO-GO (what to change about the art before continuing). This is the gate the whole spec hinges on.

- [ ] **Step 3: Capture a visual-regression baseline (only if GO)**

```ts
// append to e2e/visual/city.spec.ts
test('/city visual baseline', async ({ page }) => {
  await page.goto('/city')
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15000 })
  await page.waitForTimeout(1500) // let the pulse settle to a representative frame
  await expect(page).toHaveScreenshot('city-phase0.png', { maxDiffPixelRatio: 0.05 })
})
```

- [ ] **Step 4: Generate the baseline snapshot**

Run: `pnpm exec playwright test e2e/visual/city.spec.ts --update-snapshots`
Expected: baseline `city-phase0.png` written; re-run without the flag → PASS.

- [ ] **Step 5: Commit**

```bash
git add e2e/visual/city.spec.ts e2e/visual/city.spec.ts-snapshots docs/superpowers/plans/2026-08-16-bioluminescent-city-phase0.md
git commit -m "test(city): phase-0 visual baseline + go/no-go verdict"
```

---

## Self-Review

- **Spec coverage:** Phase 0 scope from the spec (§Phasing "Phase 0", §"v1 definition") — one structure type ✅ (Task 3), glow without broken postfx ✅ (Task 3 halo+emissive, Global Constraints), one biome ✅ (demoCity single district), dark scene ✅ (Task 3), click→info ✅ (Task 4), hand-authored CityModel ✅ (Task 1), reuse WebGPUCanvas ✅ (Task 3 + Global Constraints), look go/no-go gate ✅ (Task 5). Data pipeline / sanitizer / real fleet = Phase 1, intentionally excluded.
- **Placeholder scan:** no TBD/TODO; all steps carry real code or exact commands. Two adapt-to-reality notes (WebGPUCanvas signature in Task 3 Step 2; Playwright webServer in Task 3 Step 6) are explicit read-first instructions, not placeholders.
- **Type consistency:** `CityModel`/`CityNode`/`CityDistrict`/`CityEdge` defined in Task 1 and consumed unchanged in Tasks 2-4. `layoutPositions`/`structureHeight`/`glowIntensity` signatures identical across Task 2 (def) and Task 3 (use). `BioStructure`/`CityScene`/`CityInfoPanel` prop shapes consistent across Tasks 3-4.

## Known adapt-first points (read before coding the task)

- Task 3: read `src/components/3d/WebGPUCanvas.tsx` to confirm export style + accepted props (`camera`, `dpr`, `fallback`); adapt import/props to match. Mirror `src/app/explore/page.tsx` for the dynamic-import + error-boundary pattern.
- Task 3/4: confirm `playwright.config.ts` starts a webServer for `/city`; if not, run `pnpm dev` alongside or add the config.
- Confirm the `@/` path alias resolves to `src/` (used throughout) — check `tsconfig.json`.

## Phase 0 verdict (2026-08-16): GO

Direction has legs — approved to proceed toward Phase 2 art. Evidence:
- `/city` route renders 8 bioluminescent structures; height + glow driven by real `demoCity` metrics; gentle breathing pulse; glow via emissive + additive halo (the buggy `PostProcessingEffects` correctly avoided).
- Click → structure brightens + glassy info panel shows the node's metrics (verified `n3` = Activity 85% / Size 90% / Age 5d, matching the fixture).
- `pnpm build` compiles `/city`; both Playwright behavioral tests pass (canvas smoke + click→panel); biome clean on all 9 city files; vitest 10/10; zero console errors.
- Honest caveat: spike-level art (plain tapered cylinders, single teal biome, sparse, no atmosphere/filaments). "Promising," not yet "extraordinary" — organic forms, biomes, fog, and connective filaments are Phase 2.

**Ruling — visual baseline deferred.** A strict `toHaveScreenshot` pixel baseline on an animated WebGL canvas is cross-platform-flaky, and this repo's CI uses Docker-generated Linux baselines (`scripts/update-visual-snapshots-docker.sh`). A mac-local baseline would fail CI. Baseline deferred to Phase 2 (art-stable), to be generated via the docker script. Behavioral e2e tests cover Phase 0 instead. Cost if wrong: no pixel-regression guard on the spike art (which is throwaway anyway).
