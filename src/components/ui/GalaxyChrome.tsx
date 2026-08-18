'use client'

import { usePathname } from 'next/navigation'
import { GalaxyCursor } from '@/components/ui/GalaxyCursor'
import { WarpTransition } from '@/components/ui/WarpTransition'

/**
 * Galaxy-era ambient chrome (film grain, custom cursor, warp page-wipe) belongs only
 * to the dark 3D showcase at /explore. The editorial content site (home, work, about,
 * contact, privacy) is a different design language and must not inherit it, so this
 * gate renders nothing outside /explore.
 */
export function GalaxyChrome() {
  const pathname = usePathname()
  if (!pathname?.startsWith('/explore')) return null

  return (
    <>
      <div
        className="grain-film pointer-events-none fixed inset-0 z-[12] select-none"
        aria-hidden="true"
      />
      <WarpTransition />
      <GalaxyCursor />
    </>
  )
}
