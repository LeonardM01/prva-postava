import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderLandingPage } from './render-landing-page'

function getLinkTarget(link: HTMLElement) {
  const { hash } = new URL(link.getAttribute('href') ?? '', 'http://localhost')
  return document.querySelector(hash)
}

// Reads the value the fact sheet pairs with a label; the label may carry a short form for phones.
function getStat(factSheet: HTMLElement, label: string) {
  const terms = within(factSheet).getAllByRole('term')
  const values = within(factSheet).getAllByRole('definition')
  expect(values).toHaveLength(terms.length)
  const index = terms.findIndex((term) => term.textContent.startsWith(label))
  return index === -1 ? undefined : values[index]?.textContent
}

describe('players section', () => {
  it('is the section the "For players" nav link lands on', async () => {
    await renderLandingPage('/en')

    const section = screen.getByRole('region', {
      name: 'See how many clubs looked at your profile this week.',
    })
    expect(
      within(section).getByText(/^Listing your profile and your season's numbers costs nothing/),
    ).toBeVisible()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(getLinkTarget(within(nav).getByRole('link', { name: 'For players' }))).toBe(section)
  })

  it('links to the player profile demo', async () => {
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample player profile, not a real listing' })
    expect(getLinkTarget(screen.getByRole('link', { name: 'See a player profile' }))).toBe(demo)
  })

  it('shows the fact sheet of the promoted left wing', async () => {
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample player profile, not a real listing' })
    expect(within(demo).getByText('Ivan Horvat')).toBeVisible()
    expect(within(demo).getByText(/^Left wing · 22 · NK Kustošija/)).toBeVisible()
    expect(within(demo).getByText('Promoted in the LW list until 30 Sep')).toBeVisible()
    expect(getStat(demo, 'Matches')).toBe('24')
    expect(getStat(demo, 'Goals')).toBe('9')
    expect(getStat(demo, 'Assists')).toBe('6')
    expect(getStat(demo, 'Minutes')).toBe('1980')
    expect(getStat(demo, 'Seen by clubs this week')).toBe('7')
    expect(within(demo).getByText('Promote me to the top of LW')).toBeVisible()
  })

  it('keeps the promote control out of the tab order and away from buttons', async () => {
    const user = userEvent.setup()
    await renderLandingPage('/en')

    const demo = screen.getByRole('figure', { name: 'Sample player profile, not a real listing' })
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

    const section = screen.getByRole('region', {
      name: 'Vidi koliko je klubova ovaj tjedan pogledalo tvoj profil.',
    })
    expect(within(section).getByRole('link', { name: 'Pogledaj profil igrača' })).toBeVisible()
    const demo = within(section).getByRole('figure', {
      name: 'Primjer profila igrača, nije pravi oglas',
    })
    expect(within(demo).getByText(/^Lijevo krilo · 22 · NK Kustošija/)).toBeVisible()
    expect(within(demo).getByText('Promoviran na listi LK do 30. rujna')).toBeVisible()
    expect(getStat(demo, 'Utakmice')).toBe('24')
    expect(getStat(demo, 'Klubovi su pogledali ovaj tjedan')).toBe('7')
    expect(within(demo).getByText('Promoviraj me na vrh liste LK')).toBeVisible()
  })
})
