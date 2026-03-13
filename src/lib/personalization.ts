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

  const ref = referrer.toLowerCase()

  // Recruiter indicators
  if (
    ref.includes('linkedin.com') ||
    ref.includes('indeed.com') ||
    ref.includes('greenhouse.io') ||
    ref.includes('lever.co') ||
    ref.includes('workday.com') ||
    ref.includes('jobs.') ||
    ref.includes('careers.')
  ) {
    return 'recruiter'
  }

  // Developer indicators
  if (
    ref.includes('github.com') ||
    ref.includes('stackoverflow.com') ||
    ref.includes('dev.to') ||
    ref.includes('hackernews') ||
    ref.includes('reddit.com/r/programming') ||
    ref.includes('reddit.com/r/webdev') ||
    ref.includes('reddit.com/r/typescript') ||
    ref.includes('reddit.com/r/reactjs')
  ) {
    return 'developer'
  }

  // Client/business indicators
  if (
    ref.includes('clutch.co') ||
    ref.includes('upwork.com') ||
    ref.includes('toptal.com') ||
    ref.includes('fiverr.com')
  ) {
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
      return ['chronicle', 'timeslip-search', 'autodocs-ai', 'quantum-forge', 'componentcompass']
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
    timeOnSite: 0
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
        timeOnSite: 0
      }
      saveProfile(existingProfile)
    }

    setProfile(existingProfile)

    // Track time on site
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000)
      setProfile(prev => {
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
