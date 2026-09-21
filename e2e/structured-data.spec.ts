import { expect, type Page, test } from '@playwright/test'

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://prvapostava.co/#organization',
  name: 'Prva postava',
  url: 'https://prvapostava.co',
  email: 'neven@prvapostava.co',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    email: 'leonard@prvapostava.co',
    availableLanguage: ['hr', 'en'],
  },
  logo: {
    '@type': 'ImageObject',
    url: 'https://prvapostava.co/icon-512.png',
    width: 512,
    height: 512,
  },
}

function expectedWebsite(language: string) {
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

      // An exact match, so no `legalName`, `sameAs` or `SearchAction` slips in either, and the
      // published addresses stay the two the footer and the support inbox actually use.
      // `home-screen-icons.spec.ts` checks the logo URL's path is served as a 512 by 512 PNG.
      expect(await readStructuredData(page)).toEqual({
        '@context': 'https://schema.org',
        '@graph': [ORGANIZATION, expectedWebsite(language)],
      })
    })
  }
})
