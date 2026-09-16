import { playerChipVariants } from './player-chip-variants'
import { PositionBadge } from './position-badge'
import { type SamplePlayer } from './sample-players'
import { useLandingLanguage } from './use-landing-language'

interface PlayerChipProps {
  readonly player: SamplePlayer
}

export function PlayerChip({ player }: PlayerChipProps) {
  const { strings } = useLandingLanguage()

  return (
    <div className={playerChipVariants({ layout: 'full', isPromoted: player.isPromoted })}>
      <PositionBadge
        layout="full"
        isPromoted={player.isPromoted}
        label={strings.positions[player.position].short}
      />
      <span className="flex flex-col gap-px leading-[normal]">
        <span className="text-sm font-medium text-ink">
          {player.firstName} {player.lastName}
        </span>
        <span className="text-xs text-muted">
          {player.club} · {player.age}
        </span>
      </span>
      <span className="ml-auto flex flex-col items-end leading-[normal]">
        <span className="text-[15px] font-semibold text-ink">{player.stat.value}</span>
        <span className="text-[11px] text-muted">{strings.board.units[player.stat.unit]}</span>
      </span>
    </div>
  )
}
