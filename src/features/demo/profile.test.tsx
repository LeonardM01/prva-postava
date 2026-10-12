import { screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

function statValue(list: HTMLElement, label: string) {
  return within(list).getByText(label).nextElementSibling?.textContent
}

describe('profile', () => {
  it('reads like a dossier: identity, score against the range, facts, seasons, highlights', async () => {
    await renderDemo('/app/players/ivan-horvat?position=LW', { language: 'en' })

    const dossier = screen.getByRole('region', { name: 'Ivan Horvat' })
    expect(
      within(dossier).getByText(/^Left wing · 22 · NK Borova Glava · Treća NL Centar/),
    ).toHaveTextContent('Expiring this season')
    expect(
      within(dossier).getByText(
        'Promoted in the LW list. Paid placement, marked so the order stays honest.',
      ),
    ).toBeVisible()
    expect(within(dossier).getByText('10th of 14 left wings on the list')).toBeVisible()
    expect(
      within(dossier).getByText('Scores on the list run from 53 to 99; this player has 75.'),
    ).toBeInTheDocument()

    const factList = within(dossier).getByLabelText('Facts')
    expect(statValue(factList, 'Nationality')).toBe('Croatia')
    expect(statValue(factList, 'Preferred foot')).toBe('Left')
    expect(statValue(factList, 'Height')).toBe('176 cm')
    expect(statValue(factList, 'Contract')).toBe('Expiring this season')

    const thisSeason = within(dossier).getByLabelText(/^This season/)
    expect(statValue(thisSeason, 'Matches')).toBe('24')
    expect(statValue(thisSeason, 'Minutes')).toBe('1980')
    expect(statValue(thisSeason, 'Goals')).toBe('9')
    expect(statValue(thisSeason, 'Assists')).toBe('6')
    expect(within(dossier).getByLabelText(/^Last season 2024\/25 · /)).toBeInTheDocument()

    const highlights = within(dossier).getByRole('region', { name: 'Highlights' })
    expect(within(highlights).getByText('Sample clip')).toBeVisible()
  })

  it('marks the opened row current', async () => {
    await renderDemo('/app/players/ivan-horvat?position=LW', { language: 'en' })

    const list = screen.getByRole('list', { name: 'Left wings on the list' })
    expect(within(list).getByRole('link', { name: 'Ivan Horvat' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('opens beside the list from a row', async () => {
    const { router } = await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    await user.click(screen.getByRole('link', { name: 'David Vuković' }))

    expect(await screen.findByRole('region', { name: 'David Vuković' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/app/players/david-vukovic')
    expect(router.state.location.search).toEqual({ position: 'LW' })
    expect(screen.getByRole('list', { name: 'Left wings on the list' })).toBeInTheDocument()
  })

  it('walks the list with the arrow keys and the address follows', async () => {
    const { router } = await renderDemo('/app/players/ivan-horvat?position=LW', {
      language: 'en',
    })
    const user = userEvent.setup()

    screen.getByRole('link', { name: 'Ivan Horvat' }).focus()
    await user.keyboard('{ArrowDown}')

    expect(await screen.findByRole('region', { name: 'David Vuković' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/app/players/david-vukovic')
    expect(screen.getByRole('link', { name: 'David Vuković' })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(await screen.findByRole('region', { name: 'Ivan Horvat' })).toBeInTheDocument()
  })

  it('opens the focused row with Enter', async () => {
    const { router } = await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    screen.getByRole('link', { name: 'Ivan Horvat' }).focus()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/app/players/ivan-horvat')
    })
  })

  it('opens a note under Contact, not a dialog, and Got it closes it', async () => {
    await renderDemo('/app/players/ivan-horvat?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const contact = screen.getByRole('button', { name: 'Contact player' })
    const note = screen.getByText('Contact is coming.')
    expect(note).not.toBeVisible()

    await user.click(contact)

    expect(note).toBeVisible()
    expect(contact).toHaveAttribute('aria-expanded', 'true')
    expect(contact).toHaveFocus()
    expect(note.closest('[role="dialog"]')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Got it' }))
    expect(note).not.toBeVisible()
    expect(contact).toHaveFocus()
  })

  it('opens a shared profile on its own position when the link carries none', async () => {
    await renderDemo('/app/players/marko-kovacevic', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Left wings' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Marko Kovačević' })).toBeInTheDocument()
    expect(screen.getByText('11th of 14 left wings on the list')).toBeVisible()
  })

  it('shows clean sheets for a goalkeeper', async () => {
    await renderDemo('/app/players/karlo-basic', { language: 'en' })

    const thisSeason = screen.getByLabelText(/^This season/)
    expect(statValue(thisSeason, 'Clean sheets')).toBe('9')
    expect(within(thisSeason).queryByText('Goals')).not.toBeInTheDocument()
  })

  it('shows the not-found page for an unknown listing', async () => {
    await renderDemo('/app/players/no-such-player', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  })

  it('reads in Croatian', async () => {
    await renderDemo('/app/players/ivan-horvat?position=LW', { language: 'hr' })

    const dossier = screen.getByRole('region', { name: 'Ivan Horvat' })
    expect(within(dossier).getByText('10. od 14 igrača na listi LW')).toBeVisible()
    expect(
      within(dossier).getByText(/^Lijevo krilo · 22 · NK Borova Glava · Treća NL Centar/),
    ).toHaveTextContent('Ugovor istječe ove sezone')
    expect(within(dossier).getByRole('button', { name: 'Kontaktiraj igrača' })).toBeVisible()
  })
})
