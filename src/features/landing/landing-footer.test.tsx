import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderLandingPage } from './render-landing-page'

describe('the landing footer', () => {
  it('opens the contact link as an email to the published address', async () => {
    await renderLandingPage('/en')

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      'mailto:neven@prvapostava.co',
    )
  })

  it('opens the same address from the Croatian footer', async () => {
    await renderLandingPage('/')

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'Kontakt' })).toHaveAttribute(
      'href',
      'mailto:neven@prvapostava.co',
    )
  })
})
