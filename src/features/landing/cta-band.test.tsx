import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { joinLineup } from './join-lineup.functions'
import { type LineupSignup } from './lineup-signup-schema'
import { renderLandingPage } from './render-landing-page'

// The server function needs the Start server runtime, so the network boundary is stubbed.
vi.mock('./join-lineup.functions', () => ({ joinLineup: vi.fn() }))

const joinLineupMock = vi.mocked(joinLineup)

const CLUB_HEADLINE = 'Find your next signing in one evening.'
const PLAYER_HEADLINE = "Get in front of every club that's searching."

// A signup the test answers when it chooses, so the pending state can be observed.
function holdSignup() {
  const pending = Promise.withResolvers<LineupSignup>()
  joinLineupMock.mockReturnValue(pending.promise)
  return pending.resolve
}

function getLinkTarget(link: HTMLElement) {
  const { hash } = new URL(link.getAttribute('href') ?? '', 'http://localhost')
  return document.querySelector(hash)
}

function getBand(name = 'Get in the lineup.') {
  return screen.getByRole('region', { name })
}

function getHero(headline: string) {
  return screen.getByRole('region', { name: headline })
}

beforeEach(() => {
  joinLineupMock.mockReset()
})

describe('CTA band', () => {
  it('is where the nav and the hero button send visitors', async () => {
    await renderLandingPage()

    const band = getBand()
    expect(
      within(band).getByText(
        'Pick a side and leave an email. Players list for free; clubs get the pool once their membership is active.',
      ),
    ).toBeVisible()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(getLinkTarget(within(nav).getByRole('link', { name: 'Log in' }))).toBe(band)
    expect(getLinkTarget(within(nav).getByRole('link', { name: 'Search players' }))).toBe(band)
    const heroButton = within(getHero(CLUB_HEADLINE)).getByRole('link', {
      name: 'Search players by position',
    })
    expect(getLinkTarget(heroButton)).toBe(band)
  })

  it('offers the role switch, a labelled email field and the club button', async () => {
    await renderLandingPage()

    const band = getBand()
    const roleSwitch = within(band).getByRole('group', { name: 'Pick a side' })
    expect(within(roleSwitch).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    const email = within(band).getByRole('textbox', { name: 'Email' })
    expect(email).toHaveAttribute('placeholder', 'name@club.hr')
    expect(email).toHaveValue('')
    expect(within(band).getByRole('button', { name: 'Search players by position' })).toBeEnabled()
  })

  it('shows no error while the visitor is still typing', async () => {
    const user = userEvent.setup()
    await renderLandingPage()

    const email = within(getBand()).getByRole('textbox', { name: 'Email' })
    await user.type(email, 'ivan.horvat')
    await user.tab()

    expect(screen.queryByText('Enter an email address like name@club.hr')).not.toBeInTheDocument()
    expect(email).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('names the fix under the field when an invalid address is submitted', async () => {
    const user = userEvent.setup()
    await renderLandingPage()

    const band = getBand()
    const email = within(band).getByRole('textbox', { name: 'Email' })
    await user.type(email, 'ivan.horvat')
    await user.click(within(band).getByRole('button', { name: 'Search players by position' }))

    expect(await within(band).findByRole('alert')).toHaveTextContent(
      'Enter an email address like name@club.hr',
    )
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Enter an email address like name@club.hr')
    expect(email).toHaveFocus()
    expect(joinLineupMock).not.toHaveBeenCalled()
  })

  it('treats an empty field as an invalid address', async () => {
    const user = userEvent.setup()
    await renderLandingPage()

    const band = getBand()
    await user.click(within(band).getByRole('button', { name: 'Search players by position' }))

    expect(await within(band).findByRole('alert')).toHaveTextContent(
      'Enter an email address like name@club.hr',
    )
    expect(joinLineupMock).not.toHaveBeenCalled()
  })

  it('sends a valid address, holds the button while sending, then confirms', async () => {
    const user = userEvent.setup()
    const answerSignup = holdSignup()
    await renderLandingPage()

    const band = getBand()
    await user.type(within(band).getByRole('textbox', { name: 'Email' }), 'ivan@nk-kustosija.hr')
    await user.click(within(band).getByRole('button', { name: 'Search players by position' }))

    const sendingButton = await within(band).findByRole('button', { name: 'Sending…' })
    expect(sendingButton).toBeDisabled()
    expect(joinLineupMock).toHaveBeenCalledExactlyOnceWith({
      data: { role: 'club', email: 'ivan@nk-kustosija.hr' },
    })

    answerSignup({ role: 'club', email: 'ivan@nk-kustosija.hr' })

    expect(await within(band).findByRole('heading', { name: "You're on the list." })).toHaveFocus()
    expect(
      within(band).getByText("We'll write to ivan@nk-kustosija.hr to finish your club account."),
    ).toBeVisible()
    expect(within(band).queryByRole('textbox')).not.toBeInTheDocument()
    expect(within(band).queryByRole('button')).not.toBeInTheDocument()
  })

  it('lets the visitor try again when the signup does not go through', async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    joinLineupMock.mockRejectedValue(new Error('Network down'))
    await renderLandingPage()

    const band = getBand()
    await user.type(within(band).getByRole('textbox', { name: 'Email' }), 'ivan@nk-kustosija.hr')
    await user.click(within(band).getByRole('button', { name: 'Search players by position' }))

    expect(await within(band).findByRole('alert')).toHaveTextContent(
      "Your email didn't reach us. Try again.",
    )
    expect(within(band).getByRole('button', { name: 'Search players by position' })).toBeEnabled()
    expect(within(band).getByRole('textbox', { name: 'Email' })).toHaveValue('ivan@nk-kustosija.hr')
    expect(consoleError).toHaveBeenCalled()
  })

  it('keeps its role switch in step with the hero', async () => {
    const user = userEvent.setup()
    await renderLandingPage()

    const band = getBand()
    await user.click(within(band).getByRole('button', { name: "I'm a player" }))

    const playerHero = await screen.findByRole('region', { name: PLAYER_HEADLINE })
    expect(within(playerHero).getByRole('button', { name: "I'm a player" })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(band).getByRole('button', { name: 'List yourself, free' })).toBeVisible()

    await user.click(within(playerHero).getByRole('button', { name: 'I scout for a club' }))

    expect(await screen.findByRole('region', { name: CLUB_HEADLINE })).toBeVisible()
    expect(within(band).getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(band).getByRole('button', { name: 'Search players by position' })).toBeVisible()
  })

  it('confirms a player signup with the player wording', async () => {
    const user = userEvent.setup()
    const answerSignup = holdSignup()
    await renderLandingPage()

    const band = getBand()
    await user.click(within(band).getByRole('button', { name: "I'm a player" }))
    await user.type(within(band).getByRole('textbox', { name: 'Email' }), 'luka@mail.hr')
    await user.click(await within(band).findByRole('button', { name: 'List yourself, free' }))

    expect(joinLineupMock).toHaveBeenCalledExactlyOnceWith({
      data: { role: 'player', email: 'luka@mail.hr' },
    })
    answerSignup({ role: 'player', email: 'luka@mail.hr' })

    expect(
      await within(band).findByText(
        "We'll write to luka@mail.hr to finish the profile clubs see when they search your position.",
      ),
    ).toBeVisible()
  })

  it('carries the band and its form states in Croatian', async () => {
    const user = userEvent.setup()
    const answerSignup = holdSignup()
    await renderLandingPage('/?lang=hr')

    const band = getBand('Uđi u prvu postavu.')
    const email = within(band).getByRole('textbox', { name: 'E-mail' })
    expect(email).toHaveAttribute('placeholder', 'ime@klub.hr')
    const submit = within(band).getByRole('button', { name: 'Pretraži igrače po poziciji' })

    await user.click(submit)
    expect(await within(band).findByRole('alert')).toHaveTextContent(
      'Upiši e-mail adresu u obliku ime@klub.hr',
    )

    await user.type(email, 'ivan@nk-kustosija.hr')
    await user.click(submit)
    expect(await within(band).findByRole('button', { name: 'Slanje…' })).toBeDisabled()

    answerSignup({ role: 'club', email: 'ivan@nk-kustosija.hr' })
    expect(await within(band).findByRole('heading', { name: 'Na popisu si.' })).toBeVisible()
    expect(
      within(band).getByText('Javit ćemo ti se na ivan@nk-kustosija.hr da dovršiš račun kluba.'),
    ).toBeVisible()
  })
})
