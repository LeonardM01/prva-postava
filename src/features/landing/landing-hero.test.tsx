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
  it('opens on the player copy with the player side pressed', async () => {
    await renderLandingPage('/en')

    const roleSwitch = getHeroSwitch()
    expect(roleSwitch).toBeVisible()
    expect(within(roleSwitch).getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(roleSwitch).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Stop waiting for a scout to come to your match.',
      }),
    ).toBeVisible()
    expect(
      screen.getByText(/^List your position and this season's numbers for free\./),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'List yourself, free' })).toHaveAttribute(
      'href',
      expect.stringMatching(/#get-in-the-lineup$/),
    )
    expect(screen.getByText('All you need is an email. No agent, no fee to list.')).toBeVisible()
  })

  it('swaps the copy to the club deck and back', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/en')
    const roleSwitch = getHeroSwitch()

    await user.click(within(roleSwitch).getByRole('button', { name: 'I scout for a club' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Find your next signing in one evening.',
      }),
    ).toBeVisible()
    expect(within(roleSwitch).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(roleSwitch).getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(
      screen.getByText(/^Players list themselves here because they want a transfer/),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Search players by position' })).toHaveAttribute(
      'href',
      expect.stringMatching(/#get-in-the-lineup$/),
    )
    expect(
      screen.getByText('Start with your email. Players list for free, clubs pay a membership.'),
    ).toBeVisible()
    expect(
      screen.queryByText('All you need is an email. No agent, no fee to list.'),
    ).not.toBeInTheDocument()

    await user.click(within(roleSwitch).getByRole('button', { name: "I'm a player" }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Stop waiting for a scout to come to your match.',
      }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'List yourself, free' })).toBeVisible()
    expect(screen.getByText('All you need is an email. No agent, no fee to list.')).toBeVisible()
  })

  it('selects a side from the keyboard with Space and Enter', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/en')
    const roleSwitch = getHeroSwitch()
    const clubButton = within(roleSwitch).getByRole('button', { name: 'I scout for a club' })
    const playerButton = within(roleSwitch).getByRole('button', { name: "I'm a player" })

    clubButton.focus()
    await user.keyboard(' ')
    expect(await screen.findByRole('heading', { level: 1, name: /^Find your next/ })).toBeVisible()

    playerButton.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { level: 1, name: /^Stop waiting/ })).toBeVisible()
  })

  it('carries both decks in Croatian', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/')

    const roleSwitch = getHeroSwitch('Odaberi stranu')
    expect(roleSwitch).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Ne čekaj da skaut dođe na tvoju utakmicu.' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Oglasi se besplatno' })).toBeVisible()
    expect(
      screen.getByText('Treba ti samo e-mail. Bez menadžera i bez naknade za oglas.'),
    ).toBeVisible()

    await user.click(within(roleSwitch).getByRole('button', { name: 'Tražim igrače za klub' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Nađi sljedeće pojačanje u jednoj večeri.',
      }),
    ).toBeVisible()
    expect(
      within(roleSwitch).getByRole('button', { name: 'Tražim igrače za klub' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('link', { name: 'Pretraži igrače po poziciji' })).toBeVisible()
  })
})
