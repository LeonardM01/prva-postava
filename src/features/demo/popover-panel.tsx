import { type ReactNode, type RefObject, useId } from 'react'

import { cn } from '#/lib/utils'

import { CloseIcon } from './icons/close-icon'

interface PopoverPanelProps {
  readonly children: ReactNode
  readonly className?: string
  readonly closeLabel: string
  // Pinned under the scrolling body, so its action stays in view on short screens.
  readonly footer?: ReactNode
  // Beside the title, before the close button.
  readonly headerAction?: ReactNode
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
 * phones. Never taller than the space it has; the body scrolls between the head and the foot.
 * Spread `usePopover().panelProps` into it.
 */
export function PopoverPanel({
  children,
  className,
  closeLabel,
  footer,
  headerAction,
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
        'm-0 flex-col border border-line bg-card text-ink shadow-[0_12px_32px_-8px] shadow-ink/16 [&:popover-open]:flex',
        'max-lg:inset-x-0 max-lg:top-auto max-lg:bottom-0 max-lg:max-h-[85dvh] max-lg:w-full max-lg:max-w-none max-lg:rounded-t-2xl max-lg:backdrop:bg-ink/30',
        'lg:inset-0 lg:mt-2 lg:max-h-[calc(100%-1rem)] lg:rounded-xl lg:[position-area:bottom_span-right] lg:[position-try-fallbacks:flip-block,flip-inline]',
        className,
      )}
    >
      <div className="mx-5 flex shrink-0 items-center gap-3 border-b border-line pt-5 pb-3">
        <h2 id={titleId} className="flex-1 text-[15px] leading-[1.3] font-semibold text-ink">
          {title}
        </h2>
        {note === undefined ? null : <p className="text-[13px] leading-[1.3] text-muted">{note}</p>}
        {headerAction}
        <button
          type="button"
          aria-label={closeLabel}
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:text-ink lg:hidden"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
      {footer === undefined ? null : (
        <div className="mx-5 shrink-0 border-t border-line py-4">{footer}</div>
      )}
    </div>
  )
}
