import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { languageSearchSchema } from '#/lib/language'

import { LandingPage } from './landing-page'

async function renderLandingPage(url = '/') {
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

describe('landing hero', () => {
  it('opens on the club copy with the club side pressed', async () => {
    await renderLandingPage()

    const roleSwitch = screen.getByRole('group', { name: 'Pick a side' })
    expect(roleSwitch).toBeVisible()
    expect(screen.getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Find your next signing in one evening.' }),
    ).toBeVisible()
    expect(screen.getByText(/^Not one away match at a time\./)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Search players by position' })).toHaveAttribute(
      'href',
      expect.stringMatching(/#get-in-the-lineup$/),
    )
    expect(screen.getByText('Free for players. Clubs pay a membership.')).toBeVisible()
  })

  it('swaps the copy to the player deck and back', async () => {
    const user = userEvent.setup()
    await renderLandingPage()

    await user.click(screen.getByRole('button', { name: "I'm a player" }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: "Get in front of every club that's searching.",
      }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByText(/^Free\. Your profile and your season's numbers/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'List yourself, free' })).toHaveAttribute(
      'href',
      expect.stringMatching(/#get-in-the-lineup$/),
    )
    expect(screen.getByText('Publish your profile and statistics at no cost.')).toBeVisible()
    expect(screen.queryByText('Free for players. Clubs pay a membership.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'I scout for a club' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Find your next signing in one evening.',
      }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Search players by position' })).toBeVisible()
    expect(screen.getByText('Free for players. Clubs pay a membership.')).toBeVisible()
  })

  it('selects a side from the keyboard with Space and Enter', async () => {
    const user = userEvent.setup()
    await renderLandingPage()
    const clubButton = screen.getByRole('button', { name: 'I scout for a club' })
    const playerButton = screen.getByRole('button', { name: "I'm a player" })

    playerButton.focus()
    await user.keyboard(' ')
    expect(await screen.findByRole('heading', { level: 1, name: /^Get in front/ })).toBeVisible()

    clubButton.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { level: 1, name: /^Find your next/ })).toBeVisible()
  })

  it('carries both decks in Croatian', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/?lang=hr')

    expect(screen.getByRole('group', { name: 'Odaberi stranu' })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nađi sljedeće pojačanje u jednoj večeri.' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pretraži igrače po poziciji' })).toBeVisible()
    expect(screen.getByText('Besplatno za igrače. Klubovi plaćaju članarinu.')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Ja sam igrač' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Pokaži se svakom klubu koji traži.' }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Ja sam igrač' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Oglasi se besplatno' })).toBeVisible()
  })
})
