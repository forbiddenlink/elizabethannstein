'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Parse UTM parameters from URL
function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utmParams: Record<string, string> = {}
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  utmKeys.forEach((key) => {
    const value = params.get(key)
    if (value) utmParams[key] = value
  })
  return utmParams
}

// Store UTM params in sessionStorage for attribution
function storeUTMParams() {
  const utmParams = getUTMParams()
  if (Object.keys(utmParams).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams))
  }
}

// Get stored UTM params
function getStoredUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(sessionStorage.getItem('utm_params') || '{}')
  } catch {
    return {}
  }
}

// Track custom events with UTM attribution
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    const utmParams = getStoredUTMParams()
    window.gtag('event', eventName, { ...params, ...utmParams })
  }
}

// Web Vitals tracking
function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Use Performance Observer for Core Web Vitals
  try {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      trackEvent('web_vitals', {
        metric_name: 'LCP',
        metric_value: Math.round(lastEntry.startTime),
        metric_rating:
          lastEntry.startTime < 2500
            ? 'good'
            : lastEntry.startTime < 4000
              ? 'needs-improvement'
              : 'poor',
      })
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming
        trackEvent('web_vitals', {
          metric_name: 'FID',
          metric_value: Math.round(fidEntry.processingStart - fidEntry.startTime),
          metric_rating:
            fidEntry.processingStart - fidEntry.startTime < 100
              ? 'good'
              : fidEntry.processingStart - fidEntry.startTime < 300
                ? 'needs-improvement'
                : 'poor',
        })
      }
    })
    fidObserver.observe({ type: 'first-input', buffered: true })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Report CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('web_vitals', {
          metric_name: 'CLS',
          metric_value: Math.round(clsValue * 1000) / 1000,
          metric_rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
        })
      }
    })
  } catch {
    // PerformanceObserver not supported
  }
}

// Specific event trackers
export const analytics = {
  // Project interactions
  projectView: (projectId: string, projectTitle: string, source: string, galaxyId?: string) => {
    trackEvent('project_view', {
      project_id: projectId,
      project_title: projectTitle,
      source,
      galaxy_id: galaxyId || 'unknown',
    })
  },
  projectExplore: (projectId: string, galaxyId?: string) => {
    trackEvent('project_explore', { project_id: projectId, galaxy_id: galaxyId || 'unknown' })
  },

  // Galaxy navigation with galaxy name
  galaxyEnter: (galaxyId: string, galaxyName?: string) => {
    trackEvent('galaxy_enter', { galaxy_id: galaxyId, galaxy_name: galaxyName || galaxyId })
  },
  universeEnter: () => {
    trackEvent('universe_enter', {})
  },

  // Contact/conversion intent with funnel tracking
  contactIntent: (source: string, galaxyId?: string) => {
    trackEvent('contact_intent', {
      source,
      last_galaxy: galaxyId || sessionStorage.getItem('last_galaxy') || 'direct',
    })
  },
  contactSubmit: (galaxyId?: string) => {
    trackEvent('contact_submit', {
      last_galaxy: galaxyId || sessionStorage.getItem('last_galaxy') || 'direct',
    })
  },

  // Track last viewed galaxy for attribution
  setLastGalaxy: (galaxyId: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_galaxy', galaxyId)
    }
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

  // Journey mode tracking
  journeyStart: (tourId?: string) => {
    trackEvent('journey_start', { tour_id: tourId || 'default' })
  },
  journeyComplete: (tourId?: string, stepsCompleted?: number) => {
    trackEvent('journey_complete', {
      tour_id: tourId || 'default',
      steps_completed: stepsCompleted || 0,
    })
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

  // Store UTM params and track Web Vitals on mount
  useEffect(() => {
    storeUTMParams()
    trackWebVitals()
  }, [])

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
