import { notFound } from '@tanstack/react-router'

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

export const PROFILE_ROUTE_OPTIONS = {
  loader: loadProfile,
}
