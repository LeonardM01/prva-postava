import { expect, type Page, test } from '@playwright/test'

async function expectOpenGraph(page: Page, tags: Readonly<Record<string, string>>) {
  for (const [property, content] of Object.entries(tags)) {
    const tag = page.locator(`head meta[property="${property}"]`)
    await expect(tag, property).toHaveCount(1)
    await expect(tag, property).toHaveAttribute('content', content)
  }
}

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent, which is what a link scraper reads.
  test.use({ javaScriptEnabled: false })

  test('the Croatian home page shares with its Croatian preview', async ({ page }) => {
    await page.goto('/')

    await expectOpenGraph(page, {
      'og:type': 'website',
      'og:site_name': 'Prva postava',
      'og:title': 'Neka te nađe klub koji traži tvoju poziciju. Besplatno | Prva postava',
      'og:description':
        'Besplatno objavi poziciju i brojke iz sezone. Klubovi filtriraju po poziciji, dobi i ligi pa se javljaju igračima koji im odgovaraju. Bez menadžera.',
      'og:url': 'https://prvapostava.co/',
      'og:image': 'https://prvapostava.co/og-hr.png',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
      'og:image:alt':
        'Logo Prva postava i poruka Oglasi se besplatno. Neka te nađe klub koji traži tvoju poziciju.',
      'og:locale': 'hr_HR',
      'og:locale:alternate': 'en_US',
    })
    await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )
  })

  test('the English home page shares with its English preview', async ({ page }) => {
    await page.goto('/en')

    await expectOpenGraph(page, {
      'og:type': 'website',
      'og:site_name': 'Prva postava',
      'og:title': 'Get found by clubs looking for players. List free | Prva postava',
      'og:description':
        "List your position and this season's numbers for free. Clubs filter by position, age and league, then contact the players who fit. No agent, no fee.",
      'og:url': 'https://prvapostava.co/en',
      'og:image': 'https://prvapostava.co/og-en.png',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
      'og:image:alt':
        'Prva postava logo with the line List free. Get found by clubs that need your position.',
      'og:locale': 'en_US',
      'og:locale:alternate': 'hr_HR',
    })
    await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )
  })

  test('a campaign link shares the address without its query string', async ({ page }) => {
    await page.goto('/?utm_source=x')

    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://prvapostava.co/',
    )
  })
})

for (const path of ['/og-hr.png', '/og-en.png']) {
  test(`${path} is served as a 1200 by 630 PNG`, async ({ request }) => {
    const response = await request.get(path)

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
    // The IHDR chunk always comes first: width and height are big-endian at bytes 16 and 20.
    const png = await response.body()
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
  })
}
