// Achievement system — localStorage-backed discovery tracker

export interface Achievement {
  id: string
  label: string
  icon: string
  desc: string
  secret?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_contact',  label: 'First Contact',       icon: 'planet', desc: 'Explored your first planet' },
  { id: 'galaxy_hopper',  label: 'Galaxy Hopper',       icon: 'galaxy', desc: 'Visited all 6 galaxies' },
  { id: 'half_done',      label: 'Deep Space Traveler', icon: 'rocket', desc: 'Discovered 42 planets' },
  { id: 'completionist',  label: 'Completionist',       icon: 'star', desc: 'All 84 planets discovered' },
  { id: 'konami_master',  label: 'Konami Master',       icon: 'gamepad', desc: '↑↑↓↓←→←→BA', secret: true },
  { id: 'speed_runner',   label: 'Speed Runner',        icon: 'zap', desc: '3 galaxies in 60 seconds', secret: true },
  { id: 'night_owl',      label: 'Night Owl',           icon: 'moon', desc: 'Explored after midnight', secret: true },
  { id: 'returning',      label: 'Returning Explorer',  icon: 'infinity', desc: 'Visited on 3 different days', secret: true },
]

const STORAGE_KEY = 'ea-achievements'
const VISITED_KEY = 'ea-visited-planets'
const VISITED_GALAXIES_KEY = 'ea-visited-galaxies'
const FIRST_VISIT_KEY = 'ea-visit-dates'

function loadSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveSet(key: string, set: Set<string>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify([...set]))
}

export function getUnlockedAchievements(): Set<string> {
  return loadSet(STORAGE_KEY)
}

export function isUnlocked(id: string): boolean {
  return loadSet(STORAGE_KEY).has(id)
}

/** Returns the Achievement if newly unlocked, null if already owned */
export function unlockAchievement(id: string): Achievement | null {
  const unlocked = loadSet(STORAGE_KEY)
  if (unlocked.has(id)) return null
  unlocked.add(id)
  saveSet(STORAGE_KEY, unlocked)
  return ACHIEVEMENTS.find(a => a.id === id) ?? null
}

/** Track a planet visit. Returns array of newly-unlocked achievements. */
export function trackPlanetVisit(projectId: string): Achievement[] {
  const visited = loadSet(VISITED_KEY)
  const alreadySeen = visited.has(projectId)
  visited.add(projectId)
  saveSet(VISITED_KEY, visited)

  const newAchievements: Achievement[] = []

  if (!alreadySeen && visited.size === 1) {
    const a = unlockAchievement('first_contact')
    if (a) newAchievements.push(a)
  }
  if (visited.size >= 42) {
    const a = unlockAchievement('half_done')
    if (a) newAchievements.push(a)
  }
  if (visited.size >= 84) {
    const a = unlockAchievement('completionist')
    if (a) newAchievements.push(a)
  }

  // Night owl: after midnight
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 5) {
    const a = unlockAchievement('night_owl')
    if (a) newAchievements.push(a)
  }

  // Returning: visited on 3+ different calendar days
  const dates = loadSet(FIRST_VISIT_KEY)
  const today = new Date().toDateString()
  dates.add(today)
  saveSet(FIRST_VISIT_KEY, dates)
  if (dates.size >= 3) {
    const a = unlockAchievement('returning')
    if (a) newAchievements.push(a)
  }

  return newAchievements
}

/** Track a galaxy visit. Returns array of newly-unlocked achievements. */
export function trackGalaxyVisit(galaxyId: string): Achievement[] {
  const visited = loadSet(VISITED_GALAXIES_KEY)
  visited.add(galaxyId)
  saveSet(VISITED_GALAXIES_KEY, visited)

  if (visited.size >= 6) {
    const a = unlockAchievement('galaxy_hopper')
    if (a) return [a]
  }
  return []
}

/** Track speed runner: 3 galaxies within 60 seconds. */
let galaxyTimestamps: number[] = []
export function trackSpeedGalaxyHop(): Achievement | null {
  const now = Date.now()
  galaxyTimestamps.push(now)
  // Keep only last 10
  if (galaxyTimestamps.length > 10) galaxyTimestamps = galaxyTimestamps.slice(-10)
  // Check if 3 within 60s
  const recent = galaxyTimestamps.filter(t => now - t < 60_000)
  if (recent.length >= 3) {
    return unlockAchievement('speed_runner')
  }
  return null
}
