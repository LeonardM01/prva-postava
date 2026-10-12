import { type ReactNode } from 'react'

import { cn } from '#/lib/utils'

import { ChevronDownIcon } from './icons/chevron-down-icon'
import { ChevronRightIcon } from './icons/chevron-right-icon'
import { PopoverPanel } from './popover-panel'
import { usePopover } from './use-popover'

interface ComposerFieldProps {
  readonly children: (close: () => void) => ReactNode
  readonly closeLabel: string
  readonly isPlaceholder?: boolean
  readonly label: string
  readonly note?: string
  readonly value: string
}

/**
 * One field of the search composer: a labelled button showing its value, opening a labelled
 * panel with the control.
 */
export function ComposerField({
  children,
  closeLabel,
  isPlaceholder = false,
  label,
  note,
  value,
}: ComposerFieldProps) {
  const popover = usePopover()

  return (
    <div className="flex min-w-0 lg:flex-1">
      <button
        type="button"
        {...popover.triggerProps}
        className="flex min-h-15.5 w-full min-w-0 items-center gap-3 rounded-lg px-4 py-1.5 text-left transition-colors duration-150 hover:bg-mist"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.3]">
          <span className="text-xs text-muted">{label}</span>
          <span
            className={cn(
              'truncate text-[15px]',
              isPlaceholder ? 'font-semibold text-signal' : 'font-medium text-ink',
            )}
          >
            {value}
          </span>
        </span>
        <ChevronDownIcon className="size-4.5 shrink-0 text-ink max-lg:hidden" />
        <ChevronRightIcon className="size-4.5 shrink-0 text-ink lg:hidden" />
      </button>
      <PopoverPanel
        {...popover.panelProps}
        title={label}
        note={note}
        closeLabel={closeLabel}
        className="lg:w-100"
        onClose={popover.close}
      >
        <div className="pt-4">{children(popover.close)}</div>
      </PopoverPanel>
    </div>
  )
}
