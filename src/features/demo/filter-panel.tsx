import { useState } from 'react'

import { actionButtonVariants } from '#/components/action-button-variants'
import { chipVariants } from '#/components/chip-variants'
import { type Position } from '#/features/sample-listings/positions'
import { positionSummary, SAMPLE_LISTINGS } from '#/features/sample-listings/sample-listings'

import { AgeRangeControl } from './age-range-control'
import { ContractChips } from './contract-chips'
import { DEFAULT_FILTERS, filtersOf, type FilterValues, withoutDefaults } from './filter-values'
import { fillTemplate, formatCount } from './format'
import { SlidersIcon } from './icons/sliders-icon'
import { LeagueChecklist } from './league-checklist'
import { countAppliedFilters } from './players-search'
import { PopoverPanel } from './popover-panel'
import { ScoreControl } from './score-control'
import { searchListings } from './search-listings'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch, useUpdatePlayersSearch } from './use-players-search'
import { usePopover } from './use-popover'

interface FilterPanelProps {
  readonly position: Position
}

/**
 * The Filters button and its panel. The panel edits a draft; its count ticks as the controls
 * move, always within the position, and "Show" applies it.
 */
export function FilterPanel({ position }: FilterPanelProps) {
  const { language, strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const updateSearch = useUpdatePlayersSearch()
  const [draft, setDraft] = useState<FilterValues>(() => filtersOf(search))
  const popover = usePopover({
    onOpen: () => {
      setDraft(filtersOf(search))
    },
  })
  const copy = strings.filters
  const appliedCount = countAppliedFilters(search)
  const draftTotal = searchListings(SAMPLE_LISTINGS, { ...withoutDefaults(draft), position }).total

  function change(values: Partial<FilterValues>) {
    setDraft((previous) => ({ ...previous, ...values }))
  }

  return (
    <>
      <button
        type="button"
        {...popover.triggerProps}
        className={chipVariants({ isApplied: false, size: 'regular' })}
      >
        <SlidersIcon className="size-4" />
        {appliedCount === 0
          ? copy.button
          : fillTemplate(copy.buttonWithCount, { count: appliedCount })}
      </button>
      <PopoverPanel
        {...popover.panelProps}
        title={copy.title}
        closeLabel={copy.close}
        className="lg:w-90"
        onClose={popover.close}
      >
        <div className="flex flex-col divide-y divide-line">
          <div className="py-4">
            <AgeRangeControl
              min={draft.ageMin}
              max={draft.ageMax}
              onChange={(ageMin, ageMax) => {
                change({ ageMin, ageMax })
              }}
            />
          </div>
          <div className="py-4">
            <LeagueChecklist
              value={draft.league}
              onChange={(league) => {
                change({ league })
              }}
            />
          </div>
          <div className="py-4">
            <ScoreControl
              value={draft.scoreMin}
              onChange={(scoreMin) => {
                change({ scoreMin })
              }}
            />
          </div>
          <div className="py-4">
            <ContractChips
              value={draft.contract}
              onChange={(contract) => {
                change({ contract })
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              className={actionButtonVariants({ tone: 'primary', size: 'regular' })}
              onClick={() => {
                popover.close()
                void updateSearch({ position, sort: search.sort, ...withoutDefaults(draft) })
              }}
            >
              {formatCount(language, strings.counts.showPlayers, draftTotal)}
            </button>
            <p className="text-[13px] leading-[1.3] text-muted">
              {fillTemplate(copy.ofPosition, {
                count: positionSummary(position).count,
                listNoun: strings.positions[position].listNoun,
                short: position,
              })}
            </p>
            <button
              type="button"
              className="ml-auto flex min-h-11 items-center text-[13px] font-medium text-signal underline-offset-4 hover:underline"
              onClick={() => {
                setDraft(DEFAULT_FILTERS)
              }}
            >
              {copy.reset}
            </button>
          </div>
        </div>
      </PopoverPanel>
    </>
  )
}
