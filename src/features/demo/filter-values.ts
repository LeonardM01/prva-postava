import { type League } from '#/features/sample-listings/leagues'
import { type ContractStatus } from '#/features/sample-listings/listing-schema'

import { AGE_RANGE, type PlayersSearch } from './players-search'

/**
 * The four filters that narrow a position's list. Absent means the default (everyone), the
 * same convention the address uses.
 */
export interface FilterValues {
  readonly ageMax?: number
  readonly ageMin?: number
  readonly contract?: readonly ContractStatus[]
  readonly league?: readonly League[]
  readonly scoreMin?: number
}

export const DEFAULT_FILTERS: FilterValues = {}

export function filtersOf(search: PlayersSearch): FilterValues {
  const { ageMax, ageMin, contract, league, scoreMin } = search
  return { ageMax, ageMin, contract, league, scoreMin }
}

/**
 * Keeps only the values that differ from their defaults, so they never reach the address.
 */
export function withoutDefaults(filters: FilterValues): FilterValues {
  const { ageMax, ageMin, contract, league, scoreMin } = filters
  return {
    ...(ageMin !== undefined && ageMin !== AGE_RANGE.min && { ageMin }),
    ...(ageMax !== undefined && ageMax !== AGE_RANGE.max && { ageMax }),
    ...(league !== undefined && league.length > 0 && { league }),
    ...(scoreMin !== undefined && scoreMin > 0 && { scoreMin }),
    ...(contract !== undefined && contract.length > 0 && { contract }),
  }
}

/**
 * Adds or removes one entry of a multi-value filter; an empty list is the default.
 */
export function toggleEntry<T extends string>(
  values: readonly T[] | undefined,
  entry: T,
): T[] | undefined {
  const current = values ?? []
  const next = current.includes(entry)
    ? current.filter((value) => value !== entry)
    : [...current, entry]
  return next.length === 0 ? undefined : next
}
