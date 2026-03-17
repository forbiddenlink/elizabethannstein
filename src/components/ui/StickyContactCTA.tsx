'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useViewStore } from '@/lib/store'

export function StickyContactCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const view = useViewStore((state) => state.view)
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)

  // Hide during exploration/journey modes
  const shouldHide = view === 'exploration' || view === 'project' || isJourneyMode

  useEffect(() => {
    if (isDismissed || shouldHide) return

    // Show after 2 seconds or 20% scroll
    const timer = setTimeout(() => setIsVisible(true), 2000)

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 20) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDismissed, shouldHide])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    // Remember dismissal for this session
    sessionStorage.setItem('cta-dismissed', 'true')
  }

  const handleContact = () => {
    // Track conversion intent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_intent', { source: 'sticky_cta' })
    }
    window.location.href = '/contact'
  }

  // Check if previously dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('cta-dismissed') === 'true') {
      setIsDismissed(true)
    }
  }, [])

  if (shouldHide) return null

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-40 flex items-center gap-2"
        >
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 text-white hover:bg-black/60 transition-all duration-200"
            aria-label="Dismiss contact button"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Main CTA button */}
          <button
            onClick={handleContact}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="whitespace-nowrap">Let&apos;s Talk</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
