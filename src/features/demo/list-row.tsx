import { type ReactNode } from 'react'

import { PositionBadge } from '#/components/position-badge'
import { PromotedTag } from '#/components/promoted-tag'
import { type Listing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { seasonLine } from './listing-text'
import { type SortOrder } from './players-search'
import { RowSaveButton } from './row-save-button'
import { useDemoLanguage } from './use-demo-language'

interface ListRowProps {
  readonly isOpened: boolean
  readonly listing: Listing
  // The player's name as a link to the profile; it stretches over the whole row.
  readonly nameLink: ReactNode
  readonly onRemoved: ((listing: Listing) => void) | undefined
  readonly sortedBy: SortOrder
}

function sortedValue(listing: Listing, sortedBy: SortOrder): number {
  switch (sortedBy) {
    case 'score': {
      return listing.score
    }
    case 'age': {
      return listing.age
    }
    case 'matches': {
      return listing.thisSeason.matches
    }
  }
}

/**
 * One ranked row: badge, name and age, club and league on one truncated line, then the sorted
 * value with this season's numbers under it. Promoted rows sit on the amber wash with their
 * tag; the opened row is ringed, on tint unless promoted.
 */
export function ListRow({ isOpened, listing, nameLink, onRemoved, sortedBy }: ListRowProps) {
  const { strings } = useDemoLanguage()
  const season = seasonLine(listing, strings)

  return (
    <li
      data-listing-id={listing.id}
      className={cn(
        'relative flex min-h-16 items-center gap-3 border-b border-line px-3 py-2 transition-colors duration-150 ease-settle motion-reduce:transition-none',
        listing.isPromoted && 'bg-amber-wash',
        isOpened && 'inset-ring inset-ring-signal',
        isOpened && !listing.isPromoted && 'bg-tint',
        !isOpened && !listing.isPromoted && 'hover:bg-card',
      )}
    >
      <PositionBadge size="row" label={listing.position} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex min-w-0 items-baseline gap-1.5 leading-[1.2]">
          {nameLink}
          <span className="shrink-0 text-[13px] text-muted">{listing.age}</span>
          {listing.isPromoted && <PromotedTag shape="label" label={strings.list.promoted} />}
        </p>
        <p className="truncate text-[13px] leading-[1.25] text-muted">
          {listing.club} · {listing.league}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right whitespace-nowrap">
        <p className="font-display text-xl leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
          <span className="sr-only">{strings.list.sortedValue[sortedBy]} </span>
          {sortedValue(listing, sortedBy)}
        </p>
        <p className="text-xs leading-[1.2] text-muted">
          <span aria-hidden="true">{season.visible}</span>
          <span className="sr-only">{season.spoken}</span>
        </p>
      </div>
      <RowSaveButton listing={listing} onRemoved={onRemoved} />
    </li>
  )
}
