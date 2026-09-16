import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderLandingPage } from './render-landing-page'

// The load cascade takes about 0.9 s, then the board dwells 1.8 s on every position.
const FIRST_STOP_MS = 2720
const STOP_MS = 1400

const ONE_LOOP = [
  'Goalkeepers',
  'Defenders',
  'Midfielders',
  'Forwards',
  'Every position on one board',
]

function advanceBy(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds)
  })
}

function getBoard(caption: string) {
  return screen.getByRole('figure', { name: caption })
}

function emulateReducedMotion(isReduced: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const mediaQueryList = new EventTarget() as MediaQueryList
    return Object.assign(mediaQueryList, {
      matches: isReduced && query === '(prefers-reduced-motion: reduce)',
      media: query,
    })
  })
}

function setUpUser() {
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
}

describe('position tour', () => {
  beforeEach(() => {
    // Real time still passes so the router can settle the first render; the tour steps are advanced by hand.
    vi.useFakeTimers({ shouldAdvanceTime: true })
    emulateReducedMotion(false)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('tours the lines twice, then rests on every position', async () => {
    await renderLandingPage()
    expect(getBoard('Every position on one board')).toBeVisible()

    advanceBy(FIRST_STOP_MS)
    expect(getBoard('Goalkeepers')).toBeVisible()
    for (const caption of [...ONE_LOOP.slice(1), ...ONE_LOOP]) {
      advanceBy(STOP_MS)
      expect(getBoard(caption)).toBeVisible()
    }

    advanceBy(STOP_MS * 10)
    expect(getBoard('Every position on one board')).toBeVisible()
    expect(screen.queryByRole('button', { name: /tour$/ })).not.toBeInTheDocument()
  })

  it('stops on the current line when paused and carries on when resumed', async () => {
    const user = setUpUser()
    await renderLandingPage()
    advanceBy(FIRST_STOP_MS)

    await user.click(screen.getByRole('button', { name: 'Pause tour' }))
    advanceBy(STOP_MS * 10)

    expect(getBoard('Goalkeepers')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Resume tour' }))
    expect(screen.getByRole('button', { name: 'Pause tour' })).toBeVisible()
    advanceBy(STOP_MS)
    expect(getBoard('Defenders')).toBeVisible()
  })

  it('pauses while the pointer is over the board and stays paused after it leaves', async () => {
    const user = setUpUser()
    await renderLandingPage()
    advanceBy(FIRST_STOP_MS)

    await user.hover(within(getBoard('Goalkeepers')).getByRole('list'))
    await user.unhover(within(getBoard('Goalkeepers')).getByRole('list'))
    advanceBy(STOP_MS * 10)

    expect(getBoard('Goalkeepers')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Resume tour' })).toBeVisible()
  })

  it('pauses when the visitor switches role', async () => {
    const user = setUpUser()
    await renderLandingPage()
    advanceBy(FIRST_STOP_MS)

    await user.click(screen.getByRole('button', { name: "I'm a player" }))
    advanceBy(STOP_MS * 10)

    expect(getBoard('Goalkeepers')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Resume tour' })).toBeVisible()
  })

  it('pauses when the visitor follows a link', async () => {
    const user = setUpUser()
    await renderLandingPage()

    const nav = screen.getByRole('navigation', { name: 'Main' })
    await user.click(within(nav).getByRole('link', { name: 'For clubs' }))
    advanceBy(FIRST_STOP_MS + STOP_MS * 10)

    expect(getBoard('Every position on one board')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Resume tour' })).toBeVisible()
  })

  it('names the lines in Croatian', async () => {
    const user = setUpUser()
    await renderLandingPage('/?lang=hr')

    advanceBy(FIRST_STOP_MS)
    expect(getBoard('Vratari')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Zaustavi prikaz' }))
    expect(screen.getByRole('button', { name: 'Nastavi prikaz' })).toBeVisible()
  })

  it('never runs and offers no control when the visitor prefers reduced motion', async () => {
    emulateReducedMotion(true)
    await renderLandingPage()

    advanceBy(FIRST_STOP_MS + STOP_MS * 10)

    expect(getBoard('Every position on one board')).toBeVisible()
    expect(screen.queryByRole('button', { name: /tour$/ })).not.toBeInTheDocument()
  })
})
