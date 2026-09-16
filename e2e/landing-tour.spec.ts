import { expect, type Page, test } from '@playwright/test'

const EVERY_POSITION = 'Every position on one board'
const ONE_LOOP = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', EVERY_POSITION]

// The first line shows 2.72 s after load, then the tour moves on every 1.4 s for two loops.
const FIRST_STOP_MS = 3000
const STOP_MS = 1400
const TOUR_STOPS = ONE_LOOP.length * 2

function getBoard(page: Page, caption: string) {
  return page.getByRole('figure', { name: caption })
}

// The page clock is under the test's control, so the tour only advances when the test says so.
async function openLanding(page: Page, url = '/') {
  await page.clock.install()
  await page.goto(url)
  await expect(page.getByRole('button', { name: /tour$|prikaz$/ })).toBeVisible()
}

// One stop per clock step: the page needs a moment between steps to show a stop and schedule
// the next one, which a single long jump of the clock would not give it.
async function runForStops(page: Page, stops: number) {
  for (let stop = 0; stop < stops; stop += 1) {
    await page.clock.runFor(STOP_MS)
  }
}

test('the board tours the lines until the visitor pauses it', async ({ page }) => {
  await openLanding(page)
  await expect(getBoard(page, EVERY_POSITION)).toBeVisible()

  await page.clock.runFor(FIRST_STOP_MS)
  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()

  await page.getByRole('button', { name: 'Pause tour' }).click()
  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible()
  await runForStops(page, TOUR_STOPS)
  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()

  // Resuming proves the clock steps above would have moved a running tour on.
  await page.getByRole('button', { name: 'Resume tour' }).click()
  await runForStops(page, 2)
  await expect(getBoard(page, 'Midfielders')).toBeVisible()
})

test('the tour runs two loops, rests on every position and can go again', async ({ page }) => {
  await openLanding(page)
  await page.clock.runFor(FIRST_STOP_MS)

  for (const caption of [...ONE_LOOP, ...ONE_LOOP]) {
    await expect(getBoard(page, caption)).toBeVisible()
    await page.clock.runFor(STOP_MS)
  }

  await runForStops(page, TOUR_STOPS)
  await expect(getBoard(page, EVERY_POSITION)).toBeVisible()

  await page.getByRole('button', { name: 'Resume tour' }).click()
  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()
})

test('pointing at the board pauses the tour', async ({ page }) => {
  await openLanding(page)
  await page.clock.runFor(FIRST_STOP_MS)

  // The full chip shows the whole name and the compact chip the surname; only one is on screen.
  await getBoard(page, 'Goalkeepers')
    .getByText(/^(Luka )?Babić$/)
    .filter({ visible: true })
    .hover()

  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible()
})

test('switching role pauses the tour', async ({ page }) => {
  await openLanding(page)

  await page.getByRole('main').getByRole('button', { name: "I'm a player" }).click()

  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible()
  await page.clock.runFor(FIRST_STOP_MS)
  await runForStops(page, 2)
  await expect(getBoard(page, EVERY_POSITION)).toBeVisible()
})

test('the tour names the lines in Croatian', async ({ page }) => {
  await openLanding(page, '/?lang=hr')

  await page.clock.runFor(FIRST_STOP_MS)

  await expect(getBoard(page, 'Vratari')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Zaustavi prikaz' })).toBeVisible()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the caption never changes and there is no pause control', async ({ page }) => {
    await page.clock.install()
    await page.goto('/')
    // The role switch answering proves the page has hydrated, so the tour had its chance to
    // start. Had it started, the click would have paused it and left a "Resume tour" control.
    await page.getByRole('main').getByRole('button', { name: "I'm a player" }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      "Get in front of every club that's searching.",
    )

    await page.clock.runFor(FIRST_STOP_MS)
    await runForStops(page, TOUR_STOPS)

    await expect(getBoard(page, EVERY_POSITION)).toBeVisible()
    await expect(page.getByRole('button', { name: /tour$/ })).toHaveCount(0)
  })
})
