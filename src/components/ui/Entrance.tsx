'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProjectById } from '@/lib/galaxyData'
import { usePrefersReducedMotion, useViewStore } from '@/lib/store'

export function Entrance() {
  const hasEntered = useViewStore((state) => state.hasEntered)
  const enter = useViewStore((state) => state.enter)
  const setWarpingIn = useViewStore((state) => state.setWarpingIn)
  const [isEntering, setIsEntering] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  // Skip entrance on repeat visits or deep links
  useEffect(() => {
    if (globalThis.window && !hasEntered) {
      const hasVisited = localStorage.getItem('ea-has-visited')
      const deepLinkId = new URLSearchParams(window.location.search).get('p')
      if (hasVisited || (deepLinkId && getProjectById(deepLinkId))) {
        if (deepLinkId && getProjectById(deepLinkId)) {
          localStorage.setItem('ea-has-visited', 'true')
        }
        enter()
      }
    }
  }, [hasEntered, enter])

  const handleEnter = () => {
    setIsEntering(true)
    // Mark as visited for future sessions
    if (globalThis.window) {
      localStorage.setItem('ea-has-visited', 'true')
    }
    // Start hyperspace warp immediately, enter the galaxy after brief transition
    setWarpingIn(true)
    setTimeout(() => {
      enter()
      setWarpingIn(false)
    }, 600)
  }

  const fade = (delay: number) =>
    reducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg px-4 text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80'

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-black"
        >
          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-xl shrink-0 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
            <motion.h1
              {...fade(0.1)}
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Elizabeth Stein
            </motion.h1>

            <motion.p
              {...fade(0.3)}
              className="max-w-sm text-base leading-relaxed text-white/70 sm:max-w-md sm:text-lg"
            >
              A 3D map of everything I&apos;ve built. Planets are projects, grouped by kind.
            </motion.p>

            <motion.div {...fade(0.5)} className="flex w-full flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleEnter}
                className="group inline-flex min-h-12 items-center gap-3 rounded-lg bg-white px-8 py-3 text-base font-semibold text-black transition-colors duration-150 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                {isEntering ? (
                  <span>Entering...</span>
                ) : (
                  <>
                    <span>Enter the map</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-2">
                <Link href="/work" className={linkClass}>
                  Skip to the list
                </Link>
                <a
                  href="/resume/elizabeth-stein-resume.pdf"
                  download="Elizabeth_Stein_Resume.pdf"
                  className={linkClass}
                >
                  Résumé
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
