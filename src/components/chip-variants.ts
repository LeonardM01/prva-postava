import { cva } from 'class-variance-authority'

/**
 * Pill chips for filters, sorts and positions: white on a line stroke by default, tinted with a
 * signal stroke when applied. A chip may carry a drawn icon (never a text glyph), which the gap
 * spaces from the label.
 */
export const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors duration-150',
  {
    variants: {
      isApplied: {
        true: 'border-signal bg-tint text-signal',
        false: 'border-line bg-card text-ink hover:border-signal',
      },
      size: {
        // The landing's static search picture: tall on phones, compact from the board width.
        landing: 'p-3.5 text-[13px] leading-[normal] board:px-3 board:py-1.75',
        // Filter and sort chips: 44 px on phones, the designed 32 on wider screens.
        regular: 'min-h-11 px-3 text-[13px] leading-[1.29] lg:min-h-8',
        // The position chips under the composer and in the chooser.
        large: 'min-h-11 px-3.5 text-sm leading-[1.29] lg:min-h-10',
      },
    },
  },
)
