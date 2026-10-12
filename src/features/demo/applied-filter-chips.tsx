import { chipVariants } from '#/components/chip-variants'

import { type FilterValues } from './filter-values'
import { fillTemplate } from './format'
import { CloseIcon } from './icons/close-icon'
import { AGE_RANGE, type PlayersSearch } from './players-search'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch, useUpdatePlayersSearch } from './use-players-search'

interface AppliedFilter {
  readonly key: string
  readonly label: string
  readonly without: PlayersSearch
}

function withoutFilter(search: PlayersSearch, cleared: Partial<FilterValues>): PlayersSearch {
  return { ...search, ...cleared, page: undefined }
}

/**
 * Each applied filter as its own chip; its × removes only that filter.
 */
export function AppliedFilterChips() {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const updateSearch = useUpdatePlayersSearch()
  const copy = strings.filters

  const applied: AppliedFilter[] = [
    ...(search.ageMin === undefined && search.ageMax === undefined
      ? []
      : [
          {
            key: 'age',
            label: fillTemplate(copy.ageRange, {
              min: search.ageMin ?? AGE_RANGE.min,
              max: search.ageMax ?? AGE_RANGE.max,
            }),
            without: withoutFilter(search, { ageMin: undefined, ageMax: undefined }),
          },
        ]),
    ...(search.league ?? []).map((league) => ({
      key: `league-${league}`,
      label: league,
      without: withoutFilter(search, {
        league: search.league?.filter((other) => other !== league),
      }),
    })),
    ...(search.scoreMin === undefined
      ? []
      : [
          {
            key: 'score',
            label: fillTemplate(copy.appliedScore, { score: search.scoreMin }),
            without: withoutFilter(search, { scoreMin: undefined }),
          },
        ]),
    ...(search.contract ?? []).map((status) => ({
      key: `contract-${status}`,
      label: strings.contract[status],
      without: withoutFilter(search, {
        contract: search.contract?.filter((other) => other !== status),
      }),
    })),
  ]

  if (applied.length === 0) {
    return null
  }
  return (
    <ul aria-label={copy.appliedLabel} className="contents">
      {applied.map(({ key, label, without }) => (
        <li key={key} className="flex">
          <button
            type="button"
            aria-label={fillTemplate(copy.remove, { filter: label })}
            className={chipVariants({ isApplied: true, size: 'regular' })}
            onClick={() => {
              void updateSearch(normaliseEmptyLists(without))
            }}
          >
            {label}
            <CloseIcon className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  )
}

// Removing the last league or status leaves an empty list, which means "any".
function normaliseEmptyLists(search: PlayersSearch): PlayersSearch {
  return {
    ...search,
    league: search.league?.length === 0 ? undefined : search.league,
    contract: search.contract?.length === 0 ? undefined : search.contract,
  }
}
