/**
 * Real TimeSlipSearch output, captured from the live product so the home demo shows what it
 * actually returns instead of hand-written sample rows.
 *
 * Source: POST https://timeslipsearch.vercel.app/api/chat with { message: query }, captured
 * 2026-10-03. Date windows come from running the product's own parser
 * (time-slip-search/src/lib/date-parser.ts) on the same queries. Hit counts are the lengths of
 * the arrays the API returned for each index; the API caps them (5 songs, 3 films, 1 price
 * row, 3 events), so they are "shown", not totals. Recapture by re-running the same request;
 * do not edit values by hand.
 */

export const TIMESLIP_SOURCE = {
  endpoint: 'https://timeslipsearch.vercel.app/api/chat',
  capturedAt: '2026-10-03',
} as const

export type TimeSlipIndex = 'songs' | 'movies' | 'prices' | 'events'

export interface TimeSlipSong {
  position: number
  title: string
  artist: string
  /** Chart week the row belongs to, YYYY-MM-DD. */
  week: string
}

export interface TimeSlipPrice {
  /** Month the price row belongs to, YYYY-MM-DD (first of month). */
  month: string
  gasPerGallon: number
  minimumWage: number
  movieTicket: number
}

export interface TimeSlipEvent {
  date: string
  title: string
}

export interface TimeSlipCapture {
  id: string
  query: string
  /** What the product printed as the resolved date. */
  display: string
  /** Which branch of the product's parser handled the input. */
  parsedBy: 'season pattern' | 'chrono-node'
  /** How the parser widened the input, in plain words. */
  windowRule: string
  /** Inclusive window the four indices were filtered on, YYYY-MM-DD. */
  window: { start: string; end: string }
  hits: Record<TimeSlipIndex, number>
  songs: TimeSlipSong[]
  price?: TimeSlipPrice
  event?: TimeSlipEvent
  /** One of the product's own generated insight lines (emoji removed). */
  insight: string
}

export const TIMESLIP_CAPTURES: readonly TimeSlipCapture[] = [
  {
    id: 'summer-69',
    query: 'summer of 69',
    display: 'Summer of 1969',
    parsedBy: 'season pattern',
    windowRule: 'A season becomes its three months.',
    window: { start: '1969-06-01', end: '1969-08-31' },
    hits: { songs: 5, movies: 0, prices: 1, events: 1 },
    songs: [
      { position: 1, title: 'In The Year 2525', artist: 'Zager & Evans', week: '1969-08-16' },
      {
        position: 1,
        title: 'Love Theme From Romeo & Juliet',
        artist: 'Henry Mancini And His Orchestra',
        week: '1969-07-05',
      },
      { position: 1, title: 'Honky Tonk Women', artist: 'The Rolling Stones', week: '1969-08-30' },
    ],
    price: { month: '1969-08-01', gasPerGallon: 0.35, minimumWage: 1.6, movieTicket: 1.44 },
    event: {
      date: '1969-08-13',
      title: 'The Apollo 11 astronauts enjoy a ticker-tape parade in New York City.',
    },
    insight: 'The year we walked on the moon',
  },
  {
    id: 'live-aid',
    query: 'July 13, 1985',
    display: 'July 13, 1985',
    parsedBy: 'chrono-node',
    windowRule: 'A single date widens to three days either side.',
    window: { start: '1985-07-10', end: '1985-07-16' },
    hits: { songs: 5, movies: 0, prices: 0, events: 0 },
    songs: [
      { position: 1, title: 'A View To A Kill', artist: 'Duran Duran', week: '1985-07-13' },
      { position: 2, title: 'Sussudio', artist: 'Phil Collins', week: '1985-07-13' },
      {
        position: 3,
        title: 'Raspberry Beret',
        artist: 'Prince And The Revolution',
        week: '1985-07-13',
      },
    ],
    insight: 'The year the world came together for Live Aid',
  },
  {
    id: 'y2k',
    query: 'December 31, 1999',
    display: 'December 31, 1999',
    parsedBy: 'chrono-node',
    windowRule: 'A single date widens to three days either side, across the year boundary.',
    window: { start: '1999-12-28', end: '2000-01-03' },
    hits: { songs: 5, movies: 0, prices: 1, events: 0 },
    songs: [
      { position: 1, title: 'Smooth', artist: 'Santana Featuring Rob Thomas', week: '2000-01-01' },
      { position: 2, title: 'Back At One', artist: 'Brian McKnight', week: '2000-01-01' },
      {
        position: 3,
        title: 'I Wanna Love You Forever',
        artist: 'Jessica Simpson',
        week: '2000-01-01',
      },
    ],
    price: { month: '2000-01-01', gasPerGallon: 1.289, minimumWage: 5.15, movieTicket: 5.39 },
    insight: 'The year we partied like it was... well, 1999',
  },
] as const

export const TIMESLIP_INDEX_LABEL: Record<TimeSlipIndex, string> = {
  songs: 'Charts',
  movies: 'Films',
  prices: 'Prices',
  events: 'Events',
}
