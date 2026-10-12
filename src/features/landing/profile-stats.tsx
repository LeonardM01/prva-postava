import { StatBlock } from '#/components/stat-block'

import { type SampleListing } from './sample-listings'
import { useLandingLanguage } from './use-landing-language'

const STATS = ['matches', 'goals', 'assists', 'minutes'] as const

interface ProfileStatsProps {
  readonly listing: SampleListing
}

export function ProfileStats({ listing }: ProfileStatsProps) {
  const { strings } = useLandingLanguage()
  const labels = strings.players.stats

  return (
    <dl className="flex">
      {STATS.map((stat) => (
        <StatBlock
          key={stat}
          size="factSheet"
          value={listing[stat]}
          className="relative min-w-0 flex-1 gap-px leading-[normal] not-first:px-3 not-first:before:absolute not-first:before:top-1/2 not-first:before:left-0 not-first:before:h-9 not-first:before:w-px not-first:before:-translate-y-1/2 not-first:before:bg-line board:gap-0.5 board:not-first:px-6 board:not-first:before:h-11"
          label={
            stat === 'minutes' ? (
              <>
                <span className="max-board:hidden">{labels.minutes}</span>
                <span className="board:hidden">{labels.minutesShort}</span>
              </>
            ) : (
              labels[stat]
            )
          }
        />
      ))}
    </dl>
  )
}
