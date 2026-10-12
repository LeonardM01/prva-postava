import { cva } from 'class-variance-authority'

/**
 * The shell's two-option switches (seat and language): a tint track with the current option
 * on a white pill. `touch` is the 44 px size for phones.
 */
export const switchTrackClass = 'flex w-fit rounded-full bg-tint p-0.5'

export const switchOptionVariants = cva(
  'flex items-center justify-center rounded-full px-2.5 text-[13px] leading-[1.3] transition-colors duration-150',
  {
    variants: {
      isCurrent: {
        true: 'bg-card font-semibold text-ink shadow-[0_1px_2px] shadow-ink/12',
        false: 'font-medium text-muted hover:text-ink',
      },
      size: {
        compact: 'py-1.5',
        touch: 'min-h-11 min-w-14 px-4',
      },
    },
  },
)
