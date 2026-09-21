import { expect, test } from '@playwright/test'

// Mail clients fetch this file from the URL in the `default._bimi` DNS record. They only show it
// when it is a square SVG in the Tiny PS profile with a title, so those are the facts asserted here.
test('the BIMI logo is served as a square SVG Tiny PS file with a title', async ({
  page,
  request,
}) => {
  const response = await request.get('/bimi-logo.svg')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^image\/svg\+xml/)
  const markup = await response.text()
  const facts = await page.evaluate((source) => {
    const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement
    if (svg.tagName !== 'svg') return null
    return {
      baseProfile: svg.getAttribute('baseProfile'),
      version: svg.getAttribute('version'),
      viewBox: svg.getAttribute('viewBox'),
      title: svg.querySelector(':scope > title')?.textContent,
      forbidden: svg.querySelectorAll('script, image, style, a, foreignObject, animate').length,
    }
  }, markup)
  expect(facts).not.toBeNull()
  expect(facts?.baseProfile).toBe('tiny-ps')
  expect(facts?.version).toBe('1.2')
  expect(facts?.title).toBe('Prva postava')
  expect(facts?.forbidden).toBe(0)
  const [width, height] = (facts?.viewBox ?? '').split(/\s+/).slice(2).map(Number)
  expect(width).toBeGreaterThan(0)
  expect(width).toBe(height)
})
