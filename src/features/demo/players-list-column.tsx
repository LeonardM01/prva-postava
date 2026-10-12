import { Link, useNavigate } from '@tanstack/react-router'

import { type Position } from '#/features/sample-listings/positions'
import { SAMPLE_LISTINGS } from '#/features/sample-listings/sample-listings'

import { AppliedFilterChips } from './applied-filter-chips'
import { EmptyResult } from './empty-result'
import { FilterPanel } from './filter-panel'
import { fillTemplate } from './format'
import { ListFoot } from './list-foot'
import { PositionTitle } from './position-title'
import { RankedList } from './ranked-list'
import { searchListings } from './search-listings'
import { SortMenu } from './sort-menu'
import { useDemoLanguage } from './use-demo-language'
import { useOpenedListingId, usePlayersSearch } from './use-players-search'

interface PlayersListColumnProps {
  readonly position: Position
}

/**
 * The searched list: the position as its title, the filters and sort, the ranked rows and
 * the foot. Rows open their profile beside it at an address that keeps the search.
 */
export function PlayersListColumn({ position }: PlayersListColumnProps) {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const openedId = useOpenedListingId()
  const navigate = useNavigate()
  const searchInPosition = { ...search, position }
  const result = searchListings(SAMPLE_LISTINGS, searchInPosition)
  const sortedBy = search.sort ?? 'score'

  return (
    <div className="flex min-w-0 flex-col">
      <PositionTitle position={position} total={result.total} />
      <div className="flex flex-wrap gap-2 pt-3.5 pb-4">
        <FilterPanel position={position} />
        <AppliedFilterChips />
        <SortMenu />
      </div>
      {result.total === 0 ? (
        <EmptyResult position={position} />
      ) : (
        // A new search settles in place; nothing travels.
        <div
          key={JSON.stringify(searchInPosition)}
          className="animate-rows-settle motion-reduce:animate-none"
        >
          <RankedList
            label={fillTemplate(strings.list.listLabel, {
              plural: strings.positions[position].plural,
            })}
            listings={result.rows}
            openedId={openedId}
            sortedBy={sortedBy}
            renderNameLink={(listing, linkProps) => (
              <Link
                to="/app/players/$listingId"
                params={{ listingId: listing.id }}
                search={searchInPosition}
                {...linkProps}
              />
            )}
            onWalk={async (listing) => {
              await navigate({
                to: '/app/players/$listingId',
                params: { listingId: listing.id },
                search: searchInPosition,
              })
            }}
          />
          <ListFoot result={result} />
        </div>
      )}
    </div>
  )
}
