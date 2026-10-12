import { chipVariants } from '#/components/chip-variants'
import { cn } from '#/lib/utils'

import { fillTemplate } from './format'
import { ArrowDownIcon } from './icons/arrow-down-icon'
import { CheckIcon } from './icons/check-icon'
import { SORT_ORDERS } from './players-search'
import { PopoverPanel } from './popover-panel'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch, useUpdatePlayersSearch } from './use-players-search'
import { usePopover } from './use-popover'

/**
 * The sort chip and its three orders. Promoted rows stay on top whichever is chosen.
 */
export function SortMenu() {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const updateSearch = useUpdatePlayersSearch()
  const popover = usePopover()
  const current = search.sort ?? 'score'
  const copy = strings.sort

  return (
    <>
      <button
        type="button"
        {...popover.triggerProps}
        className={chipVariants({ isApplied: current !== 'score', size: 'regular' })}
      >
        {fillTemplate(copy.label, { order: copy.short[current] })}
        <ArrowDownIcon className="size-3.5" />
      </button>
      <PopoverPanel
        {...popover.panelProps}
        title={copy.menuLabel}
        closeLabel={strings.filters.close}
        className="lg:w-60 lg:p-2"
        onClose={popover.close}
      >
        <ul className="flex flex-col pt-2">
          {SORT_ORDERS.map((order) => {
            const isCurrent = order === current
            return (
              <li key={order}>
                <button
                  type="button"
                  aria-pressed={isCurrent}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm',
                    isCurrent ? 'bg-tint font-semibold text-ink' : 'text-ink hover:bg-mist',
                  )}
                  onClick={() => {
                    popover.close()
                    void updateSearch({
                      ...search,
                      sort: order === 'score' ? undefined : order,
                      page: undefined,
                    })
                  }}
                >
                  {copy.options[order]}
                  {isCurrent && <CheckIcon className="size-4 text-signal" />}
                </button>
              </li>
            )
          })}
        </ul>
      </PopoverPanel>
    </>
  )
}
