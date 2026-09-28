'use client'

import { useEffect, useState } from 'react'
import { THEME_STORAGE_KEY } from '@/lib/theme'

function currentIsDark(): boolean {
  const explicit = document.documentElement.getAttribute('data-theme')
  if (explicit === 'dark') return true
  if (explicit === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  // null until mounted: the server cannot know the visitor's theme.
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDark(currentIsDark())
  }, [])

  function toggle(): void {
    const next = !currentIsDark()
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage blocked (private mode): the switch still works for this page view.
    }
    setIsDark(next)
  }

  return (
    <button type="button" className={className} onClick={toggle} aria-pressed={isDark ?? undefined}>
      Dark theme
      <span aria-hidden="true" data-state={isDark ? 'on' : 'off'}>
        {isDark === null ? '' : isDark ? 'on' : 'off'}
      </span>
    </button>
  )
}
