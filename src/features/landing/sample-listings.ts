import { type Position } from './sample-players'

export interface SampleListing {
  readonly age: number
  readonly assists: number
  readonly club: string
  readonly firstName: string
  readonly goals: number
  readonly id: string
  readonly isPromoted: boolean
  readonly lastName: string
  readonly league: string
  readonly matches: number
  readonly minutes: number
  readonly position: Position
}

// Synthetic season lines, not listings. The design files all three under left wing, the
// position the search filters by, even though two of them play elsewhere on the board.
const IVAN_HORVAT: SampleListing = {
  id: 'ivan-horvat',
  firstName: 'Ivan',
  lastName: 'Horvat',
  club: 'NK Kustošija',
  league: '3. NL Zagreb',
  age: 22,
  position: 'LW',
  matches: 24,
  goals: 9,
  assists: 6,
  minutes: 1980,
  isPromoted: true,
}

/**
 * The club search demo's results, promoted listing first.
 */
export const SAMPLE_SEARCH_RESULTS: readonly SampleListing[] = [
  IVAN_HORVAT,
  {
    id: 'marko-kovacevic',
    firstName: 'Marko',
    lastName: 'Kovačević',
    club: 'NK Dubrava',
    league: '3. NL Zagreb',
    age: 20,
    position: 'LW',
    matches: 19,
    goals: 5,
    assists: 8,
    minutes: 1540,
    isPromoted: false,
  },
  {
    id: 'luka-babic',
    firstName: 'Luka',
    lastName: 'Babić',
    club: 'NK Sesvete',
    league: '2. NL',
    age: 24,
    position: 'LW',
    matches: 26,
    goals: 11,
    assists: 4,
    minutes: 2210,
    isPromoted: false,
  },
]

interface SampleProfile {
  readonly listing: SampleListing
  readonly seenByClubsThisWeek: number
}

/**
 * The player fact sheet demo: the promoted listing from the search, seen from his side.
 */
export const SAMPLE_PROFILE: SampleProfile = {
  listing: IVAN_HORVAT,
  seenByClubsThisWeek: 7,
}
