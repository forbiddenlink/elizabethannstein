'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerformanceMonitor } from '@react-three/drei'
// Post-processing conditionally enabled for WebGL only (causes flickering on WebGPU)
import { useRef, useState, useEffect, Suspense, useCallback } from 'react'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'
import { WebGPUCanvas } from '@/components/3d/WebGPUCanvas'
import { type RendererType } from '@/lib/webgpu'
import { TwinklingStarfield } from '@/components/3d/TwinklingStarfield'
import { NebulaBackground } from '@/components/3d/NebulaBackground'
import { EnhancedProjectStars } from '@/components/3d/EnhancedProjectStars'
import { ShootingStars } from '@/components/3d/ShootingStars'
import { InteractiveSpaceDust } from '@/components/3d/InteractiveSpaceDust'
import { getProjectById, galaxies } from '@/lib/galaxyData'
import { PlanetSurfaceExplorer } from '@/components/3d/PlanetSurfaceExplorer'
import { GalaxyNavigation } from '@/components/ui/GalaxyNavigation'
import { MobileGalaxyNav } from '@/components/ui/MobileGalaxyNav'
import { MotionToggle } from '@/components/ui/MotionToggle'
import { MinimapNavigator } from '@/components/ui/MinimapNavigator'
import { JourneyCameraController, JourneyOverlay } from '@/components/ui/JourneyMode'
import { ExplorerHUD } from '@/components/ui/ExplorerHUD'
import { TourElements } from '@/components/3d/TourElements'
import { GalaxyCores } from '@/components/3d/GalaxyCore'
import { PlanetEnhancements } from '@/components/3d/PlanetEnhancements'
import { ProjectRelationships } from '@/components/3d/ProjectRelationships'
import { CosmicComets } from '@/components/3d/CosmicComets'
import { AuroraRibbons } from '@/components/3d/AuroraRibbons'
import { CosmicJellyfish } from '@/components/3d/CosmicJellyfish'
import { Pulsars } from '@/components/3d/Pulsars'
import { SolarFlares } from '@/components/3d/SolarFlares'
import { BlackHole } from '@/components/3d/BlackHole'
import { AsteroidBelts } from '@/components/3d/AsteroidBelts'
import { ScanSystem } from '@/components/3d/ScanSystem'
import { PostProcessingEffects } from '@/components/3d/PostProcessingEffects'
import { SupernovaEffect } from '@/components/3d/SupernovaEffect'
import { HyperspaceWarp } from '@/components/3d/HyperspaceWarp'
import { ClickRipple } from '@/components/3d/ClickRipple'
import { GalaxyLabels } from '@/components/3d/GalaxyLabels'
import { getGalaxyCenterPosition, generateProjectPosition } from '@/lib/utils'
import { unlockAchievement } from '@/lib/achievements'
import { enqueueAchievement } from '@/components/ui/AchievementToast'

// Camera fly-to controller for galaxy navigation
function GalaxyCameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree()
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const view = useViewStore((state) => state.view)

  // Animation state
  const isAnimating = useRef(false)
  const targetPosition = useRef(new THREE.Vector3(0, 20, 60))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const animationProgress = useRef(0)
  const startPosition = useRef(new THREE.Vector3())
  const startLookAt = useRef(new THREE.Vector3())
  const animSpeed = useRef(1.5)

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
        const galaxyIndex = galaxies.findIndex(g => g.id === project.galaxy)
        if (galaxyIndex !== -1) {
          const projectIndex = galaxies[galaxyIndex].projects.findIndex((p: any) => p.id === selectedProject)
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
      const galaxyIndex = galaxies.findIndex(g => g.id === selectedGalaxy)
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

  // Animate camera
  useFrame((_, delta) => {
    if (!isAnimating.current) return

    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

    animationProgress.current += delta * animSpeed.current

    if (animationProgress.current >= 1) {
      animationProgress.current = 1
      isAnimating.current = false
    }

    const t = easeOutExpo(animationProgress.current)

    camera.position.lerpVectors(startPosition.current, targetPosition.current, t)

    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startLookAt.current, targetLookAt.current, t)
      controlsRef.current.update()
    }
  })

  return null
}

function SceneContent({ isMobile, controlsRef }: Readonly<{ isMobile: boolean; controlsRef: React.RefObject<any> }>) {
  const { camera } = useThree()
  const hasEntered = useViewStore((state) => state.hasEntered)
  const view = useViewStore((state) => state.view)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const exitExploration = useViewStore((state) => state.exitExploration)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const [konamiActive, setKonamiActive] = useState(false)

  const activeProject = selectedProject ? getProjectById(selectedProject) : null

  // Konami code easter egg: ↑↑↓↓←→←→BA
  useEffect(() => {
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
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
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000510', 180, 450]} />

      {/* Cinematic Three-Point Lighting */}
      <ambientLight intensity={0.4} color="#0a0815" />

      {/* Key light - neutral white for true color rendering */}
      <directionalLight
        position={[80, 60, 40]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={400}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fill light - softer opposite side */}
      <directionalLight
        position={[-60, 20, -40]}
        intensity={0.4}
        color="#6366f1"
      />

      {/* Rim light - edge definition */}
      <pointLight
        position={[0, 80, -60]}
        intensity={1.5}
        color="#a855f7"
        distance={200}
      />

      {/* Hemisphere for ambient variation */}
      <hemisphereLight
        intensity={0.25}
        color="#818cf8"
        groundColor="#1e1b4b"
      />

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
                <ShootingStars count={isMobile ? 2 : 5} />
{/* Disabled - particles render as squares */}
                <CosmicComets count={3} />
                <AuroraRibbons count={4} />
                <CosmicJellyfish count={4} />
                <Pulsars count={3} />
                <SolarFlares />
                <BlackHole />
                <AsteroidBelts />
              </>
            )}
          </>
        )}
      </Suspense>

      {/* Tour interactive elements (aliens, stations, trail) */}
      <TourElements />

      {/* Konami easter egg: ↑↑↓↓←→←→BA triggers supernova at black hole */}
      {konamiActive && (
        <SupernovaEffect position={[0, 0, 0]} color="#ffffff" size={8} />
      )}

      {/* Journey Mode camera controller */}
      {isJourneyMode && <JourneyCameraController />}

      {/* OrbitControls - enabled after entry for user interaction */}
      {view !== 'exploration' && !isJourneyMode && (
        <OrbitControls
          ref={controlsRef}
          enabled={hasEntered}
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
function SceneWrapper({ isMobile, rendererType }: Readonly<{ isMobile: boolean; rendererType: RendererType | null }>) {
  const controlsRef = useRef<any>(null)

  return (
    <>
      <PerformanceMonitor onDecline={() => {}} />
      <SceneContent isMobile={isMobile} controlsRef={controlsRef} />
      <GalaxyCameraController controlsRef={controlsRef} />
      <HyperspaceWarp isMobile={isMobile} />
      <ClickRipple isMobile={isMobile} />
      {/* PostProcessingEffects: WebGL-only — WebGPU causes flickering */}
      {rendererType === 'webgl' && <PostProcessingEffects isMobile={isMobile} />}
    </>
  )
}

export default function GalaxyScene() {
  const [dpr, setDpr] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [rendererType, setRendererType] = useState<RendererType | null>(null)

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
    <div className="w-full h-full flex items-center justify-center bg-linear-to-b from-black via-indigo-950 to-black">
      <div className="text-center p-8 max-w-lg">
        <div className="text-6xl mb-4">*</div>
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to My Portfolio</h2>
        <p className="text-gray-300 mb-6">
          This experience is best viewed in a browser with WebGL support.
          Please try Chrome, Firefox, Safari, or Edge for the full 3D experience.
        </p>
        <a
          href="/work"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          View Projects
        </a>
      </div>
    </div>
  )

  // Loading state while checking WebGPU support
  const LoadingFallback = (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white/50 text-sm">Initializing 3D renderer...</div>
    </div>
  )

  return (
    <div className="w-full h-screen relative">
      <WebGPUCanvas
        dpr={dpr}
        className="w-full h-full block"
        rendererConfig={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
          outputColorSpace: THREE.SRGBColorSpace
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
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      )}

      <GalaxyNavigation />
      <MobileGalaxyNav />
      <MotionToggle />
      <MinimapNavigator />
      <JourneyOverlay />
      <ExplorerHUD />
    </div>
  )
}
