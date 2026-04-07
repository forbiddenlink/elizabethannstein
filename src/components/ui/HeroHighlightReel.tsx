'use client'

import Link from 'next/link'
import { trackEvent } from '@/components/Analytics'
import { getHighlightReel } from '@/lib/highlightReel'

/**
 * Compact recruiter path: three case studies without opening the 3D scene first.
 */
export function HeroHighlightReel() {
  const items = getHighlightReel()

  return (
    <div className="pointer-events-auto mb-3 max-w-xl border-t border-white/10 pt-3 md:mb-4 md:pt-4">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
        Featured case studies
      </p>
      <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-2">
        {items.map((item) => (
          <li key={item.id} className="min-w-0 sm:max-w-[calc(50%-0.375rem)] lg:max-w-none">
            <Link
              href={`/work/${item.id}`}
              onClick={() =>
                trackEvent('highlight_reel_click', {
                  project_id: item.id,
                  project_title: item.title,
                  source: 'hero_highlight_reel',
                })
              }
              className="group flex flex-col gap-0.5 rounded-lg py-0.5 sm:inline sm:max-w-none sm:flex-row sm:items-baseline sm:gap-1.5"
            >
              <span className="truncate text-sm font-semibold text-white/92 underline-offset-4 transition-colors group-hover:text-white group-hover:underline">
                {item.title}
              </span>
              <span className="text-xs text-white/45">{item.hook}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
