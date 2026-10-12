import { useId, useState } from 'react'

import { type League } from '#/features/sample-listings/leagues'
import { LEAGUES_PRESENT } from '#/features/sample-listings/sample-listings'

import { toggleEntry } from './filter-values'
import { formatCount } from './format'
import { CheckIcon } from './icons/check-icon'
import { useDemoLanguage } from './use-demo-language'

// The top seven tiers show at once; the rest wait behind a reveal.
const FIRST_SHOWN = 7

interface LeagueChecklistProps {
  readonly onChange: (league: League[] | undefined) => void
  readonly value: readonly League[] | undefined
}

/**
 * Only the leagues the sample data uses, so no option returns nothing. None checked means
 * every league.
 */
export function LeagueChecklist({ onChange, value }: LeagueChecklistProps) {
  const { language, strings } = useDemoLanguage()
  const copy = strings.filters
  const [isExpanded, setIsExpanded] = useState(false)
  const listId = useId()
  const hasHiddenChoice = (value ?? []).some(
    (league) => LEAGUES_PRESENT.indexOf(league) >= FIRST_SHOWN,
  )
  const isShowingAll = isExpanded || hasHiddenChoice
  const shown = isShowingAll ? LEAGUES_PRESENT : LEAGUES_PRESENT.slice(0, FIRST_SHOWN)
  const hiddenCount = LEAGUES_PRESENT.length - FIRST_SHOWN

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="pb-1 text-sm leading-[1.3] font-semibold">{copy.league}</legend>
      <ul id={listId} className="flex flex-col">
        {shown.map((league) => {
          const isChecked = value?.includes(league) ?? false
          return (
            <li key={league}>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm leading-[1.3] lg:min-h-7.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="peer sr-only"
                  onChange={() => {
                    onChange(toggleEntry(value, league))
                  }}
                />
                <span
                  aria-hidden="true"
                  className="flex size-4.5 shrink-0 items-center justify-center rounded-[4px] border border-line bg-card text-card peer-checked:border-signal peer-checked:bg-signal peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal"
                >
                  {isChecked && <CheckIcon className="size-4" />}
                </span>
                {league}
              </label>
            </li>
          )
        })}
      </ul>
      {hiddenCount > 0 && !hasHiddenChoice && (
        <button
          type="button"
          aria-expanded={isShowingAll}
          aria-controls={listId}
          className="flex min-h-11 w-fit items-center text-[13px] leading-[1.3] font-medium text-signal underline-offset-4 hover:underline lg:min-h-7"
          onClick={() => {
            setIsExpanded((wasExpanded) => !wasExpanded)
          }}
        >
          {isShowingAll ? copy.fewerLeagues : formatCount(language, copy.moreLeagues, hiddenCount)}
        </button>
      )}
    </fieldset>
  )
}
