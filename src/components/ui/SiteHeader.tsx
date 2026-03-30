'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

const GALAXY_THEME = {
  enterprise: {
    border: 'border-orange-400/25',
    glow: 'shadow-[0_0_28px_rgba(249,115,22,0.20)]',
    active: 'text-orange-100 bg-orange-500/20 border border-orange-300/25',
    hover: 'hover:bg-orange-500/10 hover:text-orange-100',
  },
  ai: {
    border: 'border-cyan-400/25',
    glow: 'shadow-[0_0_28px_rgba(34,211,238,0.20)]',
    active: 'text-cyan-100 bg-cyan-500/20 border border-cyan-300/25',
    hover: 'hover:bg-cyan-500/10 hover:text-cyan-100',
  },
  fullstack: {
    border: 'border-purple-400/25',
    glow: 'shadow-[0_0_28px_rgba(168,85,247,0.20)]',
    active: 'text-purple-100 bg-purple-500/20 border border-purple-300/25',
    hover: 'hover:bg-purple-500/10 hover:text-purple-100',
  },
  devtools: {
    border: 'border-emerald-400/25',
    glow: 'shadow-[0_0_28px_rgba(16,185,129,0.20)]',
    active: 'text-emerald-100 bg-emerald-500/20 border border-emerald-300/25',
    hover: 'hover:bg-emerald-500/10 hover:text-emerald-100',
  },
  design: {
    border: 'border-pink-400/25',
    glow: 'shadow-[0_0_28px_rgba(236,72,153,0.20)]',
    active: 'text-pink-100 bg-pink-500/20 border border-pink-300/25',
    hover: 'hover:bg-pink-500/10 hover:text-pink-100',
  },
  experimental: {
    border: 'border-amber-400/25',
    glow: 'shadow-[0_0_28px_rgba(245,158,11,0.20)]',
    active: 'text-amber-100 bg-amber-500/20 border border-amber-300/25',
    hover: 'hover:bg-amber-500/10 hover:text-amber-100',
  },
} as const

const GALAXY_LABELS: Record<keyof typeof GALAXY_THEME, string> = {
  enterprise: 'Enterprise Missions',
  ai: 'AI Frontier',
  fullstack: 'Full-Stack Nebula',
  devtools: 'DevTools Arsenal',
  design: 'Design Universe',
  experimental: 'Experiment Lab',
}

type GalaxyThemeKey = keyof typeof GALAXY_THEME

interface SiteHeaderProps {
  accentGalaxy?: string
}

function isGalaxyThemeKey(value: string): value is GalaxyThemeKey {
  return value in GALAXY_THEME
}

function getRouteTheme(pathname: string): GalaxyThemeKey {
  if (pathname.startsWith('/contact')) return 'enterprise'
  if (pathname.startsWith('/about')) return 'design'
  if (pathname.startsWith('/work')) return 'ai'
  return 'fullstack'
}

export function SiteHeader({ accentGalaxy }: Readonly<SiteHeaderProps>) {
  const pathname = usePathname()
  const themeKey =
    accentGalaxy && isGalaxyThemeKey(accentGalaxy) ? accentGalaxy : getRouteTheme(pathname)
  const theme = GALAXY_THEME[themeKey]
  const themeLabel = GALAXY_LABELS[themeKey]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
      <div
        className={`mx-auto px-6 py-3 flex items-center justify-between backdrop-blur-xl bg-black/50 border-b ${theme.border} ${theme.glow} transition-all duration-300`}
      >
        <Link href="/" className="flex items-center gap-3 group min-h-11 min-w-11 p-2">
          <span className="relative w-7 h-7 shrink-0 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600" />
            <span className="absolute inset-0.5 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
            <span className="absolute inset-1 rounded-full bg-white/80" />
          </span>
          <span className="text-base sm:text-2xl font-bold bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-white group-hover:to-purple-200 transition-all duration-300">
            Elizabeth Stein
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <span
            className={`hidden xl:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.16em] border ${theme.active}`}
            aria-label={`Current sector: ${themeLabel}`}
            title={`Current sector: ${themeLabel}`}
          >
            {themeLabel}
          </span>
          {/* Open to work status pill */}
          <Link
            href="/about"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 mr-1"
            title="Open to new opportunities"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span>Open to work</span>
          </Link>
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-xs sm:text-sm font-medium min-h-11 px-3 py-3 inline-flex items-center rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 ${
                  isActive ? theme.active : `text-white/60 hover:text-white ${theme.hover}`
                }`}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full opacity-60"
                    style={{
                      background: 'currentColor',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
