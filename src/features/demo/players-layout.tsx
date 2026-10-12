import { Outlet } from '@tanstack/react-router'

import { findListing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { EntryPage } from './entry-page'
import { PlayersListColumn } from './players-list-column'
import { useOpenedListingId, usePlayersSearch } from './use-players-search'

/**
 * `/app` and the profiles under it. Without a position it is the entry composer; with one, the
 * list beside the dossier column, which stays mounted while the opened profile changes. A
 * profile shared without a position opens on its own position's list. Phones show the list or
 * the profile, never both.
 */
export function PlayersLayout() {
  const search = usePlayersSearch()
  const openedId = useOpenedListingId()
  const position =
    search.position ?? (openedId === undefined ? undefined : findListing(openedId)?.position)

  if (position === undefined) {
    return <EntryPage />
  }
  const isProfileOpen = openedId !== undefined
  return (
    <div className="lg:grid lg:grid-cols-[22.5rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className={cn(isProfileOpen && 'max-lg:hidden')}>
        <PlayersListColumn position={position} />
      </div>
      <div className={cn('min-w-0', !isProfileOpen && 'max-lg:hidden')}>
        <Outlet />
      </div>
    </div>
  )
}
