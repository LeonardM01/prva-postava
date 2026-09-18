import { expect, type Page, test } from '@playwright/test'

const ALTERNATES = [
  { hreflang: 'hr', href: 'https://prvapostava.co/' },
  { hreflang: 'en', href: 'https://prvapostava.co/en' },
  { hreflang: 'x-default', href: 'https://prvapostava.co/' },
]

async function expectAlternates(page: Page) {
  const alternates = page.locator('head link[rel="alternate"][hreflang]')
  await expect(alternates).toHaveCount(ALTERNATES.length)
  for (const { hreflang, href } of ALTERNATES) {
    await expect(
      page.locator(`head link[rel="alternate"][hreflang="${hreflang}"]`),
    ).toHaveAttribute('href', href)
  }
}

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent, which is what crawlers read.
  test.use({ javaScriptEnabled: false })

  test('the Croatian home page describes itself and names its translation', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(
      'Neka te nađe klub koji traži tvoju poziciju. Besplatno | Prva postava',
    )
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
      'content',
      'Besplatno objavi poziciju i brojke iz sezone. Klubovi filtriraju po poziciji, dobi i ligi pa se javljaju igračima koji im odgovaraju. Bez menadžera.',
    )
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://prvapostava.co/',
    )
    await expectAlternates(page)
  })

  test('the English home page describes itself and names its translation', async ({ page }) => {
    await page.goto('/en')

    await expect(page).toHaveTitle(
      'Get found by clubs looking for players. List free | Prva postava',
    )
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
      'content',
      "List your position and this season's numbers for free. Clubs filter by position, age and league, then contact the players who fit. No agent, no fee.",
    )
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://prvapostava.co/en',
    )
    await expectAlternates(page)
  })

  test('a campaign link keeps the canonical free of its query string', async ({ page }) => {
    await page.goto('/?utm_source=x')

    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://prvapostava.co/',
    )
  })

  // The first is caught by the language guard, the second matches no route at all.
  for (const path of ['/no-such-page', '/en/no-such-page']) {
    test(`the missing page ${path} asks not to be indexed`, async ({ page }) => {
      await page.goto(path)

      await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex')
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(0)
    })
  }
})

test('the sitemap lists both home page addresses with their alternates', async ({
  page,
  request,
}) => {
  const response = await request.get('/sitemap.xml')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^application\/xml/)
  const xml = await response.text()
  const urls = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'application/xml')
    if (document.querySelector('parsererror') !== null) {
      return null
    }
    // Selectors match local names in any namespace, so the namespace is read back and asserted.
    return Array.from(document.querySelectorAll('url'), (url) => ({
      loc: url.querySelector('loc')?.textContent,
      alternates: Array.from(url.querySelectorAll('link'), (link) => ({
        namespace: link.namespaceURI,
        rel: link.getAttribute('rel'),
        hreflang: link.getAttribute('hreflang'),
        href: link.getAttribute('href'),
      })),
    }))
  }, xml)
  const alternates = ALTERNATES.map((alternate) => ({
    namespace: 'http://www.w3.org/1999/xhtml',
    rel: 'alternate',
    ...alternate,
  }))
  expect(urls).toEqual([
    { loc: 'https://prvapostava.co/', alternates },
    { loc: 'https://prvapostava.co/en', alternates },
  ])
})

test('robots.txt allows every crawler and names the sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^text\/plain/)
  const robots = await response.text()
  const lines = robots.split('\n').map((line) => line.trim())
  expect(lines).toContain('User-agent: *')
  expect(lines).toContain('Allow: /')
  expect(lines).not.toContain('Disallow: /')
  expect(lines).toContain('Sitemap: https://prvapostava.co/sitemap.xml')
})
