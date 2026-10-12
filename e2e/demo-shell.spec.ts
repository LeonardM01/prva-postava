import { expect, test } from '@playwright/test'

import { languageCookie } from './demo-helpers'

const DEMO_PATHS = [
  '/app',
  '/app?position=LW',
  '/app/players/ivan-horvat',
  '/app/shortlist',
  '/app/me',
] as const

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent: the first render must already
  // be in the right language, or the visitor sees it flash.
  test.use({ javaScriptEnabled: false })

  test('the language comes from the cookie', async ({ page, baseURL }) => {
    await page.context().addCookies([{ name: 'lang', value: 'en', url: baseURL }])
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'hr' })
    await page.goto('/app')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Players')
  })

  test('without a cookie the language comes from the browser', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en;q=0.9' })
    await page.goto('/app')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Players')
  })

  test.describe('for a browser in neither language', () => {
    // The browser derives Accept-Language from its locale.
    test.use({ locale: 'de-DE' })

    test('the demo is in Croatian', async ({ page }) => {
      await page.goto('/app')

      await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Igrači')
    })
  })

  for (const path of DEMO_PATHS) {
    test(`${path} asks not to be indexed and says it is sample data`, async ({ page }) => {
      await page.goto(path)

      await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      )
      await expect(
        page.getByText(/^Demo s primjerima igrača|^Demo with sample players/),
      ).not.toHaveCount(0)
    })
  }

  test('an unknown profile is not found and not indexed', async ({ page }) => {
    const response = await page.goto('/app/players/no-such-player')

    expect(response?.status()).toBe(404)
    await expect(page.locator('head meta[name="robots"]').first()).toHaveAttribute(
      'content',
      /noindex/,
    )
  })
})

test('a ?lang= link stores the language and drops the parameter', async ({ page }) => {
  await page.goto('/app?lang=en&position=LW')

  await expect(page).toHaveURL(/\/app\?position=LW$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(await languageCookie(page)).toBe('en')
})

test('robots.txt keeps crawlers out of the demo', async ({ request }) => {
  const response = await request.get('/robots.txt')

  expect(await response.text()).toContain('Disallow: /app')
})

test('the sitemap lists no demo address', async ({ request }) => {
  const response = await request.get('/sitemap.xml')

  expect(await response.text()).not.toContain('/app')
})
