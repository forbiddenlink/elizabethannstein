'use client'

import { useEffect } from 'react'
import { useViewStore } from '@/lib/store'
import { galaxies, allProjects } from '@/lib/galaxyData'

function navigateList(items: { id: string }[], currentId: string | null, direction: 'next' | 'prev'): string {
  const currentIndex = currentId ? items.findIndex(item => item.id === currentId) : -1
  if (direction === 'next') {
    return items[(currentIndex + 1) % items.length].id
  }
  return items[currentIndex <= 0 ? items.length - 1 : currentIndex - 1].id
}

function isForwardKey(key: string): boolean {
  return key === 'ArrowRight' || key === 'ArrowDown'
}

function isBackwardKey(key: string): boolean {
  return key === 'ArrowLeft' || key === 'ArrowUp'
}

export function KeyboardNavigation() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  const zoomOut = useViewStore((state) => state.zoomOut)
  const reset = useViewStore((state) => state.reset)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        zoomOut()
        return
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        reset()
        return
      }

      // Number keys (1-6) - quick jump to galaxies
      const num = Number.parseInt(e.key)
      if (num >= 1 && num <= galaxies.length) {
        e.preventDefault()
        zoomToGalaxy(galaxies[num - 1].id)
        return
      }

      // Arrow navigation depends on current view
      const direction = isForwardKey(e.key) ? 'next' : isBackwardKey(e.key) ? 'prev' : null
      if (!direction) return

      e.preventDefault()

      if (view === 'universe') {
        zoomToGalaxy(navigateList(galaxies, selectedGalaxy, direction))
      } else if (view === 'galaxy' && selectedGalaxy) {
        const galaxy = galaxies.find(g => g.id === selectedGalaxy)
        if (galaxy) {
          zoomToProject(navigateList(galaxy.projects, selectedProject, direction))
        }
      } else if (view === 'project') {
        zoomToProject(navigateList(allProjects, selectedProject, direction))
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [view, selectedGalaxy, selectedProject, zoomToGalaxy, zoomToProject, zoomOut, reset])

  return null
}
