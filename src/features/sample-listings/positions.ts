/**
 * The twelve positions a listing can be filed under, in the order every chooser shows them:
 * by line, goalkeeper first, then right to left across each line as a lineup is read.
 */
export const POSITIONS = [
  'GK',
  'RB',
  'CB',
  'LB',
  'DM',
  'CM',
  'AM',
  'RM',
  'LM',
  'RW',
  'LW',
  'ST',
] as const

export type Position = (typeof POSITIONS)[number]

/**
 * Lines group positions so filters scan quickly. They are never a filing axis.
 */
export const LINES = ['GK', 'DEF', 'MID', 'ATT'] as const

export type Line = (typeof LINES)[number]

export const LINE_BY_POSITION = {
  GK: 'GK',
  RB: 'DEF',
  CB: 'DEF',
  LB: 'DEF',
  DM: 'MID',
  CM: 'MID',
  AM: 'MID',
  RM: 'ATT',
  LM: 'ATT',
  RW: 'ATT',
  LW: 'ATT',
  ST: 'ATT',
} as const satisfies Record<Position, Line>
