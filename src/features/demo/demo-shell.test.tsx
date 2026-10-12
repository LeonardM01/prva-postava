import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

describe('demo shell', () => {
  it('labels every screen as sample data', async () => {
    await renderDemo('/app', { language: 'en' })

    expect(
      screen.getByText(
        'Demo with sample players, not real listings. Nothing here is a real person or a real club.',
      ),
    ).toBeInTheDocument()
  })

  it('has the brand, Players and Shortlist in the club seat', async () => {
    await renderDemo('/app', { language: 'en' })

    const nav = screen.getByRole('navigation', { name: 'Demo' })
    expect(within(nav).getByRole('link', { name: 'Players' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: /^Shortlist/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prva postava home page' })).toHaveAttribute(
      'href',
      '/en',
    )
  })

  it('switches seats with two links in a fixed order, Club then Player', async () => {
    await renderDemo('/app', { language: 'en' })

    const [seatSwitch] = screen.getAllByRole('group', { name: 'Viewing as' })
    if (seatSwitch === undefined) {
      throw new Error('No seat switch')
    }
    const options = within(seatSwitch).getAllByRole('link')
    expect(options.map((option) => option.textContent)).toEqual(['Club', 'Player'])
    expect(options[0]).toHaveAttribute('aria-current', 'true')
    expect(options[1]).not.toHaveAttribute('aria-current')
  })

  it('shows only My profile in the player seat, with the switch on Player', async () => {
    await renderDemo('/app/me', { language: 'en' })

    const nav = screen.getByRole('navigation', { name: 'Demo' })
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['My profile'])
    const [seatSwitch] = screen.getAllByRole('group', { name: 'Viewing as' })
    if (seatSwitch === undefined) {
      throw new Error('No seat switch')
    }
    expect(within(seatSwitch).getByRole('link', { name: 'Player' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('marks the current language in the HR | EN control', async () => {
    await renderDemo('/app', { language: 'en' })

    const [languageSwitch] = screen.getAllByRole('group', { name: 'Language' })
    if (languageSwitch === undefined) {
      throw new Error('No language switch')
    }
    expect(
      within(languageSwitch)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['HR', 'EN'])
    expect(within(languageSwitch).getByRole('button', { name: 'EN' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('renders the shell in Croatian', async () => {
    await renderDemo('/app', { language: 'hr' })

    expect(
      screen.getByText(
        'Demo s primjerima igrača, nisu pravi oglasi. Ništa ovdje nije stvarna osoba ni stvarni klub.',
      ),
    ).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Demo' })
    expect(within(nav).getByRole('link', { name: 'Igrači' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prva postava, naslovnica' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
