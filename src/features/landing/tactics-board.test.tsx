import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderLandingPage } from './render-landing-page'

describe('tactics board', () => {
  it('is a figure captioned with the board caption and the sample note', async () => {
    await renderLandingPage()

    const board = screen.getByRole('figure', { name: 'Every position on one board' })
    expect(within(board).getByText('Sample players, not real listings')).toBeVisible()
  })

  it('lists the eleven sample players with position and club', async () => {
    await renderLandingPage()

    const board = screen.getByRole('figure', { name: 'Every position on one board' })
    const players = within(board).getAllByRole('listitem')

    expect(players).toHaveLength(11)
    expect(players.map((player) => player.textContent)).toEqual(
      expect.arrayContaining([
        'Karlo Bašić, Goalkeeper, NK Lučko, age 28, 9 clean sheets',
        'Ivan Horvat, Left wing, NK Kustošija, age 22, 9 goals, promoted',
        'Luka Babić, Striker, NK Sesvete, age 24, 11 goals',
      ]),
    )
  })

  it('shows the Promoted tag on the left-wing slot', async () => {
    await renderLandingPage()

    const board = screen.getByRole('figure', { name: 'Every position on one board' })
    expect(within(board).getByText('Promoted in LW')).toBeInTheDocument()
  })

  it('carries the board copy in Croatian', async () => {
    await renderLandingPage('/?lang=hr')

    const board = screen.getByRole('figure', { name: 'Svaka pozicija na jednoj ploči' })
    expect(within(board).getByText('Primjeri igrača, nisu pravi oglasi')).toBeVisible()
    expect(within(board).getAllByRole('listitem')).toHaveLength(11)
    expect(within(board).getByText('Promoviran u LK')).toBeInTheDocument()
  })
})
