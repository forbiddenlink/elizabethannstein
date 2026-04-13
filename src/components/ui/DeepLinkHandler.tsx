'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { getProjectById } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'

export function DeepLinkHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const zoomToProject = useViewStore((state) => state.zoomToProject)

  useEffect(() => {
    const projectParam = searchParams.get('p')

    if (projectParam) {
      const project = getProjectById(projectParam)

      // Check for WebGL support and reduced motion preference
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const hasWebGL = !!gl
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!hasWebGL || prefersReducedMotion) {
        // Escape hatch: redirect to canonical /work/[slug] page
        router.replace(`/work/${projectParam}`)
      } else if (project) {
        // Show 3D mode with project modal
        localStorage.setItem('ea-has-visited', 'true')
        zoomToProject(projectParam)
      } else {
        // Invalid project ID, remove param
        router.replace('/')
      }
    }
  }, [searchParams, router, zoomToProject])

  return null
}
