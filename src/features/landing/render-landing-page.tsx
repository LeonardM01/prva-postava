import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'

import { LandingPage } from './landing-page'
import { LANDING_ROUTE_OPTIONS } from './landing-route-options'

export type LandingPath = '/' | '/en'

/**
 * Renders the landing page behind a memory router with the real route options, so tests open
 * it by path (`/` for Croatian, `/en` for English), and waits for the first paint.
 */
export async function renderLandingPage(path: LandingPath) {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/{-$lang}/',
    ...LANDING_ROUTE_OPTIONS,
    component: LandingPage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })

  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}
