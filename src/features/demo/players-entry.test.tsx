import { screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

const LEFT_WINGS_BY_RANK = [
  'Ivan Horvat',
  'David Vuković',
  'Leon Pavlović',
  'Luka Lovrić',
  'Edin Begović',
  'Petar Filipović',
  'Domagoj Pavlović',
  'Zvonimir Petrović',
  'Toni Mandić',
  'Nemanja Stanković',
  'Luka Babić',
  'Marko Kovačević',
  'Niko Galić',
  'Toni Brkić',
]

function rowNames(listName: string) {
  const list = screen.getByRole('list', { name: listName })
  return within(list)
    .getAllByRole('listitem')
    .map((row) => within(row).getAllByRole('link')[0]?.textContent)
}

describe('players entry', () => {
  it('opens on the search composer with no rows', async () => {
    await renderDemo('/app', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Players' })).toBeVisible()
    const composer = screen.getByRole('form', { name: 'Search players' })
    expect(within(composer).getByRole('button', { name: /Choose a position/ })).toBeVisible()
    expect(within(composer).getByRole('button', { name: /18 to 34/ })).toBeVisible()
    expect(within(composer).getByRole('button', { name: /Any league/ })).toBeVisible()
    expect(within(composer).getByRole('button', { name: /Any score/ })).toBeVisible()
    expect(within(composer).getByRole('button', { name: /Any contract/ })).toBeVisible()
    expect(screen.queryByRole('list', { name: 'Left wings on the list' })).not.toBeInTheDocument()
  })

  it('offers every position by line with counts that add up to the whole list', async () => {
    await renderDemo('/app', { language: 'en' })

    const chooser = screen.getByRole('dialog', { name: 'Position · required' })
    expect(
      ['Goalkeeper', 'Defence', 'Midfield', 'Attack'].map((line) =>
        within(chooser).getByRole('group', { name: line }),
      ),
    ).toHaveLength(4)
    const counts = within(chooser)
      .getAllByRole('button', { name: /· \d+$/ })
      .map((button) => Number(button.textContent.split('· ', 2)[1]))
    expect(counts).toHaveLength(12)
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(88)
    expect(within(chooser).getByRole('button', { name: 'Left wing · 14' })).toBeVisible()
  })

  it('asks for a position before it searches', async () => {
    const { router } = await renderDemo('/app', { language: 'en' })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Choose a position first: every list is per position.',
    )
    expect(router.state.location.search).toEqual({})
  })

  it('searches the chosen position with the chosen filters', async () => {
    const { router } = await renderDemo('/app', { language: 'en' })
    const user = userEvent.setup()

    const chooser = screen.getByRole('dialog', { name: 'Position · required' })
    await user.click(within(chooser).getByRole('button', { name: 'Left wing · 14' }))
    const contract = screen.getByRole('dialog', { name: 'Contract' })
    await user.click(within(contract).getByRole('button', { name: 'Free agent' }))
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Left wings' })).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ position: 'LW', contract: ['freeAgent'] })
  })

  it('opens a position straight from the quick list', async () => {
    const { router } = await renderDemo('/app', { language: 'en' })
    const user = userEvent.setup()

    const quick = screen.getByRole('region', { name: 'Or go straight to a position' })
    await user.click(within(quick).getByRole('button', { name: 'Striker · 7' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Strikers' })).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ position: 'ST' })
  })

  it('falls back to the composer for an unknown position', async () => {
    await renderDemo('/app?position=XX', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Players' })).toBeVisible()
  })
})

describe('the searched list', () => {
  it('opens straight on a shared position: promoted first, then by score', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })

    expect(screen.getByRole('heading', { level: 1, name: 'Left wings' })).toBeVisible()
    expect(screen.getByText('14 players')).toBeVisible()
    expect(rowNames('Left wings on the list')).toEqual(LEFT_WINGS_BY_RANK)
  })

  it('shows on each row who and where, the score and this season', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })

    const list = screen.getByRole('list', { name: 'Left wings on the list' })
    const [promoted] = within(list).getAllByRole('listitem')
    if (promoted === undefined) {
      throw new Error('No rows')
    }
    expect(within(promoted).getByRole('link', { name: 'Ivan Horvat' })).toHaveAttribute(
      'href',
      '/app/players/ivan-horvat?position=LW',
    )
    expect(within(promoted).getByText('Promoted')).toBeVisible()
    expect(within(promoted).getByText('NK Borova Glava · Treća NL Centar')).toBeVisible()
    expect(within(promoted).getByText('75')).toBeVisible()
    expect(within(promoted).getByText('24 m · 9 g · 6 a')).toBeVisible()
  })

  it('shows clean sheets for goalkeepers', async () => {
    await renderDemo('/app?position=GK', { language: 'en' })

    const list = screen.getByRole('list', { name: 'Goalkeepers on the list' })
    expect(within(list).getByText(/^24 m · 9 cs$/)).toBeVisible()
  })

  it('leaves the dossier empty until a row is opened', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })

    expect(screen.getByText('Open a row to read the dossier.')).toBeVisible()
    expect(screen.getByText('1–14 of 14 · Promoted first, then by score')).toBeVisible()
  })

  it('reads in Croatian', async () => {
    await renderDemo('/app?position=LW', { language: 'hr' })

    expect(screen.getByRole('heading', { level: 1, name: 'Lijeva krila' })).toBeVisible()
    expect(screen.getByText('14 igrača')).toBeVisible()
    expect(rowNames('Lijeva krila na listi')).toEqual(LEFT_WINGS_BY_RANK)
    expect(screen.getByText('1–14 od 14 · Prvo promovirani, zatim po ocjeni')).toBeVisible()
    expect(screen.getByText('Otvori red da pročitaš dosje.')).toBeVisible()
  })
})
