'use client'

import { galaxies } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { generateProjectPosition, getGalaxyCenterPosition, getSizeMultiplier } from '@/lib/utils'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { AnimatedConstellation } from './AnimatedConstellation'
import { SupernovaEffect } from './SupernovaEffect'

// LOD distance thresholds with hysteresis buffer to prevent flickering
// Mobile uses more aggressive LOD (switch to lower detail sooner)
const LOD_CONFIG = {
  desktop: { near: 15, medium: 35, hysteresis: 3 },
  mobile: { near: 12, medium: 25, hysteresis: 2 },
}

// Geometry segment counts - reduced on mobile for performance
const SEGMENTS = {
  desktop: { planet: 64, atmosphere: 32, clouds: 48, rings: 64 },
  mobile: { planet: 32, atmosphere: 16, clouds: 24, rings: 32 },
}

// Hook to detect mobile once
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  return isMobile
}

export function EnhancedProjectStars() {
  return (
    <group>
      {galaxies.map((galaxy, galaxyIndex) => (
        <GalaxyCluster key={galaxy.id} galaxy={galaxy} galaxyIndex={galaxyIndex} />
      ))}
    </group>
  )
}

function GalaxyCluster({ galaxy, galaxyIndex }: { galaxy: any; galaxyIndex: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  // Removed scannedPlanets check - all planets are now clickable by default
  // const scannedPlanets = useViewStore((state) => state.scannedPlanets)

  return (
    <group ref={groupRef}>
      {galaxy.projects.map((project: any, projectIndex: number) => {
        const position = generateProjectPosition(
          project.id,
          galaxy.id,
          galaxyIndex,
          projectIndex,
          galaxy.projects.length,
        )

        const sizeMultiplier = getSizeMultiplier(project.size)
        const isSupernova = project.id === 'coulson-one'
        // All planets are now clickable - removed scan requirement
        const isScanned = true // scannedPlanets.has(project.id)

        return (
          <RealisticPlanet
            key={project.id}
            project={project}
            position={position}
            galaxyIndex={galaxyIndex}
            sizeMultiplier={sizeMultiplier}
            isSupernova={isSupernova}
            isScanned={isScanned}
            onPlanetClick={() => zoomToProject(project.id)}
          />
        )
      })}

      {/* Animated Constellation for Flo Labs */}
      {galaxy.id === 'enterprise' && <AnimatedConstellation />}
    </group>
  )
}

// Procedural planet shader
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const planetFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 secondaryColor;
  uniform float time;
  uniform float seed;
  uniform int planetType; // 0=rocky, 1=gas, 2=ice, 3=lava
  uniform float hasCities; // 1.0 for planets with city lights

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Noise functions
  float hash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Turbulence for gas giant band edges
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    for(int i = 0; i < 4; i++) {
      value += amplitude * abs(noise(p) - 0.5);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // City lights pattern
  float cityLights(vec3 pos, float landMask, float latitude) {
    // Cities prefer mid-latitudes and land areas
    float latPref = smoothstep(0.0, 0.25, abs(latitude)) * smoothstep(0.75, 0.5, abs(latitude));
    float landPref = smoothstep(0.35, 0.55, landMask) * smoothstep(0.85, 0.6, landMask);

    // City cluster noise
    float cityNoise = fbm(pos * 25.0 + seed);
    float clusterNoise = fbm(pos * 8.0 + seed * 0.5);

    float cities = smoothstep(0.5, 0.7, cityNoise) * smoothstep(0.35, 0.55, clusterNoise);
    return cities * latPref * landPref;
  }

  void main() {
    vec3 pos = vPosition * 3.0 + seed;

    // Base terrain noise
    float terrain = fbm(pos * 2.0);
    float detail = fbm(pos * 8.0) * 0.3;
    float pattern = terrain + detail;

    vec3 color;

    if (planetType == 0) {
      // Rocky planet with polar ice caps + ocean
      float continents = smoothstep(0.4, 0.6, pattern);
      vec3 landColor = baseColor * 1.2;
      // Ocean: dark blue-shifted version vs pure land colour
      vec3 oceanColor = mix(baseColor * 0.48, vec3(0.05, 0.12, 0.32), 0.42);
      color = mix(oceanColor, landColor, continents);

      // Mountains
      float mountains = smoothstep(0.65, 0.8, pattern);
      color = mix(color, secondaryColor * 1.1, mountains * 0.55);

      // Shallow coastal water — lighter teal band at continent edge
      float coastal = smoothstep(0.38, 0.44, pattern) * (1.0 - smoothstep(0.44, 0.52, pattern));
      color = mix(color, oceanColor * 1.5, coastal * 0.5);

      // Polar ice caps - white/blue at poles
      float polarY = abs(vPosition.y);
      float iceCap = smoothstep(0.7, 0.9, polarY + fbm(pos * 4.0) * 0.15);
      vec3 iceColor = vec3(0.9, 0.95, 1.0);
      color = mix(color, iceColor, iceCap * 0.85);

    } else if (planetType == 1) {
      // Gas giant - Jupiter-like swirling bands with turbulence

      // Create more realistic banded structure
      float y = vPosition.y;
      float bandFreq = 12.0;
      float bandNoise = fbm(vec3(pos.x * 2.0, y * 0.5, pos.z * 2.0)) * 0.3;
      float bands = sin(y * bandFreq + bandNoise * 3.0) * 0.5 + 0.5;

      // Add turbulence at band edges for more realistic look
      float bandEdge = abs(fract(y * bandFreq / 6.28318) - 0.5) * 2.0;
      float edgeTurbulence = turbulence(pos * 3.0 + vec3(time * 0.05, 0.0, 0.0));
      bands = mix(bands, bands + edgeTurbulence * 0.2, smoothstep(0.3, 0.5, bandEdge));

      // Color variation in bands — higher contrast between light/dark bands
      vec3 bandColor1 = baseColor * 1.15;
      vec3 bandColor2 = secondaryColor * 0.85;
      vec3 bandColor3 = mix(baseColor, secondaryColor, 0.5) * 1.35;

      float bandSelect = sin(y * bandFreq * 0.5) * 0.5 + 0.5;
      vec3 currentBandColor = mix(bandColor1, bandColor2, bandSelect);
      currentBandColor = mix(currentBandColor, bandColor3, smoothstep(0.4, 0.6, bands));

      // Bright equatorial zone
      float equatorial = 1.0 - smoothstep(0.0, 0.35, abs(y));
      currentBandColor = mix(currentBandColor, baseColor * 1.45, equatorial * 0.22);

      color = currentBandColor;

      // Swirling storms — more vivid
      float storms = fbm(pos * 5.0 + vec3(time * 0.08, 0.0, time * 0.03));
      color = mix(color, baseColor * 1.6, storms * 0.28);

      // Great Red Spot style feature
      vec2 spotCenter = vec2(0.25, 0.15);
      float spotDist = length(vPosition.xy - spotCenter);
      float spot = 1.0 - smoothstep(0.0, 0.25, spotDist);
      float spotSwirl = fbm(vec3(vPosition.xy * 10.0 + time * 0.1, seed));
      vec3 spotColor = mix(secondaryColor * 1.3, baseColor * 0.8, spotSwirl);
      color = mix(color, spotColor, spot * 0.5);

    } else if (planetType == 2) {
      // Ice planet - frozen surface with cracks and subsurface glow
      float ice = fbm(pos * 6.0);
      float cracks = smoothstep(0.46, 0.52, fbm(pos * 14.0));

      // Subsurface colour — slightly translucent blue-green glow through ice
      vec3 subsurface = mix(baseColor * 0.9, vec3(0.15, 0.6, 0.85), 0.35);
      color = mix(baseColor, subsurface, ice * 0.65);

      // Glowing cracks — vivid colour bleeds through
      color = mix(color, vec3(0.85, 0.97, 1.0), cracks * 0.45);
      color += baseColor * 0.4 * cracks; // colour bleed

      // Polar aurora — stronger and coloured
      float polarGlow = pow(abs(vPosition.y), 2.5) * 0.5;
      vec3 auroraColor = mix(vec3(0.15, 0.9, 0.55), vec3(0.3, 0.5, 1.0), sin(pos.x * 3.0) * 0.5 + 0.5);
      color += auroraColor * polarGlow;

    } else {
      // Lava planet - molten surface
      float lava = fbm(pos * 4.0 + vec3(time * 0.05, 0.0, 0.0));
      float crust = smoothstep(0.4, 0.6, lava);

      vec3 hotColor = vec3(1.0, 0.3, 0.0);
      vec3 crustColor = baseColor * 0.3;
      color = mix(hotColor, crustColor, crust);

      // Glowing cracks
      float cracks = 1.0 - smoothstep(0.0, 0.1, abs(lava - 0.5));
      color += vec3(1.0, 0.5, 0.0) * cracks * 0.5;

      // Lava rivers
      float rivers = smoothstep(0.45, 0.55, fbm(pos * 8.0 + vec3(time * 0.02, 0.0, 0.0)));
      color += vec3(1.0, 0.2, 0.0) * rivers * 0.3;
    }

    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float NdotL = dot(vNormal, lightDir);
    float diff = max(NdotL, 0.0);
    float ambient = 0.3;

    // Day/night calculation for city lights
    float daylight = smoothstep(-0.1, 0.2, NdotL);

    color *= (ambient + diff * 0.7);

    // City lights on night side for rocky planets
    if (hasCities > 0.5 && planetType == 0) {
      float landMask = smoothstep(0.4, 0.6, pattern);
      float latitude = vPosition.y;
      float cities = cityLights(pos * 2.0, landMask, latitude);
      float nightIntensity = 1.0 - daylight;

      // Warm city light color with subtle flicker
      vec3 cityColor = vec3(1.0, 0.85, 0.5);
      float flicker = 0.9 + 0.1 * sin(time * 8.0 + pos.x * 40.0);

      color += cityColor * cities * nightIntensity * flicker * 1.5;
    }

    // Fresnel rim lighting — strong atmospheric edge glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
    color += baseColor * 2.2 * fresnel * 0.55;
    // Bright white sparkle at limb
    float fresnelSharp = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 6.0);
    color += vec3(0.9, 0.95, 1.0) * fresnelSharp * 0.22;

    // Atmospheric glow at terminator (day/night boundary) — stronger
    float terminator = smoothstep(-0.15, 0.0, NdotL) * smoothstep(0.2, 0.0, NdotL);
    color += baseColor * terminator * 0.45;

    // Lava planets emit their own light on the night side
    if (planetType == 3) {
      float lavaGlow = fbm(pos * 4.0 + vec3(time * 0.05, 0.0, 0.0));
      float moltenMask = 1.0 - smoothstep(0.38, 0.58, lavaGlow);
      color += vec3(1.0, 0.38, 0.0) * moltenMask * (0.45 - daylight * 0.25);
    }

    // Subtle saturation boost for more vibrant appearance
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(lum), color, 1.18);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Cloud layer shader for gas giants
const cloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const cloudFragmentShader = `
  uniform vec3 cloudColor;
  uniform float time;
  uniform float seed;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 pos = vPosition * 4.0 + seed + vec3(time * 0.1, 0.0, time * 0.05);

    // Wispy cloud pattern
    float clouds = fbm(pos * 2.0);
    clouds = smoothstep(0.3, 0.7, clouds);

    // Band-following clouds
    float bandInfluence = sin(vPosition.y * 10.0) * 0.5 + 0.5;
    clouds *= bandInfluence;

    // Swirl effect
    float swirl = fbm(pos * 3.0 + vec3(time * 0.15, 0.0, 0.0));
    clouds = mix(clouds, swirl, 0.3);

    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 color = cloudColor * (0.5 + diff * 0.5);
    float alpha = clouds * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`
function RealisticPlanet({
  project,
  position,
  galaxyIndex,
  sizeMultiplier,
  isSupernova,
  isScanned,
  onPlanetClick,
}: {
  project: any
  position: [number, number, number]
  galaxyIndex: number
  sizeMultiplier: number
  isSupernova: boolean
  isScanned: boolean
  onPlanetClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  // Get LOD and segment config based on device
  const lodConfig = isMobile ? LOD_CONFIG.mobile : LOD_CONFIG.desktop
  const segments = isMobile ? SEGMENTS.mobile : SEGMENTS.desktop

  // Use ref for LOD level to avoid React re-renders that cause flickering
  const lodLevelRef = useRef<'high' | 'medium' | 'low'>('high')
  // Refs for all meshes - visibility controlled imperatively in useFrame
  const planetRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const outerAtmosphereRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const hoverRingRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Pre-compute position vector for distance calculation
  const positionVec = useMemo(() => new THREE.Vector3(...position), [position])

  // Determine planet characteristics - supermassive projects get rings
  const hasRings = project.size === 'supermassive'

  // Featured/enterprise projects have city lights (inhabited worlds)
  const hasCities = useMemo(() => {
    return (
      project.featured ||
      project.galaxy === 'enterprise' ||
      ['caipo-ai', 'stancestream', 'finance-quest', 'portfolio-pro', 'codecraft'].includes(
        project.id,
      )
    )
  }, [project])

  const planetType = useMemo(() => {
    if (
      project.color.includes('00D9FF') ||
      project.color.includes('06FFA5') ||
      project.color.includes('00ffff')
    )
      return 2 // Ice
    if (project.color.includes('FF6B6B') || project.color.includes('ff4444')) return 3 // Lava
    if (sizeMultiplier > 1.8) return 1 // Gas giant
    return 0 // Rocky
  }, [project.color, sizeMultiplier])

  // Generate secondary color
  const secondaryColor = useMemo(() => {
    const color = new THREE.Color(project.color)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    return new THREE.Color().setHSL((hsl.h + 0.1) % 1, hsl.s * 0.8, hsl.l * 0.7)
  }, [project.color])

  // Unique seed per planet
  const seed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < project.id.length; i++) {
      hash = (hash << 5) - hash + project.id.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash) % 1000
  }, [project.id])

  const rotationSpeed = useMemo(() => 0.001 + (seed % 100) * 0.00002, [seed])

  // Orbital animation parameters
  const orbitalParams = useMemo(() => {
    const [gx, , gz] = getGalaxyCenterPosition(galaxyIndex)
    const galaxyCenter = new THREE.Vector2(gx, gz)
    const planetPos2D = new THREE.Vector2(position[0], position[2])

    // Calculate orbital radius (distance from galaxy center in XZ plane)
    const radius = planetPos2D.distanceTo(galaxyCenter)

    // Calculate initial angle
    const dx = position[0] - gx
    const dz = position[2] - gz
    const initialAngle = Math.atan2(dz, dx)

    // Orbital speed: smaller planets orbit faster, supermassive slowest
    const baseSpeed = 0.015
    const speedMultiplier = sizeMultiplier > 2.5 ? 0.3 : sizeMultiplier > 1.5 ? 0.5 : 1.0
    const orbitSpeed = baseSpeed * speedMultiplier * (0.8 + (seed % 100) * 0.004)

    return { galaxyCenter, radius, initialAngle, orbitSpeed, y: position[1] }
  }, [position, galaxyIndex, sizeMultiplier, seed])

  // Track current orbital position
  const currentPosRef = useRef(new THREE.Vector3(...position))

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update orbital position
    const { galaxyCenter, radius, initialAngle, orbitSpeed, y } = orbitalParams
    const currentAngle = initialAngle + time * orbitSpeed
    const newX = galaxyCenter.x + Math.cos(currentAngle) * radius
    const newZ = galaxyCenter.y + Math.sin(currentAngle) * radius
    currentPosRef.current.set(newX, y, newZ)

    // Update group position for orbital motion
    if (groupRef.current) {
      groupRef.current.position.set(newX, y, newZ)
    }

    // Calculate distance to camera for LOD with hysteresis
    const distance = camera.position.distanceTo(currentPosRef.current)
    const currentLod = lodLevelRef.current
    let newLod = currentLod

    // Apply hysteresis: need to cross threshold + buffer to switch
    const { near, medium, hysteresis } = lodConfig
    if (currentLod === 'high' && distance > near + hysteresis) {
      newLod = 'medium'
    } else if (currentLod === 'medium') {
      if (distance < near - hysteresis) newLod = 'high'
      else if (distance > medium + hysteresis) newLod = 'low'
    } else if (currentLod === 'low' && distance < medium - hysteresis) {
      newLod = 'medium'
    }

    // Update LOD ref (no setState - no React re-render)
    lodLevelRef.current = newLod

    // Control visibility imperatively based on LOD - no React re-renders
    if (atmosphereRef.current) {
      atmosphereRef.current.visible = newLod !== 'low'
      // Progressive proximity glow — opacity strengthens as cursor approaches
      const hoverIntensity = hovered ? 1.0 : Math.max(0, 1 - distance / 25)
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial
      mat.opacity += (0.32 + hoverIntensity * 0.28 - mat.opacity) * 0.12
    }
    if (outerAtmosphereRef.current) {
      outerAtmosphereRef.current.visible = newLod === 'high'
      const hoverIntensity = hovered ? 1.0 : Math.max(0, 1 - distance / 25)
      const mat = outerAtmosphereRef.current.material as THREE.MeshBasicMaterial
      mat.opacity += (0.2 + hoverIntensity * 0.16 - mat.opacity) * 0.12
    }
    if (cloudRef.current) {
      cloudRef.current.visible = newLod !== 'low'
    }
    if (hoverRingRef.current) {
      hoverRingRef.current.visible = hovered && newLod !== 'low'
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed

      // Gravitational lean toward cursor — only when close enough to feel alive
      if (distance < 25 && newLod !== 'low') {
        const { mouse } = state
        const targetTiltX = -mouse.y * 0.18
        const targetTiltZ = mouse.x * 0.12
        planetRef.current.rotation.x += (targetTiltX - planetRef.current.rotation.x) * 0.04
        planetRef.current.rotation.z += (targetTiltZ - planetRef.current.rotation.z) * 0.04
      }

      const material = planetRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.time.value = time
      }
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0003
    }

    // Rotate cloud layer at different speed
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed * 1.5
      const material = cloudRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.time.value = time
      }
    }

    if (groupRef.current && clickBurstRef.current) {
      // Click burst: rapid scale-up before modal opens
      const scale = 1.0 + Math.min((time * 8) % 1, 1) * 0.45
      groupRef.current.scale.setScalar(scale)
    } else if (groupRef.current && hovered) {
      const scale = 1.1 + Math.sin(time * 3) * 0.02
      groupRef.current.scale.setScalar(scale)
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  const [clickBurst, setClickBurst] = useState(false)
  const clickBurstRef = useRef(false)

  const handleClick = () => {
    if (!isScanned) return
    // Scale burst: 1 → 1.4 → snap to modal
    setClickBurst(true)
    clickBurstRef.current = true
    setTimeout(() => {
      setClickBurst(false)
      clickBurstRef.current = false
      onPlanetClick()
    }, 180)
  }

  // For supernova, render the special effect with clickable area
  if (isSupernova) {
    return (
      <group ref={groupRef} position={position}>
        <SupernovaEffect position={[0, 0, 0]} color={project.color} size={sizeMultiplier} />
        {/* Invisible clickable sphere for the supernova */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            document.body.style.cursor = isScanned ? 'pointer' : 'not-allowed'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <sphereGeometry args={[sizeMultiplier * 2.5, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={position} ref={groupRef}>
      {/* Main planet with procedural surface */}
      <mesh
        ref={planetRef}
        onClick={handleClick}
        onPointerEnter={() => {
          setHovered(true)
          document.body.style.cursor = isScanned ? 'pointer' : 'not-allowed'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[sizeMultiplier, segments.planet, segments.planet]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            baseColor: { value: new THREE.Color(project.color) },
            secondaryColor: { value: secondaryColor },
            time: { value: 0 },
            seed: { value: seed },
            planetType: { value: planetType },
            hasCities: { value: hasCities ? 1.0 : 0.0 },
          }}
        />
      </mesh>

      {/* Atmosphere glow - visibility & opacity controlled in useFrame */}
      <mesh ref={atmosphereRef} scale={1.12} visible={false}>
        <sphereGeometry args={[sizeMultiplier, segments.atmosphere, segments.atmosphere]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmosphere haze - visibility & opacity controlled in useFrame */}
      <mesh ref={outerAtmosphereRef} scale={1.25} visible={false}>
        <sphereGeometry args={[sizeMultiplier, segments.atmosphere, segments.atmosphere]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cloud layer for gas giants - visibility controlled in useFrame */}
      {planetType === 1 && (
        <mesh ref={cloudRef} scale={1.03} visible={false}>
          <sphereGeometry args={[sizeMultiplier, segments.clouds, segments.clouds]} />
          <shaderMaterial
            vertexShader={cloudVertexShader}
            fragmentShader={cloudFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              cloudColor: { value: new THREE.Color(project.color).multiplyScalar(1.3) },
              time: { value: 0 },
              seed: { value: seed },
            }}
          />
        </mesh>
      )}

      {/* Saturn-like rings */}
      {hasRings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, Math.PI / 8]}>
          <ringGeometry args={[sizeMultiplier * 1.4, sizeMultiplier * 2.2, segments.rings]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Hover indicator ring - visibility controlled in useFrame */}
      <mesh ref={hoverRingRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[sizeMultiplier * 1.3, sizeMultiplier * 1.35, segments.atmosphere]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Hover preview card - skip on mobile for performance */}
      {hovered && !isMobile && (
        <Html
          position={[0, sizeMultiplier + 2, 0]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          distanceFactor={15}
          occlude={false}
        >
          <div
            className="rounded-xl shadow-2xl overflow-hidden min-w-[200px] max-w-[260px]"
            style={{
              background: 'rgba(5, 5, 15, 0.92)',
              border: `1px solid ${project.color}40`,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Colour accent bar */}
            <div
              className="h-[3px] w-full"
              style={{
                background: `linear-gradient(90deg, ${project.color}cc, ${project.color}22)`,
              }}
            />
            <div className="px-3.5 py-2.5 space-y-2">
              {/* Galaxy badge */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[9px] tracking-[0.2em] uppercase font-medium px-1.5 py-0.5 rounded-full"
                  style={{ color: project.color, background: `${project.color}18` }}
                >
                  {project.galaxy?.replace('-', ' ')}
                </span>
                {project.featured && (
                  <span className="text-[9px] tracking-widest uppercase text-amber-400/80 font-medium">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Title + role */}
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">{project.title}</h3>
                {project.role && <p className="text-white/50 text-[11px] mt-0.5">{project.role}</p>}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-[10px] rounded-full text-white/70"
                      style={{
                        background: `${project.color}1a`,
                        border: `1px solid ${project.color}30`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Metrics row */}
              {project.metrics && (
                <div className="pt-1.5 border-t border-white/8 flex gap-3 text-[10px]">
                  {project.metrics.users && (
                    <span className="text-white/60">{project.metrics.users} users</span>
                  )}
                  {project.metrics.revenue && (
                    <span className="text-emerald-400/90">{project.metrics.revenue}</span>
                  )}
                  {project.metrics.tests && (
                    <span className="text-white/60">{project.metrics.tests} tests</span>
                  )}
                </div>
              )}

              {/* Click CTA */}
              <p className="text-[9px] tracking-[0.15em] uppercase text-white/25 text-center pt-0.5">
                Click to explore →
              </p>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
