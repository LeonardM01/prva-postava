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

// Synthetic players, not listings. Desktop points are the handoff centre points, except the
// centre backs, which sit 5 px further apart so the Croatian stat units do not make them touch.
// Mobile points are the centres of the chips on the Figma mobile board.
export const SAMPLE_PLAYERS: readonly SamplePlayer[] = [
  {
    id: 'karlo-basic',
    firstName: 'Karlo',
    lastName: 'Bašić',
    club: 'NK Lučko',
    age: 28,
    position: 'GK',
    stat: { value: 9, unit: 'cleanSheets' },
    isPromoted: false,
    slot: { full: { x: 368, y: 452 }, compact: { x: 175, y: 410 } },
  },
  {
    id: 'josip-matic',
    firstName: 'Josip',
    lastName: 'Matić',
    club: 'NK Jarun',
    age: 25,
    position: 'LB',
    stat: { value: 24, unit: 'matches' },
    isPromoted: false,
    slot: { full: { x: 122, y: 318 }, compact: { x: 58, y: 300 } },
  },
  {
    id: 'tomislav-vukovic',
    firstName: 'Tomislav',
    lastName: 'Vuković',
    club: 'NK Ponikve',
    age: 27,
    position: 'CB',
    stat: { value: 26, unit: 'matches' },
    isPromoted: false,
    slot: { full: { x: 253, y: 374 }, compact: { x: 110, y: 350 } },
  },
  {
    id: 'dario-knezevic',
    firstName: 'Dario',
    lastName: 'Knežević',
    club: 'NK Sloga',
    age: 24,
    position: 'CB',
    stat: { value: 21, unit: 'matches' },
    isPromoted: false,
    slot: { full: { x: 483, y: 374 }, compact: { x: 242, y: 350 } },
  },
  {
    id: 'niko-grgic',
    firstName: 'Niko',
    lastName: 'Grgić',
    club: 'NK Zelina',
    age: 22,
    position: 'RB',
    stat: { value: 19, unit: 'matches' },
    isPromoted: false,
    slot: { full: { x: 614, y: 318 }, compact: { x: 292, y: 300 } },
  },
  {
    id: 'petar-juric',
    firstName: 'Petar',
    lastName: 'Jurić',
    club: 'NK Rudeš',
    age: 23,
    position: 'CM',
    stat: { value: 4, unit: 'assists' },
    isPromoted: false,
    slot: { full: { x: 175, y: 178 }, compact: { x: 80, y: 170 } },
  },
  {
    id: 'ante-peric',
    firstName: 'Ante',
    lastName: 'Perić',
    club: 'NK Solin',
    age: 26,
    position: 'CM',
    stat: { value: 6, unit: 'assists' },
    isPromoted: false,
    slot: { full: { x: 368, y: 234 }, compact: { x: 175, y: 222 } },
  },
  {
    id: 'filip-saric',
    firstName: 'Filip',
    lastName: 'Šarić',
    club: 'NK Vinogradar',
    age: 21,
    position: 'CM',
    stat: { value: 3, unit: 'assists' },
    isPromoted: false,
    slot: { full: { x: 561, y: 178 }, compact: { x: 270, y: 170 } },
  },
  {
    id: 'ivan-horvat',
    firstName: 'Ivan',
    lastName: 'Horvat',
    club: 'NK Kustošija',
    age: 22,
    position: 'LW',
    stat: { value: 9, unit: 'goals' },
    isPromoted: true,
    slot: { full: { x: 150, y: 56 }, compact: { x: 62, y: 78 } },
  },
  {
    id: 'luka-babic',
    firstName: 'Luka',
    lastName: 'Babić',
    club: 'NK Sesvete',
    age: 24,
    position: 'ST',
    stat: { value: 11, unit: 'goals' },
    isPromoted: false,
    slot: { full: { x: 368, y: 56 }, compact: { x: 175, y: 34 } },
  },
  {
    id: 'marko-kovacevic',
    firstName: 'Marko',
    lastName: 'Kovačević',
    club: 'NK Dubrava',
    age: 20,
    position: 'RW',
    stat: { value: 5, unit: 'goals' },
    isPromoted: false,
    slot: { full: { x: 586, y: 56 }, compact: { x: 283, y: 78 } },
  },
]
