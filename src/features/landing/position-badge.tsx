import { cva } from 'class-variance-authority'

import { type BoardLayout } from './board-layout'

const badgeVariants = cva(
  'flex shrink-0 items-center justify-center text-[11px] leading-[normal] font-semibold',
  {
    variants: {
      layout: {
        full: 'size-7.5 rounded-[7px]',
        compact: 'size-6.5 rounded-[6px]',
      },
      isPromoted: {
        true: 'bg-amber text-ink',
        false: 'bg-signal text-card',
      },
    },
  },
)

interface PositionBadgeProps {
  readonly isPromoted: boolean
  readonly label: string
  readonly layout: BoardLayout
}

export function PositionBadge({ isPromoted, label, layout }: PositionBadgeProps) {
  return <span className={badgeVariants({ isPromoted, layout })}>{label}</span>
}
