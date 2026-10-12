import { type Listing } from '#/features/sample-listings/sample-listings'

import { useAfterShortlistRemoval } from './shortlist-removal-context'
import { useShortlist } from './use-shortlist'

interface SavedToggle {
  // False until the device's shortlist has been read, so the server renders no saved marks.
  readonly isSaved: boolean
  readonly toggle: () => void
}

/**
 * Save or remove one listing, from a row or a profile alike.
 */
export function useSavedToggle(listing: Listing): SavedToggle {
  const shortlist = useShortlist()
  const afterRemoval = useAfterShortlistRemoval()
  const isSaved = shortlist.ids?.includes(listing.id) ?? false

  return {
    isSaved,
    toggle: () => {
      if (isSaved) {
        shortlist.remove(listing.id)
        afterRemoval(listing)
        return
      }
      shortlist.save(listing.id)
    },
  }
}
