import { type KeyboardEvent, type ReactNode } from 'react'

import { type Listing } from '#/features/sample-listings/sample-listings'

import { ListRow } from './list-row'
import { fullName } from './listing-text'
import { type SortOrder } from './players-search'

// The name stretches its hit area over the whole row; the focus ring follows the row's edge.
const NAME_LINK_CLASS =
  "min-w-0 truncate text-[15px] font-semibold text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-signal"

export interface NameLinkProps {
  readonly 'aria-current': 'page' | undefined
  readonly children: string
  readonly className: string
  readonly onKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => void
  readonly tabIndex: number
}

interface RankedListProps {
  readonly label: string
  readonly listings: readonly Listing[]
  // Opens a listing when the arrow keys walk onto it.
  readonly onWalk: (listing: Listing) => Promise<void>
  // Runs after a row's Save control removes its listing from the shortlist.
  readonly onRemoved?: (listing: Listing) => void
  readonly openedId: string | undefined
  readonly renderNameLink: (listing: Listing, props: NameLinkProps) => ReactNode
  readonly sortedBy: SortOrder
}

/**
 * The rows as a list of links named after the players. One row is in the tab order (the
 * opened one, else the first); the arrow keys move through the rest and open each in turn, so
 * the address follows.
 */
export function RankedList({
  label,
  listings,
  onRemoved,
  onWalk,
  openedId,
  renderNameLink,
  sortedBy,
}: RankedListProps) {
  const focusableId = listings.some((listing) => listing.id === openedId)
    ? openedId
    : listings[0]?.id

  async function walk(event: KeyboardEvent<HTMLAnchorElement>, from: Listing) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return
    }
    const index = listings.indexOf(from)
    const next = listings[index + (event.key === 'ArrowDown' ? 1 : -1)]
    if (next === undefined) {
      return
    }
    event.preventDefault()
    event.currentTarget
      .closest('ol')
      ?.querySelector<HTMLElement>(`[data-listing-id="${CSS.escape(next.id)}"] a`)
      ?.focus()
    await onWalk(next)
  }

  return (
    <ol aria-label={label} className="border-t border-line">
      {listings.map((listing) => (
        <ListRow
          key={listing.id}
          listing={listing}
          sortedBy={sortedBy}
          isOpened={listing.id === openedId}
          onRemoved={onRemoved}
          nameLink={renderNameLink(listing, {
            'aria-current': listing.id === openedId ? 'page' : undefined,
            children: fullName(listing),
            className: NAME_LINK_CLASS,
            tabIndex: listing.id === focusableId ? 0 : -1,
            onKeyDown: (event) => {
              void walk(event, listing)
            },
          })}
        />
      ))}
    </ol>
  )
}
