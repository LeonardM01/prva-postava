import { useNavigate } from '@tanstack/react-router'

import { type Position } from '#/features/sample-listings/positions'

import { formatCount } from './format'
import { ChevronDownIcon } from './icons/chevron-down-icon'
import { PopoverPanel } from './popover-panel'
import { PositionChooser } from './position-chooser'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch } from './use-players-search'
import { usePopover } from './use-popover'

interface PositionTitleProps {
  readonly position: Position
  readonly total: number
}

/**
 * The list title is the position control: one action changes the list from anywhere in it.
 * Filters and sort carry over; the page starts again.
 */
export function PositionTitle({ position, total }: PositionTitleProps) {
  const { language, strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const navigate = useNavigate()
  const popover = usePopover()

  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <h1 className="font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
        <button
          type="button"
          {...popover.triggerProps}
          aria-haspopup="dialog"
          className="-ml-1 flex min-h-11 items-center gap-2 rounded-md px-1 hover:text-signal-deep"
        >
          {strings.positions[position].plural}
          <ChevronDownIcon className="size-5 shrink-0" />
        </button>
      </h1>
      <p className="text-[15px] leading-[1.3] text-muted">
        {formatCount(language, strings.counts.players, total)}
      </p>
      <PopoverPanel
        {...popover.panelProps}
        title={strings.chooser.title}
        note={strings.chooser.note}
        closeLabel={strings.chooser.close}
        className="lg:w-120"
        onClose={popover.close}
      >
        <PositionChooser
          layout="stacked"
          current={position}
          onChoose={(chosen) => {
            popover.close()
            void navigate({
              to: '/app',
              search: { ...search, position: chosen, page: undefined },
            })
          }}
        />
      </PopoverPanel>
    </div>
  )
}
