import { useId } from 'react'

import { actionButtonVariants } from '#/components/action-button-variants'
import { type Position } from '#/features/sample-listings/positions'
import { positionSummary } from '#/features/sample-listings/sample-listings'

import { fillTemplate, formatCount } from './format'
import { type PlayersSearch } from './players-search'
import { type DemoStrings } from './strings'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch, useUpdatePlayersSearch } from './use-players-search'

interface Suggestion {
  readonly label: string
  readonly search: PlayersSearch
}

// The filter most likely to have emptied the list: score first, as it cuts hardest.
function suggestDrop(search: PlayersSearch, copy: DemoStrings['empty']): Suggestion | undefined {
  if (search.scoreMin !== undefined) {
    return { label: copy.dropScore, search: { ...search, scoreMin: undefined } }
  }
  if (search.ageMin !== undefined || search.ageMax !== undefined) {
    return { label: copy.dropAge, search: { ...search, ageMin: undefined, ageMax: undefined } }
  }
  if (search.league !== undefined) {
    return { label: copy.dropLeague, search: { ...search, league: undefined } }
  }
  if (search.contract !== undefined) {
    return { label: copy.dropContract, search: { ...search, contract: undefined } }
  }
  return undefined
}

interface EmptyResultProps {
  readonly position: Position
}

/**
 * No rows: say what the position holds, so the next move is obvious, and offer it.
 */
export function EmptyResult({ position }: EmptyResultProps) {
  const { language, strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const updateSearch = useUpdatePlayersSearch()
  const titleId = useId()
  const copy = strings.empty
  const summary = positionSummary(position)
  const suggestion = suggestDrop(search, copy)
  const holds = fillTemplate(
    summary.lowestScore === summary.highestScore ? copy.holdsOne : copy.holds,
    {
      short: position,
      players: formatCount(language, strings.counts.players, summary.count),
      lowest: summary.lowestScore,
      highest: summary.highestScore,
    },
  )

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3 border-t border-line px-3 pt-9 pb-6"
    >
      <h2 id={titleId} className="text-[17px] leading-[1.3] font-semibold text-ink">
        {copy.title}
      </h2>
      <p className="text-[15px] leading-normal text-muted">{fillTemplate(copy.body, { holds })}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          className={actionButtonVariants({ tone: 'secondary', size: 'regular' })}
          onClick={() => {
            void updateSearch({ position, sort: search.sort })
          }}
        >
          {copy.reset}
        </button>
        {suggestion !== undefined && (
          <button
            type="button"
            className={actionButtonVariants({ tone: 'secondary', size: 'regular' })}
            onClick={() => {
              void updateSearch({ ...suggestion.search, page: undefined })
            }}
          >
            {suggestion.label}
          </button>
        )}
      </div>
    </section>
  )
}
