import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderLandingPage } from './render-landing-page'

function getLinkTarget(link: HTMLElement) {
  const { hash } = new URL(link.getAttribute('href') ?? '', 'http://localhost')
  return document.querySelector(hash)
}

describe('clubs section', () => {
  it('is the section the "For clubs" nav link lands on', async () => {
    await renderLandingPage('/en')

    const section = screen.getByRole('region', {
      name: 'Clubs filter the whole pool, not the one match they could drive to.',
    })
    expect(
      within(section).getByText(
        /^Filter by position, age and league, then by the season's numbers\./,
      ),
    ).toBeVisible()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(getLinkTarget(within(nav).getByRole('link', { name: 'For clubs' }))).toBe(section)
  })

  it('links to the club search demo', async () => {
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample club search, not real listings' })
    expect(getLinkTarget(screen.getByRole('link', { name: 'See how a club searches' }))).toBe(demo)
  })

  it('shows the search results as a table with a header row', async () => {
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample club search, not real listings' })
    const table = within(demo).getByRole('table')
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(headers).toEqual(
      expect.arrayContaining(['Pos', 'Player', 'Age', 'Matches', 'Goals', 'Assists', 'Min']),
    )

    const rows = within(table).getAllByRole('row')
    const headerRows = rows.filter((row) => within(row).queryAllByRole('columnheader').length > 0)
    const playerRows = rows.filter((row) => within(row).queryByRole('rowheader') !== null)
    expect(headerRows).toHaveLength(1)
    expect(playerRows).toHaveLength(3)
    expect(playerRows.map((row) => within(row).getByRole('rowheader').textContent)).toEqual([
      expect.stringMatching(/^Ivan Horvat/),
      expect.stringMatching(/^Marko Kovačević/),
      expect.stringMatching(/^Luka Babić/),
    ])
  })

  it('announces the promoted row with its tag', async () => {
    await renderLandingPage('/en')

    const table = screen.getByRole('table')
    expect(within(table).getByRole('rowheader', { name: /^Ivan Horvat Promoted\b/ })).toBeVisible()
    expect(
      within(table).queryByRole('rowheader', { name: /^Marko Kovačević Promoted\b/ }),
    ).toBeNull()
    const promotedRow = within(table).getByRole('row', { name: /Ivan Horvat/ })
    expect(
      within(promotedRow)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(expect.arrayContaining(['22', '24', '9', '6', '1980']))
  })

  it('shows the filters and the actions a club takes', async () => {
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample club search, not real listings' })
    const filters = within(within(demo).getByRole('list', { name: 'Filters' })).getAllByRole(
      'listitem',
    )
    expect(filters.map((filter) => filter.textContent)).toEqual(
      expect.arrayContaining([
        'Position: LW',
        'Age 18–24',
        'Min. 15 matches',
        '3. NL and below',
        '+ Add filter',
      ]),
    )
    expect(within(demo).getByText('Contact player')).toBeVisible()
    expect(within(demo).getByText('Save this search')).toBeVisible()
    expect(within(demo).getAllByText('Save')).toHaveLength(3)
  })

  it('keeps the demo controls out of the tab order and away from buttons', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample club search, not real listings' })
    expect(within(demo).queryAllByRole('button')).toEqual([])
    expect(within(demo).queryAllByRole('link')).toEqual([])

    const footerLink = screen.getByRole('link', { name: 'Contact' })
    while (document.activeElement !== footerLink) {
      await user.tab()
      expect(demo).not.toContainElement(document.activeElement as HTMLElement | null)
    }
  })

  it('carries the section in Croatian', async () => {
    await renderLandingPage('/')

    expect(
      screen.getByRole('region', {
        name: 'Klubovi filtriraju cijelu bazu, a ne samo utakmicu do koje su mogli doći.',
      }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pogledaj kako klub pretražuje' })).toBeVisible()
    const table = screen.getByRole('table')
    expect(within(table).getByRole('columnheader', { name: 'Utakmice' })).toBeInTheDocument()
    expect(
      within(table).getByRole('rowheader', { name: /^Ivan Horvat Promoviran\b/ }),
    ).toBeVisible()
    expect(screen.getByText('Pozicija: LK')).toBeInTheDocument()
    expect(screen.getByText('Kontaktiraj igrača')).toBeInTheDocument()
  })
})
