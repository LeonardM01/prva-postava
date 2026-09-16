import { expect, type Page, test } from '@playwright/test'

const EVERY_POSITION = 'Every position on one board'
const ONE_LOOP = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', EVERY_POSITION]

// Every stop, the opening "Every position" one included, shows for 1.4 s; two loops follow it.
const STOP_MS = 1400
const TOUR_STOPS = 1 + ONE_LOOP.length * 2

function getBoard(page: Page, caption: string) {
  return page.getByRole('figure', { name: caption })
}

// The page clock is under the test's control, so the tour only advances when the test says so.
// The tour starts its clock on hydration, and any click would stop it, so the wait for
// hydration looks for React's handle on the board instead of interacting with the page.
async function openLanding(page: Page, url = '/') {
  await page.clock.install()
  await page.goto(url)
  await page.waitForFunction(() =>
    Object.keys(document.querySelector('figure') ?? {}).some((key) =>
      key.startsWith('__reactFiber$'),
    ),
  )
}

// One stop per clock step: the page needs a moment between steps to show a stop and schedule
// the next one, which a single long jump of the clock would not give it.
async function runForStops(page: Page, stops: number) {
  for (let stop = 0; stop < stops; stop += 1) {
    await page.clock.runFor(STOP_MS)
  }
}

test('the board tours the lines twice and rests on every position', async ({ page }) => {
  await openLanding(page)
  await expect(getBoard(page, EVERY_POSITION)).toBeVisible()

  for (const caption of [...ONE_LOOP, ...ONE_LOOP]) {
    await page.clock.runFor(STOP_MS)
    await expect(getBoard(page, caption)).toBeVisible()
  }

  await runForStops(page, TOUR_STOPS)
  await expect(getBoard(page, EVERY_POSITION)).toBeVisible()
  await expect(page.getByRole('button', { name: /tour|prikaz/i })).toHaveCount(0)
})

test('pointing at the board stops the tour', async ({ page }) => {
  await openLanding(page)
  await page.clock.runFor(STOP_MS)
  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()

  // The full chip shows the whole name and the compact chip the surname; only one is on screen.
  await getBoard(page, 'Goalkeepers')
    .getByText(/^(Luka )?Babić$/)
    .filter({ visible: true })
    .hover()
  await runForStops(page, TOUR_STOPS)

  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()
})

test('switching role stops the tour', async ({ page }) => {
  await openLanding(page)
  await page.clock.runFor(STOP_MS)
  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()

  await page.getByRole('main').getByRole('button', { name: "I'm a player" }).click()
  await runForStops(page, TOUR_STOPS)

  await expect(getBoard(page, 'Goalkeepers')).toBeVisible()
})

test('the tour names the lines in Croatian', async ({ page }) => {
  await openLanding(page, '/?lang=hr')

  await page.clock.runFor(STOP_MS)

  await expect(getBoard(page, 'Vratari')).toBeVisible()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the caption never changes', async ({ page }) => {
    await openLanding(page)

    await runForStops(page, TOUR_STOPS)

    await expect(getBoard(page, EVERY_POSITION)).toBeVisible()
  })
})
