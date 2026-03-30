'use client'

import { allProjects, galaxies } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { useEffect } from 'react'

function navigateList(
  items: { id: string }[],
  currentId: string | null,
  direction: 'next' | 'prev',
): string {
  const currentIndex = currentId ? items.findIndex((item) => item.id === currentId) : -1
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

function isEditableTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element) return false

  return (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'SELECT' ||
    element.isContentEditable
  )
}

export function KeyboardNavigation() {
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)
  const zoomToGalaxy = useViewStore((state) => state.zoomToGalaxy)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  const zoomOut = useViewStore((state) => state.zoomOut)
  const reset = useViewStore((state) => state.reset)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const endJourney = useViewStore((state) => state.endJourney)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      if (e.key === 'Escape') {
        e.preventDefault()
        // End journey mode if active, otherwise zoom out
        if (isJourneyMode) {
          endJourney()
        } else {
          zoomOut()
        }
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
      let direction: 'next' | 'prev' | null = null
      if (isForwardKey(e.key)) {
        direction = 'next'
      } else if (isBackwardKey(e.key)) {
        direction = 'prev'
      }

      if (!direction) return

      e.preventDefault()

      if (view === 'universe') {
        zoomToGalaxy(navigateList(galaxies, selectedGalaxy, direction))
      } else if (view === 'galaxy' && selectedGalaxy) {
        const galaxy = galaxies.find((g) => g.id === selectedGalaxy)
        if (galaxy) {
          zoomToProject(navigateList(galaxy.projects, selectedProject, direction))
        }
      } else if (view === 'project') {
        zoomToProject(navigateList(allProjects, selectedProject, direction))
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [view, selectedGalaxy, selectedProject, zoomToGalaxy, zoomToProject, zoomOut, reset, isJourneyMode, endJourney])

  return null
}
