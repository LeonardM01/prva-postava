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
        <div
          key={stat}
          className="relative flex min-w-0 flex-1 flex-col-reverse gap-px leading-[normal] whitespace-nowrap not-first:px-3 not-first:before:absolute not-first:before:top-1/2 not-first:before:left-0 not-first:before:h-9 not-first:before:w-px not-first:before:-translate-y-1/2 not-first:before:bg-line board:gap-0.5 board:not-first:px-6 board:not-first:before:h-11"
        >
          <dt className="text-xs text-muted board:text-[13px]">
            {stat === 'minutes' ? (
              <>
                <span className="max-board:hidden">{labels.minutes}</span>
                <span className="board:hidden">{labels.minutesShort}</span>
              </>
            ) : (
              labels[stat]
            )}
          </dt>
          <dd className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink board:text-[32px]">
            {listing[stat]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
