import { createFileRoute } from '@tanstack/react-router'

import { ShortlistPage } from '#/features/demo/shortlist-page'
import { SHORTLIST_ROUTE_OPTIONS } from '#/features/demo/shortlist-route-options'

export const Route = createFileRoute('/app/shortlist')({
  ...SHORTLIST_ROUTE_OPTIONS,
  component: ShortlistPage,
})
