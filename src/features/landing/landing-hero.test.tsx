import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderLandingPage } from './render-landing-page'

// The CTA band has a role switch of its own; these tests drive the one in the hero.
function getHeroSwitch(label = 'Pick a side') {
  const hero = screen.getByRole('region', {
    name: screen.getByRole('heading', { level: 1 }).textContent,
  })
  return within(hero).getByRole('group', { name: label })
}

describe('landing hero', () => {
  it('opens on the club copy with the club side pressed', async () => {
    await renderLandingPage('/en')

    const roleSwitch = getHeroSwitch()
    expect(roleSwitch).toBeVisible()
    expect(within(roleSwitch).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(roleSwitch).getByRole('button', { name: "I'm a player" })).toHaveAttribute(
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
    await renderLandingPage('/en')
    const roleSwitch = getHeroSwitch()

    await user.click(within(roleSwitch).getByRole('button', { name: "I'm a player" }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: "Get in front of every club that's searching.",
      }),
    ).toBeVisible()
    expect(within(roleSwitch).getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(roleSwitch).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
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

    await user.click(within(roleSwitch).getByRole('button', { name: 'I scout for a club' }))

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
    await renderLandingPage('/en')
    const roleSwitch = getHeroSwitch()
    const clubButton = within(roleSwitch).getByRole('button', { name: 'I scout for a club' })
    const playerButton = within(roleSwitch).getByRole('button', { name: "I'm a player" })

    playerButton.focus()
    await user.keyboard(' ')
    expect(await screen.findByRole('heading', { level: 1, name: /^Get in front/ })).toBeVisible()

    clubButton.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { level: 1, name: /^Find your next/ })).toBeVisible()
  })

  it('carries both decks in Croatian', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/')

    const roleSwitch = getHeroSwitch('Odaberi stranu')
    expect(roleSwitch).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nađi sljedeće pojačanje u jednoj večeri.' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pretraži igrače po poziciji' })).toBeVisible()
    expect(screen.getByText('Besplatno za igrače. Klubovi plaćaju članarinu.')).toBeVisible()

    await user.click(within(roleSwitch).getByRole('button', { name: 'Ja sam igrač' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Pokaži se svakom klubu koji traži.' }),
    ).toBeVisible()
    expect(within(roleSwitch).getByRole('button', { name: 'Ja sam igrač' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Oglasi se besplatno' })).toBeVisible()
  })
})
