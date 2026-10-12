import { cva } from 'class-variance-authority'

/**
 * The primary and secondary buttons of the Turf world, for buttons and for links that look
 * like them. Pressed keeps the hover fill and sinks under the pressed inset. Put an
 * `ArrowRightIcon` in a `group-hover:translate-x-0.5` span for the arrow variant.
 */
export const actionButtonVariants = cva(
  'group inline-flex items-center justify-center gap-2.5 rounded-[12px] font-semibold transition-colors duration-150 active:inset-shadow-pressed',
  {
    variants: {
      tone: {
        primary: 'bg-signal text-card hover:bg-signal-deep active:bg-signal-deep',
        secondary: 'border border-line bg-card text-ink hover:border-signal active:bg-tint',
      },
      size: {
        // The landing hero's call to action.
        hero: 'h-13 px-6 text-[17px]',
        // Phones get 44 px; wider screens the designed 40.
        regular: 'min-h-11 px-4.5 text-sm leading-[1.29] lg:min-h-10',
        small: 'min-h-11 px-3.5 text-[13px] leading-[1.29] lg:min-h-8.5',
      },
    },
  },
)
