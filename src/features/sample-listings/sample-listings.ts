import { type League, LEAGUES } from './leagues'
import { type GeneratedListing, generatedListingsSchema } from './listing-schema'
import { type Line, LINE_BY_POSITION, type Position, POSITIONS } from './positions'
import GENERATED_LISTINGS from './sample-listings.json'
import { placeholderScore } from './score'

/**
 * A sample listing with everything the list, the profile and the player seat derive from it,
 * computed once here so the three never disagree.
 */
export interface Listing extends GeneratedListing {
  readonly line: Line
  // 1 for the highest score in the position; tied scores share a rank.
  readonly rank: number
  readonly score: number
}

export interface PositionSummary {
  readonly count: number
  readonly highestScore: number
  readonly line: Line
  readonly lowestScore: number
  readonly position: Position
}

const SCORED = generatedListingsSchema.parse(GENERATED_LISTINGS).map((listing) => {
  const line = LINE_BY_POSITION[listing.position]
  return { ...listing, line, score: placeholderScore(line, listing.thisSeason) }
})

/**
 * Every sample listing: invented players at invented clubs in real league names.
 */
export const SAMPLE_LISTINGS: readonly Listing[] = SCORED.map((listing) => ({
  ...listing,
  rank:
    1 +
    SCORED.filter((other) => other.position === listing.position && other.score > listing.score)
      .length,
}))

function summarise(position: Position): PositionSummary | undefined {
  const scores = SAMPLE_LISTINGS.filter((listing) => listing.position === position).map(
    (listing) => listing.score,
  )
  if (scores.length === 0) {
    return undefined
  }
  return {
    position,
    line: LINE_BY_POSITION[position],
    count: scores.length,
    lowestScore: Math.min(...scores),
    highestScore: Math.max(...scores),
  }
}

/**
 * The twelve positions in chooser order, each with how many listings it holds and the range of
 * their scores. Every position has at least one listing.
 */
export const POSITION_SUMMARIES: readonly PositionSummary[] = POSITIONS.map((position) => {
  const summary = summarise(position)
  if (summary === undefined) {
    throw new Error(`The sample data has no listing under ${position}`)
  }
  return summary
})

export function positionSummary(position: Position): PositionSummary {
  const summary = POSITION_SUMMARIES.find((candidate) => candidate.position === position)
  if (summary === undefined) {
    throw new Error(`No summary for ${position}`)
  }
  return summary
}

/**
 * The leagues the sample data uses, top tier first, so a league filter never offers a league
 * that returns nothing.
 */
export const LEAGUES_PRESENT: readonly League[] = LEAGUES.filter((league) =>
  SAMPLE_LISTINGS.some((listing) => listing.league === league),
)

export function findListing(id: string): Listing | undefined {
  return SAMPLE_LISTINGS.find((listing) => listing.id === id)
}

/**
 * For listings the code names on purpose (the landing's players, the player seat), where a
 * missing one is a bug in the data rather than a bad address.
 */
export function getListing(id: string): Listing {
  const listing = findListing(id)
  if (listing === undefined) {
    throw new Error(`No sample listing with id "${id}"`)
  }
  return listing
}
