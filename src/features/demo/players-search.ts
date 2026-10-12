import { z } from 'zod'

import { type League } from '#/features/sample-listings/leagues'
import { CONTRACT_STATUSES, type ContractStatus } from '#/features/sample-listings/listing-schema'
import { type Position, POSITIONS } from '#/features/sample-listings/positions'
import { LEAGUES_PRESENT } from '#/features/sample-listings/sample-listings'

export const AGE_RANGE = { min: 18, max: 34 } as const

export const SCORE_STEP = 5

export const SORT_ORDERS = ['score', 'age', 'matches'] as const

export type SortOrder = (typeof SORT_ORDERS)[number]

/**
 * A search as the address carries it. Every field is optional and absent means its default, so
 * a default search keeps a short address: no position is the entry state, no sort is score,
 * no page is the first.
 */
export interface PlayersSearch {
  readonly ageMax?: number
  readonly ageMin?: number
  readonly contract?: readonly ContractStatus[]
  readonly league?: readonly League[]
  readonly page?: number
  readonly position?: Position
  readonly scoreMin?: number
  readonly sort?: Exclude<SortOrder, 'score'>
}

const positionSchema = z.enum(POSITIONS).optional().catch(undefined)

const ageSchema = z.int().min(AGE_RANGE.min).max(AGE_RANGE.max).optional().catch(undefined)

const scoreSchema = z.int().min(0).max(100).multipleOf(SCORE_STEP).optional().catch(undefined)

const sortSchema = z.enum(['age', 'matches']).optional().catch(undefined)

const pageSchema = z.int().min(2).optional().catch(undefined)

// Unknown entries are dropped one by one, so one bad league keeps the good ones.
function parseList<T extends string>(value: unknown, allowed: readonly T[]): T[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }
  const entries = allowed.filter((candidate) => value.includes(candidate))
  return entries.length === 0 ? undefined : entries
}

function parseAgeRange(search: Readonly<Record<string, unknown>>) {
  const ageMin = ageSchema.parse(search.ageMin)
  const ageMax = ageSchema.parse(search.ageMax)
  if (ageMin !== undefined && ageMax !== undefined && ageMin > ageMax) {
    return { ageMin: undefined, ageMax: undefined }
  }
  return {
    ageMin: ageMin === AGE_RANGE.min ? undefined : ageMin,
    ageMax: ageMax === AGE_RANGE.max ? undefined : ageMax,
  }
}

/**
 * Reads a search from the address. Any missing or invalid value falls back to its default
 * rather than failing, so a mistyped shared link still opens. Every key is returned, undefined
 * when it is the default: the router lays this over the raw params, so a key left out would
 * keep its unvalidated value.
 */
export function parsePlayersSearch(search: Readonly<Record<string, unknown>>): PlayersSearch {
  const scoreMin = scoreSchema.parse(search.scoreMin)
  return {
    position: positionSchema.parse(search.position),
    ...parseAgeRange(search),
    league: parseList(search.league, LEAGUES_PRESENT),
    scoreMin: scoreMin === 0 ? undefined : scoreMin,
    contract: parseList(search.contract, CONTRACT_STATUSES),
    sort: sortSchema.parse(search.sort),
    page: pageSchema.parse(search.page),
  }
}

/**
 * How many filters differ from their defaults. Position is the list itself, not a filter.
 */
export function countAppliedFilters(search: PlayersSearch): number {
  return [
    search.ageMin !== undefined || search.ageMax !== undefined,
    search.league !== undefined,
    search.scoreMin !== undefined,
    search.contract !== undefined,
  ].filter(Boolean).length
}
