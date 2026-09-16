import { type CSSProperties } from 'react'

import { cn } from '#/lib/utils'

import { BOARD_LAYOUT_VISIBILITY, BOARD_SIZE, type BoardLayout } from './board-layout'
import { CompactPlayerChip } from './compact-player-chip'
import { PlayerChip } from './player-chip'
import { PromotedTag } from './promoted-tag'
import { LINE_BY_POSITION, type SamplePlayer } from './sample-players'
import { useLandingLanguage } from './use-landing-language'

function toSlotStyle(player: SamplePlayer): CSSProperties {
  const percentOf = (layout: BoardLayout, axis: 'x' | 'y') => {
    const size = axis === 'x' ? BOARD_SIZE[layout].width : BOARD_SIZE[layout].height
    return `${(player.slot[layout][axis] / size) * 100}%`
  }
  return {
    '--compact-x': percentOf('compact', 'x'),
    '--compact-y': percentOf('compact', 'y'),
    '--full-x': percentOf('full', 'x'),
    '--full-y': percentOf('full', 'y'),
  } as CSSProperties
}

interface PlayerSlotProps {
  readonly player: SamplePlayer
}

/**
 * One player's place on the board, centred on its Figma point. The slot is data, so the
 * percentages arrive as custom properties; which chip shows is decided by the breakpoint.
 */
export function PlayerSlot({ player }: PlayerSlotProps) {
  const { strings } = useLandingLanguage()

  return (
    <div
      data-line={LINE_BY_POSITION[player.position]}
      style={toSlotStyle(player)}
      className="absolute top-(--compact-y) left-(--compact-x) -translate-x-1/2 board:top-(--full-y) board:left-(--full-x)"
    >
      <div className={BOARD_LAYOUT_VISIBILITY.compact}>
        <CompactPlayerChip player={player} />
      </div>
      <div className={cn('relative', BOARD_LAYOUT_VISIBILITY.full)}>
        <PlayerChip player={player} />
        {player.isPromoted ? (
          <span className="absolute -top-2.75 right-px">
            <PromotedTag
              label={`${strings.board.promotedIn} ${strings.positions[player.position].short}`}
            />
          </span>
        ) : null}
      </div>
    </div>
  )
}
