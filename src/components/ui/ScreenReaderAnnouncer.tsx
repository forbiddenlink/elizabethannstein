'use client'

import { useEffect, useState } from 'react'
import { useViewStore } from '@/lib/store'
import { galaxies, allProjects } from '@/lib/galaxyData'

export function ScreenReaderAnnouncer() {
  const [announcement, setAnnouncement] = useState('')
  const view = useViewStore((state) => state.view)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const selectedProject = useViewStore((state) => state.selectedProject)

  useEffect(() => {
    if (view === 'universe') {
      setAnnouncement('Viewing all galaxies. Use number keys 1-6 to select a galaxy, or arrow keys to navigate. Press T for text-only accessible view.')
    } else if (view === 'galaxy' && selectedGalaxy) {
      const galaxy = galaxies.find(g => g.id === selectedGalaxy)
      if (galaxy) {
        setAnnouncement(`Viewing ${galaxy.name} galaxy with ${galaxy.projects.length} projects. ${galaxy.description}. Use arrow keys to navigate projects, Escape to zoom out.`)
      }
    } else if (view === 'project' && selectedProject) {
      const project = allProjects.find(p => p.id === selectedProject)
      if (project) {
        setAnnouncement(`Viewing project: ${project.title}. ${project.description}. Press Enter to open project details, E to explore planet surface, Escape to go back.`)
      }
    } else if (view === 'exploration' && selectedProject) {
      const project = allProjects.find(p => p.id === selectedProject)
      if (project) {
        setAnnouncement(`Exploring ${project.title} planet surface. Use W A S D keys to move around. Press Escape to exit exploration mode.`)
      }
    }
  }, [view, selectedGalaxy, selectedProject])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
