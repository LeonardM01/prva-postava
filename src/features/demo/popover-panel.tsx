import { type ReactNode, type RefObject, useId } from 'react'

import { cn } from '#/lib/utils'

import { CloseIcon } from './icons/close-icon'

interface PopoverPanelProps {
  readonly children: ReactNode
  readonly className?: string
  readonly closeLabel: string
  readonly id: string
  readonly note?: ReactNode
  readonly onClose: () => void
  readonly popover: 'auto'
  readonly ref: RefObject<HTMLDivElement | null>
  readonly style: object
  readonly title: string
}

/**
 * A labelled panel in the top layer: under its trigger on wide screens, a bottom sheet on
 * phones. Spread `usePopover().panelProps` into it.
 */
export function PopoverPanel({
  children,
  className,
  closeLabel,
  note,
  onClose,
  title,
  ...panelProps
}: PopoverPanelProps) {
  const titleId = useId()

  return (
    <div
      {...panelProps}
      role="dialog"
      aria-labelledby={titleId}
      className={cn(
        'm-0 overflow-y-auto border border-line bg-card p-5 text-ink shadow-[0_12px_32px_-8px] shadow-ink/16',
        'max-lg:inset-x-0 max-lg:top-auto max-lg:bottom-0 max-lg:max-h-[85dvh] max-lg:w-full max-lg:max-w-none max-lg:rounded-t-2xl max-lg:backdrop:bg-ink/30',
        'lg:inset-auto lg:top-[anchor(bottom)] lg:left-[anchor(left)] lg:mt-2 lg:max-h-[calc(100dvh-8rem)] lg:rounded-xl lg:[position-try-fallbacks:flip-block]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <h2 id={titleId} className="text-[15px] leading-[1.3] font-semibold text-ink">
          {title}
        </h2>
        {note === undefined ? null : (
          <p className="ml-auto text-[13px] leading-[1.3] text-muted">{note}</p>
        )}
        <button
          type="button"
          aria-label={closeLabel}
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:text-ink lg:hidden"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      {children}
    </div>
  )
}
