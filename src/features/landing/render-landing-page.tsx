import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'

import { languageSearchSchema } from '#/lib/language'

import { LandingPage } from './landing-page'

/**
 * Renders the landing page behind a memory router with the real search validation, so tests
 * can open it in either language, and waits for the first paint.
 */
export async function renderLandingPage(url = '/') {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    validateSearch: languageSearchSchema,
    component: LandingPage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [url] }),
  })

  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}
