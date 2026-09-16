import { expect, type Locator, type Page, test } from '@playwright/test'

interface LoadMotion {
  readonly ends: number[]
  readonly starts: number[]
}

declare global {
  interface Window {
    loadMotion?: LoadMotion
  }
}

// CSS animations leave no trace once they finish, so the page records when each one starts
// and ends from the very first frame.
async function recordLoadMotion(page: Page) {
  await page.addInitScript(() => {
    const motion: LoadMotion = { starts: [], ends: [] }
    Object.defineProperty(window, 'loadMotion', { value: motion })
    const capture = { capture: true }
    document.addEventListener(
      'animationstart',
      () => {
        motion.starts.push(performance.now())
      },
      capture,
    )
    document.addEventListener(
      'animationend',
      () => {
        motion.ends.push(performance.now())
      },
      capture,
    )
  })
}

async function readLoadMotion(page: Page): Promise<LoadMotion> {
  return page.evaluate(() => ({
    starts: [...(window.loadMotion?.starts ?? [])],
    ends: [...(window.loadMotion?.ends ?? [])],
  }))
}

async function waitForLoadMotionToSettle(page: Page) {
  await expect
    .poll(async () => {
      const motion = await readLoadMotion(page)
      return motion.starts.length
    })
    .toBeGreaterThan(0)
  await expect
    .poll(async () => {
      const motion = await readLoadMotion(page)
      return motion.ends.length - motion.starts.length
    })
    .toBe(0)
}

function getBoard(page: Page) {
  return page.getByRole('figure', { name: 'Every position on one board' })
}

// The full chip shows the whole name and the compact chip the surname; only one is on screen.
function getVisibleChip(board: Locator, firstName: string, lastName: string) {
  return board.getByText(new RegExp(`^(${firstName} )?${lastName}$`)).filter({ visible: true })
}

// Bašić is the first chip to travel and Horvat carries the promoted tag, which lands last.
async function measureHero(page: Page) {
  const board = getBoard(page)
  const locators = [
    page.getByRole('heading', { level: 1 }),
    board.getByText('Every position on one board', { exact: true }),
    getVisibleChip(board, 'Karlo', 'Bašić'),
    getVisibleChip(board, 'Ivan', 'Horvat'),
  ]
  return Promise.all(locators.map((locator) => locator.boundingBox()))
}

test('the load cascade plays once and settles within about a second', async ({ page }) => {
  await recordLoadMotion(page)
  await page.goto('/')
  await waitForLoadMotionToSettle(page)

  const { starts, ends } = await readLoadMotion(page)
  expect(Math.max(...ends) - Math.min(...starts)).toBeLessThan(1100)
})

test('after the cascade the hero rests exactly where the page without animations puts it', async ({
  page,
}) => {
  // Optional fonts apply only when they beat first paint, which two loads under test load do
  // not agree on. Both loads use the fallback fonts, so only the motion can move the hero.
  await page.route('**/*.woff2', (route) => route.abort())
  await recordLoadMotion(page)
  await page.goto('/')
  await waitForLoadMotionToSettle(page)
  const animated = await measureHero(page)

  await page.goto('/')
  await page.addStyleTag({ content: '*, ::before, ::after { animation: none !important; }' })
  const resting = await measureHero(page)

  expect(animated).toEqual(resting)
})

test('the cascade plays even when the visitor prefers reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await recordLoadMotion(page)
  await page.goto('/')

  await waitForLoadMotionToSettle(page)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('neither the cascade nor the web fonts shift the layout', async ({ page }) => {
  await recordLoadMotion(page)
  await page.goto('/')
  await waitForLoadMotionToSettle(page)

  const shift = await page.evaluate(() => {
    const observer = new PerformanceObserver(() => undefined)
    observer.observe({ type: 'layout-shift', buffered: true })
    // Buffered entries are already in the observer's queue, so they can be taken right away.
    const entries = observer.takeRecords() as (PerformanceEntry & { readonly value: number })[]
    observer.disconnect()
    return entries.reduce((total, entry) => total + entry.value, 0)
  })
  expect(shift).toBe(0)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the copy and the full board still show', async ({ page }) => {
    await page.goto('/')

    const board = getBoard(page)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(board.getByRole('listitem')).toHaveCount(11)
    await expect(getVisibleChip(board, 'Karlo', 'Bašić')).toBeVisible()
    await expect(getVisibleChip(board, 'Ivan', 'Horvat')).toBeVisible()
  })
})
