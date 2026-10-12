import { type Season } from './listing-schema'
import { type Line } from './positions'

// A season of 30 rounds at 90 minutes: the minutes that count as fully available.
const FULL_SEASON_MINUTES = 2700

/**
 * The demo's placeholder score, 0 to 100, from this season's numbers. Not the product's
 * algorithm, which is undecided: copy must never describe it as one. Recorded in the design
 * brief so the designer, the data and the copy agree.
 */
export function placeholderScore(line: Line, season: Season): number {
  const nineties = season.minutes / 90
  const availability = Math.min(season.minutes / FULL_SEASON_MINUTES, 1)
  const contributionsPerNinety = (season.goals + season.assists) / Math.max(nineties, 1)
  const output = outputFor(line, season, contributionsPerNinety)
  return Math.max(0, Math.min(100, Math.round(100 * (0.4 * availability + 0.6 * output))))
}

function outputFor(line: Line, season: Season, contributionsPerNinety: number): number {
  switch (line) {
    case 'ATT': {
      return Math.min(contributionsPerNinety / 0.9, 1)
    }
    case 'MID': {
      return Math.min(contributionsPerNinety / 0.6, 1)
    }
    case 'DEF': {
      return (
        0.6 * Math.min(season.matches / 30, 1) + 0.4 * Math.min(contributionsPerNinety / 0.25, 1)
      )
    }
    case 'GK': {
      const cleanSheetRate = (season.cleanSheets ?? 0) / Math.max(season.matches, 1)
      return Math.min(cleanSheetRate / 0.45, 1)
    }
  }
}
