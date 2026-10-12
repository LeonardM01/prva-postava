import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'

import { NotFound } from '#/components/not-found'
import { type Language } from '#/lib/language'

import { DEMO_LAYOUT_OPTIONS } from './demo-route-options'
import { DemoShell } from './demo-shell'
import { DossierPrompt } from './dossier-prompt'
import { PlayerSeatPage } from './player-seat-page'
import { PlayersLayout } from './players-layout'
import { PLAYERS_ROUTE_OPTIONS } from './players-route-options'
import { ProfilePage } from './profile-page'
import { PROFILE_ROUTE_OPTIONS } from './profile-route-options'
import { ShortlistPage } from './shortlist-page'
import { SHORTLIST_ROUTE_OPTIONS } from './shortlist-route-options'

interface RenderDemoOptions {
  readonly language: Language
}

function createDemoRouter(path: string, language: Language) {
  const rootRoute = createRootRoute({ notFoundComponent: NotFound })
  const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app',
    ...DEMO_LAYOUT_OPTIONS,
    // The cookie is only readable inside a request; the e2e specs cover reading it.
    beforeLoad: () => ({ language }),
    component: DemoShell,
  })
  const searchRoute = createRoute({
    getParentRoute: () => appRoute,
    id: '_search',
    ...PLAYERS_ROUTE_OPTIONS,
    component: PlayersLayout,
  })
  const indexRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: '/',
    component: DossierPrompt,
  })
  const profileRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: 'players/$listingId',
    ...PROFILE_ROUTE_OPTIONS,
    component: ProfilePage,
  })
  const shortlistRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'shortlist',
    ...SHORTLIST_ROUTE_OPTIONS,
    component: ShortlistPage,
  })
  const meRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'me',
    component: PlayerSeatPage,
  })
  const searchTree = searchRoute.addChildren([indexRoute, profileRoute])
  const appTree = appRoute.addChildren([searchTree, shortlistRoute, meRoute])
  return createRouter({
    routeTree: rootRoute.addChildren([appTree]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
}

/**
 * Renders a demo address behind a memory router with the real route options, in `language`
 * as if the cookie said so, on a device with nothing saved yet. Waits for the page heading.
 */
export async function renderDemo(path: string, { language }: RenderDemoOptions) {
  localStorage.clear()
  const router = createDemoRouter(path, language)
  const view = render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
  return { ...view, router }
}
