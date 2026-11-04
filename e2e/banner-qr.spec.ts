import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// The QR code on the match-day banners encodes /banner-qr.
const SIDES = [
  { door: 'Ja sam igrač', role: 'player', headline: 'Ne čekaj da skaut dođe na tvoju utakmicu.' },
  {
    door: 'Tražim igrače za klub',
    role: 'club',
    headline: 'Nađi sljedeće pojačanje u jednoj večeri.',
  },
] as const

for (const side of SIDES) {
  test(`the chooser opens the home page on the ${side.role} side`, async ({ page }) => {
    await page.goto('/banner-qr')
    await page
      .getByRole('navigation', { name: 'Odaberi stranu' })
      .getByRole('link', { name: side.door })
      .click()

    await expect(page.getByRole('heading', { level: 1, name: side.headline })).toBeVisible()
    const url = new URL(page.url())
    expect(url.pathname).toBe('/')
    expect(url.searchParams.get('role')).toBe(side.role)
    expect(url.searchParams.get('utm_source')).toBe('banner')
  })
}

test('the chooser has no WCAG A or AA violations', async ({ page }) => {
  await page.goto('/banner-qr')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.allSettled(document.getAnimations().map((animation) => animation.finished))
  })

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  expect(results.violations.map((violation) => violation.id)).toEqual([])
})

test('the banner address answers without a redirect and stays out of search', async ({
  request,
}) => {
  const response = await request.get('/banner-qr', { maxRedirects: 0 })

  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('<meta content="noindex" name="robots"/>')
})

test('the server renders the club side when the link asks for it', async ({ request }) => {
  const response = await request.get('/?role=club')

  expect(await response.text()).toContain('Nađi sljedeće pojačanje u jednoj večeri.')
})
