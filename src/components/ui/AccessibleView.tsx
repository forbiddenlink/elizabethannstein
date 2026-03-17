'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { galaxies } from '@/lib/galaxyData'
import { Eye, EyeOff, ExternalLink, Github, ChevronRight } from 'lucide-react'

// Toggle button to switch between 3D and accessible view
// Made prominent for users who can't/won't use 3D
export function AccessibleViewToggle({
  isAccessibleMode,
  onToggle
}: {
  isAccessibleMode: boolean
  onToggle: () => void
}) {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2">
      {/* Hint text - only shows on 3D mode */}
      {!isAccessibleMode && (
        <span className="text-xs text-white/40 bg-black/60 backdrop-blur-sm px-2 py-1 rounded hidden md:block">
          Prefer text? Click below
        </span>
      )}
      <button
        onClick={onToggle}
        className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-black/70 backdrop-blur-xl border border-white/30 text-sm text-white/90 hover:text-white hover:bg-black/90 hover:border-white/50 hover:scale-105 transition-all shadow-lg"
        aria-label={isAccessibleMode ? 'Switch to 3D galaxy view' : 'Switch to accessible text list view'}
        title={isAccessibleMode ? 'Return to interactive 3D view' : 'View as simple text list (no 3D)'}
      >
        {isAccessibleMode ? (
          <>
            <Eye className="w-5 h-5" />
            <span>3D Galaxy View</span>
          </>
        ) : (
          <>
            <EyeOff className="w-5 h-5" />
            <span>View as List</span>
          </>
        )}
      </button>
    </div>
  )
}

// Full accessible view of all projects
export function AccessibleView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Elizabeth Stein - Portfolio</h1>
          <p className="text-white/60">Full-stack developer + design systems + AI integration</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6" aria-label="Galaxy sections">
        <h2 className="sr-only">Jump to section</h2>
        <div className="flex flex-wrap gap-2">
          {galaxies.map((galaxy) => (
            <a
              key={galaxy.id}
              href={`#${galaxy.id}`}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={{
                borderColor: `${galaxy.color}50`,
                color: galaxy.color
              }}
            >
              {galaxy.name}
              <span className="ml-1 text-white/40">({galaxy.projects.length})</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Projects by Galaxy */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {galaxies.map((galaxy) => (
          <section
            key={galaxy.id}
            id={galaxy.id}
            className="mb-16"
            aria-labelledby={`${galaxy.id}-heading`}
          >
            <div className="sticky top-20 z-30 bg-black/80 backdrop-blur-md py-4 mb-6 -mx-4 px-4 border-b border-white/5">
              <h2
                id={`${galaxy.id}-heading`}
                className="text-3xl font-bold flex items-center gap-3"
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: galaxy.color }}
                  aria-hidden="true"
                />
                {galaxy.name}
              </h2>
              <p className="text-white/60 mt-1">{galaxy.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galaxy.projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded bg-white/10 text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-xs text-white/40">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <Link
                      href={`/work/${project.id}`}
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </Link>
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </a>
                    )}
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        Code
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/40 text-sm">
          <p>Total: {galaxies.reduce((acc, g) => acc + g.projects.length, 0)} projects across {galaxies.length} categories</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/work" className="hover:text-white transition-colors">All Work</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Hook to manage accessible view preference
export function useAccessibleView() {
  const [isAccessibleMode, setIsAccessibleMode] = useState(false)

  useEffect(() => {
    // Check localStorage preference
    const stored = localStorage.getItem('accessible-view')
    if (stored === 'true') {
      setIsAccessibleMode(true)
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && stored === null) {
      // Suggest accessible view for reduced motion users
      setIsAccessibleMode(true)
    }
  }, [])

  const toggle = () => {
    const newValue = !isAccessibleMode
    setIsAccessibleMode(newValue)
    localStorage.setItem('accessible-view', String(newValue))
  }

  return { isAccessibleMode, toggle }
}
