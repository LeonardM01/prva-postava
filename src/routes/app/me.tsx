import { createFileRoute } from '@tanstack/react-router'

import { PlayerSeatPage } from '#/features/demo/player-seat-page'

export const Route = createFileRoute('/app/me')({
  component: PlayerSeatPage,
})
