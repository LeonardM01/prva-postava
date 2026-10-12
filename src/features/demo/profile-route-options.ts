import { notFound } from '@tanstack/react-router'

import { RouteError } from '#/components/route-error'
import { findListing } from '#/features/sample-listings/sample-listings'

interface ProfileLoaderOptions {
  readonly params: { readonly listingId: string }
}

// A dead profile link fails honestly, with the not-found page.
function loadProfile({ params }: ProfileLoaderOptions) {
  const listing = findListing(params.listingId)
  if (listing === undefined) {
    throw notFound()
  }
  return { listing }
}

// No pendingComponent, though docs/CODING_STANDARDS.md §7 asks for one: the loader reads bundled
// data and never waits, and a pending component renders during a slow hydration and breaks it.
export const PROFILE_ROUTE_OPTIONS = {
  loader: loadProfile,
  errorComponent: RouteError,
}
