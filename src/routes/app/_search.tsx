import { createFileRoute } from '@tanstack/react-router'

import { PlayersLayout } from '#/features/demo/players-layout'
import { PLAYERS_ROUTE_OPTIONS } from '#/features/demo/players-route-options'

export const Route = createFileRoute('/app/_search')({
  ...PLAYERS_ROUTE_OPTIONS,
  component: PlayersLayout,
})
