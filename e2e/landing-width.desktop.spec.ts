import { expect, type Locator, type Page, test } from '@playwright/test'

// The design is drawn at 1440 px with 64 px gutters; wider screens centre that frame.
const DESIGN_WIDTH = 1440
const GUTTER = 64
const WIDE_SCREEN = { width: 2560, height: 1440 }

// Reduced motion keeps the position tour from renaming the board while it is measured.
test.use({ viewport: WIDE_SCREEN, reducedMotion: 'reduce' })

async function measure(locator: Locator) {
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  return box ?? { x: 0, y: 0, width: 0, height: 0 }
}

async function measureEdges(page: Page) {
  const nav = page.getByRole('navigation', { name: 'Main' })
  const brand = await measure(nav.getByRole('link', { name: 'Prva postava' }))
  const navButton = await measure(nav.getByRole('link', { name: 'Search players' }))
  const headline = await measure(page.getByRole('heading', { level: 1 }))
  const board = await measure(page.getByRole('figure', { name: 'Every position on one board' }))
  const footerNote = await measure(
    page.getByRole('contentinfo').getByText(/^© \d{4} Prva postava$/),
  )
  return {
    navLeft: brand.x,
    navRight: navButton.x + navButton.width,
    heroLeft: headline.x,
    heroRight: board.x + board.width,
    footerRight: footerNote.x + footerNote.width,
  }
}

test('on a screen wider than the design the page keeps the 1440 px frame, centred', async ({
  page,
}) => {
  await page.goto('/')

  const frameLeft = (WIDE_SCREEN.width - DESIGN_WIDTH) / 2 + GUTTER
  const frameRight = WIDE_SCREEN.width - frameLeft
  const edges = await measureEdges(page)

  expect(edges.navLeft).toBeCloseTo(frameLeft, 0)
  expect(edges.heroLeft).toBeCloseTo(frameLeft, 0)
  expect(edges.navRight).toBeCloseTo(frameRight, 0)
  expect(edges.heroRight).toBeCloseTo(frameRight, 0)
  expect(edges.footerRight).toBeCloseTo(frameRight, 0)
})
