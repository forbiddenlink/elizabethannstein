'use client'

import { OrbitControls, PerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// Post-processing conditionally enabled for WebGL only (causes flickering on WebGPU)
import { AmbientSpaceTraffic } from '@/components/3d/AmbientSpaceTraffic'
import { BlackHole } from '@/components/3d/BlackHole'
import { CinematicCamera, GalaxyTourButton, TourProgress } from '@/components/3d/CinematicCamera'
import { ClickRipple } from '@/components/3d/ClickRipple'
import { CosmicComets } from '@/components/3d/CosmicComets'
import { CursorTrail } from '@/components/3d/CursorTrail'
import { DevToolsPanel, StatsMonitor } from '@/components/3d/DevTools'
import { EnhancedProjectStars } from '@/components/3d/EnhancedProjectStars'
import { GalaxyCores } from '@/components/3d/GalaxyCore'
import { GalaxyLabels } from '@/components/3d/GalaxyLabels'
import { HyperspaceWarp } from '@/components/3d/HyperspaceWarp'
import { NebulaBackground } from '@/components/3d/NebulaBackground'
import { PlanetEnhancements } from '@/components/3d/PlanetEnhancements'
import { PlanetSurfaceExplorer } from '@/components/3d/PlanetSurfaceExplorer'
import { PostProcessingEffects } from '@/components/3d/PostProcessingEffects'
import { ProjectRelationships } from '@/components/3d/ProjectRelationships'
import { ScanSystem } from '@/components/3d/ScanSystem'
import { ShootingStars } from '@/components/3d/ShootingStars'
import { SolarFlares } from '@/components/3d/SolarFlares'
import { SupernovaEffect } from '@/components/3d/SupernovaEffect'
import {
  TheatreCameraController,
  TheatreStudioToggle,
  useTheatreModeStore,
} from '@/components/3d/TheatreSetup'
import { TourElements } from '@/components/3d/TourElements'
import { TwinklingStarfield } from '@/components/3d/TwinklingStarfield'
import { WebGPUCanvas } from '@/components/3d/WebGPUCanvas'
import { enqueueAchievement } from '@/components/ui/AchievementToast'
import { ExplorerHUD } from '@/components/ui/ExplorerHUD'
import { GalaxyNavigation } from '@/components/ui/GalaxyNavigation'
import { JourneyCameraController, JourneyOverlay } from '@/components/ui/JourneyMode'
import { MinimapNavigator } from '@/components/ui/MinimapNavigator'
import { MobileGalaxyNav } from '@/components/ui/MobileGalaxyNav'
import { MotionToggle } from '@/components/ui/MotionToggle'
import { unlockAchievement } from '@/lib/achievements'
import { galaxies, getProjectById } from '@/lib/galaxyData'
import { CANVAS_DPR_TIER_MULTIPLIERS, useCanvasPerformanceStore, useViewStore } from '@/lib/store'
import { generateProjectPosition, getGalaxyCenterPosition } from '@/lib/utils'
import type { RendererType } from '@/lib/webgpu'

// Camera fly-to controller for galaxy navigation with spring physics and idle drift
function GalaxyCameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera, mouse } = useThree()
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const view = useViewStore((state) => state.view)
  const isTheatreMode = useTheatreModeStore((s) => s.isTheatreMode)

  // Animation state
  const isAnimating = useRef(false)
  const targetPosition = useRef(new THREE.Vector3(0, 20, 60))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const animationProgress = useRef(0)
  const startPosition = useRef(new THREE.Vector3())
  const startLookAt = useRef(new THREE.Vector3())
  const animSpeed = useRef(1.5)

  // Spring physics state for smooth, organic motion
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const lookAtVelocity = useRef(new THREE.Vector3(0, 0, 0))

  // Idle drift state - subtle camera movement when not animating
  const idleDriftOffset = useRef(new THREE.Vector3(0, 0, 0))
  const idleTime = useRef(0)

  // Mouse drift state - camera subtly follows cursor
  const mouseDriftOffset = useRef(new THREE.Vector3(0, 0, 0))

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof globalThis.window !== 'undefined') {
      setPrefersReducedMotion(globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  // Handle view/selection changes
  useEffect(() => {
    startPosition.current.copy(camera.position)
    if (controlsRef.current) {
      startLookAt.current.copy(controlsRef.current.target)
    }
    animationProgress.current = 0
    isAnimating.current = true

    if (view === 'project' && selectedProject) {
      // Zoom close to the selected planet
      const project = getProjectById(selectedProject)
      if (project) {
        const galaxyIndex = galaxies.findIndex((g) => g.id === project.galaxy)
        if (galaxyIndex !== -1) {
          const projectIndex = galaxies[galaxyIndex].projects.findIndex(
            (p: any) => p.id === selectedProject
          )
          const [px, py, pz] = generateProjectPosition(
            selectedProject,
            project.galaxy,
            galaxyIndex,
            projectIndex,
            galaxies[galaxyIndex].projects.length
          )
          // Position camera 10 units away at a slight upward angle
          targetLookAt.current.set(px, py, pz)
          targetPosition.current.set(px + 4, py + 3, pz + 9)
          animSpeed.current = prefersReducedMotion ? 8 : 2.5
        }
      }
    } else if (selectedGalaxy && view === 'galaxy') {
      const galaxyIndex = galaxies.findIndex((g) => g.id === selectedGalaxy)
      if (galaxyIndex !== -1) {
        const [gx, gy, gz] = getGalaxyCenterPosition(galaxyIndex)
        const cameraDistance = 35
        const cameraHeight = 15
        targetLookAt.current.set(gx, gy, gz)
        targetPosition.current.set(gx, gy + cameraHeight, gz + cameraDistance)
        animSpeed.current = prefersReducedMotion ? 8 : 1.5
      }
    } else if (view === 'universe' && !selectedGalaxy) {
      targetPosition.current.set(0, 20, 60)
      targetLookAt.current.set(0, 0, 0)
      animSpeed.current = prefersReducedMotion ? 8 : 1.2
    }
  }, [selectedGalaxy, selectedProject, view, camera, controlsRef, prefersReducedMotion])

  // Animate camera with spring physics and idle drift
  useFrame((_state, delta) => {
    // Skip all camera animation when Theatre.js is controlling
    if (isTheatreMode) return

    if (isAnimating.current) {
      // Spring physics for smooth, organic camera motion
      const springStiffness = 3.5
      const springDamping = 0.85

      // Calculate spring force toward target
      const positionDelta = new THREE.Vector3().subVectors(targetPosition.current, camera.position)
      const springForce = positionDelta.multiplyScalar(springStiffness * delta)

      // Apply damping to velocity
      velocity.current.multiplyScalar(springDamping)
      velocity.current.add(springForce)

      // Update camera position
      camera.position.add(velocity.current)

      // Same for look-at target
      if (controlsRef.current) {
        const lookAtDelta = new THREE.Vector3().subVectors(
          targetLookAt.current,
          controlsRef.current.target
        )
        const lookAtForce = lookAtDelta.multiplyScalar(springStiffness * delta)

        lookAtVelocity.current.multiplyScalar(springDamping)
        lookAtVelocity.current.add(lookAtForce)

        controlsRef.current.target.add(lookAtVelocity.current)
        controlsRef.current.update()
      }

      // Check if we've settled (velocity is very low)
      if (
        velocity.current.length() < 0.001 &&
        camera.position.distanceTo(targetPosition.current) < 0.1
      ) {
        isAnimating.current = false
        velocity.current.set(0, 0, 0)
        lookAtVelocity.current.set(0, 0, 0)
      }
    } else if (!prefersReducedMotion) {
      // Idle drift - subtle camera breathing motion when not animating
      idleTime.current += delta

      // Multi-frequency drift for organic feel
      const driftX =
        Math.sin(idleTime.current * 0.15) * 0.08 + Math.sin(idleTime.current * 0.23) * 0.04
      const driftY =
        Math.cos(idleTime.current * 0.12) * 0.06 + Math.sin(idleTime.current * 0.19) * 0.03
      const driftZ = Math.sin(idleTime.current * 0.1) * 0.05

      // Mouse-influenced drift - camera subtly follows cursor (5-8% influence)
      const mouseInfluence = 0.06
      const targetMouseDriftX = mouse.x * mouseInfluence * 3 // Horizontal follows cursor
      const targetMouseDriftY = mouse.y * mouseInfluence * 2 // Vertical follows cursor (less)

      // Smooth mouse drift interpolation
      const targetMouseDrift = new THREE.Vector3(targetMouseDriftX, targetMouseDriftY, 0)
      mouseDriftOffset.current.lerp(targetMouseDrift, delta * 1.5)

      // Combine idle breathing + mouse following
      const combinedDriftX = driftX + mouseDriftOffset.current.x
      const combinedDriftY = driftY + mouseDriftOffset.current.y
      const combinedDriftZ = driftZ

      // Smoothly interpolate combined drift offset
      const targetDrift = new THREE.Vector3(combinedDriftX, combinedDriftY, combinedDriftZ)
      idleDriftOffset.current.lerp(targetDrift, delta * 2)

      // Apply drift to orbit controls target for subtle parallax feel
      if (controlsRef.current) {
        // Offset the look-at target slightly based on mouse position
        // This creates a subtle parallax effect where the scene shifts with cursor
        const lookAtOffset = new THREE.Vector3(
          mouseDriftOffset.current.x * 0.5,
          mouseDriftOffset.current.y * 0.3,
          0
        )
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0).add(lookAtOffset), delta * 0.5)
        controlsRef.current.update()
      }
    }
  })

  return null
}

function SceneContent({
  isMobile,
  controlsRef,
}: Readonly<{ isMobile: boolean; controlsRef: React.RefObject<any> }>) {
  const hasEntered = useViewStore((state) => state.hasEntered)
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const exitExploration = useViewStore((state) => state.exitExploration)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const isTheatreMode = useTheatreModeStore((s) => s.isTheatreMode)
  const [konamiActive, setKonamiActive] = useState(false)

  const activeProject = selectedProject ? getProjectById(selectedProject) : null

  // Konami code easter egg: ↑↑↓↓←→←→BA
  useEffect(() => {
    const KONAMI = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]
    const buffer: string[] = []
    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key)
      if (buffer.length > KONAMI.length) buffer.shift()
      if (buffer.join(',') === KONAMI.join(',')) {
        setKonamiActive(true)
        setTimeout(() => setKonamiActive(false), 4000)
        const a = unlockAchievement('konami_master')
        if (a) setTimeout(() => enqueueAchievement(a), 400)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Camera handled by OrbitControls and GalaxyCameraController
  // No manual camera manipulation here to avoid conflicts

  return (
    <>
      <color attach="background" args={['#03020c']} />
      {/* Depth fog — cool void; slightly violet-tinted for premium depth (not flat gray) */}
      <fog attach="fog" args={['#0a0618', 78, 315]} />

      {/* Cinematic Three-Point Lighting */}
      <ambientLight intensity={0.4} color="#0a0815" />

      {/* Key light - neutral white for true color rendering */}
      <directionalLight
        position={[82, 62, 44]}
        intensity={1.62}
        color="#fff7f2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
        shadow-camera-near={10}
        shadow-camera-far={400}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fill light - softer opposite side */}
      <directionalLight position={[-60, 20, -40]} intensity={0.4} color="#6366f1" />

      {/* Rim light - edge definition */}
      <pointLight position={[0, 80, -60]} intensity={1.5} color="#a855f7" distance={200} />

      {/* Hemisphere for ambient variation */}
      <hemisphereLight intensity={0.25} color="#818cf8" groundColor="#1e1b4b" />

      {/* Environment */}
      <Suspense fallback={null}>
        {view === 'exploration' && activeProject ? (
          <PlanetSurfaceExplorer
            project={activeProject}
            planetType={activeProject.size === 'supermassive' ? 'gas' : 'rocky'} // Simple logic for demo
            planetColor={activeProject.color}
            onExit={exitExploration}
          />
        ) : (
          <>
            <NebulaBackground isMobile={isMobile} />
            <TwinklingStarfield count={isMobile ? 1000 : 3000} />
            <GalaxyCores />
            <GalaxyLabels />
            <EnhancedProjectStars />
            <ScanSystem />
            <PlanetEnhancements />
            <ProjectRelationships />
            {!isMobile && (
              <>
                <ShootingStars count={3} />
                <CosmicComets count={2} />
                <SolarFlares />
                <BlackHole />
              </>
            )}
          </>
        )}
      </Suspense>

      {/* Tour interactive elements (aliens, stations, trail) */}
      <TourElements />

      {/* Free-roam traffic — satellites + scout probes (universe view only) */}
      <AmbientSpaceTraffic isMobile={isMobile} />

      {/* Konami easter egg: ↑↑↓↓←→←→BA triggers supernova at black hole */}
      {konamiActive && <SupernovaEffect position={[0, 0, 0]} color="#ffffff" size={8} />}

      {/* Journey Mode camera controller */}
      {isJourneyMode && <JourneyCameraController />}

      {/* OrbitControls - enabled after entry for user interaction, disabled in Theatre mode */}
      {view !== 'exploration' && !isJourneyMode && !isTheatreMode && (
        <OrbitControls
          ref={controlsRef}
          enabled={hasEntered && !isTheatreMode}
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={150}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          makeDefault
        />
      )}
    </>
  )
}

// Wrapper component to provide controlsRef inside Canvas
function SceneWrapper({
  isMobile,
  rendererType,
}: Readonly<{ isMobile: boolean; rendererType: RendererType | null }>) {
  const controlsRef = useRef<any>(null)
  const declineTier = useCanvasPerformanceStore((s) => s.declineTier)
  const inclineTier = useCanvasPerformanceStore((s) => s.inclineTier)

  return (
    <>
      <PerformanceMonitor
        ms={300}
        iterations={12}
        threshold={0.72}
        flipflops={48}
        onDecline={declineTier}
        onIncline={inclineTier}
      />
      <SceneContent isMobile={isMobile} controlsRef={controlsRef} />
      <GalaxyCameraController controlsRef={controlsRef} />
      <CinematicCamera controlsRef={controlsRef} />
      <TheatreCameraController />
      <HyperspaceWarp isMobile={isMobile} />
      <ClickRipple isMobile={isMobile} />
      <CursorTrail enabled={!isMobile} />
      {/* PostProcessingEffects: WebGL-only — WebGPU causes flickering */}
      {rendererType === 'webgl' && <PostProcessingEffects isMobile={isMobile} />}
      {/* Dev tools: GPU/FPS stats - only in development */}
      {process.env.NODE_ENV === 'development' && <StatsMonitor />}
    </>
  )
}

export default function GalaxyScene() {
  const [dpr, setDpr] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [rendererType, setRendererType] = useState<RendererType | null>(null)
  const perfTier = useCanvasPerformanceStore((s) => s.tier)
  const tierMultiplier = CANVAS_DPR_TIER_MULTIPLIERS[perfTier]
  const effectiveDpr = dpr * tierMultiplier

  // Refs to track previous values and avoid unnecessary state updates that cause re-renders
  const prevMobileRef = useRef<boolean | null>(null)
  const prevDprRef = useRef<number | null>(null)

  useEffect(() => {
    // Basic mobile check - only update state if values actually changed
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      const newDpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)

      // Only update isMobile if it changed
      if (prevMobileRef.current !== mobile) {
        prevMobileRef.current = mobile
        setIsMobile(mobile)
      }

      // Only update dpr if it changed (avoid triggering Canvas buffer resize)
      if (prevDprRef.current !== newDpr) {
        prevDprRef.current = newDpr
        setDpr(newDpr)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Callback when renderer is ready
  const handleRendererReady = useCallback((type: RendererType) => {
    setRendererType(type)
  }, [])

  // Static fallback for browsers without WebGL support
  const WebGLFallback = (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#020108]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(99,102,241,0.2), transparent 55%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(168,85,247,0.1), transparent 50%)',
        }}
      />
      <div className="relative max-w-lg px-8 text-center">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
          3D unavailable
        </p>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Portfolio still shines in 2D
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-white/55">
          This interactive galaxy needs WebGL. Open in Chrome, Edge, or Safari for the full
          experience — or browse the project archive below.
        </p>
        <a
          href="/work"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-8 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/10"
        >
          View all projects
        </a>
      </div>
    </div>
  )

  const LoadingFallback = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020108] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(168,85,247,0.08), transparent 50%)',
        }}
      />
      <div className="relative mb-6 h-px w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-linear-to-r from-indigo-400/80 via-purple-400 to-fuchsia-400/80" />
      </div>
      <p className="relative text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">
        Calibrating renderer
      </p>
      <p className="relative mt-2 text-xs text-white/30">WebGL · ACES · high performance</p>
    </div>
  )

  return (
    <div className="w-full h-screen relative">
      <WebGPUCanvas
        dpr={effectiveDpr}
        className="w-full h-full block"
        rendererConfig={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.38,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 20, 60], fov: 45 }}
        fallback={WebGLFallback}
        loadingFallback={LoadingFallback}
        onRendererReady={handleRendererReady}
        showRendererIndicator={process.env.NODE_ENV === 'development'}
      >
        <SceneWrapper isMobile={isMobile} rendererType={rendererType} />
      </WebGPUCanvas>

      {/* CSS vignette fallback for WebGPU (post-processing causes flickering) */}
      {rendererType === 'webgpu' && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      )}

      <GalaxyNavigation />
      <MobileGalaxyNav />
      <MotionToggle />
      <MinimapNavigator />
      <JourneyOverlay />
      <ExplorerHUD />
      {/* Galaxy tour UI */}
      <GalaxyTourButton />
      <TourProgress />
      {/* Leva controls panel - only in development */}
      <DevToolsPanel />
      {/* Theatre.js timeline toggle - only in development */}
      <TheatreStudioToggle />
    </div>
  )
}
