import { cva } from 'class-variance-authority'

/**
 * The white chip, or the amber-washed one for the promoted slot. The amber outline is an
 * inset ring so the promoted chip keeps the same size as its neighbours.
 */
export const playerChipVariants = cva(
  'flex items-center whitespace-nowrap shadow-chip transition-[translate,box-shadow] duration-150 ease-settle hover:shadow-chip-lifted motion-safe:hover:-translate-y-0.5',
  {
    variants: {
      layout: {
        full: 'gap-2.5 rounded-[10px] py-2 pr-3 pl-2',
        // Phones narrower than the 390 px design squeeze the board, so the chips tighten to keep clear.
        compact:
          'gap-2 rounded-[9px] py-1.5 pr-2.5 pl-1.5 text-[13px] max-[24rem]:gap-1.5 max-[24rem]:pr-2 max-[24rem]:text-xs',
      },
      isPromoted: {
        true: 'bg-amber-wash inset-ring-[1.5px] inset-ring-amber',
        false: 'bg-card',
      },
    },
  },
)
