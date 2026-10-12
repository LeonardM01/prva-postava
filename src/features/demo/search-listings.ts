import { type Listing } from '#/features/sample-listings/sample-listings'

import { AGE_RANGE, type PlayersSearch, type SortOrder } from './players-search'

export const PAGE_SIZE = 20

export interface SearchResult {
  // The page shown, after clamping a page beyond the range to the last one.
  readonly page: number
  readonly pageCount: number
  readonly rows: readonly Listing[]
  // Every listing in the position that matches the filters, across pages.
  readonly total: number
}

function isMatch(listing: Listing, search: PlayersSearch): boolean {
  const ageMin = search.ageMin ?? AGE_RANGE.min
  const ageMax = search.ageMax ?? AGE_RANGE.max
  return (
    listing.position === search.position &&
    listing.age >= ageMin &&
    listing.age <= ageMax &&
    (search.league === undefined || search.league.includes(listing.league)) &&
    listing.score >= (search.scoreMin ?? 0) &&
    (search.contract === undefined || search.contract.includes(listing.contractStatus))
  )
}

function fullName(listing: Listing): string {
  return `${listing.firstName} ${listing.lastName}`
}

function compareBySort(sort: SortOrder, first: Listing, second: Listing): number {
  switch (sort) {
    case 'score': {
      return second.score - first.score
    }
    case 'age': {
      return first.age - second.age
    }
    case 'matches': {
      return second.thisSeason.matches - first.thisSeason.matches
    }
  }
}

/**
 * Promoted rows first in every order, so the paid spot never hides inside a sort; then the
 * chosen order; ties by score, then by name.
 */
export function compareListings(sort: SortOrder, first: Listing, second: Listing): number {
  return (
    Number(second.isPromoted) - Number(first.isPromoted) ||
    compareBySort(sort, first, second) ||
    second.score - first.score ||
    fullName(first).localeCompare(fullName(second), 'hr')
  )
}

/**
 * The filtered, ordered rows of one position, one page at a time. The filter panel calls it
 * with its draft filters for the live count.
 */
export function searchListings(listings: readonly Listing[], search: PlayersSearch): SearchResult {
  const sort = search.sort ?? 'score'
  const matching = listings
    .filter((listing) => isMatch(listing, search))
    .toSorted((first, second) => compareListings(sort, first, second))
  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE))
  const page = Math.min(search.page ?? 1, pageCount)
  return {
    page,
    pageCount,
    total: matching.length,
    rows: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  }
}
