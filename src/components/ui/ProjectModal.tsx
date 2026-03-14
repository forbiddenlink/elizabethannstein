'use client'

import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewStore } from '@/lib/store'
import { getProjectById } from '@/lib/galaxyData'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { GenerativeHero } from '@/components/ui/GenerativeHero'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ScrollProgress } from './ScrollProgress'

export function ProjectModal() {
  const router = useRouter()
  const selectedProject = useViewStore((state) => state.selectedProject)
  const view = useViewStore((state) => state.view)
  const zoomOut = useViewStore((state) => state.zoomOut)

  const project = selectedProject ? getProjectById(selectedProject) : null
  const isOpen = view === 'project' && project !== null
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trapping inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, textarea, select'

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    // Focus the first focusable element
    const timer = setTimeout(() => {
      const firstFocusable = modal.querySelector<HTMLElement>(focusableSelector)
      firstFocusable?.focus()
    }, 100)

    modal.addEventListener('keydown', handleTab)
    return () => {
      clearTimeout(timer)
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  // Close handler that properly updates URL
  const handleClose = useCallback(() => {
    zoomOut()
    router.push('/', { scroll: false })
  }, [zoomOut, router])

  // Sync URL with selection state (deep-linking)
  useEffect(() => {
    if (selectedProject && isOpen) {
      // Update URL with query param
      router.replace(`/?p=${selectedProject}`, { scroll: false })
    }
  }, [selectedProject, isOpen, router])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(globalThis.location.search)
      const projectParam = urlParams.get('p')

      if (!projectParam && isOpen) {
        zoomOut()
      }
    }

    globalThis.addEventListener('popstate', handlePopState)
    return () => globalThis.removeEventListener('popstate', handlePopState)
  }, [zoomOut, isOpen])

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    },
    [isOpen, handleClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence mode="wait">
      {isOpen && project && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto gpu-accelerated"
          onClick={handleClose}          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project details`}
          ref={modalRef}        >
          {/* Backdrop with blur-in */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(20px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/90"
          />
          
          {/* Scroll Progress */}
          <ScrollProgress />

          {/* Content with zoom + slide-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ 
              delay: 0.1, 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="relative w-full max-w-5xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl my-8 mx-4 shadow-2xl will-change-transform"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.6) 50%, rgba(0,0,0,0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderColor: `${project.color}30`,
              boxShadow: `0 0 60px ${project.color}20, 0 8px 32px rgba(0,0,0,0.5)`
            }}
          >
            {/* Glass morphism inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/5 via-transparent to-white/5 pointer-events-none z-10" />

            {/* Generative Modal Background/Header */}
            <div className="absolute inset-x-0 top-0 h-64 overflow-hidden rounded-t-3xl opacity-20 mask-image-linear-to-b">
              <GenerativeHero name={project.title} color={project.color} />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
            </div>

            {/* Animated border glow with project color */}
            <div
              className="absolute inset-0 rounded-3xl blur-xl -z-10 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${project.color}30, transparent 70%)`
              }}
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onClick={handleClose}
              className="ripple-button fixed top-8 right-8 z-[60] p-4 rounded-full bg-black/60 hover:bg-black/80 hover:scale-110 hover:rotate-90 transition-all duration-300 backdrop-blur-xl border-2 border-white/30 group shadow-2xl"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
            </motion.button>

            {/* Reuse the same component used in /work/[slug] */}
            <ProjectCaseStudy project={project} />

            {/* View full page link */}
            <div className="px-8 pb-8">
              <a
                href={`/work/${project.id}`}
                className="ripple-button inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-base text-white/70 hover:text-white hover:gap-3 transition-all duration-300"
              >
                View full page →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
