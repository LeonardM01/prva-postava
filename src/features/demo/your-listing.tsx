import { useId } from 'react'

import { actionButtonVariants } from '#/components/action-button-variants'
import { type Listing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { fillTemplate, formatCount } from './format'
import { useDemoLanguage } from './use-demo-language'

interface YourListingProps {
  readonly listing: Listing
}

/**
 * The player's own column: seen by clubs as a ruled readout, then the top spot for sale. The
 * Promote button is real and focusable but does nothing in the demo: no checkout, no price.
 */
export function YourListing({ listing }: YourListingProps) {
  const { language, strings } = useDemoLanguage()
  const promoteId = useId()
  const copy = strings.seat
  const { lastWeek, thisWeek } = listing.seenByClubs

  return (
    <section className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1 lg:pb-6">
      <h1 className="font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
        {copy.title}
      </h1>
      <div className="flex flex-col gap-4">
        <dl className="flex items-baseline justify-between border-b border-line pb-2">
          <dt className="text-[15px] leading-[1.3] font-medium text-ink">{copy.seenByClubs}</dt>
          <dd className="font-display text-[28px] leading-none font-extrabold tracking-[-0.02em] text-ink">
            {thisWeek}
          </dd>
        </dl>
        <p className="text-sm leading-normal text-muted">
          {fillTemplate(copy.seenBody, {
            thisWeek: formatCount(language, copy.clubsCount, thisWeek),
            lastWeek,
          })}
        </p>
      </div>
      <section
        aria-labelledby={promoteId}
        className="flex flex-col gap-3 border-t border-line pt-6"
      >
        <h2 id={promoteId} className="text-[17px] leading-[1.3] font-semibold text-ink">
          {fillTemplate(copy.promoteTitle, { short: listing.position })}
        </h2>
        <p className="text-[15px] leading-normal text-muted">
          {fillTemplate(copy.promoteBody, { short: listing.position })}
        </p>
        <button
          type="button"
          className={cn(
            actionButtonVariants({ tone: 'primary', size: 'regular' }),
            'mt-1 max-lg:h-12 max-lg:w-full lg:w-fit',
          )}
        >
          {fillTemplate(copy.promote, { short: listing.position })}
        </button>
      </section>
    </section>
  )
}
