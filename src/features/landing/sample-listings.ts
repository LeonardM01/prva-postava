import { getListing } from '#/features/sample-listings/sample-listings'

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

// The three are filed under left wing in the sample data, the position the search filters by.
function leftWingListing(id: string): SampleListing {
  const { league, thisSeason } = getListing(id)
  return {
    player: findSamplePlayer(id),
    position: 'LW',
    league,
    matches: thisSeason.matches,
    goals: thisSeason.goals,
    assists: thisSeason.assists,
    minutes: thisSeason.minutes,
  }
}

const IVAN_HORVAT = leftWingListing('ivan-horvat')

/**
 * The club search demo's results, promoted listing first.
 */
export const SAMPLE_SEARCH_RESULTS: readonly SampleListing[] = [
  IVAN_HORVAT,
  leftWingListing('marko-kovacevic'),
  leftWingListing('luka-babic'),
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
  seenByClubsThisWeek: getListing('ivan-horvat').seenByClubs.thisWeek,
}
