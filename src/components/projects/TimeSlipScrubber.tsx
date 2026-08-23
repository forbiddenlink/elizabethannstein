'use client'

import { Calendar, Disc, DollarSign, Film, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface CulturalEra {
  year: number
  dateLabel: string
  billboard: string
  artist: string
  boxOffice: string
  gasPrice: string
  headline: string
  synthesis: string
}

const ERAS: CulturalEra[] = [
  {
    year: 1969,
    dateLabel: 'July 20, 1969',
    billboard: 'In the Year 2525',
    artist: 'Zager & Evans',
    boxOffice: 'Midnight Cowboy / Easy Rider',
    gasPrice: '$0.35 / gal',
    headline: 'Apollo 11 Lands on the Moon: "One Giant Leap"',
    synthesis:
      'Humanity touches lunar dust while psychedelic counterculture echoes across Woodstock radio towers. A pivotal turning point in world history.',
  },
  {
    year: 1977,
    dateLabel: 'May 25, 1977',
    billboard: 'Sir Duke',
    artist: 'Stevie Wonder',
    boxOffice: 'Star Wars: Episode IV — A New Hope',
    gasPrice: '$0.62 / gal',
    headline: 'George Lucas Reinvents Global Cinema with Star Wars',
    synthesis:
      'Laser fire and funk basslines transform youth culture as sci-fi blockbusters become a universal global language.',
  },
  {
    year: 1985,
    dateLabel: 'July 13, 1985',
    billboard: 'Everytime You Go Away',
    artist: 'Paul Young',
    boxOffice: 'Back to the Future',
    gasPrice: '$1.12 / gal',
    headline: 'Live Aid Transmits Global Concert to 1.9 Billion People',
    synthesis:
      'DeLorean time circuits, synthesizer hooks, and planetary broadcast satellites unite the 80s in an unforgettable neon pulse.',
  },
  {
    year: 1999,
    dateLabel: 'December 31, 1999',
    billboard: 'Smooth',
    artist: 'Santana ft. Rob Thomas',
    boxOffice: 'The Matrix / Star Wars: Phantom Menace',
    gasPrice: '$1.22 / gal',
    headline: 'Millennium Eve: Global Vigilance over Y2K Infrastructure',
    synthesis:
      'Cyberpunk thrills and digital dawn optimism collide on the eve of the 21st century as dial-up tones give way to the internet age.',
  },
  {
    year: 2026,
    dateLabel: 'March 15, 2026',
    billboard: 'Algolia Agent Studio Grand Prize Winner',
    artist: 'TimeSlipSearch AI Engine',
    boxOffice: 'Autonomous AI Multi-Agent Workflows',
    gasPrice: 'Realtime FRED API',
    headline: 'Elizabeth Stein Wins $750 Algolia Agent Studio Challenge',
    synthesis:
      'Conversational multi-index vector search fuses 420,000 cultural records into era-aware narratives using Next.js 16 and Langfuse.',
  },
]

export function TimeSlipScrubber() {
  const [selectedYearIndex, setSelectedYearIndex] = useState(2) // 1985 default
  const era = ERAS[selectedYearIndex]

  return (
    <div className="w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0e0d16] text-gray-200 font-sans shadow-xl">
      {/* CRT / VHS Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161426] border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-gray-200 tracking-wider uppercase font-mono">
            TimeSlipSearch &mdash; Interactive Cultural Snapshot Engine
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          ★ $750 Algolia Grand Prize
        </span>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        {/* Year scrubber slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Scrub Cultural Timeline:
            </span>
            <span className="font-mono text-sm font-bold text-cyan-300">
              {era.year} &middot; {era.dateLabel}
            </span>
          </div>

          <div className="flex gap-2">
            {ERAS.map((e, idx) => (
              <button
                type="button"
                key={e.year}
                onClick={() => setSelectedYearIndex(idx)}
                className={`flex-1 py-1.5 px-1 text-center font-mono text-xs rounded transition-all ${
                  selectedYearIndex === idx
                    ? 'bg-amber-400 text-black font-bold shadow-md'
                    : 'bg-neutral-800/80 text-gray-300 hover:bg-neutral-700'
                }`}
              >
                {e.year}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Index Query Simulation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Billboard Index */}
          <div className="p-3 rounded bg-[#161426]/70 border border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-pink-400 font-mono font-semibold mb-1 text-[11px]">
              <Disc className="w-3.5 h-3.5" /> Billboard #1
            </div>
            <p className="font-medium text-white">{era.billboard}</p>
            <p className="text-[11px] text-gray-400">{era.artist}</p>
          </div>

          {/* TMDB Index */}
          <div className="p-3 rounded bg-[#161426]/70 border border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold mb-1 text-[11px]">
              <Film className="w-3.5 h-3.5" /> Box Office Sensation
            </div>
            <p className="font-medium text-white">{era.boxOffice}</p>
          </div>

          {/* FRED Economic Index */}
          <div className="p-3 rounded bg-[#161426]/70 border border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold mb-1 text-[11px]">
              <DollarSign className="w-3.5 h-3.5" /> Economic Baseline
            </div>
            <p className="font-medium text-white">Gas: {era.gasPrice}</p>
          </div>

          {/* Wikimedia Events */}
          <div className="p-3 rounded bg-[#161426]/70 border border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-semibold mb-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5" /> Wikimedia Event
            </div>
            <p className="font-medium text-white leading-tight">{era.headline}</p>
          </div>
        </div>

        {/* Synthesized Era Narrative */}
        <div className="p-4 rounded-lg bg-[#12101e] border border-amber-400/20 text-xs sm:text-sm leading-relaxed text-gray-200">
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Algolia Agent Studio Narrative Output:
          </div>
          <p className="italic text-gray-100">&ldquo;{era.synthesis}&rdquo;</p>
        </div>
      </div>
    </div>
  )
}
