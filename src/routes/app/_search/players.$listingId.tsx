import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '#/features/demo/profile-page'
import { PROFILE_ROUTE_OPTIONS } from '#/features/demo/profile-route-options'

export const Route = createFileRoute('/app/_search/players/$listingId')({
  ...PROFILE_ROUTE_OPTIONS,
  component: ProfilePage,
})
