import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '#/features/landing/landing-page'
import { LANDING_ROUTE_OPTIONS } from '#/features/landing/landing-route-options'

export const Route = createFileRoute('/{-$lang}/')({
  ...LANDING_ROUTE_OPTIONS,
  component: LandingPage,
})
