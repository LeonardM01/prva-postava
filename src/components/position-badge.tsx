import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'flex shrink-0 items-center justify-center text-[11px] leading-[normal] font-semibold',
  {
    variants: {
      size: {
        // The tactics board's chips, desktop and phone.
        board: 'size-7.5 rounded-[7px]',
        boardCompact: 'size-6.5 rounded-[6px]',
        // Ranked rows: the landing's search table and the demo's list.
        row: 'h-6 w-7 rounded-[6px] board:h-6.5 board:w-7.5',
      },
      isPromoted: {
        true: 'bg-amber text-ink',
        false: 'bg-signal text-card',
      },
    },
    defaultVariants: { isPromoted: false },
  },
)

interface PositionBadgeProps {
  // Only the board marks a promoted player's badge; rows carry the Promoted tag instead.
  readonly isPromoted?: boolean
  readonly label: string
  readonly size: 'board' | 'boardCompact' | 'row'
}

export function PositionBadge({ isPromoted, label, size }: PositionBadgeProps) {
  return <span className={badgeVariants({ isPromoted, size })}>{label}</span>
}
