import { createContext, use } from 'react'

import { type Listing } from '#/features/sample-listings/sample-listings'

type AfterRemove = (listing: Listing) => void

function doNothing() {
  // Outside the Shortlist page a removal needs no follow-up.
}

/**
 * What the Shortlist page does after a player is removed from a row or a profile: open the
 * next one. Every other page leaves the default, which does nothing.
 */
export const ShortlistRemovalContext = createContext<AfterRemove>(doNothing)

export function useAfterShortlistRemoval(): AfterRemove {
  return use(ShortlistRemovalContext)
}
