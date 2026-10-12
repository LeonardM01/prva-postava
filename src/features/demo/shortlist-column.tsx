import { Link, useNavigate } from '@tanstack/react-router'

import { chipVariants } from '#/components/chip-variants'
import { type Listing } from '#/features/sample-listings/sample-listings'

import { fillTemplate } from './format'
import { SlidersIcon } from './icons/sliders-icon'
import { RankedList } from './ranked-list'
import { useDemoLanguage } from './use-demo-language'

interface ShortlistColumnProps {
  readonly onRemoved: (listing: Listing) => void
  readonly openedId: string | undefined
  // Undefined until the device's shortlist has been read.
  readonly saved: readonly Listing[] | undefined
}

/**
 * The saved rows in the order they were saved. A promoted row keeps its tag but not its
 * place: the shortlist is not for sale.
 */
export function ShortlistColumn({ onRemoved, openedId, saved }: ShortlistColumnProps) {
  const { strings } = useDemoLanguage()
  const navigate = useNavigate()
  const copy = strings.shortlist

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <h1 className="font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
          {copy.title}
        </h1>
        {saved !== undefined && (
          <p className="text-[15px] leading-[1.3] text-muted">
            {fillTemplate(copy.saved, { count: saved.length })}
          </p>
        )}
      </div>
      {/* Drawn, not controls: the shortlist does not filter or re-sort yet. */}
      <ul aria-hidden="true" className="flex flex-wrap gap-2 pt-3.5 pb-4">
        <li className={chipVariants({ isApplied: false, size: 'regular' })}>
          <SlidersIcon className="size-4" />
          {strings.filters.button}
        </li>
        <li className={chipVariants({ isApplied: false, size: 'regular' })}>{copy.sortNewest}</li>
      </ul>
      {saved?.length === 0 && (
        <p className="border-t border-line py-6 text-[15px] leading-normal text-muted">
          {copy.emptyTitle}{' '}
          <Link to="/app" className="font-semibold text-signal underline underline-offset-4">
            {copy.emptyLink}
          </Link>
        </p>
      )}
      {saved !== undefined && saved.length > 0 && (
        <>
          <RankedList
            label={copy.listLabel}
            listings={saved}
            openedId={openedId}
            sortedBy="score"
            renderNameLink={(listing, linkProps) => (
              <Link to="/app/shortlist" search={{ listing: listing.id }} {...linkProps} />
            )}
            onWalk={async (listing) => {
              await navigate({ to: '/app/shortlist', search: { listing: listing.id } })
            }}
            onRemoved={onRemoved}
          />
          <p className="py-3 pl-3 text-[13px] leading-[1.3] text-muted">{copy.foot}</p>
        </>
      )}
    </div>
  )
}
