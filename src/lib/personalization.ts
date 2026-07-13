'use client'

import { useEffect, useState } from 'react'

// Visitor types based on referrer and behavior
export type VisitorType = 'recruiter' | 'developer' | 'client' | 'unknown'

interface VisitorProfile {
  type: VisitorType
  referrer: string | null
  interests: string[]
  viewedProjects: string[]
  timeOnSite: number
}

// Detect visitor type from referrer
function detectVisitorType(referrer: string | null): VisitorType {
  if (!referrer) return 'unknown'

  // Parse referrer into host + path so matches anchor to the real hostname,
  // not an arbitrary URL substring (includes('github.com') also matches
  // 'github.com.attacker.io').
  let host = ''
  let path = ''
  try {
    const url = new URL(referrer)
    host = url.hostname.toLowerCase()
    path = url.pathname.toLowerCase()
  } catch {
    return 'unknown'
  }

  const onHost = (domain: string) => host === domain || host.endsWith('.' + domain)
  const hasLabel = (label: string) =>
    host === label || host.startsWith(label + '.') || host.includes('.' + label + '.')

  // Recruiter indicators
  if (
    onHost('linkedin.com') ||
    onHost('indeed.com') ||
    onHost('greenhouse.io') ||
    onHost('lever.co') ||
    onHost('workday.com') ||
    hasLabel('jobs') ||
    hasLabel('careers')
  ) {
    return 'recruiter'
  }

  // Developer indicators
  if (
    onHost('github.com') ||
    onHost('stackoverflow.com') ||
    onHost('dev.to') ||
    onHost('ycombinator.com') ||
    (onHost('reddit.com') && /^\/r\/(programming|webdev|typescript|reactjs)\b/.test(path))
  ) {
    return 'developer'
  }

  // Client/business indicators
  if (onHost('clutch.co') || onHost('upwork.com') || onHost('toptal.com') || onHost('fiverr.com')) {
    return 'client'
  }

  return 'unknown'
}

// Get recommended projects based on visitor type
export function getRecommendedProjectIds(type: VisitorType): string[] {
  switch (type) {
    case 'recruiter':
      // Show enterprise work, team projects, production apps
      return ['coulson-one', 'flo-labs', 'hire-ready', 'autodocs-ai', 'chronicle']
    case 'developer':
      // Show technical projects, open source, interesting tech
      return ['chronicle', 'timeslip-search', 'autodocs-ai', 'quantum-forge', 'trace']
    case 'client':
      // Show shipped products, revenue-generating, polished UX
      return ['autodocs-ai', 'hire-ready', 'flo-labs', 'caipo-ai', 'coulson-one']
    default:
      // Default: featured projects
      return ['chronicle', 'autodocs-ai', 'timeslip-search', 'hire-ready', 'coulson-one']
  }
}

// Storage keys
const STORAGE_KEY = 'portfolio_visitor_profile'

// Load profile from storage
function loadProfile(): VisitorProfile | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

// Save profile to storage
function saveProfile(profile: VisitorProfile): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore storage errors
  }
}

// Track project view
export function trackProjectView(projectId: string): void {
  const profile = loadProfile()
  if (!profile) return

  if (!profile.viewedProjects.includes(projectId)) {
    profile.viewedProjects.push(projectId)
    saveProfile(profile)
  }
}

// Hook to get visitor profile
export function useVisitorProfile(): VisitorProfile {
  const [profile, setProfile] = useState<VisitorProfile>({
    type: 'unknown',
    referrer: null,
    interests: [],
    viewedProjects: [],
    timeOnSite: 0,
  })

  useEffect(() => {
    // Load existing profile or create new one
    let existingProfile = loadProfile()

    if (!existingProfile) {
      const referrer = document.referrer || null
      existingProfile = {
        type: detectVisitorType(referrer),
        referrer,
        interests: [],
        viewedProjects: [],
        timeOnSite: 0,
      }
      saveProfile(existingProfile)
    }

    setProfile(existingProfile)

    // Track time on site
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000)
      setProfile((prev) => {
        const updated = { ...prev, timeOnSite: prev.timeOnSite + elapsed }
        saveProfile(updated)
        return updated
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return profile
}

// Hook to get personalized project order
export function usePersonalizedProjects(projectIds: string[]): string[] {
  const profile = useVisitorProfile()
  const [orderedIds, setOrderedIds] = useState(projectIds)

  useEffect(() => {
    const recommended = getRecommendedProjectIds(profile.type)

    // Sort: recommended first, then by original order
    const sorted = [...projectIds].sort((a, b) => {
      const aRecommended = recommended.indexOf(a)
      const bRecommended = recommended.indexOf(b)

      // Both recommended: sort by recommendation order
      if (aRecommended !== -1 && bRecommended !== -1) {
        return aRecommended - bRecommended
      }

      // Only a recommended
      if (aRecommended !== -1) return -1

      // Only b recommended
      if (bRecommended !== -1) return 1

      // Neither recommended: keep original order
      return 0
    })

    setOrderedIds(sorted)
  }, [projectIds, profile.type])

  return orderedIds
}
