'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * The command palette pulls in GSAP and the whole `galaxyData` catalogue — all
 * 88 projects with their case-study prose. Mounting it from the root layout put
 * that in the shared bundle of every route: measured in production, /privacy
 * (pure legal text, no project data on screen) still downloaded a 32 KB
 * compressed chunk containing "Coulson One" and the rest of the catalogue.
 *
 * This keeps a ~0-cost keydown listener in the shared bundle instead, and pulls
 * the real palette in the first time someone presses the shortcut. The listener
 * hands off `defaultOpen` so that first press still opens it in one go.
 */
const CommandPalette = dynamic(
  () => import('@/components/ui/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false }
)

export function CommandPaletteLoader() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setLoaded(true)
      }
    }

    globalThis.addEventListener('keydown', onKeyDown)
    return () => globalThis.removeEventListener('keydown', onKeyDown)
  }, [loaded])

  if (!loaded) return null
  // Once mounted the palette owns the shortcut itself, including toggling shut.
  return <CommandPalette defaultOpen />
}
