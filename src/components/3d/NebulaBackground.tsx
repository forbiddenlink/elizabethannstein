'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useViewStore } from '@/lib/store'

interface NebulaBackgroundProps {
  readonly isMobile?: boolean
}

/** Galaxy hex colors as vec3 tuples for shader uniforms */
const GALAXY_COLORS: Record<string, [number,number,number]> = {
  enterprise:   [1.0, 0.42, 0.21],  // #FF6B35 warm orange
  ai:           [0.0, 0.85, 1.0],   // #00D9FF cyan
  fullstack:    [0.62, 0.31, 0.87], // #9D4EDD purple
  devtools:     [0.02, 1.0, 0.65],  // #06FFA5 green
  design:       [1.0, 0.42, 0.62],  // #FF6BAD pink
  experimental: [1.0, 0.70, 0.28],  // #FFB347 amber
}
const DEFAULT_GALAXY_COLOR: [number,number,number] = [0.18, 0.1, 0.48]

/**
 * Nebula background with animated gradient colors.
 * Tints toward the currently selected galaxy's colour.
 */
export function NebulaBackground({ isMobile = false }: NebulaBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const octaves = isMobile ? 4 : 6
  const selectedGalaxy = useViewStore((s) => s.selectedGalaxy)
  const view = useViewStore((s) => s.view)

  // Current lerp target (galaxy color or default)
  const targetColor = useMemo(() => {
    if (view === 'galaxy' && selectedGalaxy && GALAXY_COLORS[selectedGalaxy]) {
      return GALAXY_COLORS[selectedGalaxy]
    }
    return DEFAULT_GALAXY_COLOR
  }, [selectedGalaxy, view])

  const currentColor = useRef(new THREE.Vector3(...DEFAULT_GALAXY_COLOR))
  const targetVec    = useRef(new THREE.Vector3(...targetColor))

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.time.value = clock.getElapsedTime() * 0.05
    material.uniforms.cameraPos.value.set(
      camera.position.x * 0.002,
      camera.position.y * 0.002,
      camera.position.z * 0.001
    )

    // Lerp galaxy tint smoothly
    targetVec.current.set(...targetColor)
    currentColor.current.lerp(targetVec.current, 0.018)
    material.uniforms.galaxyTint.value.copy(currentColor.current)
  })

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    uniform vec3 cameraPos;
    uniform int octaveCount;
    uniform vec3 galaxyTint;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < 6; i++) {
        if (i >= octaveCount) break;
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float voronoi(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float minDist = 1.0;
      for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = hash(i + neighbor) * vec2(hash(i + neighbor + vec2(1.0, 0.0)));
          point = 0.5 + 0.5 * sin(time * 0.1 + 6.28 * point);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          minDist = min(minDist, dist);
        }
      }
      return minDist;
    }

    // Blue noise approximation for dithering
    float blueNoise(vec2 p) {
      float n = hash(p);
      n += hash(p * 2.0 + 0.5) * 0.5;
      n += hash(p * 4.0 + 0.25) * 0.25;
      return fract(n);
    }

    void main() {
      // === PARALLAX DEPTH LAYERS ===
      // Each layer moves at different speed based on camera, creating depth
      float parallax1 = 0.08;  // Far layer - slow
      float parallax2 = 0.05;  // Mid-far layer
      float parallax3 = 0.03;  // Mid layer
      float parallax4 = 0.015; // Near layer - fastest

      vec2 uv1 = vUv + cameraPos.xy * parallax1;
      vec2 uv2 = vUv + cameraPos.xy * parallax2;
      vec2 uv3 = vUv + cameraPos.xy * parallax3;
      vec2 uv4 = vUv + cameraPos.xy * parallax4;

      vec3 deepPurple    = mix(vec3(0.15, 0.03, 0.42), galaxyTint * 0.6, 0.5);
      vec3 cosmicBlue    = vec3(0.03, 0.12, 0.48);
      vec3 nebulaPink    = mix(vec3(0.38, 0.06, 0.32), galaxyTint * 0.4, 0.4);
      vec3 electricCyan  = mix(vec3(0.06, 0.25, 0.42), galaxyTint * 0.3, 0.35);
      vec3 royalPurple   = mix(vec3(0.18, 0.1, 0.48), galaxyTint * 0.5, 0.45);
      vec3 deepSpace     = vec3(0.015, 0.015, 0.08);
      vec3 warmGlow      = vec3(0.25, 0.08, 0.12);

      // Swirl with parallax
      vec2 swirl = uv2 - 0.5;
      float angle = atan(swirl.y, swirl.x);
      float radius = length(swirl);
      float spiral = angle + radius * 3.0 + time * 0.05;

      // LAYER 1: Far background nebula (slowest parallax)
      float farNebula = fbm(uv1 * 1.5 + vec2(cos(spiral) * 0.15, sin(spiral) * 0.15) + time * 0.008);
      vec3 color = mix(deepSpace, deepPurple * 0.7, farNebula * 1.1);

      // LAYER 2: Mid-far cosmic clouds
      float midFarClouds = fbm(uv2 * 3.0 - vec2(time * 0.02, time * 0.015));
      float midFarDust = fbm(uv2 * 2.0 + 100.0);
      color = mix(color, cosmicBlue * 0.9, midFarClouds * 0.7);
      color = mix(color, warmGlow, midFarDust * 0.2);

      // LAYER 3: Mid nebula structures (detailed)
      float layer3a = fbm(uv3 * 6.0 + vec2(time * 0.04, -time * 0.03));
      float layer3b = fbm(uv3 * 8.0 + vec2(-time * 0.05, time * 0.04));
      color = mix(color, nebulaPink, pow(layer3a, 1.4) * 0.55);
      color = mix(color, electricCyan, layer3b * 0.45);

      // LAYER 4: Near foreground wisps (fastest parallax)
      float nearWisps = fbm(uv4 * 12.0 - vec2(time * 0.06, time * 0.08));
      float nearDust = fbm(uv4 * 5.0 + vec2(time * 0.03, 0.0));
      nearDust = smoothstep(0.35, 0.65, nearDust);
      color = mix(color, royalPurple, nearWisps * 0.35);
      color *= 0.75 + nearDust * 0.4;

      // Volumetric light shafts from center
      vec2 center = vec2(0.5 + sin(time * 0.02) * 0.04, 0.5 + cos(time * 0.025) * 0.04);
      float dist = distance(vUv, center);
      float radialDensity = 1.0 - smoothstep(0.0, 0.7, dist);

      // God rays / light shafts
      float rayAngle = atan(vUv.y - center.y, vUv.x - center.x);
      float rays = sin(rayAngle * 12.0 + time * 0.3) * 0.5 + 0.5;
      rays = pow(rays, 3.0) * radialDensity;
      float rayNoise = fbm(vec2(rayAngle * 3.0, dist * 8.0) + time * 0.1);
      rays *= 0.7 + rayNoise * 0.3;
      color += vec3(0.15, 0.1, 0.25) * rays * 0.4;

      // Emission and scattering
      float emission = pow(midFarClouds * layer3a, 0.5) * radialDensity;
      color += nebulaPink * emission * 0.35;
      color += electricCyan * (1.0 - emission) * radialDensity * 0.25;

      float scattering = pow(radialDensity, 2.0) * 0.45;
      color += vec3(0.12, 0.06, 0.22) * scattering;

      // Star cluster voronoi
      float clusters = voronoi(uv3 * 6.0);
      clusters = smoothstep(0.0, 0.35, clusters);
      color += vec3(0.12, 0.08, 0.18) * (1.0 - clusters) * 0.45;

      // Bright star spots
      float spots = smoothstep(0.95, 1.0, fbm(uv4 * 20.0 + time * 0.012));
      color += vec3(1.0, 0.92, 0.96) * spots * 0.6;

      // Subtle color shifts
      color.r += sin(vUv.x * 3.14159 + time * 0.08) * 0.015;
      color.b += cos(vUv.y * 3.14159 + time * 0.06) * 0.015;

      // === BLUE NOISE DITHERING ===
      // Reduces gradient banding in dark areas
      float dither = (blueNoise(gl_FragCoord.xy) - 0.5) / 255.0 * 2.0;
      color += dither;

      // Final grading
      color = pow(color, vec3(0.9));
      color *= 1.55;

      // Vignette
      float vignette = 1.0 - smoothstep(0.4, 1.0, dist * 1.2);
      color *= 0.85 + vignette * 0.15;

      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 0, -200]} scale={[500, 500, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time:       { value: 0.0 },
          cameraPos:  { value: new THREE.Vector3(0, 0, 0) },
          octaveCount:{ value: octaves },
          galaxyTint: { value: new THREE.Vector3(...DEFAULT_GALAXY_COLOR) },
        }}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

