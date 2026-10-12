import { screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

function savedNames() {
  const list = screen.getByRole('list', { name: 'Saved players' })
  return within(list)
    .getAllByRole('listitem')
    .map((row) => within(row).getAllByRole('link')[0]?.textContent)
}

function shortlistNavLink() {
  const nav = screen.getByRole('navigation', { name: 'Demo' })
  return within(nav).getByRole('link', { name: /^Shortlist/ })
}

describe('shortlist', () => {
  it('starts with three sample players, newest first, the promoted one in its saved place', async () => {
    await renderDemo('/app/shortlist', { language: 'en' })

    expect(shortlistNavLink()).toHaveTextContent('Shortlist · 3')
    expect(screen.getByText('3 saved')).toBeVisible()
    expect(savedNames()).toEqual(['Marko Kovačević', 'Ivan Horvat', 'Petar Filipović'])
    const list = screen.getByRole('list', { name: 'Saved players' })
    const ivan = within(list).getAllByRole('listitem')[1]
    expect(ivan && within(ivan).getByText('Promoted')).toBeVisible()
    expect(
      screen.getByText(
        'Saved on this device, newest first. A promoted row keeps its tag but not its place here: your shortlist is not for sale.',
      ),
    ).toBeVisible()
  })

  it('opens the newest saved player beside the list', async () => {
    await renderDemo('/app/shortlist', { language: 'en' })

    const dossier = screen.getByRole('region', { name: 'Marko Kovačević' })
    expect(within(dossier).getByRole('button', { name: 'Remove from shortlist' })).toBeVisible()
  })

  it('saves from a search row and lists the player first', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const save = screen.getByRole('button', { name: 'Save David Vuković to the shortlist' })
    expect(save).toHaveAttribute('aria-pressed', 'false')
    await user.click(save)

    expect(shortlistNavLink()).toHaveTextContent('Shortlist · 4')
    expect(
      screen.getByRole('button', { name: 'Remove David Vuković from the shortlist' }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(shortlistNavLink())
    expect(await screen.findByRole('heading', { level: 1, name: 'Shortlist' })).toBeVisible()
    expect(savedNames()[0]).toBe('David Vuković')
  })

  it('saves and removes from a profile', async () => {
    await renderDemo('/app/players/david-vukovic?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const dossier = screen.getByRole('region', { name: 'David Vuković' })
    await user.click(within(dossier).getByRole('button', { name: 'Save to shortlist' }))
    expect(shortlistNavLink()).toHaveTextContent('Shortlist · 4')

    await user.click(within(dossier).getByRole('button', { name: 'Remove from shortlist' }))
    expect(shortlistNavLink()).toHaveTextContent('Shortlist · 3')
    expect(within(dossier).getByRole('button', { name: 'Save to shortlist' })).toBeVisible()
  })

  it('removes a player from a row on the shortlist', async () => {
    await renderDemo('/app/shortlist', { language: 'en' })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Remove Ivan Horvat from the shortlist' }))

    expect(savedNames()).toEqual(['Marko Kovačević', 'Petar Filipović'])
    expect(shortlistNavLink()).toHaveTextContent('Shortlist · 2')
    expect(screen.getByText('2 saved')).toBeVisible()
  })

  it('opens the next player when the opened one is removed from its profile', async () => {
    const { router } = await renderDemo('/app/shortlist', { language: 'en' })
    const user = userEvent.setup()

    const dossier = screen.getByRole('region', { name: 'Marko Kovačević' })
    await user.click(within(dossier).getByRole('button', { name: 'Remove from shortlist' }))

    expect(await screen.findByRole('region', { name: 'Ivan Horvat' })).toBeInTheDocument()
    expect(savedNames()).toEqual(['Ivan Horvat', 'Petar Filipović'])
    expect(router.state.location.search).toEqual({ listing: 'ivan-horvat' })
  })

  it('points back to Players once everyone is removed', async () => {
    await renderDemo('/app/shortlist', { language: 'en' })
    const user = userEvent.setup()

    for (const name of ['Marko Kovačević', 'Ivan Horvat', 'Petar Filipović']) {
      await user.click(screen.getByRole('button', { name: `Remove ${name} from the shortlist` }))
    }

    expect(screen.getByText(/^Your shortlist is empty\./)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Find players' })).toHaveAttribute('href', '/app')
  })

  it('reads in Croatian', async () => {
    await renderDemo('/app/shortlist', { language: 'hr' })

    expect(screen.getByRole('heading', { level: 1, name: 'Uži izbor' })).toBeVisible()
    expect(screen.getByText('spremljeno: 3')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Ukloni igrača Ivan Horvat iz užeg izbora' }),
    ).toBeVisible()
  })
})
