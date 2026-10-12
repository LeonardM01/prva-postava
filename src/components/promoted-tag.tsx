import { StarIcon } from './star-icon'

interface PromotedTagProps {
  readonly label: string
  /**
   * `pill` floats over a board chip with a star; `label` sits after a name in a ranked row.
   */
  readonly shape: 'label' | 'pill'
}

/**
 * Marks a paid top spot. Amber is reserved for this, and the word is always there, so the mark
 * never relies on colour alone.
 */
export function PromotedTag({ label, shape }: PromotedTagProps) {
  switch (shape) {
    case 'pill': {
      return (
        <span className="flex items-center gap-1 rounded-full bg-amber px-2 py-0.75 text-[11px] leading-[normal] font-semibold tracking-[0.02em] whitespace-nowrap text-ink">
          <StarIcon className="size-2.25" />
          {label}
        </span>
      )
    }
    case 'label': {
      return (
        <span className="shrink-0 rounded-[4px] bg-amber px-1.25 py-0.5 text-[10px] leading-[normal] font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase board:px-1.5">
          {label}
        </span>
      )
    }
  }
}
