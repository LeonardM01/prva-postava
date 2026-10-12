import { type Listing } from '#/features/sample-listings/sample-listings'

import { fillTemplate } from './format'
import { type DemoStrings } from './strings'

export function fullName(listing: Listing): string {
  return `${listing.firstName} ${listing.lastName}`
}

interface SeasonLine {
  // Spoken in full, for assistive technology.
  readonly spoken: string
  // "24 m · 9 g · 6 a", or clean sheets for goalkeepers.
  readonly visible: string
}

/**
 * This season's numbers as a row shows them under the score.
 */
export function seasonLine(listing: Listing, strings: DemoStrings): SeasonLine {
  const { assists, cleanSheets, goals, matches } = listing.thisSeason
  const copy = strings.list
  if (listing.position === 'GK') {
    const values = { matches, cleanSheets: cleanSheets ?? 0 }
    return {
      visible: fillTemplate(copy.seasonLineKeeper, values),
      spoken: fillTemplate(copy.seasonLineKeeperSpoken, values),
    }
  }
  const values = { matches, goals, assists }
  return {
    visible: fillTemplate(copy.seasonLine, values),
    spoken: fillTemplate(copy.seasonLineSpoken, values),
  }
}
