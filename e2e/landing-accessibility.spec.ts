import { AxeBuilder } from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// The position tour dims chips mid-fade, which axe would read as low contrast. Without it the
// page holds still once the one-off load cascade has landed.
test.use({ reducedMotion: 'reduce' })

async function waitForPageToSettle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.allSettled(document.getAnimations().map((animation) => animation.finished))
  })
}

async function findViolations(page: Page) {
  await waitForPageToSettle(page)
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  // Rule and element are enough to find the problem; the full axe report is noise in a diff.
  return results.violations.map((violation) => ({
    rule: violation.id,
    elements: violation.nodes.map((node) => node.target.join(' ')),
  }))
}

const LANDING_PAGES = [
  { lang: 'hr', path: '/' },
  { lang: 'en', path: '/en' },
] as const

for (const { lang, path } of LANDING_PAGES) {
  test(`the landing page has no WCAG A or AA violations in ${lang}`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    expect(await findViolations(page)).toEqual([])
  })
}

test('the club side of the page has no WCAG A or AA violations', async ({ page }) => {
  await page.goto('/en')
  const hero = page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })
  await hero.getByRole('button', { name: 'I scout for a club' }).click()
  await expect(hero.getByRole('link', { name: 'Search players by position' })).toBeVisible()

  expect(await findViolations(page)).toEqual([])
})

test('the CTA form error has no WCAG A or AA violations', async ({ page }) => {
  await page.goto('/en')
  const band = page.getByRole('region', { name: 'Get in the lineup.' })
  await band.getByRole('textbox', { name: 'Email' }).fill('ivan.horvat')
  await band.getByRole('button', { name: 'List yourself, free' }).click()
  await expect(band.getByRole('alert')).toBeVisible()

  expect(await findViolations(page)).toEqual([])
})
