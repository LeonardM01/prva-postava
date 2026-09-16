import { type CSSProperties } from 'react'

import { cn } from '#/lib/utils'

import { BOARD_LAYOUT_VISIBILITY, BOARD_SIZE, type BoardLayout } from './board-layout'
import { CompactPlayerChip } from './compact-player-chip'
import { PlayerChip } from './player-chip'
import { PromotedTag } from './promoted-tag'
import { LINE_BY_POSITION, type SamplePlayer } from './sample-players'
import { useLandingLanguage } from './use-landing-language'

type Axis = 'x' | 'y'

function sizeAlong(layout: BoardLayout, axis: Axis): number {
  return axis === 'x' ? BOARD_SIZE[layout].width : BOARD_SIZE[layout].height
}

function toSlotStyle(player: SamplePlayer, cascadeIndex: number): CSSProperties {
  const percentOf = (layout: BoardLayout, axis: Axis) =>
    `${(player.slot[layout][axis] / sizeAlong(layout, axis)) * 100}%`
  // The load travel starts on the centre spot. The board is a container, so 100cqw is its
  // width on both axes and the distance scales with the board.
  const offsetToCentreSpot = (layout: BoardLayout, axis: Axis) =>
    `${((sizeAlong(layout, axis) / 2 - player.slot[layout][axis]) / BOARD_SIZE[layout].width) * 100}cqw`
  return {
    '--cascade-index': cascadeIndex,
    '--compact-x': percentOf('compact', 'x'),
    '--compact-y': percentOf('compact', 'y'),
    '--compact-travel-x': offsetToCentreSpot('compact', 'x'),
    '--compact-travel-y': offsetToCentreSpot('compact', 'y'),
    '--full-x': percentOf('full', 'x'),
    '--full-y': percentOf('full', 'y'),
    '--full-travel-x': offsetToCentreSpot('full', 'x'),
    '--full-travel-y': offsetToCentreSpot('full', 'y'),
  } as CSSProperties
}

interface PlayerSlotProps {
  // Where the chip falls in the load cascade, 0 for the first to travel.
  readonly cascadeIndex: number
  readonly player: SamplePlayer
}

/**
 * One player's place on the board, centred on its Figma point. The slot is data, so the
 * percentages arrive as custom properties; which chip shows is decided by the breakpoint.
 */
export function PlayerSlot({ cascadeIndex, player }: PlayerSlotProps) {
  const { strings } = useLandingLanguage()

  return (
    <div
      data-line={LINE_BY_POSITION[player.position]}
      style={toSlotStyle(player, cascadeIndex)}
      className="absolute top-(--compact-y) left-(--compact-x) -translate-x-1/2 animate-chip-travel [--travel-x:var(--compact-travel-x)] [--travel-y:var(--compact-travel-y)] board:top-(--full-y) board:left-(--full-x) board:[--travel-x:var(--full-travel-x)] board:[--travel-y:var(--full-travel-y)]"
    >
      <div className={BOARD_LAYOUT_VISIBILITY.compact}>
        <CompactPlayerChip player={player} />
      </div>
      <div className={cn('relative', BOARD_LAYOUT_VISIBILITY.full)}>
        <PlayerChip player={player} />
        {player.isPromoted ? (
          <span className="absolute -top-2.75 right-px animate-tag-land">
            <PromotedTag
              label={`${strings.board.promotedIn} ${strings.positions[player.position].short}`}
            />
          </span>
        ) : null}
      </div>
    </div>
  )
}
