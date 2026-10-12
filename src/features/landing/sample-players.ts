import { getListing } from '#/features/sample-listings/sample-listings'

import { type BoardLayout } from './board-layout'

export type Position = 'CB' | 'CM' | 'GK' | 'LB' | 'LW' | 'RB' | 'RW' | 'ST'

export type PlayerLine = 'DEF' | 'FWD' | 'GK' | 'MID'

export const LINE_BY_POSITION = {
  GK: 'GK',
  LB: 'DEF',
  CB: 'DEF',
  RB: 'DEF',
  CM: 'MID',
  LW: 'FWD',
  ST: 'FWD',
  RW: 'FWD',
} as const satisfies Record<Position, PlayerLine>

export type StatUnit = 'assists' | 'cleanSheets' | 'goals' | 'matches'

// A chip's horizontal centre and top edge on the Figma board, in board pixels.
interface SlotPoint {
  readonly x: number
  readonly y: number
}

interface SeasonStat {
  readonly unit: StatUnit
  readonly value: number
}

export interface SamplePlayer {
  readonly age: number
  readonly club: string
  readonly firstName: string
  readonly id: string
  readonly isPromoted: boolean
  readonly lastName: string
  readonly position: Position
  readonly slot: Readonly<Record<BoardLayout, SlotPoint>>
  readonly stat: SeasonStat
}

interface BoardSlot {
  // The sample listing on this slot. Its name, club, age and numbers come from the data module.
  readonly listingId: string
  // The slot on the board, which need not be the position the listing is filed under.
  readonly position: Position
  readonly slot: Readonly<Record<BoardLayout, SlotPoint>>
  readonly statUnit: StatUnit
}

// Desktop points are the handoff centre points, except the centre backs, which sit 5 px further
// apart so the Croatian stat units do not make them touch. Mobile points are the centres of the
// chips on the Figma mobile board.
const BOARD_SLOTS: readonly BoardSlot[] = [
  {
    listingId: 'karlo-basic',
    position: 'GK',
    statUnit: 'cleanSheets',
    slot: { full: { x: 368, y: 452 }, compact: { x: 175, y: 410 } },
  },
  {
    listingId: 'josip-matic',
    position: 'LB',
    statUnit: 'matches',
    slot: { full: { x: 122, y: 318 }, compact: { x: 58, y: 300 } },
  },
  {
    listingId: 'tomislav-vukovic',
    position: 'CB',
    statUnit: 'matches',
    slot: { full: { x: 253, y: 374 }, compact: { x: 110, y: 350 } },
  },
  {
    listingId: 'dario-knezevic',
    position: 'CB',
    statUnit: 'matches',
    slot: { full: { x: 483, y: 374 }, compact: { x: 242, y: 350 } },
  },
  {
    listingId: 'niko-grgic',
    position: 'RB',
    statUnit: 'matches',
    slot: { full: { x: 614, y: 318 }, compact: { x: 292, y: 300 } },
  },
  {
    listingId: 'petar-juric',
    position: 'CM',
    statUnit: 'assists',
    slot: { full: { x: 175, y: 178 }, compact: { x: 80, y: 170 } },
  },
  {
    listingId: 'ante-peric',
    position: 'CM',
    statUnit: 'assists',
    slot: { full: { x: 368, y: 234 }, compact: { x: 175, y: 222 } },
  },
  {
    listingId: 'filip-saric',
    position: 'CM',
    statUnit: 'assists',
    slot: { full: { x: 561, y: 178 }, compact: { x: 270, y: 170 } },
  },
  {
    listingId: 'ivan-horvat',
    position: 'LW',
    statUnit: 'goals',
    slot: { full: { x: 150, y: 56 }, compact: { x: 62, y: 78 } },
  },
  {
    listingId: 'luka-babic',
    position: 'ST',
    statUnit: 'goals',
    slot: { full: { x: 368, y: 56 }, compact: { x: 175, y: 34 } },
  },
  {
    listingId: 'marko-kovacevic',
    position: 'RW',
    statUnit: 'goals',
    slot: { full: { x: 586, y: 56 }, compact: { x: 283, y: 78 } },
  },
]

function toSamplePlayer({ listingId, position, slot, statUnit }: BoardSlot): SamplePlayer {
  const listing = getListing(listingId)
  const { cleanSheets = 0, ...season } = listing.thisSeason
  const stats: Readonly<Record<StatUnit, number>> = { ...season, cleanSheets }
  return {
    id: listing.id,
    firstName: listing.firstName,
    lastName: listing.lastName,
    club: listing.club,
    age: listing.age,
    isPromoted: listing.isPromoted,
    position,
    slot,
    stat: { unit: statUnit, value: stats[statUnit] },
  }
}

/**
 * The eleven sample players on the tactics board, read from the shared sample listings so the
 * landing page and the demo show the same people at the same clubs.
 */
export const SAMPLE_PLAYERS: readonly SamplePlayer[] = BOARD_SLOTS.map((slot) =>
  toSamplePlayer(slot),
)
