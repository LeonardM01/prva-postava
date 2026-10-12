import { getRouteApi } from '@tanstack/react-router'

const profileRoute = getRouteApi('/app/_search/players/$listingId')

export function ProfilePage() {
  const { listing } = profileRoute.useLoaderData()

  return (
    <h2>
      {listing.firstName} {listing.lastName}
    </h2>
  )
}
