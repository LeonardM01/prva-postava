import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { type LandingPath, renderLandingPage } from './render-landing-page'

// Every stop, the opening "Every position" one included, shows for 1.4 s.
const STOP_MS = 1400
const WHOLE_TOUR_MS = STOP_MS * 12

const ONE_LOOP_CAPTIONS = [
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

// Opens the page and lets the tour reach its first line, so a later pause has a tour to stop.
async function renderTouringBoard(path: LandingPath) {
  const user = setUpUser()
  await renderLandingPage(path)
  advanceBy(STOP_MS)
  return user
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
    await renderLandingPage('/en')
    expect(getBoard('Every position on one board')).toBeVisible()

    for (const caption of [...ONE_LOOP_CAPTIONS, ...ONE_LOOP_CAPTIONS]) {
      advanceBy(STOP_MS)
      expect(getBoard(caption)).toBeVisible()
    }

    advanceBy(WHOLE_TOUR_MS)
    expect(getBoard('Every position on one board')).toBeVisible()
  })

  it('offers no button to pause the tour', async () => {
    await renderTouringBoard('/en')

    expect(
      within(getBoard('Goalkeepers')).queryByRole('button', { name: /tour/i }),
    ).not.toBeInTheDocument()
  })

  it('stops for good once the pointer is over the board', async () => {
    const user = await renderTouringBoard('/en')

    await user.hover(within(getBoard('Goalkeepers')).getByRole('list'))
    await user.unhover(within(getBoard('Goalkeepers')).getByRole('list'))
    advanceBy(WHOLE_TOUR_MS)

    expect(getBoard('Goalkeepers')).toBeVisible()
  })

  it('keeps touring when a finger lands on the board', async () => {
    const user = await renderTouringBoard('/en')

    await user.pointer({
      keys: '[TouchA>]',
      target: within(getBoard('Goalkeepers')).getByRole('list'),
    })
    advanceBy(STOP_MS)

    expect(getBoard('Defenders')).toBeVisible()
  })

  it('stops when the visitor switches role', async () => {
    const user = await renderTouringBoard('/en')

    const hero = screen.getByRole('region', { name: 'Find your next signing in one evening.' })
    await user.click(within(hero).getByRole('button', { name: "I'm a player" }))
    advanceBy(WHOLE_TOUR_MS)

    expect(getBoard('Goalkeepers')).toBeVisible()
  })

  it('stops when the visitor follows a link', async () => {
    const user = await renderTouringBoard('/en')

    const nav = screen.getByRole('navigation', { name: 'Main' })
    await user.click(within(nav).getByRole('link', { name: 'For clubs' }))
    advanceBy(WHOLE_TOUR_MS)

    expect(getBoard('Goalkeepers')).toBeVisible()
  })

  it('names the lines in Croatian', async () => {
    await renderTouringBoard('/')
    expect(getBoard('Vratari')).toBeVisible()

    advanceBy(STOP_MS)
    expect(getBoard('Braniči')).toBeVisible()
  })

  it('never runs when the visitor prefers reduced motion', async () => {
    emulateReducedMotion(true)
    await renderLandingPage('/en')

    advanceBy(WHOLE_TOUR_MS)

    expect(getBoard('Every position on one board')).toBeVisible()
  })
})
