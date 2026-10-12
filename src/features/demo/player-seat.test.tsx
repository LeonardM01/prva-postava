import { screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

function seatSwitch() {
  const [group] = screen.getAllByRole('group', { name: 'Viewing as' })
  if (group === undefined) {
    throw new Error('No seat switch')
  }
  return group
}

describe('player seat', () => {
  it('shows how many clubs looked this week and the week before', async () => {
    await renderDemo('/app/me', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Your listing' })).toBeVisible()
    expect(screen.getByText('Seen by clubs this week').nextElementSibling).toHaveTextContent('7')
    expect(
      screen.getByText(
        '7 clubs opened your profile this week, 4 the week before. Only clubs with an active membership can see it.',
      ),
    ).toBeVisible()
  })

  it('shows Promote as a real button that does nothing in the demo', async () => {
    const { router } = await renderDemo('/app/me', { language: 'en' })
    const user = userEvent.setup()

    const promote = screen.getByRole('button', { name: 'Promote me to the top of LW' })
    promote.focus()
    expect(promote).toHaveFocus()
    const before = document.body.textContent

    await user.click(promote)

    expect(router.state.location.pathname).toBe('/app/me')
    expect(document.body.textContent).toBe(before)
  })

  it('shows the dossier as a club sees it, without Save or Contact', async () => {
    await renderDemo('/app/me', { language: 'en' })

    const caption = screen.getByRole('region', { name: /^What a club sees/ })
    const dossier = within(caption).getByRole('region', { name: 'Marko Kovačević' })
    expect(within(dossier).getByText('11th of 14 left wings on the list')).toBeVisible()
    expect(
      within(dossier).queryByRole('button', { name: 'Contact player' }),
    ).not.toBeInTheDocument()
    expect(within(dossier).queryByRole('button', { name: /shortlist/ })).not.toBeInTheDocument()
  })

  it('names no price, duration or date', async () => {
    await renderDemo('/app/me', { language: 'en' })

    const text = document.body.textContent
    for (const forbidden of [/€/, /\bEUR\b/, /until/i, /per month/i, /\d days/i]) {
      expect(text).not.toMatch(forbidden)
    }
  })

  it('switches seats there and back with the order unchanged', async () => {
    const { router } = await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    await user.click(within(seatSwitch()).getByRole('link', { name: 'Player' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Your listing' })).toBeVisible()
    expect(
      within(seatSwitch())
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Club', 'Player'])

    await user.click(within(seatSwitch()).getByRole('link', { name: 'Club' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Players' })).toBeVisible()
    expect(router.state.location.pathname).toBe('/app')
  })

  it('reads in Croatian', async () => {
    await renderDemo('/app/me', { language: 'hr' })

    expect(screen.getByRole('heading', { level: 1, name: 'Tvoj oglas' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Promoviraj me na vrh liste LW' })).toBeVisible()
    expect(screen.getByText('Klubovi su pogledali ovaj tjedan')).toBeVisible()
    expect(screen.getByText('11. od 14 igrača na listi LW')).toBeVisible()
  })
})
