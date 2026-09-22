'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

/**
 * Galaxy-era ambient chrome (film grain, custom cursor, warp page-wipe) belongs only
 * to the dark 3D showcase at /explore. The editorial content site (home, work, about,
 * contact, privacy) is a different design language and must not inherit it, so this
 * gate renders nothing outside /explore.
 *
 * The two pieces are loaded dynamically because the `return null` above only stops
 * them RENDERING — static imports would still put them, and everything they pull in,
 * in the shared bundle of every route. GalaxyCursor reaches `lib/store`, which imports
 * the whole `galaxyData` catalogue; WarpTransition pulls framer-motion. Measured in
 * production before this change, /privacy downloaded a chunk containing every project's
 * case-study prose while showing none of it.
 */
const GalaxyCursor = dynamic(
  () => import('@/components/ui/GalaxyCursor').then((m) => m.GalaxyCursor),
  { ssr: false }
)
const WarpTransition = dynamic(
  () => import('@/components/ui/WarpTransition').then((m) => m.WarpTransition),
  { ssr: false }
)

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
