import { getRouteApi, useNavigate, useParams } from '@tanstack/react-router'

import { type PlayersSearch } from './players-search'

const playersRoute = getRouteApi('/app/_search')

export function usePlayersSearch(): PlayersSearch {
  return playersRoute.useSearch()
}

/**
 * The listing whose profile is open beside the list, if any.
 */
export function useOpenedListingId(): string | undefined {
  return useParams({ strict: false, select: (params) => params.listingId })
}

/**
 * Replaces the search in the address, keeping the opened profile open.
 */
export function useUpdatePlayersSearch() {
  const navigate = useNavigate()
  const openedId = useOpenedListingId()
  return async (search: PlayersSearch) => {
    if (openedId === undefined) {
      await navigate({ to: '/app', search })
      return
    }
    await navigate({ to: '/app/players/$listingId', params: { listingId: openedId }, search })
  }
}
