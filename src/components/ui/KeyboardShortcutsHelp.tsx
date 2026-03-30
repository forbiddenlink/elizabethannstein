'use client'

import { useViewStore } from '@/lib/store'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function KeyboardShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false)
  const view = useViewStore((state) => state.view)
  const hasEntered = useViewStore((state) => state.hasEntered)
  const selectedGalaxy = useViewStore((state) => state.selectedGalaxy)
  const showMobileTrigger = view === 'universe' && !selectedGalaxy

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) {
    // Hide the ? button when modal is open — it's under the modal anyway but prevents visual peek-through
    if (view === 'project' || !hasEntered) return null
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed z-30 hidden lg:flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white lg:bottom-8 lg:right-28 ${showMobileTrigger ? 'bottom-18 right-4 opacity-100' : 'pointer-events-none bottom-16 right-4 opacity-0 translate-y-3 lg:pointer-events-auto lg:opacity-100 lg:translate-y-0'}`}
        aria-label="Show keyboard shortcuts"
      >
        <span aria-hidden="true">?</span>
        <span className="sr-only">Show keyboard shortcuts</span>
      </button>
    )
  }

  const shortcuts = [
    { keys: ['⌘K'], description: 'Search all projects' },
    { keys: ['←', '→', '↑', '↓'], description: 'Navigate galaxies/projects' },
    { keys: ['1-6'], description: 'Jump to galaxy' },
    { keys: ['H'], description: 'Home (universe view)' },
    { keys: ['ESC'], description: 'Zoom out / Close' },
    { keys: ['Enter'], description: 'Select / Zoom in' },
    { keys: ['?'], description: 'Toggle this help' },
  ]

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-linear-to-br from-black/90 to-black/70 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 min-w-11 min-h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Keyboard Shortcuts</h2>

        <div className="space-y-4">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.description} className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={`${shortcut.description}-${key}`}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-mono font-semibold"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-white/70 text-sm flex-1 text-right">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">
            Current view: <span className="text-white/80 font-semibold capitalize">{view}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
