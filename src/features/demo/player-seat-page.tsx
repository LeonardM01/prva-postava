import { useId } from 'react'

import { getListing } from '#/features/sample-listings/sample-listings'

import { Dossier } from './dossier'
import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'
import { YourListing } from './your-listing'

// The player seat's sample player: unpromoted, so the Promote button makes sense.
const SEAT_LISTING_ID = 'marko-kovacevic'

/**
 * `/app/me`: the sample player's side. How many clubs looked and the top spot for sale on one
 * side, the dossier exactly as a club opens it on the other. Phones stack them, readout first.
 */
export function PlayerSeatPage() {
  const { strings } = useDemoLanguage()
  const captionId = useId()
  const listing = getListing(SEAT_LISTING_ID)
  const copy = strings.seat

  return (
    <div className="grid gap-8 lg:grid-cols-[22.5rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
      <YourListing listing={listing} />
      <section
        aria-labelledby={captionId}
        className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <h2
          id={captionId}
          className="flex flex-col gap-x-2 leading-[1.3] lg:flex-row lg:items-baseline"
        >
          <span className="text-[15px] font-semibold text-ink">{copy.clubSees}</span>{' '}
          <span className="text-[13px] font-normal text-muted">
            {fillTemplate(copy.clubSeesNote, { short: listing.position })}
          </span>
        </h2>
        <Dossier listing={listing} scoreNote={copy.scoreNote} />
      </section>
      <p className="border-t border-line pt-5 text-[13px] leading-normal text-muted lg:col-start-1 lg:row-start-2 lg:self-start">
        <span className="lg:hidden">{copy.freeShort}</span>
        <span className="max-lg:hidden">{copy.free}</span>
      </p>
    </div>
  )
}
