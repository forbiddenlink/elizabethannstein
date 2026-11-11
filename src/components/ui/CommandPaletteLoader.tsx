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
const loadCommandPalette = () =>
  import('@/components/ui/CommandPalette').then((m) => m.CommandPalette)

const CommandPalette = dynamic(loadCommandPalette, { ssr: false })

export function CommandPaletteLoader() {
  const [loaded, setLoaded] = useState(false)

  /**
   * Warm the chunk once the page is idle. Without this the first Cmd+K on a
   * cold load has to wait for a network round trip before anything appears,
   * which is a visible stall for the person and an intermittent failure for the
   * palette specs. Prefetching costs nothing on the critical path: the import
   * still happens after first paint, it is simply no longer on the keypress.
   */
  useEffect(() => {
    if (loaded) return
    const idle = globalThis.requestIdleCallback
    const warm = () => {
      void loadCommandPalette()
    }
    if (typeof idle === 'function') {
      const handle = idle(warm)
      return () => globalThis.cancelIdleCallback?.(handle)
    }
    const timer = globalThis.setTimeout(warm, 2000)
    return () => globalThis.clearTimeout(timer)
  }, [loaded])

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
