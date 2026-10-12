import { type Language } from '#/lib/language'

import { type FilterValues } from './filter-values'
import { fillTemplate, formatCount } from './format'
import { AGE_RANGE } from './players-search'
import { type DemoStrings } from './strings'

function summariseLeagues(
  language: Language,
  strings: DemoStrings,
  leagues: FilterValues['league'],
): string {
  const [first, ...others] = leagues ?? []
  if (first === undefined) {
    return strings.entry.anyLeague
  }
  return others.length === 0
    ? first
    : formatCount(language, strings.entry.leagueCount, others.length + 1)
}

/**
 * How each filter reads on a composer field: the default's own words, or the chosen value.
 */
export function summariseFilters(language: Language, strings: DemoStrings, filters: FilterValues) {
  const { entry } = strings
  const [onlyContract, ...otherContracts] = filters.contract ?? []
  return {
    age: fillTemplate(strings.filters.ageRange, {
      min: filters.ageMin ?? AGE_RANGE.min,
      max: filters.ageMax ?? AGE_RANGE.max,
    }),
    league: summariseLeagues(language, strings, filters.league),
    score:
      filters.scoreMin === undefined
        ? entry.anyScore
        : fillTemplate(entry.scoreValue, { score: filters.scoreMin }),
    contract:
      onlyContract === undefined
        ? entry.anyContract
        : [onlyContract, ...otherContracts].map((status) => strings.contract[status]).join(', '),
  }
}
