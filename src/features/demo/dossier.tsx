import { type ReactNode, useId } from 'react'

import { InitialsMark } from '#/components/initials-mark'
import { StarIcon } from '#/components/star-icon'
import { type Listing } from '#/features/sample-listings/sample-listings'

import { FactsRow } from './facts-row'
import { fillTemplate } from './format'
import { HighlightsPlate } from './highlights-plate'
import { fullName } from './listing-text'
import { ScoreBlock } from './score-block'
import { SeasonStrips } from './season-strips'
import { useDemoLanguage } from './use-demo-language'

interface DossierProps {
  // Save and Contact in the club seat; the player seat has none.
  readonly actions?: ReactNode
  readonly listing: Listing
  readonly scoreNote: string
  readonly scoreNoteShort: string
}

/**
 * The Profile as a club reads it: identity with contract status, the score against the
 * position's range, facts, two seasons and the highlights. A region headed by the name.
 * Opening another player cross-fades it in.
 */
export function Dossier({ actions, listing, scoreNote, scoreNoteShort }: DossierProps) {
  const { strings } = useDemoLanguage()
  const nameId = useId()
  const copy = strings.dossier

  return (
    <section
      aria-labelledby={nameId}
      className="flex animate-dossier-swap flex-col divide-y divide-line motion-reduce:animate-none"
    >
      <div className="flex flex-col gap-5 pb-6 xl:flex-row xl:items-start xl:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-4 lg:gap-6">
          <InitialsMark size="dossier" firstName={listing.firstName} lastName={listing.lastName} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2
              id={nameId}
              className="font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.025em] text-ink lg:text-[40px]"
            >
              {fullName(listing)}
            </h2>
            <p className="text-[15px] leading-[1.4] text-muted lg:text-[17px]">
              {fillTemplate(copy.identity, {
                position: strings.positions[listing.position].name,
                age: listing.age,
                club: listing.club,
                league: listing.league,
              })}
              <br />
              {strings.contract[listing.contractStatus]}
            </p>
            {listing.isPromoted && (
              <p className="flex w-fit items-center gap-2 rounded-lg bg-amber-wash px-3 py-2 text-[13px] leading-[1.3] font-medium text-ink">
                <StarIcon className="size-3 shrink-0 text-amber" />
                {fillTemplate(copy.promoted, { short: listing.position })}
              </p>
            )}
          </div>
        </div>
        {actions}
      </div>
      <ScoreBlock listing={listing} note={scoreNote} noteShort={scoreNoteShort} />
      <FactsRow listing={listing} />
      <SeasonStrips listing={listing} />
      <HighlightsPlate listing={listing} />
    </section>
  )
}
