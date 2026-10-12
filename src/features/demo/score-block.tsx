import { type Listing, positionSummary } from '#/features/sample-listings/sample-listings'

import { fillTemplate, formatOrdinal } from './format'
import { RangeRule } from './range-rule'
import { useDemoLanguage } from './use-demo-language'

interface ScoreBlockProps {
  readonly listing: Listing
  // The line under the rank: a club reads how it is computed, the player that promotion never moves it.
  readonly note: string
}

/**
 * The score against the position's range, so the number means something.
 */
export function ScoreBlock({ listing, note }: ScoreBlockProps) {
  const { language, strings } = useDemoLanguage()
  const summary = positionSummary(listing.position)
  const position = strings.positions[listing.position]

  return (
    <div className="flex gap-5 py-6 lg:gap-10 lg:py-7">
      <p className="flex shrink-0 flex-col">
        <span className="font-display text-[56px] leading-none font-extrabold tracking-[-0.03em] text-ink lg:text-7xl">
          {listing.score}
        </span>
        <span className="text-[13px] leading-[1.3] tracking-[0.06em] text-muted">
          {strings.dossier.score}
        </span>
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-3 lg:pt-2">
        <p className="text-[17px] leading-[1.3] font-semibold text-ink lg:text-[19px]">
          {fillTemplate(strings.dossier.rank, {
            rank: formatOrdinal(language, strings.counts.ordinal, listing.rank),
            count: summary.count,
            listNoun: position.listNoun,
            short: listing.position,
          })}
        </p>
        <p className="max-w-130 text-sm leading-normal text-muted lg:text-[15px]">{note}</p>
        <RangeRule
          lowest={summary.lowestScore}
          highest={summary.highestScore}
          score={listing.score}
          caption={fillTemplate(strings.dossier.rangeLabel, { plural: position.plural })}
        />
      </div>
    </div>
  )
}
