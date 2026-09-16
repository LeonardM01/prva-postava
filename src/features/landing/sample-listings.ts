import { type Position, SAMPLE_PLAYERS, type SamplePlayer } from './sample-players'

export interface SampleListing {
  readonly assists: number
  readonly goals: number
  readonly league: string
  readonly matches: number
  readonly minutes: number
  readonly player: SamplePlayer
  // The list the player is filed under in the search, which need not be his slot on the board.
  readonly position: Position
}

function findSamplePlayer(id: string): SamplePlayer {
  const player = SAMPLE_PLAYERS.find((candidate) => candidate.id === id)
  if (player === undefined) {
    throw new Error(`No sample player with id "${id}"`)
  }
  return player
}

// Synthetic season lines for players on the board, not listings. The design files all three
// under left wing, the position the search filters by.
const IVAN_HORVAT: SampleListing = {
  player: findSamplePlayer('ivan-horvat'),
  position: 'LW',
  league: '3. NL Zagreb',
  matches: 24,
  goals: 9,
  assists: 6,
  minutes: 1980,
}

/**
 * The club search demo's results, promoted listing first.
 */
export const SAMPLE_SEARCH_RESULTS: readonly SampleListing[] = [
  IVAN_HORVAT,
  {
    player: findSamplePlayer('marko-kovacevic'),
    position: 'LW',
    league: '3. NL Zagreb',
    matches: 19,
    goals: 5,
    assists: 8,
    minutes: 1540,
  },
  {
    player: findSamplePlayer('luka-babic'),
    position: 'LW',
    league: '2. NL',
    matches: 26,
    goals: 11,
    assists: 4,
    minutes: 2210,
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
