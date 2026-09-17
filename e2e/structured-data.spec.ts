import { expect, type Page, test } from '@playwright/test'

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://prvapostava.co/#organization',
  name: 'Prva postava',
  url: 'https://prvapostava.co',
  logo: {
    '@type': 'ImageObject',
    url: 'https://prvapostava.co/icon-512.png',
    width: 512,
    height: 512,
  },
}

function websiteIn(language: string) {
  return {
    '@type': 'WebSite',
    '@id': 'https://prvapostava.co/#website',
    name: 'Prva postava',
    url: 'https://prvapostava.co',
    inLanguage: language,
    publisher: { '@id': 'https://prvapostava.co/#organization' },
  }
}

async function readStructuredData(page: Page): Promise<unknown> {
  const scripts = page.locator('script[type="application/ld+json"]')
  await expect(scripts).toHaveCount(1)
  await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(1)
  const source = await scripts.textContent()
  expect(source).not.toBeNull()
  // Fields added only once the fact is real: no company, public email or social profile yet,
  // and Google retired the sitelinks search box that `SearchAction` fed.
  expect(source).not.toMatch(/legalName|email|sameAs|SearchAction/)
  return JSON.parse(source ?? '')
}

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent, which is what crawlers read.
  test.use({ javaScriptEnabled: false })

  for (const { path, language } of [
    { path: '/', language: 'hr' },
    { path: '/en', language: 'en' },
  ]) {
    test(`${path} names the organisation and the website in ${language}`, async ({ page }) => {
      await page.goto(path)

      expect(await readStructuredData(page)).toEqual({
        '@context': 'https://schema.org',
        '@graph': [ORGANIZATION, websiteIn(language)],
      })
    })
  }
})

test('the structured data logo is served as a 512 by 512 PNG', async ({ request }) => {
  // The logo points at production, so the same path is fetched from the server under test.
  const response = await request.get(new URL(ORGANIZATION.logo.url).pathname)

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('image/png')
  // The IHDR chunk always comes first: width and height are big-endian at bytes 16 and 20.
  const png = await response.body()
  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([512, 512])
})
