'use client'

import { galaxies } from '@/lib/galaxyData'
import { useViewStore } from '@/lib/store'
import { gsap } from 'gsap'
import { Globe, Keyboard, Search, X, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'project' | 'galaxy' | 'action' | 'shortcut'
  icon: React.ReactNode
  action: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const zoomToProject = useViewStore((state) => state.zoomToProject)
  const exploreProject = useViewStore((state) => state.exploreProject)
  const hasEntered = useViewStore((state) => state.hasEntered)

  const isHomeRoute = pathname === '/'

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setSearch('')
    setSelectedIndex(0)
  }, [])

  const viewProject = useCallback(
    (projectId: string) => {
      if (isHomeRoute && hasEntered) {
        zoomToProject(projectId)
      } else {
        router.push(`/work/${projectId}`)
      }
      closePalette()
    },
    [closePalette, hasEntered, isHomeRoute, router, zoomToProject],
  )

  const openGalaxy = useCallback(
    (galaxyId: string) => {
      if (isHomeRoute && hasEntered) {
        const galaxy = galaxies.find((item) => item.id === galaxyId)
        if (galaxy?.projects[0]) {
          zoomToProject(galaxy.projects[0].id)
        }
      } else {
        router.push(`/work?filter=${galaxyId}`)
      }
      closePalette()
    },
    [closePalette, hasEntered, isHomeRoute, router, zoomToProject],
  )

  const exploreIn3D = useCallback(
    (projectId: string) => {
      if (isHomeRoute && hasEntered) {
        exploreProject(projectId)
      } else {
        router.push(`/?p=${projectId}`)
      }
      closePalette()
    },
    [closePalette, exploreProject, hasEntered, isHomeRoute, router],
  )

  // Build command list
  const commands: CommandItem[] = [
    // Projects - View Details
    ...galaxies.flatMap((galaxy) =>
      galaxy.projects.map((project) => ({
        id: `project-${project.id}`,
        title: project.title,
        subtitle: `${galaxy.name} • ${project.role}`,
        category: 'project' as const,
        icon: <Zap className="w-4 h-4" />,
        action: () => viewProject(project.id),
      })),
    ),
    // Projects - Explore Planet
    ...galaxies.flatMap((galaxy) =>
      galaxy.projects.map((project) => ({
        id: `explore-${project.id}`,
        title: `🚀 Explore ${project.title}`,
        subtitle: `Land on planet and walk around • ${galaxy.name}`,
        category: 'action' as const,
        icon: <Globe className="w-4 h-4" />,
        action: () => exploreIn3D(project.id),
      })),
    ),
    // Galaxies
    ...galaxies.map((galaxy) => ({
      id: `galaxy-${galaxy.id}`,
      title: galaxy.name,
      subtitle: `${galaxy.projects.length} projects`,
      category: 'galaxy' as const,
      icon: <Globe className="w-4 h-4" />,
      action: () => openGalaxy(galaxy.id),
    })),
    // Actions
    {
      id: 'view-list',
      title: 'Switch to List View',
      subtitle: 'See all projects in a list',
      category: 'action' as const,
      icon: <Keyboard className="w-4 h-4" />,
      action: () => {
        router.push('/work')
        closePalette()
      },
    },
    {
      id: 'view-3d',
      title: 'Switch to 3D View',
      subtitle: 'Explore the galaxy',
      category: 'action' as const,
      icon: <Globe className="w-4 h-4" />,
      action: () => {
        router.push('/')
        closePalette()
      },
    },
  ]

  // Filter commands based on search
  const filteredCommands = search
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(search.toLowerCase()) ||
          cmd.subtitle?.toLowerCase().includes(search.toLowerCase()),
      )
    : commands

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTypingContext =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      // Open with CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      if (isTypingContext) return

      // Close with ESC
      if (e.key === 'Escape' && isOpen) {
        closePalette()
        return
      }

      // Navigate with arrows when open
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        filteredCommands[selectedIndex]?.action()
      }
    },
    [closePalette, filteredCommands, isOpen, selectedIndex],
  )

  useEffect(() => {
    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.command-palette-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        '.command-palette-modal',
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' },
      )
    }
  }, [isOpen])

  if (!isOpen) return null

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'project':
        return 'Projects'
      case 'galaxy':
        return 'Galaxies'
      case 'action':
        return 'Actions'
      case 'shortcut':
        return 'Shortcuts'
      default:
        return ''
    }
  }

  // Group commands by category
  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = []
      acc[cmd.category].push(cmd)
      return acc
    },
    {} as Record<string, CommandItem[]>,
  )

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="command-palette-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
        onClick={() => {
          closePalette()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            closePalette()
          }
        }}
        tabIndex={-1}
        aria-label="Close command palette"
      />

      {/* Modal */}
      <div className="command-palette-modal fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-60 px-4">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, galaxies, or actions..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
              autoFocus
            />
            <button
              onClick={() => {
                closePalette()
              }}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title="Close command palette"
              aria-label="Close command palette"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-500">
                No results found for "{search}"
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  {items.map((cmd, idx) => {
                    const globalIdx = filteredCommands.indexOf(cmd)
                    const isSelected = globalIdx === selectedIndex

                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        type="button"
                        aria-label={`${cmd.title} - ${cmd.subtitle || ''}`}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-blue-500/20 text-white border-l-2 border-blue-500'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div className={`${isSelected ? 'text-blue-400' : 'text-gray-500'}`}>
                          {cmd.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{cmd.title}</div>
                          {cmd.subtitle && (
                            <div className="text-sm text-gray-500">{cmd.subtitle}</div>
                          )}
                        </div>
                        {isSelected && (
                          <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded">↵</kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/5 rounded font-mono">↑</kbd>
                <kbd className="px-2 py-1 bg-white/5 rounded font-mono">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/5 rounded font-mono">↵</kbd>
                <span>Select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/5 rounded font-mono">ESC</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
