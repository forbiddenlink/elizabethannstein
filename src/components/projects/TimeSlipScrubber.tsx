'use client'

import { useState } from 'react'
import styles from './TimeSlipScrubber.module.css'

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
    <div className={styles.sheet}>
      <div className={styles.head}>
        <span>TimeSlipSearch: a sample year</span>
        <span>Algolia challenge, $750 prize</span>
      </div>

      <div className={styles.years} role="group" aria-label="Pick a year">
        {ERAS.map((e, idx) => (
          <button
            type="button"
            key={e.year}
            aria-pressed={selectedYearIndex === idx}
            onClick={() => setSelectedYearIndex(idx)}
          >
            {e.year}
          </button>
        ))}
      </div>

      <p className={styles.date}>{era.dateLabel}</p>

      <dl className={styles.rows}>
        <div>
          <dt>Billboard #1</dt>
          <dd>
            {era.billboard}
            <span>{era.artist}</span>
          </dd>
        </div>
        <div>
          <dt>Box office</dt>
          <dd>{era.boxOffice}</dd>
        </div>
        <div>
          <dt>Economic baseline</dt>
          <dd>Gas: {era.gasPrice}</dd>
        </div>
        <div>
          <dt>Wikimedia event</dt>
          <dd>{era.headline}</dd>
        </div>
      </dl>

      <figure className={styles.narrative}>
        <figcaption>Agent Studio narrative output</figcaption>
        <blockquote>{era.synthesis}</blockquote>
      </figure>
    </div>
  )
}
