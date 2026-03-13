'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Specific event trackers
export const analytics = {
  // Project interactions
  projectView: (projectId: string, projectTitle: string, source: string) => {
    trackEvent('project_view', { project_id: projectId, project_title: projectTitle, source })
  },
  projectExplore: (projectId: string) => {
    trackEvent('project_explore', { project_id: projectId })
  },

  // Galaxy navigation
  galaxyEnter: (galaxyId: string) => {
    trackEvent('galaxy_enter', { galaxy_id: galaxyId })
  },
  universeEnter: () => {
    trackEvent('universe_enter', {})
  },

  // Contact/conversion intent
  contactIntent: (source: string) => {
    trackEvent('contact_intent', { source })
  },
  contactSubmit: () => {
    trackEvent('contact_submit', {})
  },

  // Engagement
  scrollDepth: (depth: number) => {
    trackEvent('scroll_depth', { depth_percent: depth })
  },
  timeOnPage: (seconds: number) => {
    trackEvent('time_on_page', { seconds })
  },

  // Feature usage
  commandPaletteOpen: () => {
    trackEvent('command_palette_open', {})
  },
  keyboardShortcut: (key: string) => {
    trackEvent('keyboard_shortcut', { key })
  },
}

// Scroll depth tracking hook
function useScrollDepthTracking() {
  const trackedDepths = useRef(new Set<number>())

  useEffect(() => {
    const milestones = [25, 50, 75, 90]

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone)
          analytics.scrollDepth(milestone)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}

// Time on page tracking hook
function useTimeOnPageTracking() {
  const startTime = useRef(Date.now())

  useEffect(() => {
    const trackTime = () => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000)
      analytics.timeOnPage(seconds)
    }

    // Track when leaving page
    window.addEventListener('beforeunload', trackTime)
    // Track every 30 seconds
    const interval = setInterval(() => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000)
      if (seconds % 30 === 0) {
        analytics.timeOnPage(seconds)
      }
    }, 30000)

    return () => {
      window.removeEventListener('beforeunload', trackTime)
      clearInterval(interval)
    }
  }, [])
}

export function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  // Enable tracking hooks even without GA (they're no-ops without gtag)
  useScrollDepthTracking()
  useTimeOnPageTracking()

  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
