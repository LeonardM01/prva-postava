import { playerChipVariants } from './player-chip-variants'
import { PositionBadge } from './position-badge'
import { type SamplePlayer } from './sample-players'
import { useLandingLanguage } from './use-landing-language'

interface CompactPlayerChipProps {
  readonly player: SamplePlayer
}

export function CompactPlayerChip({ player }: CompactPlayerChipProps) {
  const { strings } = useLandingLanguage()

  return (
    <div className={playerChipVariants({ layout: 'compact', isPromoted: player.isPromoted })}>
      <PositionBadge
        layout="compact"
        isPromoted={player.isPromoted}
        label={strings.positions[player.position].short}
      />
      <span className="leading-[normal] font-medium text-ink">{player.lastName}</span>
      <span className="leading-[normal] font-semibold text-muted">{player.stat.value}</span>
    </div>
  )
}
