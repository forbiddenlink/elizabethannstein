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

    void main() {
      vec2 uv = vUv + cameraPos.xy * 0.05;

      vec3 deepPurple    = mix(vec3(0.15, 0.03, 0.42), galaxyTint * 0.6, 0.5);
      vec3 cosmicBlue    = vec3(0.03, 0.12, 0.48);
      vec3 nebulaPink    = mix(vec3(0.38, 0.06, 0.32), galaxyTint * 0.4, 0.4);
      vec3 electricCyan  = mix(vec3(0.06, 0.25, 0.42), galaxyTint * 0.3, 0.35);
      vec3 royalPurple   = mix(vec3(0.18, 0.1, 0.48), galaxyTint * 0.5, 0.45);
      vec3 deepSpace     = vec3(0.02, 0.02, 0.1);

      vec2 swirl = uv - 0.5;
      float angle = atan(swirl.y, swirl.x);
      float radius = length(swirl);
      float spiral = angle + radius * 3.0 + time * 0.05;

      float layer1 = fbm(uv * 2.0 + vec2(cos(spiral) * 0.2, sin(spiral) * 0.2) + time * 0.015);
      float layer2 = fbm(uv * 4.5 - vec2(time * 0.04, time * 0.025));
      float layer3 = fbm(uv * 8.0 + vec2(time * 0.06, -time * 0.05));
      float layer4 = fbm(uv * 14.0 - vec2(time * 0.08, time * 0.1));
      float dustLanes = fbm(uv * 3.0 + vec2(time * 0.02, 0.0));
      dustLanes = smoothstep(0.3, 0.7, dustLanes);
      float clusters = voronoi(uv * 6.0);
      clusters = smoothstep(0.0, 0.4, clusters);

      vec3 color = mix(deepSpace, deepPurple, layer1 * 1.2);
      color = mix(color, cosmicBlue, layer2 * 0.8);
      color = mix(color, nebulaPink, pow(layer3, 1.5) * 0.6);
      color = mix(color, electricCyan, layer4 * 0.5);
      color = mix(color, royalPurple, (1.0 - dustLanes) * 0.4);

      vec2 center = vec2(0.5 + sin(time * 0.02) * 0.05, 0.5 + cos(time * 0.03) * 0.05);
      float dist = distance(uv, center);
      float radialDensity = 1.0 - smoothstep(0.0, 0.75, dist);
      float emission = pow(layer2 * layer3, 0.5) * radialDensity;
      color += nebulaPink * emission * 0.4;
      color += electricCyan * (1.0 - emission) * radialDensity * 0.3;

      float scattering = pow(radialDensity, 2.0) * 0.5;
      color += vec3(0.1, 0.05, 0.2) * scattering;
      color *= 0.7 + dustLanes * 0.5;
      color += vec3(0.15, 0.1, 0.2) * (1.0 - clusters) * 0.5;

      float spots = smoothstep(0.94, 1.0, fbm(uv * 18.0 + time * 0.015));
      color += vec3(1.0, 0.9, 0.95) * spots * 0.5;
      color.r += sin(uv.x * 3.14159 + time * 0.1) * 0.02;
      color.b += cos(uv.y * 3.14159 + time * 0.08) * 0.02;
      color = pow(color, vec3(0.92));
      color *= 1.6;

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

