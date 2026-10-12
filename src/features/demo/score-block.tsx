import { type Listing, positionSummary } from '#/features/sample-listings/sample-listings'

import { fillTemplate, formatOrdinal } from './format'
import { RangeRule } from './range-rule'
import { useDemoLanguage } from './use-demo-language'

interface ScoreBlockProps {
  readonly listing: Listing
  // The line under the rank: a club reads how it is computed, the player that promotion never
  // moves it. Phones get the short form.
  readonly note: string
  readonly noteShort: string
}

/**
 * The score against the position's range, so the number means something.
 */
export function ScoreBlock({ listing, note, noteShort }: ScoreBlockProps) {
  const { language, strings } = useDemoLanguage()
  const summary = positionSummary(listing.position)
  const position = strings.positions[listing.position]

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 py-6 lg:gap-x-10 lg:gap-y-3 lg:py-7">
      <p className="flex flex-col lg:row-span-2">
        <span className="font-display text-[56px] leading-none font-extrabold tracking-[-0.03em] text-ink lg:text-7xl">
          {listing.score}
        </span>
        <span className="text-[13px] leading-[1.3] tracking-[0.06em] text-muted">
          {strings.dossier.score}
        </span>
      </p>
      <div className="flex min-w-0 flex-col gap-2 lg:gap-3 lg:pt-2">
        <p className="text-[17px] leading-[1.3] font-semibold text-ink lg:text-[19px]">
          {fillTemplate(strings.dossier.rank, {
            rank: formatOrdinal(language, strings.counts.ordinal, listing.rank),
            count: summary.count,
            listNoun: position.listNoun,
            short: listing.position,
          })}
        </p>
        <p className="max-w-130 text-sm leading-normal text-muted lg:text-[15px]">
          <span className="lg:hidden">{noteShort}</span>
          <span className="max-lg:hidden">{note}</span>
        </p>
      </div>
      <div className="col-span-2 lg:col-span-1 lg:col-start-2">
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
